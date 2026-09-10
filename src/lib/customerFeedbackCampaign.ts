// Frozen approval 5595. Never derive this list from the customer database.
export const FEEDBACK_FORM = 'premium-kunden';
export const FEEDBACK_CAMPAIGN = 'premium-feedback-20260910';
export const FEEDBACK_SUBJECT = '1 Monat Cleverli Premium gratis für dein Feedback';
export const FEEDBACK_FROM = 'Cleverli <hello@cleverli.ch>';
export const FEEDBACK_REPLY_TO = 'hello@cleverli.ch';
export const FEEDBACK_RECIPIENTS = [
  "ale.ga@gmx.net",
  "ardnas_mueller@bluemail.ch",
  "astrid.prenza1@gmail.com",
  "familiebuechel@gmx.net",
  "family@maurer-boll.ch",
  "isa-caro@gmx.de",
  "jstaubli@icloud.com",
  "kosova42@gmail.com",
  "kosta.danilis@gmail.com",
  "manuel.weber@bluemail.ch",
  "meisa@gmx.ch",
  "nrdabagh@gmail.com",
  "pe@tca.ch",
  "pgaetzi@posteo.de",
  "ramona.1995@windowslive.com",
  "sabibo@gmx.ch",
  "stephanievoegeli90@gmail.com"
] as const;
export function approvedFeedbackEmail(value: unknown): string {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!(FEEDBACK_RECIPIENTS as readonly string[]).includes(email)) throw Error('recipient_not_approved');
  return email;
}
