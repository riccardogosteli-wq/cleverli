# Cleverli Progress Map System

**Status:** ✅ Complete - Ready for implementation  
**Built:** March 5, 2026  
**Components:** 3 files + 1 integration component

---

## Overview

A complete progress roadmap system for Cleverli that:
1. **Visualizes learning progression** with a 3-checkpoint roadmap (Beginner → Intermediate → Expert)
2. **Unlocks missions** as children complete exercise tiers
3. **Generates dynamic SVG maps** (different layouts for mobile vs desktop)
4. **Tracks difficulty-based progress** (exercises grouped by difficulty 1, 2, 3)
5. **Supports all 4 languages** (DE/FR/IT/EN)

---

## Architecture

### Files Created

#### 1. `/src/lib/progressMap.ts` (3.7 KB)
Core logic for progress tracking and mission unlocking.

**Key exports:**
- `buildProgressMap()` - Creates roadmap structure for a topic
- `getCheckpointProgress()` - Calculates % completion per checkpoint
- `isCheckpointCompleted()` - Checks if checkpoint is unlocked
- `CHECKPOINT_DEFINITIONS` - Universal 3-level structure
  - Level 1: Anfänger (Beginner) - Difficulty 1 exercises
  - Level 2: Fortgeschritten (Intermediate) - Difficulty 2 exercises
  - Level 3: Meister (Expert) - Difficulty 3+ exercises

**Translations included:**
- `CHECKPOINT_LABELS` - Multi-language checkpoint names
- `MISSION_TITLES` - Multi-language mission titles

---

#### 2. `/src/lib/roadmapGenerator.ts` (6.0 KB)
SVG roadmap visualization engine.

**Key functions:**
- `generateRoadmapSVG()` - Main entry point (routes to mobile/desktop)
- `generateDesktopRoadmap()` - Horizontal layout with connecting path
- `generateMobileRoadmap()` - Vertical layout (stack-friendly)
- `roadmapToDataURI()` - Converts SVG to data URI for `<img src="">`

**Features:**
- Dynamic checkpoint circles (color = completion status)
- Progress bars (% complete per level)
- Connecting paths between checkpoints
- Responsive design (mobile: 320px, desktop: 800px)
- No external dependencies (pure SVG)

---

#### 3. `/src/components/ProgressMapClient.tsx` (6.1 KB)
React component that displays the roadmap and mission unlocks.

**Props:**
```typescript
{
  topicId: string;
  topicTitle: string;
  grade: number;
  subject: string;
  completedExercisesByDifficulty: Record<number, number>;
  totalExercisesByDifficulty: Record<number, number>;
}
```

**Features:**
- Renders dynamic SVG roadmap
- Shows mission unlock notifications (🥉 🥈 🥇)
- Displays progress summary (completed/total per level)
- Call-to-action messaging
- Responsive (mobile/desktop auto-layout)
- Multi-language support

---

## Integration Steps

### 1. Update Terminology in i18n.ts

Replace all occurrences:
- `statTrophies: "Trophäen"` → `statTrophies: "Missionen"`
- `navTrophies: "🏆 Trophäen"` → `navTrophies: "🏆 Missionen"`
- `trophyRoom: "Trophäen-Zimmer"` → `trophyRoom: "Missionen-Zimmer"` or "Missionen-Übersicht"

(Same changes for FR/IT/EN translations)

### 2. Update Topic/Dashboard Page

In the topic learning page or dashboard, import and use:

```typescript
import ProgressMapClient from "@/components/ProgressMapClient";

// Inside your topic page:
<ProgressMapClient
  topicId={topic.id}
  topicTitle={topic.title}
  grade={grade}
  subject={subject}
  completedExercisesByDifficulty={{
    1: exercisesCompleted.filter(e => e.difficulty === 1).length,
    2: exercisesCompleted.filter(e => e.difficulty === 2).length,
    3: exercisesCompleted.filter(e => e.difficulty === 3).length,
  }}
  totalExercisesByDifficulty={{
    1: allExercises.filter(e => e.difficulty === 1).length,
    2: allExercises.filter(e => e.difficulty === 2).length,
    3: allExercises.filter(e => e.difficulty === 3).length,
  }}
/>
```

### 3. Ensure Exercise Difficulty is Tracked

Each exercise must have a `difficulty` field (1, 2, or 3):
- Already present in existing exercise data ✅

---

## Data Flow

```
Topic Page
    ↓
Calculate exercises by difficulty
    ↓
Pass to ProgressMapClient
    ↓
buildProgressMap() creates checkpoint structure
    ↓
generateRoadmapSVG() creates visualization
    ↓
React renders SVG + mission notifications
    ↓
Child sees visual progression roadmap
```

---

## Mobile vs Desktop

### Desktop (≥769px)
- Horizontal layout: ●──────●──────●
- Checkpoints left to right
- Full labels visible
- Wider spacing

### Mobile (<769px)
- Vertical layout: ● | ● | ●
- Checkpoints stacked top to bottom
- Compact labels
- Narrower profile

Layout switches automatically via `useMediaQuery("(max-width: 768px)")`.

---

## Multi-Language Support

All labels auto-translate based on `useLang()` context:

| German | French | Italian | English |
|--------|--------|---------|---------|
| Anfänger | Débutant | Principiante | Beginner |
| Fortgeschritten | Intermédiaire | Intermedio | Intermediate |
| Meister | Maître | Maestro | Expert |
| Mission Stufe 1 | Mission Niveau 1 | Missione Livello 1 | Mission Level 1 |

---

## Features Summary

✅ **Dynamic roadmap generation** - No hard-coded layouts  
✅ **Mobile/desktop variants** - Auto-responsive  
✅ **SVG-based** - No image assets needed  
✅ **Multi-language** - DE/FR/IT/EN built-in  
✅ **Progress tracking** - By difficulty level  
✅ **Mission unlocks** - Automatic notifications  
✅ **Beautiful UI** - Color-coded checkpoints + bars  

---

## Next Steps

1. **Integrate into topic/dashboard page** (30 min)
2. **Update i18n.ts terminology** (15 min)
3. **Test on mobile/desktop** (15 min)
4. **Verify all 4 languages** (10 min)
5. **Deploy** (5 min)

**Total integration time: ~75 minutes**

---

## Example Output

When a child completes 15 easy exercises (Beginner checkpoint), the roadmap shows:

```
🏆 Missionen — Zahlen 1–10

●────────●────────●
Anfänger  Fortgeschritten  Meister
100%      45%             0%

✅ Missionen Stufe 1 freigeschaltet! 🎯
```

---

**Ready to integrate into Cleverli!** 🚀
