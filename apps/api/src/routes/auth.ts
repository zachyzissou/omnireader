import express from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const router = express.Router();

// Validation schemas
const LoginSchema = z.object({
  email: z.string().email(),
});

const VerifyTokenSchema = z.object({
  token: z.string(),
});

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'development-refresh-secret';

export function createAuthRoutes() {
  // Magic link login - send login email
  router.post('/login', async (req, res) => {
    try {
      const { email } = LoginSchema.parse(req.body);
      
      // Generate magic link token (short-lived, 15 minutes)
      const magicToken = jwt.sign(
        { email, type: 'magic-link' },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      
      // In a real implementation, send email with magic link
      // For development, return the token directly
      if (process.env.NODE_ENV === 'development') {
        res.json({
          message: 'Magic link generated',
          magicLink: `http://localhost:3000/auth/verify?token=${magicToken}`,
          token: magicToken, // For development only
        });
      } else {
        // TODO: Send email with magic link
        res.json({ message: 'Magic link sent to email' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Verify magic link token and issue access/refresh tokens
  router.post('/verify', async (req, res) => {
    try {
      const { token } = VerifyTokenSchema.parse(req.body);
      
      // Verify magic link token
      const payload = jwt.verify(token, JWT_SECRET) as any;
      
      if (payload.type !== 'magic-link') {
        res.status(400).json({ error: 'Invalid token type' });
        return;
      }
      
      const { email } = payload;
      
      // TODO: Create or update user in database
      const userId = email; // Simplified for now
      
      // Generate access token (1 hour)
      const accessToken = jwt.sign(
        { userId, email, type: 'access' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      // Generate refresh token (30 days)
      const refreshToken = jwt.sign(
        { userId, email, type: 'refresh' },
        JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
      );
      
      res.json({
        accessToken,
        refreshToken,
        user: { id: userId, email },
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      
      logger.error('Token verification error:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  });

  // Refresh access token
  router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token required' });
        return;
      }
      
      // Verify refresh token
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      
      if (payload.type !== 'refresh') {
        res.status(400).json({ error: 'Invalid token type' });
        return;
      }
      
      const { userId, email } = payload;
      
      // Generate new access token
      const newAccessToken = jwt.sign(
        { userId, email, type: 'access' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
        return;
      }
      
      logger.error('Token refresh error:', error);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  });

  // Get current user
  router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });

  return router;
}

// Authentication middleware
export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, payload: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    if (payload.type !== 'access') {
      return res.status(403).json({ error: 'Invalid token type' });
    }
    
    req.user = payload;
    next();
  });
}