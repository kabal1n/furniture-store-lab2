import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret-key';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ error: 'Нет access токена' });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    (req as any).admin = payload;
    next();
  } catch {
    return res.status(403).json({ error: 'Невалидный access токен' });
  }
}
