"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const cloudinary_1 = require("../lib/cloudinary");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Endpoint uses multer to intercept the file upload, then runs the controller
router.post('/', auth_middleware_1.authMiddleware, cloudinary_1.upload.single('image'), upload_controller_1.uploadImage);
exports.default = router;
