import { MetadataRoute } from "next";
import { getTopics, SUBJECTS } from "@/data/index";

const BASE = "https://www.cleverli.ch";
const GRADES = [1, 2, 3, 4, 5, 6];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    // Marketing & conversion pages
    { url: BASE,                   lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/parents`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/upgrade`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/signup`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/login`,        lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    // Legal pages (indexed — required by Swiss law)
    { url: `${BASE}/agb`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/impressum`,    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/datenschutz`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    // NOTE: /dashboard, /missionen, /rewards, /daily, /family, /kids
    //       are in-app pages (localStorage-dependent) — excluded (noindex in their metadata)
  ];

  // Grade/subject pages — dynamically generated from data
  for (const grade of GRADES) {
    for (const subject of SUBJECTS.map(s => s.id)) {
      routes.push({
        url: `${BASE}/learn/${grade}/${subject}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      });
      // Topic pages — read from actual data so sitemap stays up-to-date automatically
      const topics = getTopics(grade, subject);
      for (const topic of topics) {
        routes.push({
          url: `${BASE}/learn/${grade}/${subject}/${topic.id}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return routes;
}
