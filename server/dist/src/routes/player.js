"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playerController_1 = require("../controllers/playerController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Player
router.route('/teams/:team/apply').post(auth_1.protect, (0, auth_1.authorize)(3), playerController_1.applyTeam);
router.route('/teams/:team/cancel').delete(auth_1.protect, (0, auth_1.authorize)(3), playerController_1.cancelTeam);
router.route('/teams/:team/leave').get(auth_1.protect, (0, auth_1.authorize)(3), playerController_1.leaveTeam);
router.route('/myteam').get(auth_1.protect, (0, auth_1.authorize)(3), playerController_1.getMyTeam);
exports.default = router;
