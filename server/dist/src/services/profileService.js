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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kickTeamById = exports.getProfilesByTeam = exports.getProfileByResetToken = exports.getProfileByEmail = exports.getProfileByLogin = exports.updateProfileAvatar = exports.updateProfileById = exports.getProfileByIdAndRole = exports.checkActiveProfile = exports.getProfileById = exports.getAllProfilesByRole = void 0;
const associate_1 = require("../models/associate");
const kickModel_1 = __importDefault(require("../models/kickModel"));
const sequelize_1 = __importDefault(require("sequelize"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const Op = sequelize_1.default.Op;
const getAllProfilesByRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield associate_1.ProfileModel.findAll({
        include: [
            { model: associate_1.RoleModel, as: 'role', where: { name: role } },
            { model: associate_1.TeamModel, as: 'team' },
        ],
    });
});
exports.getAllProfilesByRole = getAllProfilesByRole;
const getProfilesByTeam = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield associate_1.ProfileModel.findAll({
        where: { teamId: teamId },
        include: [
            { model: associate_1.RoleModel, as: 'role' },
            { model: associate_1.TeamModel, as: 'team' },
        ],
    });
});
exports.getProfilesByTeam = getProfilesByTeam;
const getProfileById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield associate_1.ProfileModel.findByPk(id, {
        include: [
            { model: associate_1.RoleModel, as: 'role' },
            { model: associate_1.TeamModel, as: 'team' },
        ],
    });
});
exports.getProfileById = getProfileById;
const checkActiveProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield associate_1.SuspendModel.findOne({
        where: {
            profileId: id,
        },
    });
});
exports.checkActiveProfile = checkActiveProfile;
const getProfileByIdAndRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield associate_1.ProfileModel.findOne({
        where: {
            id: id,
        },
        include: [
            { model: associate_1.RoleModel, as: 'role', where: { name: role } },
            { model: associate_1.TeamModel, as: 'team' },
            { model: associate_1.SuspendModel, as: 'suspendTable' },
        ],
    });
});
exports.getProfileByIdAndRole = getProfileByIdAndRole;
const getProfileByLogin = (login) => __awaiter(void 0, void 0, void 0, function* () { return yield associate_1.ProfileModel.findOne({ where: { login: login } }); });
exports.getProfileByLogin = getProfileByLogin;
const getProfileByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield associate_1.ProfileModel.findOne({ where: { email: email } }); });
exports.getProfileByEmail = getProfileByEmail;
const getProfileByResetToken = (resetPasswordToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield associate_1.ProfileModel.findOne({
        where: {
            resetPasswordToken,
            resetPasswordExpire: {
                [Op.gt]: Date.now(),
            },
        },
    });
});
exports.getProfileByResetToken = getProfileByResetToken;
const updateProfileById = (profile, body) => __awaiter(void 0, void 0, void 0, function* () {
    if (body.login) {
        profile.login = body.login;
    }
    if (body.password) {
        profile.password = yield (0, hashPassword_1.default)(body.password);
    }
    yield profile.save();
});
exports.updateProfileById = updateProfileById;
const updateProfileAvatar = (profile, filepath) => __awaiter(void 0, void 0, void 0, function* () {
    if (filepath) {
        profile.avatar = filepath;
    }
    yield profile.save();
});
exports.updateProfileAvatar = updateProfileAvatar;
const kickTeamById = (id, reason) => __awaiter(void 0, void 0, void 0, function* () {
    yield associate_1.ProfileModel.update({
        teamId: null,
    }, {
        where: {
            id: id,
        },
    });
    yield kickModel_1.default.update({
        isActive: false,
        kickReason: reason,
    }, {
        where: {
            profileId: id,
        },
    });
});
exports.kickTeamById = kickTeamById;
