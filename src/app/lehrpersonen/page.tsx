import type { Metadata } from 'next';
import TeacherPage from './TeacherPage';
export const metadata: Metadata = { title:'Cleverli für Lehrpersonen', description:'Cleverli im Unterricht und in der begleiteten Förderung: Lehrerkonto mit unbegrenzt vielen Kinderprofilen auf Anfrage.', alternates:{canonical:'https://www.cleverli.ch/lehrpersonen'} };
export default function Page() { return <TeacherPage />; }
