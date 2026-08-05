"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Must be called before any imports that use env variables
// Patch BigInt globally to prevent JSON stringify errors
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const canvas_service_1 = require("./services/canvas.service");
// Initialize canvas service
canvas_service_1.canvasService.init().catch(console.error);
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const fandom_routes_1 = __importDefault(require("./routes/fandom.routes"));
const track_routes_1 = __importDefault(require("./routes/track.routes"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express_1.default.json());
// Mount routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/fandoms', fandom_routes_1.default);
app.use('/api/v1/tracks', track_routes_1.default);
app.use('/api/v1/sessions', session_routes_1.default);
app.use('/api/v1/upload', upload_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
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
            version: canvas_service_1.canvasService.getVersion(),
            pixels: canvas_service_1.canvasService.getAllPixels().map(p => ({
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
    socket.on('pixel:place', (data) => {
        if (!socket.data.userId) {
            return socket.emit('error', { message: 'Unauthorized' });
        }
        try {
            const newPixel = canvas_service_1.canvasService.placePixel({
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
        }
        catch (e) {
            socket.emit('error', { message: e.message });
        }
    });
    socket.on('cursor:move', (data) => {
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
