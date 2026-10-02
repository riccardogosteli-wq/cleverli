import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

const signup = read("src/app/signup/SignupClient.tsx");
const onboarding = read("src/components/OnboardingModal.tsx");
const checklist = read("src/components/FirstWeekActivationCard.tsx");
const topicClient = read("src/app/learn/[grade]/[subject]/[topic]/TopicClient.tsx");
const exercisePlayer = read("src/components/ExercisePlayer.tsx");
const activityRoute = read("src/app/api/telemetry/activity/route.ts");

assert.match(signup, /router\.push\("\/dashboard"\)/, "signup must enter the guided dashboard flow");
assert.doesNotMatch(signup, /router\.push\("\/learn\/1\/math\/zahlen-1-10"\)/, "signup must not force every child into grade 1 maths");

assert.match(onboarding, /getTopicSummaries\(grade, subject\)\.slice\(0, 3\)/, "goal picker must offer three bounded recommendations");
assert.match(onboarding, /mission_size: FIRST_WEEK_MISSION_SIZE/, "goal selection telemetry must record the shared mission size");
assert.match(onboarding, /activation-start-mission/, "the guided flow needs a stable first-mission control");
assert.doesNotMatch(onboarding, /send-welcome|push\/subscribe|Notification/, "activation UI must not send email or request notifications");

assert.match(topicClient, /sessionLimit=\{firstWeekMission \? FIRST_WEEK_MISSION_SIZE : undefined\}/, "first-week mode must use the shared five-task cap");
assert.match(exercisePlayer, /limitSessionExercises\(getInitialSessionExercises/, "the initial activation mission must apply the cap");
assert.match(exercisePlayer, /completeFirstWeekMission/, "mission completion must persist its activation milestone");
assert.match(exercisePlayer, /activation_first_mission_completed/, "mission completion must emit internal activation telemetry");

assert.match(checklist, /firstMissionCompletedAt/, "the checklist must read the first mission milestone");
assert.match(checklist, /activeDays >= 2/, "the checklist must require a second active learning day");
assert.match(activityRoute, /"activation_profile_created"/, "profile activation telemetry must be allowed server-side");
assert.match(activityRoute, /"activation_goal_selected"/, "goal activation telemetry must be allowed server-side");
assert.match(activityRoute, /"activation_first_mission_completed"/, "mission activation telemetry must be allowed server-side");

console.log("First-week activation audit passed: guided profile, goal, five-task mission, checklist and internal telemetry contracts verified.");
