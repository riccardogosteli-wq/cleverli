export const SCHOOLTIME_OFFER_PRICE_CHF = 249;
export const SCHOOLTIME_OFFER_REFERENCE_CHF = 594;
export const SCHOOLTIME_OFFER_SAVINGS_CHF = SCHOOLTIME_OFFER_REFERENCE_CHF - SCHOOLTIME_OFFER_PRICE_CHF;
export const SCHOOLTIME_OFFER_END = "2026-09-06T21:59:59.000Z";

export function isSchooltimeOfferActive(now = new Date()) {
  return now.getTime() <= new Date(SCHOOLTIME_OFFER_END).getTime();
}
