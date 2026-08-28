import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { getSubjects, getTopicsBeforeExerciseIdMigration } from "../src/data";

interface Migration {
  grade: number;
  subject: string;
  topicId: string;
  legacyId: string;
  canonicalId: string;
}

const locations: Array<{ grade: number; subject: string; topicId: string; legacyId: string }> = [];
for (let grade = 1; grade <= 6; grade += 1) {
  for (const { id: subject } of getSubjects(grade)) {
    for (const topic of getTopicsBeforeExerciseIdMigration(grade, subject)) {
      for (const exercise of topic.exercises) locations.push({ grade, subject, topicId: topic.id, legacyId: exercise.id });
    }
  }
}

const existingIds = new Set(locations.map((location) => location.legacyId));
const usedIds = new Set(existingIds);
const seenIds = new Set<string>();
const seenLocations = new Set<string>();
const migrations: Migration[] = [];

for (const location of locations) {
  const locationKey = `${location.grade}/${location.subject}/${location.topicId}/${location.legacyId}`;
  if (seenLocations.has(locationKey)) throw new Error(`Duplicate ID inside one topic cannot be location-migrated: ${locationKey}`);
  seenLocations.add(locationKey);
  if (!seenIds.has(location.legacyId)) {
    seenIds.add(location.legacyId);
    continue;
  }

  const stem = `g${location.grade}-${location.subject}-${location.topicId}-${location.legacyId}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  let canonicalId = stem;
  let suffix = 2;
  while (usedIds.has(canonicalId)) canonicalId = `${stem}-${suffix++}`;
  usedIds.add(canonicalId);
  migrations.push({ ...location, canonicalId });
}

const outputPath = resolve("src/data/generatedExerciseIdMigrations.json");
writeFileSync(outputPath, `${JSON.stringify(migrations, null, 2)}\n`);
console.log(JSON.stringify({ exercises: locations.length, legacyUniqueIds: seenIds.size, migrations: migrations.length, outputPath }, null, 2));
