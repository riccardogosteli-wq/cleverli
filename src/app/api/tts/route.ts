import { NextRequest, NextResponse } from "next/server";

const VOICE_ID = "vmVmHDKBkkCgbLVIOJRb"; // Charlie Chatlin — Real & Casual (German, Conversational)
const API_KEY  = process.env.ELEVENLABS_API_KEY ?? "";
const MAX_TEXT_LENGTH = 600;

function isSameOriginBrowserRequest(req: NextRequest) {
  const referer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!referer || !/Mozilla\//i.test(userAgent)) return false;

  try {
    return new URL(referer).hostname === req.nextUrl.hostname;
  } catch {
    return false;
  }
}

function providerUnavailable(reason: string) {
  return NextResponse.json(
    { error: "tts unavailable", reason },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "X-Cleverli-TTS-Status": reason,
      },
    },
  );
}

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text")?.trim();
  if (!text) return NextResponse.json({ error: "no text" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  if (text.length > MAX_TEXT_LENGTH) return NextResponse.json({ error: "text too long" }, { status: 413, headers: { "Cache-Control": "no-store" } });
  // The endpoint proxies a metered provider. Only the Cleverli browser UI may
  // create new audio; this prevents crawlers and bulk QA scripts from draining
  // ElevenLabs credits with arbitrary text.
  if (process.env.NODE_ENV === "production" && !isSameOriginBrowserRequest(req)) {
    return NextResponse.json({ error: "browser request required" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  if (!API_KEY) return providerUnavailable("provider_not_configured");

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.80,
            style: 0.15,
            use_speaker_boost: true,
            speed: 0.8,
          },
        }),
      }
    );

    if (!res.ok) {
      const providerDetail = (await res.text()).slice(0, 500);
      console.error(`[tts] ElevenLabs ${res.status}: ${providerDetail}`);
      return providerUnavailable("provider_unavailable");
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800, s-maxage=604800, immutable",
      },
    });
  } catch (e) {
    console.error("[tts]", e);
    return providerUnavailable("provider_failed");
  }
}
