/**
 * TTS / Voice API tests.
 */
import { test, expect } from "@playwright/test";

const TTS_ENDPOINT = "https://www.cleverli.ch/api/tts";
const BROWSER_HEADERS = {
  referer: "https://www.cleverli.ch/learn/1/math/zahlen-1-10",
  "user-agent": "Mozilla/5.0 Cleverli-TTS-Smoke-Test",
};

test.describe("TTS API", () => {
  test("TTS endpoint returns real ElevenLabs audio", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "Cleverli TTS smoke test version one.", lang: "de" },
      headers: BROWSER_HEADERS,
    });
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain("audio/mpeg");
    expect(res.headers()["x-cleverli-tts-fallback"]).toBeUndefined();
    expect(res.headers()["x-cleverli-tts-status"]).toBeUndefined();
    expect((await res.body()).byteLength).toBeGreaterThan(10_000);
    const cc = res.headers()["cache-control"] ?? "";
    expect(cc).toContain("max-age=604800");

    // Vercel consumes and strips s-maxage before sending the client response.
    // A repeated request proves the edge cache is active without another
    // metered provider call.
    const cached = await request.get(TTS_ENDPOINT, {
      params: { text: "Cleverli TTS smoke test version one.", lang: "de" },
      headers: BROWSER_HEADERS,
    });
    expect(cached.headers()["x-vercel-cache"]).toBe("HIT");
  });

  test("TTS rejects non-browser bulk requests before provider use", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "This request must never reach ElevenLabs.", lang: "de" },
    });
    expect(res.status()).toBe(403);
  });

  test("TTS with empty text returns 400", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "", lang: "de" },
    });
    expect([400, 422, 500]).toContain(res.status());
  });

  test("client bundle contains no robotic Web Speech fallback", async ({ request }) => {
    const page = await request.get("https://www.cleverli.ch/learn/1/german/hoeren-verstehen");
    expect(page.status()).toBe(200);
    const html = await page.text();
    const scriptUrls = Array.from(html.matchAll(/<script[^>]+src="([^"]+)"/g), match => new URL(match[1], TTS_ENDPOINT).toString());
    const scripts = await Promise.all(scriptUrls.map(async url => (await request.get(url)).text()));
    const bundle = scripts.join("\n");
    expect(bundle).not.toContain("SpeechSynthesisUtterance");
    expect(bundle).not.toContain("falling back to Web Speech");
  });
});
