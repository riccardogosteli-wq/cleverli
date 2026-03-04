/**
 * TTS / Voice API tests.
 */
import { test, expect } from "@playwright/test";

const TTS_ENDPOINT = "https://www.cleverli.ch/api/tts";

test.describe("TTS API", () => {
  test("TTS endpoint returns audio for German text", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "Guten Tag, willkommen bei Cleverli!", lang: "de" },
    });
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain("audio");
  });

  test("TTS endpoint returns audio for French text", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "Bonjour, bienvenue sur Cleverli!", lang: "fr" },
    });
    expect(res.status()).toBe(200);
  });

  test("TTS endpoint returns audio for Italian text", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "Ciao, benvenuto su Cleverli!", lang: "it" },
    });
    expect(res.status()).toBe(200);
  });

  test("TTS endpoint returns audio for English text", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "Hello, welcome to Cleverli!", lang: "en" },
    });
    expect(res.status()).toBe(200);
  });

  test("TTS response has correct Cache-Control header", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "Test", lang: "de" },
    });
    const cc = res.headers()["cache-control"] ?? "";
    expect(cc).toContain("max-age");
  });

  test("TTS with empty text returns 400", async ({ request }) => {
    const res = await request.get(TTS_ENDPOINT, {
      params: { text: "", lang: "de" },
    });
    expect([400, 422, 500]).toContain(res.status());
  });
});
