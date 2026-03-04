import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop | Cleverli",
  robots: { index: false, follow: false },
};

export default function ShopPage() {
  return <ShopClient />;
}
