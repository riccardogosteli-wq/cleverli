export interface TeacherAccount {
  user_id: string;
  school_name: string;
  active: boolean;
  valid_until: string;
}
export function teacherAccountActive(account: TeacherAccount | null | undefined, now = Date.now()): boolean {
  return account?.active === true && Number.isFinite(Date.parse(account.valid_until)) && Date.parse(account.valid_until) > now;
}
export function validateTeacherAction(form: FormData, now = Date.now()) {
  const fields = ['userId', 'action', 'school', 'until', 'confirmed'];
  if ([...form.keys()].some(k => !fields.includes(k) || form.getAll(k).length !== 1)) throw Error('invalid_fields');
  const userId = String(form.get('userId') ?? '');
  const action = String(form.get('action') ?? '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) throw Error('invalid_user');
  if (!['preview', 'grant', 'revoke'].includes(action)) throw Error('invalid_action');
  if (action !== 'preview' && form.get('confirmed') !== 'yes') throw Error('confirmation_required');
  const school = String(form.get('school') ?? '').trim();
  const raw = String(form.get('until') ?? '');
  const until = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T23:59:59.999Z` : null;
  if (action === 'grant' && (school.length < 2 || school.length > 160 || !until || !Number.isFinite(Date.parse(until)) || new Date(until).toISOString().slice(0,10) !== raw || Date.parse(until) <= now || Date.parse(until) > now + 5 * 366 * 86400000)) throw Error('invalid_grant');
  return { userId, action, school, until };
}
