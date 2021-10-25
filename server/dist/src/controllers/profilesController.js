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
exports.kickTeam = exports.getMe = exports.updateAvatar = exports.updateProfile = exports.getProfile = exports.getTeam = exports.getProfiles = void 0;
const profileService_1 = require("../services/profileService");
const playerService_1 = require("../services/playerService");
const getProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.path.split('/')[1];
    if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
    }
    const profiles = yield (0, profileService_1.getAllProfilesByRole)(role);
    if (!profiles) {
        res.status(200).json({ message: 'Something went wrong' });
        return;
    }
    const returnedProfiles = profiles.map((profile) => Object.assign(profile.toResponse(), {
        role: profile.getDataValue('role'),
        team: profile.getDataValue('team'),
    }));
    res.status(200).json(returnedProfiles);
});
exports.getProfiles = getProfiles;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { team: teamName } = req.params;
    if (!teamName) {
        res.status(200).json({ message: 'Team not found' });
        return;
    }
    const team = yield (0, playerService_1.getTeamByName)(teamName);
    if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
    }
    const profiles = yield (0, profileService_1.getProfilesByTeam)(team.id);
    const returnedProfiles = profiles.map((profile) => Object.assign(profile.toResponse(), {
        role: profile.getDataValue('role'),
        team: profile.getDataValue('team'),
    }));
    res.status(200).json(returnedProfiles);
});
exports.getTeam = getTeam;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const role = req.path.split('/')[1];
    if (!id) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    if (!role) {
        res.status(200).json({ message: 'Role not found' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileByIdAndRole)(id, role);
    if (!profile) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    const suspendInfo = yield (0, profileService_1.checkActiveProfile)(profile.id);
    if (!suspendInfo) {
        res.status(200).json({ message: 'Something went wrong' });
        return;
    }
    const returnedProfile = Object.assign(profile.toResponse(), {
        isActive: suspendInfo.getDataValue('isActive'),
        role: profile.getDataValue('role'),
        team: profile.getDataValue('team'),
    });
    res.status(200).json(returnedProfile);
});
exports.getProfile = getProfile;
const getMe = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = res.locals.profile;
    if (!profile) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    const returnedProfile = Object.assign(profile.toResponse(), {
        role: profile.getDataValue('role'),
        team: profile.getDataValue('team'),
    });
    res.status(200).json(returnedProfile);
});
exports.getMe = getMe;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = res.locals.profile;
    if (!id) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    let profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    yield (0, profileService_1.updateProfileById)(profile, body);
    profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    res.status(200).json(profile.toResponse());
});
exports.updateProfile = updateProfile;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req;
    if (!file) {
        res.status(200).json({ message: 'File not found' });
        return;
    }
    const { id } = res.locals.profile;
    if (!id) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    let profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    yield (0, profileService_1.updateProfileAvatar)(profile, file.path);
    profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    res.status(200).json({ message: 'Avatar updated' });
});
exports.updateAvatar = updateAvatar;
const kickTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(200).json({ message: 'Profile not found' });
        return;
    }
    const { kickReason } = req.body;
    if (!kickReason) {
        res.status(404).json({ message: 'No reason' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileById)(id);
    if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
    }
    const { teamId } = profile;
    if (!teamId) {
        res.status(404).json({ message: 'Player not on any team' });
        return;
    }
    yield (0, profileService_1.kickTeamById)(id, kickReason);
    res.status(200).json({ message: 'Player kicked' });
});
exports.kickTeam = kickTeam;
