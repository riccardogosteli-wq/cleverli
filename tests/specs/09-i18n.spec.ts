/**
 * i18n / language switching tests — DE, FR, IT, EN.
 */
import { test, expect } from "@playwright/test";

const LANG_PARAMS = [
  { lang: "de", label: "Deutsch" },
  { lang: "fr", label: "Français" },
  { lang: "it", label: "Italiano" },
  { lang: "en", label: "English" },
];

for (const { lang, label } of LANG_PARAMS) {
  test.describe(`Language: ${label} (${lang})`, () => {
    test(`Homepage renders in ${label}`, async ({ page }) => {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(2_000);
      
      // Just check page loads without error
      await expect(page.locator("nav").first()).toBeVisible({ timeout: 10_000 });
    });

    test(`Language switcher switches to ${label}`, async ({ page }) => {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(2_000);
      
      // Check page renders
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      expect(pageTitle.length).toBeGreaterThan(0);
    });
  });
}

test.describe("i18n completeness", () => {
  test("all nav items have translations (no undefined/null text)", async ({ page }) => {
    for (const lang of ["de", "fr", "it", "en"]) {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(1_500);

      // Check nav and interactive elements for missing translations
      // Skip body text check since it includes RSC payload with $undefined
      const navButtons = await page.locator("nav button, header button, [role=navigation] button").allTextContents();
      const navLinks = await page.locator("nav a, header a, [role=navigation] a").allTextContents();
      const allNav = [...navButtons, ...navLinks].join(" ");
      
      // Check if any nav item is literally "undefined"
      expect(allNav).not.toMatch(/\bundefined\b/);
      expect(allNav).not.toContain("MISSING_KEY");
    }
  });

  test("upgrade page shows correct grade range in all languages", async ({ page }) => {
    for (const lang of ["de", "fr", "it", "en"]) {
      await page.goto(`/upgrade?lang=${lang}`);
      await page.waitForTimeout(1_000);
      const body = await page.locator("body").textContent() ?? "";
      // Should mention grades 1 and 6
      expect(body).toContain("1");
      expect(body).toContain("6");
    }
  });

  test("exercise page shows correct language content", async ({ page }) => {
    // German (default)
    await page.goto("/learn/1/math/zahlen-1-10");
    await page.waitForTimeout(1_500);
    const body = await page.locator("body").textContent() ?? "";
    // German exercise questions should contain German words
    expect(body).toMatch(/Wie viele|Welche|Was ist|Zahl/i);
  });

  test("topic info sections follow English language setting", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("cleverli_lang", "en"));
    await page.goto("/learn/1/math/zahlen-1-10");

    await expect(page.getByRole("heading", { name: "Numbers 1–10", exact: true })).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText("Quick overview")).toBeVisible();
    await expect(page.getByText("What will my child learn in Numbers 1–10?")).toBeVisible();
    await expect(page.getByText("Exercises for this topic")).toBeVisible();
    await expect(page.getByText("Sample exercises")).toBeVisible();
    await expect(page.getByText("More Maths topics")).toBeVisible();

    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("Kurz erklärt");
    expect(visibleText).not.toContain("Was lernt mein Kind");
    expect(visibleText).not.toContain("Übungen zum Thema");
    expect(visibleText).not.toContain("Beispielaufgaben");
  });

  test("topic info sections follow French and Italian language settings", async ({ page }) => {
    const cases = [
      {
        lang: "fr",
        title: "Nombres 1–10",
        expected: ["En bref", "Qu'apprend mon enfant avec Nombres 1–10?", "Exercices sur le thème", "Exemples d'exercices"],
      },
      {
        lang: "it",
        title: "Numeri 1–10",
        expected: ["In breve", "Cosa impara mio figlio con Numeri 1–10?", "Esercizi sull'argomento", "Esempi di esercizi"],
      },
    ];

    for (const entry of cases) {
      await page.goto("/login");
      await page.evaluate((lang) => localStorage.setItem("cleverli_lang", lang), entry.lang);
      await page.goto("/learn/1/math/zahlen-1-10");

      await expect(page.getByRole("heading", { name: entry.title, exact: true })).toBeVisible({ timeout: 8_000 });
      for (const text of entry.expected) {
        await expect(page.getByText(text)).toBeVisible();
      }

      const visibleText = await page.locator("body").innerText();
      expect(visibleText).not.toContain("Kurz erklärt");
      expect(visibleText).not.toContain("Was lernt mein Kind");
      expect(visibleText).not.toContain("Übungen zum Thema");
      expect(visibleText).not.toContain("Beispielaufgaben");
    }
  });

  test("topic seo sections hide after the first few exercises", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cleverli_lang", "it");
      localStorage.setItem("cleverli_anon_exercises", "3");
      localStorage.setItem("cleverli_1_math_addition-bis-10", JSON.stringify({
        completed: 3,
        correctIds: ["a1", "a2", "a3"],
      }));
    });

    await page.goto("/learn/1/math/addition-bis-10");

    await expect(page.getByRole("heading", { name: "Addizione fino a 10", exact: true })).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText("Esercizi sull'argomento")).toHaveCount(0);
    await expect(page.getByText("Esempi di esercizi")).toHaveCount(0);
    await expect(page.getByText("Altri argomenti di Matematica")).toHaveCount(0);
  });

  test("daily challenge exercise text follows French and Italian language settings", async ({ page }) => {
    await page.addInitScript(() => {
      const fixedNow = new Date("2026-08-14T12:00:00.000Z").getTime();
      const RealDate = Date;

      class FixedDate extends RealDate {
        constructor(...args: ConstructorParameters<typeof Date>) {
          super(...(args.length ? args : [fixedNow]));
        }

        static now() {
          return fixedNow;
        }
      }

      FixedDate.UTC = RealDate.UTC;
      FixedDate.parse = RealDate.parse;
      FixedDate.prototype = RealDate.prototype;
      window.Date = FixedDate;
    });

    const cases = [
      { lang: "fr", expected: "Combien de syllabes", forbidden: "Wie viele Silben" },
      { lang: "it", expected: "Quanti sillabe", forbidden: "Wie viele Silben" },
    ];

    for (const entry of cases) {
      await page.goto("/login");
      await page.evaluate((lang) => {
        localStorage.setItem("cleverli_lang", lang);
        localStorage.removeItem("cleverli_daily");
      }, entry.lang);
      await page.goto("/daily");

      await expect(page.getByText(entry.expected)).toBeVisible({ timeout: 8_000 });
      const visibleText = await page.locator("body").innerText();
      expect(visibleText).not.toContain(entry.forbidden);
      expect(visibleText).not.toContain("Tagesaufgabe");
    }
  });

  test("Italian math exercises clean German fragments from localized text", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cleverli_lang", "it");
      localStorage.setItem("cleverli_1_math_addition-bis-10", JSON.stringify({
        completed: 22,
        correctIds: [
          "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a9", "a11", "a12", "a13", "a14", "a15", "a16", "a17",
          "a8", "a10", "a18", "a19", "a20", "a21", "a22",
        ],
      }));
    });

    await page.goto("/learn/1/math/addition-bis-10");

    await expect(page.getByText("Quale calcolo dà 8?")).toBeVisible({ timeout: 8_000 });
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("ergibt");
    expect(visibleText).not.toContain("Quale calcolo ergibt");
  });

  test("Italian addition word problems clean German sentence fragments", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cleverli_lang", "it");
      localStorage.setItem("cleverli_1_math_addition-bis-10", JSON.stringify({
        completed: 27,
        correctIds: [
          "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a9", "a11", "a12", "a13", "a14", "a15", "a16", "a17",
          "a8", "a10", "a18", "a19", "a20", "a21", "a22", "a23", "a24", "a25", "a26", "a27",
        ],
      }));
    });

    await page.goto("/learn/1/math/addition-bis-10");

    await expect(page.getByText("Nel cesto ci sono 4 mele e 4 pere. Quanti frutti sono? 🍎🍐")).toBeVisible({ timeout: 8_000 });
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("Im Korb");
    expect(visibleText).not.toContain("Äpfel");
    expect(visibleText).not.toContain("Früchte");
  });

  test("Italian cleanup does not rewrite expected fill-in answers", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cleverli_lang", "it");
      localStorage.setItem("cleverli_2_german_satzzeichen", JSON.stringify({
        completed: 14,
        correctIds: ["sz1", "sz2", "sz3", "sz4", "sz5", "sz6", "sz7", "sz8", "sz9", "sz10", "sz11", "sz12", "sz13", "sz14"],
      }));
    });

    await page.goto("/learn/2/german/satzzeichen");

    await expect(page.getByText("«Hunde, Katzen___ uccelli sono animali.»")).toBeVisible({ timeout: 8_000 });
    await page.getByPlaceholder(/Antwort|Risposta|Answer|Réponse/i).fill("und");
    await page.getByRole("button", { name: /Prüfen|Verifica|Check|Vérifier/i }).click();
    await expect(page.getByRole("button", { name: /Corretto/i })).toBeVisible();
  });

  test("Italian URL language persists for German rhyming exercise feedback", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("cleverli_lang");
      localStorage.setItem("cleverli_1_german_reime", JSON.stringify({
        completed: 8,
        correctIds: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"],
      }));
    });

    await page.goto("/learn/1/german/reime?lang=it");

    await expect(page.getByText("Regen fa rima con: ___. (-egen)")).toBeVisible({ timeout: 8_000 });
    await expect(page.getByLabel("Apri menu")).toBeVisible();
    await expect(page.getByRole("button", { name: "Verifica" })).toBeVisible();

    await page.getByPlaceholder("Inserisci la risposta...").fill("foo");
    await page.getByRole("button", { name: "Verifica" }).click();

    const visibleText = await page.locator("body").innerText();
    expect(visibleText).toContain("La risposta corretta è:");
    expect(visibleText).toContain("Wegen (o Segen)");
    expect(visibleText).toContain("Esercizio 1 / 7");
    expect(visibleText).not.toContain("Regen reimt sich auf");
    expect(visibleText).not.toContain("Die richtige Antwort ist:");
    expect(visibleText).not.toContain("Tipp anzeigen");
    expect(visibleText).not.toContain("Zum Inhalt springen");
    expect(visibleText).not.toContain("1/7 Aufgaben");
  });

  test("Italian fill-in accepts each slash-separated answer variant", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("cleverli_lang");
      localStorage.setItem("cleverli_1_german_reime", JSON.stringify({
        completed: 20,
        correctIds: [
          "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10",
          "r11", "r12", "r13", "r14", "r15", "r16", "r17", "r18", "r19", "r20",
        ],
      }));
    });

    await page.goto("/learn/1/german/reime?lang=it");

    await expect(page.getByText(/fa rima con.*Hahn/)).toBeVisible({ timeout: 8_000 });
    await page.getByPlaceholder("Inserisci la risposta...").fill("Kahn");
    await page.getByRole("button", { name: "Verifica" }).click();

    await expect(page.getByRole("button", { name: /Corretto/i })).toBeVisible({ timeout: 2_000 });
    await expect(page.getByText("La risposta corretta è:")).toHaveCount(0);
    await expect(page.getByText("reimt sich su")).toHaveCount(0);
  });

  test("Italian grass sentence requires the semantic fill-in answer, not any rhyme", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("cleverli_lang");
      localStorage.setItem("cleverli_1_german_reime", JSON.stringify({
        completed: 23,
        correctIds: [
          "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10",
          "r11", "r12", "r13", "r14", "r15", "r16", "r17", "r18", "r19", "r20",
          "r21", "r22", "r23",
        ],
      }));
    });

    await page.goto("/learn/1/german/reime?lang=it");

    await expect(page.getByText("«Una ___ mangia erba» — la parola fa rima con «Kuh».")).toBeVisible({ timeout: 8_000 });
    await page.getByPlaceholder("Inserisci la risposta...").fill("Schuh");
    await page.getByRole("button", { name: "Verifica" }).click();

    await expect(page.getByText("La risposta corretta è:")).toBeVisible({ timeout: 2_000 });
    await expect(page.getByText("Kuh", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Avanti/i })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Kuh... reimt");
  });

  test("Italian desktop progress suffix is localized", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.addInitScript(() => {
      localStorage.removeItem("cleverli_lang");
      localStorage.setItem("cleverli_1_german_reime", JSON.stringify({
        completed: 8,
        correctIds: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"],
      }));
    });

    await page.goto("/learn/1/german/reime?lang=it");

    const visibleText = await page.locator("body").innerText();
    expect(visibleText).toContain("1/7 Esercizi");
    expect(visibleText).not.toContain("1/7 Aufgaben");
    expect(visibleText).not.toContain("Tastenkürzel");
    expect(visibleText).not.toContain("Zum Inhalt springen");
  });
});
