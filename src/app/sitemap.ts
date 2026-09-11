import { MetadataRoute } from "next";
import { getSubjects, getTopics } from "@/data/index";
import { ORGANIC_LANDING_PAGES } from "@/lib/seoContent";
import { GRADE_SUBJECT_SEO_PAGES } from "@/lib/gradeSubjectSeo";

const BASE = "https://www.cleverli.ch";
const GRADES = [1, 2, 3, 4, 5, 6];

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastmod: no verified per-page significant modification dates are tracked.
  const routes: MetadataRoute.Sitemap = [
    // Marketing & conversion pages
    { url: BASE,               changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/lehrpersonen`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/parents`,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/missionen`,    changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/upgrade`,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: "monthly", priority: 0.7 },
    // Blog (SEO content)
    { url: `${BASE}/blog/kinder-motivieren-zum-lernen`, changeFrequency: "yearly", priority: 0.7 },
    // NOTE: app-only pages, legal pages, auth pages, and /ads test routes
    //       are excluded because they are noindex or not intended for organic search.
  ];

  for (const page of ORGANIC_LANDING_PAGES) {
    routes.push({
      url: `${BASE}${page.href}`,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  for (const page of GRADE_SUBJECT_SEO_PAGES) {
    routes.push({
      url: `${BASE}${page.href}`,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  // Grade/subject pages — dynamically generated from data
  for (const grade of GRADES) {
    for (const subject of getSubjects(grade).map(s => s.id)) {
      routes.push({
        url: `${BASE}/learn/${grade}/${subject}`,
        changeFrequency: "monthly",
        priority: 0.9,
      });
      // Topic pages — read from actual data so sitemap stays up-to-date automatically
      const topics = getTopics(grade, subject);
      for (const topic of topics) {
        routes.push({
          url: `${BASE}/learn/${grade}/${subject}/${topic.id}`,
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
