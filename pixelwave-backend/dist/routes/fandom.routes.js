"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fandom_controller_1 = require("../controllers/fandom.controller");
const router = (0, express_1.Router)();
router.get('/', fandom_controller_1.getFandoms);
router.get('/:slug', fandom_controller_1.getFandomBySlug);
exports.default = router;
