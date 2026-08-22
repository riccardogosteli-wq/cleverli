import { MetadataRoute } from "next";
import { getSubjects, getTopics } from "@/data/index";
import { ORGANIC_LANDING_PAGES } from "@/lib/seoContent";
import { GRADE_SUBJECT_SEO_PAGES } from "@/lib/gradeSubjectSeo";

const BASE = "https://www.cleverli.ch";
const GRADES = [1, 2, 3, 4, 5, 6];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    // Marketing & conversion pages
    { url: BASE,                   lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/parents`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/missionen`,    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/upgrade`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Blog (SEO content)
    { url: `${BASE}/blog/kinder-motivieren-zum-lernen`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    // NOTE: app-only pages, legal pages, auth pages, and /ads test routes
    //       are excluded because they are noindex or not intended for organic search.
  ];

  for (const page of ORGANIC_LANDING_PAGES) {
    routes.push({
      url: `${BASE}${page.href}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  for (const page of GRADE_SUBJECT_SEO_PAGES) {
    routes.push({
      url: `${BASE}${page.href}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  // Grade/subject pages — dynamically generated from data
  for (const grade of GRADES) {
    for (const subject of getSubjects(grade).map(s => s.id)) {
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

  const seen = new Set<string>();
  return routes.filter((route) => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
