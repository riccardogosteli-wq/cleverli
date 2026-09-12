import { createHash } from 'crypto';
export const OUTREACH_CAMPAIGN = 'school-outreach-20260912' as const;
export const OUTREACH_FROM = 'Cleverli <hello@cleverli.ch>';
export const OUTREACH_REPLY_TO = 'hello@cleverli.ch';
export const OUTREACH_SUBJECT = 'Cleverli als Ergänzung für Ihre Lernempfehlungen?';
export const OUTREACH_RECIPIENTS = [
  {
    "organisation": "Schule Flaachtal",
    "email": "andreas.gaberthueel@schuleflaachtal.ch",
    "greeting": "Guten Tag Herr Gaberthüel"
  },
  {
    "organisation": "iLern",
    "email": "info@ilern.ch",
    "greeting": "Guten Tag Herr Cathomen",
    "basis": "Official contact page identifies Mario Cathomen as the recipient."
  },
  {
    "organisation": "Schule Niederglatt",
    "email": "tanja.berger@niederglatt-zh.ch",
    "greeting": "Guten Tag Frau Berger"
  },
  {
    "organisation": "Primarschule Kappel am Albis",
    "email": "schulverwaltung@primarschulekappel.ch",
    "greeting": "Guten Tag",
    "basis": "No verified individual recipient."
  },
  {
    "organisation": "Primarschule Weiningen",
    "email": "schulverwaltung@weiningen.ch",
    "greeting": "Guten Tag Frau Henniger",
    "basis": "Official staff page identifies Denise Henniger as responsible for the website; shared administrative inbox used deliberately for this named contact."
  }
] as const;
export const OUTREACH_BATCH2_RECIPIENTS = [
 {organisation: 'Primarschule Seuzach', email: 'sarina.baumann@seuzach.ch', greeting: 'Guten Tag Frau Baumann'},
 {organisation: 'Familienleben', email: 'redaktion@familienleben.ch', greeting: 'Guten Tag'},
 {organisation: 'LetsFamily', email: 'letsfamily@present-service.ch', greeting: 'Guten Tag'},
] as const;
// Original five and their content remain immutable. Forms are not email recipients.
export const ALL_OUTREACH_RECIPIENTS = [...OUTREACH_RECIPIENTS, ...OUTREACH_BATCH2_RECIPIENTS] as const;
const HTML = "<!DOCTYPE html>\n<html lang=\"de\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />\n    <title>Cleverli als Ergänzung für Ihre Lernempfehlungen?</title>\n  </head>\n  <body style=\"margin:0;padding:0;background:#f0fdf4;font-family:Arial,Helvetica,sans-serif;color:#1f2937;\">\n    <div style=\"display:none;max-height:0;overflow:hidden;opacity:0;\">\n      Im Zürcher Weinland entwickelt, für neugierige Primarschulkinder.\n    </div>\n    <div\n      style=\"max-width:560px;margin:32px auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dcfce7;box-shadow:0 4px 24px rgba(0,0,0,0.06);\"\n    >\n      <div style=\"background:#15803d;padding:28px 24px;text-align:center;\">\n        <img\n          src=\"https://www.cleverli.ch/cleverli-logo.png\"\n          alt=\"Cleverli\"\n          width=\"150\"\n          style=\"display:block;margin:0 auto 14px;\"\n        />\n        <h1 style=\"margin:0;color:#ffffff;font-size:23px;line-height:1.35;font-weight:800;\">\n          Lernfreude aus dem Zürcher Weinland\n        </h1>\n      </div>\n      <div style=\"padding:28px;font-size:15px;line-height:1.7;color:#4b5563;\">\n        <p style=\"margin:0 0 16px;\">Guten Tag</p>\n        <p style=\"margin:0 0 16px;\">\n          Wir möchten Ihnen Cleverli vorstellen: eine im Zürcher Weinland entwickelte Lernplattform für Kinder der 1.\n          bis 6. Klasse. Vielleicht ist das Angebot auch für die Familien interessant, die Ihre Website besuchen.\n        </p>\n        <p style=\"margin:0 0 16px;\">\n          Uns ist wichtig, dass Kinder in ihrem eigenen Tempo üben können und bei einer schwierigen Aufgabe\n          Unterstützung bekommen. Auf Cleverli finden sie kurze, interaktive Übungen in Mathematik, Deutsch und weiteren\n          Schulfächern. Die Inhalte orientieren sich am Lehrplan 21. Hinweise, Vorlesefunktionen und direktes Feedback\n          helfen beim Üben; Eltern können den Lernfortschritt mitverfolgen.\n        </p>\n        <p style=\"margin:0 0 20px;\">\n          Hier können Sie sich einen ersten Eindruck verschaffen:<br /><a\n            href=\"https://www.cleverli.ch\"\n            style=\"color:#15803d;text-decoration:underline;word-break:break-word;\"\n            >www.cleverli.ch</a\n          >\n        </p>\n        <div style=\"background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 18px;margin:0 0 20px;\">\n          <p style=\"margin:0;font-size:14px;line-height:1.7;\">\n            Gerne richten wir Ihnen einen kostenlosen Premiumzugang ein, damit Sie Cleverli in Ruhe kennenlernen können.\n            Dieser ist unverbindlich und nicht an eine Erwähnung oder Verlinkung gebunden.\n          </p>\n        </div>\n        <p style=\"margin:0 0 16px;\">\n          Wenn Cleverli zu Ihren Lernempfehlungen passt, würden wir uns über eine Aufnahme auf Ihrer Website freuen.\n        </p>\n        <p style=\"margin:0 0 16px;\">\n          Falls jemand anderes Ihre Lernempfehlungen betreut, freuen wir uns über einen Hinweis auf die passende\n          Ansprechperson. Wenn das Thema für Sie nicht relevant ist, genügt eine kurze Nachricht; dann kontaktieren wir\n          Sie dazu nicht erneut.\n        </p>\n        <p style=\"margin:24px 0 0;\">Herzliche Grüsse<br />Alexandra und das Cleverli-Team</p>\n      </div>\n      <div style=\"border-top:1px solid #e5e7eb;padding:16px 28px;text-align:center;background:#f9fafb;\">\n        <p style=\"font-size:11px;line-height:1.5;color:#9ca3af;margin:0;\">\n          Cleverli<br /><a href=\"https://www.cleverli.ch/datenschutz\" style=\"color:#9ca3af;\">Datenschutz</a> ·\n          <a href=\"https://www.cleverli.ch/impressum\" style=\"color:#9ca3af;\">Impressum</a>\n        </p>\n      </div>\n    </div>\n  </body>";
export function outreachRecipient(value: unknown) {
 if (typeof value !== 'string') throw Error('invalid_recipient');
 const recipient = ALL_OUTREACH_RECIPIENTS.find(r => r.email === value.trim().toLowerCase());
 if (!recipient) throw Error('unapproved_recipient');
 return recipient;
}
export function outreachContent(value: unknown) {
 const recipient = outreachRecipient(value);
 const html = HTML.replace('>Guten Tag</p>', `>${recipient.greeting}</p>`);
 const hash = createHash('sha256').update(JSON.stringify({from:OUTREACH_FROM,to:recipient.email,replyTo:OUTREACH_REPLY_TO,subject:OUTREACH_SUBJECT,html})).digest('hex');
 return {...recipient,html,hash};
}
