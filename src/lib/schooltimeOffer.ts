export const SCHOOLTIME_OFFER_PRICE_CHF = 249;
export const SCHOOLTIME_OFFER_REFERENCE_CHF = 594;
export const SCHOOLTIME_OFFER_SAVINGS_CHF = SCHOOLTIME_OFFER_REFERENCE_CHF - SCHOOLTIME_OFFER_PRICE_CHF;
// 31 October 2026, 23:59:59 Europe/Zurich (CET, UTC+1).
export const SCHOOLTIME_OFFER_END = "2026-10-31T22:59:59.000Z";

export function isSchooltimeOfferActive(now = new Date()) {
  return now.getTime() <= new Date(SCHOOLTIME_OFFER_END).getTime();
}
