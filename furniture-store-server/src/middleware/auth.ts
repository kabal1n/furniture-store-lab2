import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: 'Нет токена' })

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    ;(req as any).admin = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Неверный токен' })
  }
}
