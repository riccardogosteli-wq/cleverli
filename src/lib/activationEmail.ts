/** A zero-value trial invoice is not activation; its first collected invoice is.
 * Consume all pages supplied by Stripe's async iterator. Any other collected
 * invoice suppresses renewals and delayed replays of an old activation event.
 * The caller must scope history to the exact subscription and fail closed on errors.
 */
type CollectedInvoice = { id: string; amount_paid: number; status: string | null };

export async function isFirstCollectedInvoice(
  current: CollectedInvoice,
  history: AsyncIterable<CollectedInvoice>,
): Promise<boolean> {
  if (current.status !== "paid" || current.amount_paid <= 0) return false;
  for await (const invoice of history) {
    if (invoice.id !== current.id && invoice.status === "paid" && invoice.amount_paid > 0) {
      return false;
    }
  }
  return true;
}
