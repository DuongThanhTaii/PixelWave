import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev-only-change-in-prod';
const JWT_EXPIRES_IN = '7d';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, message: 'Missing Google token' });
      return;
    }

    // Try to verify as ID token first
    let email, googleId, name, picture;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (payload) {
        email = payload.email;
        googleId = payload.sub;
        name = payload.name;
        picture = payload.picture;
      }
    } catch (error) {
      // If it fails, try to use it as an access token to fetch user info
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          email = data.email;
          googleId = data.sub;
          name = data.name;
          picture = data.picture;
        } else {
          res.status(400).json({ success: false, message: 'Invalid Google token' });
          return;
        }
      } catch (fetchError) {
        res.status(400).json({ success: false, message: 'Invalid Google token' });
        return;
      }
    }

    if (!email || !googleId) {
      res.status(400).json({ success: false, message: 'Could not extract user info from Google' });
      return;
    }

    // Find user by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }]
      }
    });

    if (user) {
      // Link googleId if missing
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId }
        });
      }
    } else {
      // Create new user
      const username = `user_${Math.floor(Math.random() * 1000000)}`;
      const placeholderPassword = await bcrypt.hash(googleId + JWT_SECRET, 10);
      user = await prisma.user.create({
        data: {
          username,
          displayName: name || username,
          email,
          googleId,
          passwordHash: placeholderPassword,
          avatarUrl: picture
        }
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastActiveAt: new Date() }
    });

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'Username or email already in use' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        displayName: username
      }
    });

    // Generate token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          displayName: newUser.displayName,
          email: newUser.email,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body; // frontend can send username as email

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }]
      }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastActiveAt: new Date() }
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        bio: true,
        role: true,
        waveLevel: true,
        pixelBalance: true,
        currentStreak: true,
        activeFandomId: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
