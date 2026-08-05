"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Secure all admin routes
router.use(auth_middleware_1.authMiddleware);
router.post('/artists', (0, role_middleware_1.roleMiddleware)([client_1.Role.ADMIN, client_1.Role.MODERATOR]), admin_controller_1.createArtist);
router.post('/fandoms', (0, role_middleware_1.roleMiddleware)([client_1.Role.ADMIN, client_1.Role.MODERATOR]), admin_controller_1.createFandom);
router.post('/tracks', (0, role_middleware_1.roleMiddleware)([client_1.Role.ADMIN, client_1.Role.MODERATOR]), admin_controller_1.createTrack);
router.put('/tracks/:id/lyrics', (0, role_middleware_1.roleMiddleware)([client_1.Role.ADMIN, client_1.Role.MODERATOR]), admin_controller_1.updateTrackLyrics);
exports.default = router;
