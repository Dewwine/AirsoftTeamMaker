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
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const associate_1 = require("../models/associate");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        [, token] = req.headers.authorization.split(' ');
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized (no token or cookie)' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'string') {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        res.locals.profile = yield associate_1.ProfileModel.findByPk(decoded.id, {
            include: [
                { model: associate_1.RoleModel, as: 'role' },
                { model: associate_1.TeamModel, as: 'team' },
            ],
        });
        if (!res.locals.profile) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized (Token not match)' });
    }
});
exports.protect = protect;
const authorize = (...roles) => (_req, res, next) => {
    if (!roles.includes(res.locals.profile.roleId)) {
        res.status(403).json({ message: 'Role forbidden' });
        return;
    }
    next();
};
exports.authorize = authorize;
