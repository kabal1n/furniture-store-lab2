import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

/**
 * @swagger
 * /furniture:
 *   get:
 *     summary: Получить список мебели
 *     tags:
 *       - Furniture
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Фильтр по типу мебели
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Фильтр по цвету
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию мебели
 *     responses:
 *       200:
 *         description: Список мебели
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req: Request, res: Response) => {
  const { type, color, search } = req.query;

  try {
    const furniture = await prisma.furniture.findMany({
      where: {
        AND: [
          type ? { type: { equals: String(type), mode: 'insensitive' } } : {},
          color ? { color: { equals: String(color), mode: 'insensitive' } } : {},
          search ? { name: { contains: String(search), mode: 'insensitive' } } : {},
        ],
      },
    });

    res.json(furniture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера при получении мебели' });
  }
});

/**
 * @swagger
 * /furniture/{id}:
 *   get:
 *     summary: Получить мебель по ID
 *     tags:
 *       - Furniture
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мебели
 *     responses:
 *       200:
 *         description: Объект мебели
 *       404:
 *         description: Мебель не найдена
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Неверный ID' });
  }

  try {
    const item = await prisma.furniture.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Не найдено' });

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера при получении мебели' });
  }
});

export default router;
