import type { Metadata } from "next";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich – Cleverli",
  robots: { index: false },
  referrer: "no-referrer",
};

export default function PaymentSuccessPage() {
  return <SuccessClient />;
}
