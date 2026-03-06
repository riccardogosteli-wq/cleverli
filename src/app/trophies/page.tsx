import { redirect } from "next/navigation";

// /trophies is now /missionen — permanent redirect
export default function TrophiesRedirect() {
  redirect("/missionen");
}
