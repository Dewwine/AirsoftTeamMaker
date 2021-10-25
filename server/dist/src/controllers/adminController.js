"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagerRequests = exports.unbanProfile = exports.banProfile = exports.declineManager = exports.approveManager = void 0;
const profileService_1 = require("../services/profileService");
const adminService_1 = require("../services/adminService");
const adminService_2 = require("../services/adminService");
// Admin
const approveManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    const managerRequest = yield (0, adminService_2.getManagerRequestByProfileId)(id);
    if (!managerRequest) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    yield (0, adminService_1.approveManagerById)(id);
    res.status(200).json({ message: 'Application approved' });
});
exports.approveManager = approveManager;
const declineManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    const managerRequest = yield (0, adminService_2.getManagerRequestByProfileId)(id);
    if (!managerRequest) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    yield (0, adminService_1.declineManagerById)(id);
    res.status(200).json({ message: 'Application declined' });
});
exports.declineManager = declineManager;
const banProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    const { suspendReason } = req.body;
    if (!suspendReason) {
        res.status(404).json({ message: 'No reason' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    if (profile.roleId === 1) {
        res.status(403).json({ message: 'Profile is admin' });
        return;
    }
    yield (0, adminService_1.BanProfileById)(id, suspendReason);
    res.status(200).json({ message: 'Profile banned' });
});
exports.banProfile = banProfile;
const unbanProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    const { suspendReason } = req.body;
    if (!suspendReason) {
        res.status(404).json({ message: 'No reason' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    if (profile.roleId === 1) {
        res.status(403).json({ message: 'Profile is admin' });
        return;
    }
    yield (0, adminService_1.UnbanProfileById)(id, suspendReason);
    res.status(200).json({ message: 'Profile unbanned' });
});
exports.unbanProfile = unbanProfile;
const getManagerRequests = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teamApplications = yield (0, adminService_2.getAllManagerRequests)();
    if (!teamApplications) {
        res.status(404).json({ message: 'Applications not found' });
        return;
    }
    res.status(200).json(teamApplications);
});
exports.getManagerRequests = getManagerRequests;
