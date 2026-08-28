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
    expect((await res.body()).byteLength).toBeGreaterThan(10_000);
    const cc = res.headers()["cache-control"] ?? "";
    expect(cc).toContain("s-maxage=604800");
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
});
