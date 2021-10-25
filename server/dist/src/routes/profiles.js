"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profilesController_1 = require("../controllers/profilesController");
const auth_1 = require("../middlewares/auth");
const fileStorage_1 = __importDefault(require("../middlewares/fileStorage"));
const router = (0, express_1.Router)();
router.route('/teams/:team').get(auth_1.protect, (0, auth_1.authorize)(3, 2, 1), profilesController_1.getTeam);
router.route('/player').get(auth_1.protect, (0, auth_1.authorize)(3, 2, 1), profilesController_1.getProfiles);
router.route('/player/:id').get(auth_1.protect, (0, auth_1.authorize)(3, 2, 1), profilesController_1.getProfile);
router.route('/player/:id/kick').put(auth_1.protect, (0, auth_1.authorize)(2, 1), profilesController_1.kickTeam);
router
    .route('/me')
    .get(auth_1.protect, (0, auth_1.authorize)(3, 2, 1), profilesController_1.getMe)
    .put(auth_1.protect, (0, auth_1.authorize)(3, 2, 1), profilesController_1.updateProfile)
    .post(auth_1.protect, (0, auth_1.authorize)(3, 2, 1), fileStorage_1.default.single('avatar'), profilesController_1.updateAvatar);
exports.default = router;
