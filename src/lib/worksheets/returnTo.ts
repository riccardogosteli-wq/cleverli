/** Only this feature's known route is allowed. Never accept arbitrary redirects. */
export function worksheetReturnTo(search: string): string | null {
  const value = new URLSearchParams(search).get("returnTo");
  return value && /^\/arbeitsblaetter\/bibliothek(?:\?klasse=[1-6])?$/.test(value) ? value : null;
}
export function loginDestination(): string {
  return (typeof window !== "undefined" && worksheetReturnTo(window.location.search)) || "/dashboard";
}
