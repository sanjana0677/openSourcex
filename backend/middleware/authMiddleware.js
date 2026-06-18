import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  try {
    const { sub } = verifyAccessToken(token);
    const user = await User.findById(sub).select('_id');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.userId = sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
