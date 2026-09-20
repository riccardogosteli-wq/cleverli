import { getTopicTitle } from '@/data/topicTitles';
import type { Lang } from './i18n';
// Overview-only translations for titles not yet covered by the shared catalogue.
const titles: Record<string, Partial<Record<Lang, string>>> = {
 'digitale-spuren-3': {fr:'Traces numériques',it:'Tracce digitali',en:'Digital footprints'},
 'algorithmen-alltag-3': {fr:'Les algorithmes au quotidien',it:'Algoritmi nella vita quotidiana',en:'Everyday algorithms'},
 'informationen-pruefen-4': {fr:'Vérifier les informations',it:'Verificare le informazioni',en:'Checking information'},
 'programme-befehle-4': {fr:'Programmes et instructions',it:'Programmi e istruzioni',en:'Programs and instructions'},
 'sicher-online-5': {fr:'La sécurité en ligne',it:'Sicurezza online',en:'Staying safe online'},
 'daten-diagramme-5': {fr:'Comprendre les données',it:'Comprendere i dati',en:'Understanding data'},
 'feeds-algorithmen-6': {fr:'Fils d’actualité et algorithmes',it:'Feed e algoritmi',en:'Feeds and algorithms'},
 'netzwerke-sicherheit-6': {fr:'Réseaux et sécurité',it:'Reti e sicurezza',en:'Networks and security'},
 'bonjour-classe-3': {it:'Saluti e vita in classe',en:'Greetings and the classroom'},
 'je-me-presente-3': {it:'Mi presento',en:'Introducing myself'},
 'nombres-dates-3': {it:'Numeri e date',en:'Numbers and dates'},
 'ecole-objets-3': {it:'La scuola e gli oggetti',en:'School and objects'},
 'famille-amis-3': {it:'Famiglia e amici',en:'Family and friends'},
 'couleurs-vetements-3': {it:'Colori e vestiti',en:'Colours and clothes'},
 'manger-boire-3': {it:'Mangiare e bere',en:'Eating and drinking'},
 'suisse-romande-3': {it:'La Svizzera romanda',en:'French-speaking Switzerland'},
 'journee-heure-4': {it:'La mia giornata e l’ora',en:'My day and telling the time'},
 'maison-position-4': {it:'La casa e le posizioni',en:'The home and positions'},
 'ecole-horaire-4': {it:'La scuola e l’orario',en:'School and the timetable'},
 'loisirs-capacites-4': {it:'Tempo libero e capacità',en:'Hobbies and abilities'},
 'achats-prix-4': {it:'Acquisti e prezzi',en:'Shopping and prices'},
 'meteo-saisons-4': {it:'Meteo e stagioni',en:'Weather and seasons'},
 'ville-directions-4': {it:'In città e le indicazioni',en:'In town and directions'},
 'messages-invitations-4': {it:'Messaggi e inviti',en:'Messages and invitations'},
 'histoires-cultures-4': {it:'Storie e culture francofone',en:'Stories and French-speaking cultures'},
 'culture-francophone-6': {en:'French-speaking cultures'},
};
export function getLehrplanTopicTitle(id: string, lang: Lang, fallback: string) {
 return lang === 'de' ? fallback : titles[id]?.[lang] ?? getTopicTitle(id, lang, fallback);
}
