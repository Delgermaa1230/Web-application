import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const cookieName = 'numteach_session';
const sessionAgeSeconds = 60 * 60 * 24 * 14;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, 64)).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export async function checkPassword(password, stored) {
  const [, salt, hash] = String(stored || '').split(':');
  if (!salt || !/^[0-9a-f]{128}$/.test(hash || '')) return false;
  const actual = await scrypt(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(db, res, userId, secure = false) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + sessionAgeSeconds * 1000;
  await db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .run(tokenHash(token), userId, expiresAt);
  res.cookie(cookieName, token, {
    httpOnly: true, sameSite: 'lax', secure,
    path: '/', maxAge: sessionAgeSeconds * 1000,
  });
}

export async function clearSession(db, req, res) {
  const token = readCookie(req);
  if (token) await db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token));
  res.clearCookie(cookieName, { path: '/', sameSite: 'lax' });
}

function readCookie(req) {
  const item = (req.headers.cookie || '').split(';').map(value => value.trim())
    .find(value => value.startsWith(`${cookieName}=`));
  return item?.slice(cookieName.length + 1) || null;
}

export async function currentUser(db, req) {
  const token = readCookie(req);
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  return await db.prepare(`SELECT users.* FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?`)
    .get(tokenHash(token), Date.now()) || null;
}
