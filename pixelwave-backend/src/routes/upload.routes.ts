import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../lib/cloudinary';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint uses multer to intercept the file upload, then runs the controller
router.post('/', authMiddleware, upload.single('file'), uploadImage);

export default router;
