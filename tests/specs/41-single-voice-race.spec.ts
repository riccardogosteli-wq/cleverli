import { test, expect } from "@playwright/test";

const URL = "https://www.cleverli.ch/learn/1/math/zahlen-1-10";
const TTS = "https://www.cleverli.ch/api/tts";
const HEADERS = {
  referer: URL,
  "user-agent": "Mozilla/5.0 Cleverli-TTS-Smoke-Test",
};

test("rapid voice clicks play one ElevenLabs source and no device voice", async ({ page, request }, testInfo) => {
  const cached = await request.get(TTS, {
    params: { text: "Cleverli TTS smoke test version one.", lang: "de" },
    headers: HEADERS,
  });
  expect(cached.status()).toBe(200);
  expect(cached.headers()["content-type"]).toContain("audio/mpeg");
  const mp3 = await cached.body();

  await page.addInitScript(() => {
    const counters = { sources: 0, robotVoices: 0 };
    Object.defineProperty(window, "__cleverliVoiceCounters", { value: counters });

    if (window.speechSynthesis) {
      window.speechSynthesis.speak = () => { counters.robotVoices += 1; };
    }

    const NativeAudioContext = window.AudioContext;
    if (NativeAudioContext) {
      const original = NativeAudioContext.prototype.createBufferSource;
      NativeAudioContext.prototype.createBufferSource = function (...args) {
        counters.sources += 1;
        return original.apply(this, args);
      };
    }
  });

  await page.route("**/api/tts?**", async route => {
    await new Promise(resolve => setTimeout(resolve, 700));
    await route.fulfill({ status: 200, contentType: "audio/mpeg", body: mp3 });
  });

  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", req => failedRequests.push(`${req.method()} ${req.url()}`));

  const response = await page.goto(URL, { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);

  const button = page.getByRole("button", { name: /vorlesen/i }).first();
  await expect(button).toBeVisible();
  await button.click();
  await page.waitForTimeout(80);
  await button.click();
  await page.waitForTimeout(1100);

  const counters = await page.evaluate(() =>
    (window as unknown as { __cleverliVoiceCounters: { sources: number; robotVoices: number } }).__cleverliVoiceCounters
  );
  expect(counters.robotVoices).toBe(0);
  expect(counters.sources).toBe(1);
  expect(consoleErrors).toEqual([]);
  expect(failedRequests.filter(url => url.includes("cleverli.ch"))).toEqual([]);

  await page.screenshot({
    path: `.qa/single-voice-2026-08-28/${testInfo.project.name}.png`,
    fullPage: true,
  });
});
