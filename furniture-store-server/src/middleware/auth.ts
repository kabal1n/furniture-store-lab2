import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
if (!ACCESS_SECRET) {
  throw new Error('ACCESS_SECRET не задан в .env');
}

interface AdminRequest extends Request {
  admin?: string | jwt.JwtPayload;
}

export function authMiddleware(req: AdminRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ error: 'Нет access токена' });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    console.error('JWT ошибка:', err);
    return res.status(403).json({ error: 'Невалидный access токен' });
  }
}
