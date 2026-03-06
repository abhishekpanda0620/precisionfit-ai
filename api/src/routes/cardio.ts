import { Router, Response } from 'express';
import prisma from '../db';
import { asyncHandler } from '../middleware/asyncHandler';
import { LIMITS, validateNumericFields, validateRequired } from '../utils/validators';
import { keytelCalorieBurn } from '../utils/formulas';

const router = Router();

// POST /api/cardio — Log a new cardio session
router.post('/', asyncHandler(async (req, res) => {
  const { userId, durationMinutes, distanceKm, caloriesDevice, avgHeartRate, source = 'manual' } = req.body;

  const missing = validateRequired(req.body, ['userId', 'durationMinutes', 'distanceKm', 'caloriesDevice', 'avgHeartRate']);
  if (missing) return res.status(400).json({ error: missing });

  const invalid = validateNumericFields([
    { field: 'Heart rate', value: avgHeartRate, min: LIMITS.HR_MIN, max: LIMITS.HR_MAX, unit: 'bpm' },
    { field: 'Duration', value: durationMinutes, min: LIMITS.DURATION_MIN, max: LIMITS.DURATION_MAX, unit: 'minutes' },
    { field: 'Distance', value: distanceKm, min: LIMITS.DISTANCE_MIN, max: LIMITS.DISTANCE_MAX, unit: 'km' },
    { field: 'Device calories', value: caloriesDevice, min: LIMITS.CALORIES_MIN, max: LIMITS.CALORIES_MAX },
  ]);
  if (invalid) return res.status(400).json({ error: invalid });

  // Fetch user biometrics for accurate Keytel formula calculation
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const caloriesFormula = keytelCalorieBurn(
    avgHeartRate,
    durationMinutes,
    (user as any)?.weightKg ?? undefined,
    (user as any)?.age ?? undefined,
    ((user as any)?.gender as 'male' | 'female') ?? undefined,
  );

  const session = await prisma.cardioSession.create({
    data: { userId, durationMinutes, distanceKm, caloriesDevice, caloriesFormula, avgHeartRate, source },
  });

  res.status(201).json(session);
}));

// GET /api/cardio?userId=xxx — List sessions for a user
router.get('/', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (typeof userId !== 'string') return res.status(400).json({ error: 'userId is required' });

  const sessions = await prisma.cardioSession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
  res.json(sessions);
}));

// GET /api/cardio/:id — Get a single session
router.get('/:id', asyncHandler(async (req, res) => {
  const session = await prisma.cardioSession.findUnique({ where: { id: req.params.id } });
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
}));

// DELETE /api/cardio/:id — Delete a session
router.delete('/:id', asyncHandler(async (req, res) => {
  await prisma.cardioSession.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

export default router;
