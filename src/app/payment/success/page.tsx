import type { Metadata } from "next";
import WorksheetReturnLink from "@/components/WorksheetReturnLink";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich – Cleverli",
  robots: { index: false },
  referrer: "no-referrer",
};

export default function PaymentSuccessPage() {
  return <><WorksheetReturnLink/><SuccessClient /></>;
}
