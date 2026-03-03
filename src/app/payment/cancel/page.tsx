import type { Metadata } from "next";
import CancelClient from "./CancelClient";

export const metadata: Metadata = {
  title: "Zahlung abgebrochen – Cleverli",
  robots: { index: false },
};

export default function PaymentCancelPage() {
  return <CancelClient />;
}
