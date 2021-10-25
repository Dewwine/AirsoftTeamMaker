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
exports.verifyGoogleToken = exports.deleteUserProfile = exports.requestRegisterById = exports.deleteResetPasswordToken = exports.createResetPasswordToken = exports.createNewPassword = exports.resetCookieResponse = exports.sendTokenResponse = exports.createSuspendTable = exports.createNewProfile = void 0;
require('dotenv').config();
const crypto_1 = __importDefault(require("crypto"));
const associate_1 = require("../models/associate");
const managerRequestsModel_1 = __importDefault(require("../models/managerRequestsModel"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const google_auth_library_1 = require("google-auth-library");
const createNewProfile = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield (0, hashPassword_1.default)(body.password);
    const role = yield associate_1.RoleModel.findOne({ where: { name: body.role } });
    return yield associate_1.ProfileModel.create({
        email: body.email,
        login: body.login,
        password: password,
        roleId: role.id,
    });
});
exports.createNewProfile = createNewProfile;
const createSuspendTable = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield associate_1.SuspendModel.create({
        profileId: body.id,
        isActive: body.roleId === 2 ? false : true,
    });
});
exports.createSuspendTable = createSuspendTable;
const sendTokenResponse = (profile, statusCode, res) => {
    const token = profile.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.status(statusCode).cookie('token', token, options).json({ message: 'Success', token });
};
exports.sendTokenResponse = sendTokenResponse;
const resetCookieResponse = (message, statusCode, res) => {
    const options = {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
    };
    res.status(statusCode).cookie('token', 'none', options).json({ message });
};
exports.resetCookieResponse = resetCookieResponse;
const createResetPasswordToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    yield associate_1.ProfileModel.update({
        resetPasswordToken: crypto_1.default.createHash('sha256').update(resetToken).digest('hex'),
        resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000),
    }, {
        where: {
            id: id,
        },
    });
    return resetToken;
});
exports.createResetPasswordToken = createResetPasswordToken;
const deleteResetPasswordToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield associate_1.ProfileModel.update({
        resetPasswordToken: null,
        resetPasswordExpire: null,
    }, {
        where: {
            id: id,
        },
    });
});
exports.deleteResetPasswordToken = deleteResetPasswordToken;
const createNewPassword = (id, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    yield associate_1.ProfileModel.update({
        password: yield (0, hashPassword_1.default)(newPassword),
        resetPasswordToken: null,
        resetPasswordExpire: null,
    }, {
        where: {
            id: id,
        },
    });
});
exports.createNewPassword = createNewPassword;
const deleteUserProfile = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    yield profile.destroy();
});
exports.deleteUserProfile = deleteUserProfile;
const requestRegisterById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield managerRequestsModel_1.default.create({
        status: 'waiting',
        profileId: id,
    });
});
exports.requestRegisterById = requestRegisterById;
const verifyGoogleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = yield client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        return;
    }
    const profileData = {
        email: `${payload.email}`,
        login: `${payload.name}`,
        password: `${payload.given_name}${payload.family_name}`,
        avatar: `${payload.picture}`,
        role: 'player',
    };
    return profileData;
});
exports.verifyGoogleToken = verifyGoogleToken;
