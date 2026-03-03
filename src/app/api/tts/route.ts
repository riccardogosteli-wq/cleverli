import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VOICE_ID    = "vmVmHDKBkkCgbLVIOJRb"; // Charlie Chatlin — Real & Casual (German, Conversational)
const API_KEY     = process.env.ELEVENLABS_API_KEY ?? "";
const SUPA_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPA_ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function GET(req: NextRequest) {
  // Require a valid Supabase session to prevent ElevenLabs API key drain
  if (SUPA_URL && SUPA_ANON) {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const sb = createClient(SUPA_URL, SUPA_ANON);
    const { data: { user } } = await sb.auth.getUser(token);
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const text = req.nextUrl.searchParams.get("text")?.trim();
  if (!text) return NextResponse.json({ error: "no text" }, { status: 400 });
  if (!API_KEY) return NextResponse.json({ error: "no key" }, { status: 503 });

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
          model_id: "eleven_multilingual_v2",   // handles DE/FR/IT/EN automatically
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.80,
            style: 0.15,
            use_speaker_boost: true,
            speed: 0.8,  // slightly slower for kids (range 0.7–1.2, default 1.0)
          },
        }),
      }
    );

    if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800, immutable", // 7-day CDN cache
      },
    });
  } catch (e) {
    console.error("[tts]", e);
    return NextResponse.json({ error: "tts_failed" }, { status: 500 });
  }
}
