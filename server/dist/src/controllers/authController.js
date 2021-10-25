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
exports.googleAuth = exports.deleteProfile = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const profileService_1 = require("../services/profileService");
const authService_1 = require("../services/authService");
const emailSender_1 = require("../utils/emailSender");
const adminService_1 = require("../services/adminService");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    if (!body.email) {
        res.status(400).json({ message: 'No email' });
        return;
    }
    if (!body.login) {
        res.status(400).json({ message: 'No login' });
        return;
    }
    if (!body.password) {
        res.status(400).json({ message: 'No password' });
        return;
    }
    if (!body.role) {
        res.status(400).json({ message: 'No role' });
        return;
    }
    const checkProfile = yield (0, profileService_1.getProfileByLogin)(body.login);
    if (checkProfile) {
        res.status(400).json({ message: 'Profile already exists' });
        return;
    }
    const profile = yield (0, authService_1.createNewProfile)(body);
    yield (0, authService_1.createSuspendTable)(profile);
    if (profile.roleId === 2) {
        yield (0, authService_1.requestRegisterById)(profile.id);
        res.status(202).json({ message: 'Your application was sent' });
        return;
    }
    (0, authService_1.sendTokenResponse)(profile, 200, res);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login: profileLogin, password } = req.body;
    if (!profileLogin) {
        res.status(400).json({ message: 'No login' });
        return;
    }
    if (!password) {
        res.status(400).json({ message: 'No password' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileByLogin)(profileLogin);
    if (!profile) {
        res.status(401).json({ message: 'Invalid login' });
        return;
    }
    const isMatch = yield profile.matchPassword(password);
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid password' });
        return;
    }
    const managerRequest = yield (0, adminService_1.getManagerRequestByProfileId)(profile.id);
    if (profile.roleId === 2 && managerRequest) {
        res.status(400).json({ message: 'Your application on review' });
        return;
    }
    const activeProfile = yield (0, profileService_1.checkActiveProfile)(profile.id);
    if (!activeProfile) {
        res.status(403).json({ message: 'Something went wrong' });
        return;
    }
    if (profile.roleId === 2 && !activeProfile.isActive) {
        res.status(400).json({ message: 'Your application was declined' });
        return;
    }
    if (!activeProfile.isActive) {
        res.status(403).json({ message: 'Your account is suspended' });
        return;
    }
    (0, authService_1.sendTokenResponse)(profile, 200, res);
});
exports.login = login;
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    const profileData = yield (0, authService_1.verifyGoogleToken)(id_token);
    if (!profileData) {
        res.status(401).json({ message: 'Account not exists' });
        return;
    }
    let profile = yield (0, profileService_1.getProfileByLogin)(profileData.login);
    if (!profile) {
        profile = yield (0, authService_1.createNewProfile)(profileData);
        yield (0, authService_1.createSuspendTable)(profile);
    }
    (0, authService_1.sendTokenResponse)(profile, 200, res);
});
exports.googleAuth = googleAuth;
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authService_1.resetCookieResponse)('You have been logged out', 200, res);
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const profile = yield (0, profileService_1.getProfileByEmail)(email);
    if (!profile) {
        res.status(404).json({ message: 'No user with such email' });
        return;
    }
    const resetToken = yield (0, authService_1.createResetPasswordToken)(profile.id);
    const resetMessage = `Your password reset url is: ${resetToken}`;
    try {
        yield (0, emailSender_1.sendEmail)({
            email: profile.email,
            subject: 'Password reset token',
            message: resetMessage,
        });
    }
    catch (err) {
        yield (0, authService_1.deleteResetPasswordToken)(profile.id);
        res.status(500).json({ message: 'Email could not be sent' });
        return;
    }
    res.status(200).json({ message: 'Reset token was sent on your email' });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    const profile = yield (0, profileService_1.getProfileByResetToken)(resetPasswordToken);
    if (!profile) {
        res.status(400).json({ message: 'Invalid token' });
        return;
    }
    yield (0, authService_1.createNewPassword)(profile.id, req.body.password);
    (0, authService_1.sendTokenResponse)(profile, 200, res);
});
exports.resetPassword = resetPassword;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login: profileLogin, password } = req.body;
    if (!profileLogin || !password) {
        res.status(400).json({ message: 'No login or password' });
        return;
    }
    const profile = yield (0, profileService_1.getProfileByLogin)(profileLogin);
    if (!profile) {
        res.status(401).json({ message: 'Invalid login' });
        return;
    }
    const isMatch = yield profile.matchPassword(password);
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid password' });
        return;
    }
    yield (0, authService_1.deleteUserProfile)(profile);
    res.status(200).json({ message: 'Profile deleted' });
});
exports.deleteProfile = deleteProfile;
