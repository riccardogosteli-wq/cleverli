import type { Metadata } from 'next';
import type { Lang } from '@/lib/i18n';
import type { getLehrplanOverview } from '@/lib/lehrplanOverview';
import { LEHRPLAN_LANGS, lehrplanCopy, lehrplanUrl } from '@/lib/lehrplanCopy';
import generatedRows from '@/data/lehrplanOverview.generated.json';
import LehrplanOverviewClient from './LehrplanOverviewClient';

type Props = { searchParams: Promise<{ lang?: string }> };
const resolveLang = (value?: string): Lang => LEHRPLAN_LANGS.includes(value as Lang) ? value as Lang : 'de';
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = resolveLang((await searchParams).lang);
  const c = lehrplanCopy[lang];
  return {
    title: c.title, description: c.description,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: lehrplanUrl(lang), languages: Object.fromEntries(LEHRPLAN_LANGS.map(l => [l, lehrplanUrl(l)])) },
    openGraph: { title: c.title, description: c.description, url: lehrplanUrl(lang), locale: c.locale.replace('-', '_') },
  };
}
export default async function LehrplanOverviewPage({ searchParams }: Props) {
  const initialLang = resolveLang((await searchParams).lang);
  const allRows = generatedRows as Record<Lang, ReturnType<typeof getLehrplanOverview>>;
  return <LehrplanOverviewClient allRows={allRows} initialLang={initialLang} />;
}
