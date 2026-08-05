"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const track_controller_1 = require("../controllers/track.controller");
const router = (0, express_1.Router)();
router.get('/', track_controller_1.getTracks);
exports.default = router;
