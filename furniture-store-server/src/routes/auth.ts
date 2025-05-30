import { Router, Request, Response } from 'express'
import prisma from '../prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вход администратора
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: user
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Успешный вход
 *       401:
 *         description: Неверные данные
 */



const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'

router.post('/login', async (req: Request, res: Response) => {
  const { login, password } = req.body

  if (!login || !password) {
    return res.status(400).json({ error: 'Требуются логин и пароль' })
  }

  const admin = await prisma.admin.findUnique({ where: { login } })
  if (!admin) return res.status(401).json({ error: 'Неверные данные' })

  const valid = await bcrypt.compare(password, admin.password)
if (!valid) return res.status(401).json({ error: 'Неверные данные' })

  const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '2h' })

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  })

  res.json({ message: 'Вход выполнен' })
})

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  res.json({ message: 'Выход выполнен' });
});


export default router
