import { Router } from 'express';
import prisma from '../db';
import { asyncHandler } from '../middleware/asyncHandler';
import { LIMITS, validateNumericFields, validateRequired } from '../utils/validators';

const router = Router();

/** Fields safe to return to the client */
const PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  age: true,
  gender: true,
  heightCm: true,
  weightKg: true,
  activityLevel: true,
};

// GET /api/profile?userId=xxx — Get user profile
router.get('/', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (typeof userId !== 'string') return res.status(400).json({ error: 'userId is required' });

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: PROFILE_SELECT,
  });

  if (!profile) return res.status(404).json({ error: 'User not found' });
  res.json(profile);
}));

// PUT /api/profile — Update user profile
router.put('/', asyncHandler(async (req, res) => {
  const { userId, age, gender, heightCm, weightKg, activityLevel, name } = req.body;

  const missing = validateRequired(req.body, ['userId']);
  if (missing) return res.status(400).json({ error: missing });

  const invalid = validateNumericFields([
    ...(age !== undefined ? [{ field: 'Age', value: age, min: 13, max: 120, unit: 'years' }] : []),
    ...(heightCm !== undefined ? [{ field: 'Height', value: heightCm, min: 50, max: 300, unit: 'cm' }] : []),
    ...(weightKg !== undefined ? [{ field: 'Weight', value: weightKg, min: LIMITS.WEIGHT_MIN, max: LIMITS.WEIGHT_MAX, unit: 'kg' }] : []),
  ]);
  if (invalid) return res.status(400).json({ error: invalid });

  if (gender && !['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: 'Gender must be "male" or "female"' });
  }

  if (activityLevel && !['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(activityLevel)) {
    return res.status(400).json({ error: 'Invalid activity level' });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name }),
      ...(age !== undefined && { age }),
      ...(gender !== undefined && { gender }),
      ...(heightCm !== undefined && { heightCm }),
      ...(weightKg !== undefined && { weightKg }),
      ...(activityLevel !== undefined && { activityLevel }),
    },
    select: PROFILE_SELECT,
  });

  res.json(updated);
}));

export default router;
