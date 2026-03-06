import { Router } from 'express';
import prisma from '../db';
import { asyncHandler } from '../middleware/asyncHandler';
import { LIMITS, validateNumericFields, validateRequired } from '../utils/validators';

const router = Router();

// POST /api/weight — Log a weight entry
router.post('/', asyncHandler(async (req, res) => {
  const { userId, weightKg } = req.body;

  const missing = validateRequired(req.body, ['userId', 'weightKg']);
  if (missing) return res.status(400).json({ error: missing });

  const invalid = validateNumericFields([
    { field: 'Weight', value: weightKg, min: LIMITS.WEIGHT_MIN, max: LIMITS.WEIGHT_MAX, unit: 'kg' },
  ]);
  if (invalid) return res.status(400).json({ error: invalid });

  const entry = await prisma.weightLog.create({ data: { userId, weightKg } });
  res.status(201).json(entry);
}));

// GET /api/weight?userId=xxx — List weight entries
router.get('/', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (typeof userId !== 'string') return res.status(400).json({ error: 'userId is required' });

  const entries = await prisma.weightLog.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  res.json(entries);
}));

// DELETE /api/weight/:id — Delete a weight entry
router.delete('/:id', asyncHandler(async (req, res) => {
  await prisma.weightLog.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

export default router;
