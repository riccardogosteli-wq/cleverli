import type { Metadata } from "next";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich – Cleverli",
  robots: { index: false },
};

export default function PaymentSuccessPage() {
  return <SuccessClient />;
}
