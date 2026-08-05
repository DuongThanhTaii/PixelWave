import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export const roleMiddleware = (allowedRoles: Role[], allowVerifiedArtist: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, isVerified: true }
      });

      if (!user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
      }

      const hasRole = allowedRoles.includes(user.role);
      const isAllowedArtist = allowVerifiedArtist && user.isVerified;

      if (!hasRole && !isAllowedArtist) {
        res.status(403).json({ success: false, message: `Forbidden: Requires one of ${allowedRoles.join(', ')} or Verified Artist status` });
        return;
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
};
