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
exports.getMyTeam = exports.leaveTeam = exports.cancelTeam = exports.applyTeam = void 0;
const profileService_1 = require("../services/profileService");
const playerService_1 = require("../services/playerService");
// Player
const applyTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, teamId: playerTeam } = res.locals.profile;
    const { team: teamName } = req.params;
    if (!teamName) {
        res.status(404).json({ message: 'Team not found' });
        return;
    }
    const team = yield (0, playerService_1.getTeamByName)(teamName);
    if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
    }
    if (!['teamA', 'teamB'].includes(team.name)) {
        res.status(404).json({ message: 'Team not exists' });
        return;
    }
    if (playerTeam === team.id) {
        res.status(404).json({ message: 'Already in team' });
        return;
    }
    const playersInTeam = yield (0, profileService_1.getProfilesByTeam)(team.id);
    if (playersInTeam.length === 10) {
        res.status(400).json({ message: 'Team is full' });
        return;
    }
    const teamRequest = yield (0, playerService_1.getTeamRequestByProfileId)(id);
    if (teamRequest) {
        res.status(404).json({ message: 'You already have active request' });
        return;
    }
    yield (0, playerService_1.requestTeamById)(team.id, id);
    res.status(200).json({ message: 'Application sent' });
});
exports.applyTeam = applyTeam;
const cancelTeam = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = res.locals.profile;
    const teamRequest = yield (0, playerService_1.getTeamRequestByProfileId)(id);
    if (!teamRequest) {
        res.status(400).json({ message: 'Your application was reviewed by manager' });
        return;
    }
    yield (0, playerService_1.cancelTeamById)(teamRequest);
    res.status(200).json({ message: 'Application cancelled' });
});
exports.cancelTeam = cancelTeam;
const leaveTeam = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, team } = res.locals.profile;
    if (!team) {
        res.status(400).json({ message: 'You are not on any team' });
        return;
    }
    const teamRequest = yield (0, playerService_1.getTeamRequestByProfileId)(id);
    if (teamRequest) {
        res.status(404).json({ message: 'You already have active request' });
        return;
    }
    yield (0, playerService_1.leaveTeamById)(id);
    res.status(200).json({ message: 'Application sent' });
});
exports.leaveTeam = leaveTeam;
const getMyTeam = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { team } = res.locals.profile;
    if (!team) {
        res.status(400).json({ message: 'You are not on any team' });
        return;
    }
    const profiles = yield (0, profileService_1.getProfilesByTeam)(team);
    res.status(200).json(profiles.map((profile) => profile.toResponse()));
});
exports.getMyTeam = getMyTeam;
