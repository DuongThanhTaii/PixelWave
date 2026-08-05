"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("../controllers/session.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Require authentication to log sessions
router.post('/log', auth_middleware_1.authMiddleware, session_controller_1.logSession);
router.post('/progress', auth_middleware_1.authMiddleware, session_controller_1.saveProgress);
router.get('/progress/:trackId', auth_middleware_1.authMiddleware, session_controller_1.getResumePosition);
exports.default = router;
