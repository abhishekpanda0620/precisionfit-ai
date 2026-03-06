import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db';

const router = Router();

// Middleware to verify internal API Secret
const verifyInternalRequest = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized internal request' });
  }
  next();
};

router.use(verifyInternalRequest);

// --- Simple Credential Operations ---

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });
    
    // @ts-ignore - Don't leak hash
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    // @ts-ignore
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- User Operations ---

router.post('/user', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/user/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json(null);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.get('/user-by-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (typeof email !== 'string') return res.status(400).json({ error: 'Invalid email' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json(null);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user by email' });
  }
});

router.get('/user-by-account', async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user by account' });
  }
});

router.put('/user/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/user/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.params.id } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- Account Operations ---

router.post('/account', async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.create({ data: req.body });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to link account' });
  }
});

router.delete('/account', async (req: Request, res: Response) => {
  try {
    const { provider, providerAccountId } = req.query;
    if (typeof provider !== 'string' || typeof providerAccountId !== 'string') {
      return res.status(400).json({ error: 'Invalid account query' });
    }
    const account = await prisma.account.delete({
      where: { provider_providerAccountId: { provider, providerAccountId } },
    });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlink account' });
  }
});

// --- Session Operations ---

router.post('/session', async (req: Request, res: Response) => {
  try {
    const session = await prisma.session.create({ data: req.body });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

router.get('/session', async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.query;
    if (typeof sessionToken !== 'string') return res.status(400).json({ error: 'Invalid token' });
    const sessionAndUser = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!sessionAndUser) return res.status(404).json(null);
    const { user, ...session } = sessionAndUser;
    res.json({ session, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});

router.put('/session', async (req: Request, res: Response) => {
  try {
    const { sessionToken, ...data } = req.body;
    const session = await prisma.session.update({
      where: { sessionToken },
      data,
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

router.delete('/session', async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.query;
    if (typeof sessionToken !== 'string') return res.status(400).json({ error: 'Invalid token' });
    const session = await prisma.session.delete({ where: { sessionToken } });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// --- Verification Token Operations (Required for Email Magic Links) ---

router.post('/verification-token', async (req: Request, res: Response) => {
  try {
    const verificationToken = await prisma.verificationToken.create({ data: req.body });
    res.json(verificationToken);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create verification token' });
  }
});

router.delete('/verification-token', async (req: Request, res: Response) => {
  try {
    const { identifier, token } = req.query;
    if (typeof identifier !== 'string' || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid query params' });
    }
    const verificationToken = await prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } },
    });
    res.json(verificationToken);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete verification token' });
  }
});

export default router;
