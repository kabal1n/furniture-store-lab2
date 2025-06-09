import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/custom-models', authMiddleware, async (req: Request, res: Response) => {
  try {
    const models = await prisma.customModel.findMany({
      include: { base: true },
    });
    res.json(models);
  } catch (err) {
    console.error('Ошибка при получении моделей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
