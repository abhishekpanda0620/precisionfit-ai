import { Router } from 'express';
import prisma from '../db';
import { asyncHandler } from '../middleware/asyncHandler';
import { LIMITS, validateNumericFields, validateRequired } from '../utils/validators';

const router = Router();

// POST /api/meals — Log a new meal
router.post('/', asyncHandler(async (req, res) => {
  const { userId, foodName, amountGrams, calories, proteinGrams = 0, carbsGrams = 0, fatGrams = 0 } = req.body;

  const missing = validateRequired(req.body, ['userId', 'foodName', 'calories']);
  if (missing) return res.status(400).json({ error: missing });

  const invalid = validateNumericFields([
    { field: 'Calories', value: calories, min: LIMITS.CALORIES_MIN, max: LIMITS.CALORIES_MAX },
    { field: 'Amount', value: amountGrams, min: LIMITS.GRAMS_MIN, max: LIMITS.GRAMS_MAX, unit: 'g' },
  ]);
  if (invalid) return res.status(400).json({ error: invalid });

  const meal = await prisma.mealLog.create({
    data: { userId, foodName, amountGrams, calories, proteinGrams, carbsGrams, fatGrams },
  });
  res.status(201).json(meal);
}));

// GET /api/meals?userId=xxx&date=YYYY-MM-DD — List meals, optionally by date
router.get('/', asyncHandler(async (req, res) => {
  const { userId, date } = req.query;
  if (typeof userId !== 'string') return res.status(400).json({ error: 'userId is required' });

  const where: any = { userId };
  if (typeof date === 'string') {
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setDate(dayEnd.getDate() + 1);
    where.date = { gte: dayStart, lt: dayEnd };
  }

  const meals = await prisma.mealLog.findMany({ where, orderBy: { date: 'desc' } });
  res.json(meals);
}));

// DELETE /api/meals/:id — Delete a meal entry
router.delete('/:id', asyncHandler(async (req, res) => {
  await prisma.mealLog.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

export default router;
