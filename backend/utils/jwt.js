import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'dev-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

export function signAccessToken(userId) {
  return jwt.sign({ sub: userId, type: 'access' }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, ACCESS_SECRET);
  if (payload.type !== 'access') throw new Error('Invalid token type');
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, REFRESH_SECRET);
  if (payload.type !== 'refresh') throw new Error('Invalid token type');
  return payload;
}
