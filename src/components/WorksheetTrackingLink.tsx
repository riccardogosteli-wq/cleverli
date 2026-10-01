"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { trackGa4ProductEvent, type Ga4ProductEvent } from "@/lib/analytics";

type Props = {
  href: string;
  event: Extract<Ga4ProductEvent, "worksheet_download" | "solution_download" | "online_practice_handoff">;
  children: ReactNode;
  className?: string;
  download?: string;
  grade?: number;
  subject?: string;
  topic?: string;
  sourcePage: string;
};

export default function WorksheetTrackingLink({
  href,
  event,
  children,
  className,
  download,
  grade,
  subject,
  topic,
  sourcePage,
}: Props) {
  const track = () => trackGa4ProductEvent(event, {
    grade,
    subject,
    topic,
    source_page: sourcePage,
    destination: href,
  });

  if (event === "online_practice_handoff") {
    return <Link href={href} className={className} onClick={track}>{children}</Link>;
  }

  return <a href={href} download={download} className={className} onClick={track}>{children}</a>;
}
