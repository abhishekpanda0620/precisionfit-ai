import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db';
import { asyncHandler } from '../middleware/asyncHandler';
import { verifyInternalRequest } from '../middleware/verifyInternal';
import { validateRequired } from '../utils/validators';

const router = Router();

// All routes in this module require a valid internal API key
router.use(verifyInternalRequest);

// --- Helpers ---

/** Strip passwordHash before returning user data to callers */
function sanitizeUser(user: Record<string, any>) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// --- Credential Operations ---

router.post('/register', asyncHandler(async (req, res) => {
  const missing = validateRequired(req.body, ['email', 'password']);
  if (missing) return res.status(400).json({ error: missing });

  const { email, password, name } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });

  res.json(sanitizeUser(user));
}));

router.post('/login', asyncHandler(async (req, res) => {
  const missing = validateRequired(req.body, ['email', 'password']);
  if (missing) return res.status(400).json({ error: missing });

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json(sanitizeUser(user));
}));

// --- User CRUD (NextAuth Adapter Operations) ---

router.post('/user', asyncHandler(async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json(user);
}));

router.get('/user/:id', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json(null);
  res.json(user);
}));

router.get('/user-by-email', asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (typeof email !== 'string') return res.status(400).json({ error: 'Invalid email' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json(null);
  res.json(user);
}));

router.get('/user-by-account', asyncHandler(async (req, res) => {
  const { provider, providerAccountId } = req.query;
  if (typeof provider !== 'string' || typeof providerAccountId !== 'string') {
    return res.status(400).json({ error: 'Invalid account query' });
  }
  const account = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  });
  if (!account) return res.status(404).json(null);
  res.json(account.user);
}));

router.put('/user/:id', asyncHandler(async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
  res.json(user);
}));

router.delete('/user/:id', asyncHandler(async (req, res) => {
  const user = await prisma.user.delete({ where: { id: req.params.id } });
  res.json(user);
}));

// --- Account Operations ---

router.post('/account', asyncHandler(async (req, res) => {
  const account = await prisma.account.create({ data: req.body });
  res.json(account);
}));

router.delete('/account', asyncHandler(async (req, res) => {
  const { provider, providerAccountId } = req.query;
  if (typeof provider !== 'string' || typeof providerAccountId !== 'string') {
    return res.status(400).json({ error: 'Invalid account query' });
  }
  const account = await prisma.account.delete({
    where: { provider_providerAccountId: { provider, providerAccountId } },
  });
  res.json(account);
}));

// --- Session Operations ---

router.post('/session', asyncHandler(async (req, res) => {
  const session = await prisma.session.create({ data: req.body });
  res.json(session);
}));

router.get('/session', asyncHandler(async (req, res) => {
  const { sessionToken } = req.query;
  if (typeof sessionToken !== 'string') return res.status(400).json({ error: 'Invalid token' });
  const sessionAndUser = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });
  if (!sessionAndUser) return res.status(404).json(null);
  const { user, ...session } = sessionAndUser;
  res.json({ session, user });
}));

router.put('/session', asyncHandler(async (req, res) => {
  const { sessionToken, ...data } = req.body;
  const session = await prisma.session.update({ where: { sessionToken }, data });
  res.json(session);
}));

router.delete('/session', asyncHandler(async (req, res) => {
  const { sessionToken } = req.query;
  if (typeof sessionToken !== 'string') return res.status(400).json({ error: 'Invalid token' });
  const session = await prisma.session.delete({ where: { sessionToken } });
  res.json(session);
}));

// --- Verification Token Operations ---

router.post('/verification-token', asyncHandler(async (req, res) => {
  const token = await prisma.verificationToken.create({ data: req.body });
  res.json(token);
}));

router.delete('/verification-token', asyncHandler(async (req, res) => {
  const { identifier, token } = req.query;
  if (typeof identifier !== 'string' || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid query params' });
  }
  const result = await prisma.verificationToken.delete({
    where: { identifier_token: { identifier, token } },
  });
  res.json(result);
}));

export default router;
