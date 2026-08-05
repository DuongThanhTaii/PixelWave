"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const prisma_1 = require("../lib/prisma");
const roleMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });
            if (!user || !allowedRoles.includes(user.role)) {
                res.status(403).json({ success: false, message: `Forbidden: Requires one of ${allowedRoles.join(', ')}` });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Role middleware error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };
};
exports.roleMiddleware = roleMiddleware;
