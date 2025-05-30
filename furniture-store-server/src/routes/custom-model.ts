import { Router, Request, Response } from 'express'
import prisma from '../prisma'

const router = Router()

/**
 * @swagger
 * /custom-model:
 *   post:
 *     summary: Сохранить пользовательскую модель мебели
 *     tags:
 *       - CustomModel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - baseId
 *               - data
 *             properties:
 *               baseId:
 *                 type: integer
 *               data:
 *                 type: object
 *                 properties:
 *                   color:
 *                     type: string
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *                   depth:
 *                     type: number
 *                   shelves:
 *                     type: array
 *                     items:
 *                       type: number
 *     responses:
 *       201:
 *         description: Модель сохранена
 *       400:
 *         description: Ошибка валидации
 */


router.post('/', async (req: Request, res: Response) => {
  const { baseId, data } = req.body

  if (!baseId || !data) {
    return res.status(400).json({ error: 'baseId и data обязательны' })
  }

  try {
    const base = await prisma.furniture.findUnique({ where: { id: Number(baseId) } })
    if (!base) return res.status(404).json({ error: 'Базовая мебель не найдена' })

    const model = await prisma.customModel.create({
      data: {
        baseId: Number(baseId),
        data,
      },
    })

    res.status(201).json(model)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка при сохранении модели' })
  }
})

export default router
