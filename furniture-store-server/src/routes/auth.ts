import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
if (!ACCESS_SECRET || !REFRESH_SECRET) throw new Error('JWT ключи не заданы');

function generateTokens(payload: object) {
  return {
    accessToken: jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' }),
    refreshToken: jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' }),
  };
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вход администратора
 *     tags: [Auth]
 */

router.post('/login', async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: 'Требуются логин и пароль' });
  }

  const admin = await prisma.admin.findUnique({ where: { login } });
  if (!admin) return res.status(401).json({ error: 'Неверные данные' });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: 'Неверные данные' });

  const payload = { id: admin.id };
  const { accessToken, refreshToken } = generateTokens(payload);

  res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 15 * 60 * 1000, // 15 минут
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    })
    .json({ message: 'Вход выполнен' });
});

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Обновление Access Token по Refresh Token
 *     tags: [Auth]
 */

router.post('/refresh', (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'Нет refresh токена' });

  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as { id: number };
    const newAccessToken = jwt.sign({ id: payload.id }, ACCESS_SECRET, {
      expiresIn: '15m',
    });

    res
      .cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: 'Access token обновлён' });
  } catch (err) {
    res.status(403).json({ error: 'Невалидный refresh token' });
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Выход
 *     tags: [Auth]
 */

router.post('/logout', (req: Request, res: Response) => {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ message: 'Выход выполнен' });
});

export default router;
