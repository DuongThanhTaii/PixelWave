"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = exports.googleLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev-only-change-in-prod';
const JWT_EXPIRES_IN = '7d';
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ success: false, message: 'Missing Google token' });
            return;
        }
        // Verify token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ success: false, message: 'Invalid Google token' });
            return;
        }
        const { email, sub: googleId, name, picture } = payload;
        // Find user by googleId or email
        let user = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ googleId }, { email }]
            }
        });
        if (user) {
            // Link googleId if missing
            if (!user.googleId) {
                user = await prisma_1.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        }
        else {
            // Create new user
            const username = `user_${Math.floor(Math.random() * 1000000)}`;
            const placeholderPassword = await bcryptjs_1.default.hash(googleId + JWT_SECRET, 10);
            user = await prisma_1.prisma.user.create({
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
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date(), lastActiveAt: new Date() }
        });
        // Generate JWT
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ success: false, message: 'Google authentication failed' });
    }
};
exports.googleLogin = googleLogin;
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        // Check if user exists
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        if (existingUser) {
            res.status(409).json({ success: false, message: 'Username or email already in use' });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const newUser = await prisma_1.prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
                displayName: username
            }
        });
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        // Find user
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // Verify password
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // Update last login
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date(), lastActiveAt: new Date() }
        });
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
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
    }
    catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getMe = getMe;
