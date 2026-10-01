import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const route = fs.readFileSync(
  path.join(root, "src/app/api/cron/streak-reminders/route.ts"),
  "utf8"
);
const serviceWorker = fs.readFileSync(path.join(root, "public/sw.js"), "utf8");

const expectedTitle = "Deine Tagesaufgabe ⚡";

assert.match(route, new RegExp(`title: ${JSON.stringify(expectedTitle)}`));
assert.match(
  serviceWorker,
  new RegExp(`data\\.title \\|\\| ${JSON.stringify(expectedTitle)}`)
);
assert.doesNotMatch(route, /title:\s*["']Cleverli(?:\s*⚡)?["']/);
assert.doesNotMatch(serviceWorker, /data\.title\s*\|\|\s*["']Cleverli["']/);

console.log("Push reminder title is descriptive and does not repeat the app name.");
