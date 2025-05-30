import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send('Test route OK')
})

router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' })
  res.json({ id, message: 'Item found' })
})

export default router
