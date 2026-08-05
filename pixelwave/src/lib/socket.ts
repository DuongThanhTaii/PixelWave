import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:4000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Pixelwave WebSocket:', this.socket?.id);
      
      // Auto-auth if token exists
      const token = typeof window !== 'undefined' ? localStorage.getItem('pixelwave_token') : null;
      if (token) {
        this.socket?.emit('auth', { token });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Pixelwave WebSocket');
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
