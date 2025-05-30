import { Router, Request, Response } from 'express'
import prisma from '../prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/custom-models', authMiddleware, async (req: Request, res: Response) => {
  const models = await prisma.customModel.findMany({
    include: { base: true }
  })
  res.json(models)
})

export default router
