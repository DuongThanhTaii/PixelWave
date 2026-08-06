import dotenv from 'dotenv';
dotenv.config(); // Must be called before any imports that use env variables

// Patch BigInt globally to prevent JSON stringify errors
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { prisma } from './lib/prisma';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

import { canvasService, PixelData } from './services/canvas.service';

// Initialize canvas service
canvasService.init().catch(console.error);

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import fandomRoutes from './routes/fandom.routes';
import trackRoutes from './routes/track.routes';
import sessionRoutes from './routes/session.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/fandoms', fandomRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/public', publicRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.get('/api/v1/canvas', (req, res) => {
  res.json({
    success: true,
    data: {
      config: {
        width: 1000,
        height: 1000,
        pixelGap: 1,
        defaultPixelSize: 12
      },
      version: canvasService.getVersion(),
      pixels: canvasService.getAllPixels().map(p => ({
        ...p,
        version: p.version.toString() // Convert BigInt for JSON serialization
      }))
    }
  });
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on('auth', (data) => {
    console.log(`Auth attempt with token: ${data.token}`);
    // Mock user identification
    const userId = 'mock-user-id-' + Math.floor(Math.random() * 1000);
    socket.data.userId = userId;
    socket.emit('auth:success', { userId, fandomId: 'mock-fandom-id' });
  });

  // Canvas Events
  socket.on('canvas:join', () => {
    socket.join('canvas_global');
  });

  socket.on('pixel:place', (data: { x: number, y: number, color: string, fandomId: string }) => {
    if (!socket.data.userId) {
      return socket.emit('error', { message: 'Unauthorized' });
    }

    try {
      const newPixel = canvasService.placePixel({
        x: data.x,
        y: data.y,
        color: data.color,
        fandomId: data.fandomId,
        userId: socket.data.userId
      });

      // Broadcast to everyone in canvas room
      io.to('canvas_global').emit('pixel:update', {
        ...newPixel,
        version: newPixel.version.toString()
      });
      
    } catch (e: any) {
      socket.emit('error', { message: e.message });
    }
  });

  socket.on('cursor:move', (data: { x: number, y: number, color: string }) => {
    // Broadcast cursor position (volatile as it's high frequency and can be dropped)
    if (socket.data.userId) {
      socket.volatile.broadcast.to('canvas_global').emit('cursor:update', {
        userId: socket.data.userId,
        x: data.x,
        y: data.y,
        color: data.color
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Pixelwave Backend running on port ${PORT}`);
});
