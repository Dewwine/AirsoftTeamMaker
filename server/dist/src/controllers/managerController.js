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
exports.getTeamRequests = exports.declineTeam = exports.approveTeam = void 0;
const profileService_1 = require("../services/profileService");
const managerService_1 = require("../services/managerService");
const playerService_1 = require("../services/playerService");
// Manager
const approveTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const teamApplication = yield (0, playerService_1.getTeamRequestByProfileId)(id);
    if (!teamApplication) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    const { teamRequest } = teamApplication;
    const kickTable = yield (0, managerService_1.getKickTable)(id);
    if (!kickTable) {
        yield (0, managerService_1.createKickTable)(profile);
    }
    yield (0, managerService_1.approveTeamById)(teamRequest, id);
    res.status(200).json({ message: 'Application approved' });
});
exports.approveTeam = approveTeam;
const declineTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const teamApplication = yield (0, playerService_1.getTeamRequestByProfileId)(id);
    if (!teamApplication) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    yield (0, managerService_1.declineTeamById)(id);
    res.status(200).json({ message: 'Application declined' });
});
exports.declineTeam = declineTeam;
const getTeamRequests = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teamApplications = yield (0, managerService_1.getAllTeamRequests)();
    if (!teamApplications) {
        res.status(404).json({ message: 'Applications not found' });
        return;
    }
    res.status(200).json(teamApplications);
});
exports.getTeamRequests = getTeamRequests;
