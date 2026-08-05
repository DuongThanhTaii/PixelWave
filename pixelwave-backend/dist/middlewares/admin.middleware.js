"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const prisma_1 = require("../lib/prisma");
const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { isAdmin: true }
        });
        if (!user || !user.isAdmin) {
            res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.adminMiddleware = adminMiddleware;
