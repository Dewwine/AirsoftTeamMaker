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
exports.getAllManagerRequests = exports.getManagerRequestByProfileId = exports.UnbanProfileById = exports.BanProfileById = exports.declineManagerById = exports.approveManagerById = void 0;
const associate_1 = require("../models/associate");
const managerRequestsModel_1 = __importDefault(require("../models/managerRequestsModel"));
const getAllManagerRequests = () => __awaiter(void 0, void 0, void 0, function* () { return yield managerRequestsModel_1.default.findAll({ where: { status: 'waiting' } }); });
exports.getAllManagerRequests = getAllManagerRequests;
const getManagerRequestByProfileId = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield managerRequestsModel_1.default.findOne({ where: { profileId: id, status: 'waiting' } }); });
exports.getManagerRequestByProfileId = getManagerRequestByProfileId;
// Admin
const approveManagerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield associate_1.SuspendModel.update({
        isActive: true,
    }, {
        where: {
            profileId: id,
        },
    });
    yield managerRequestsModel_1.default.update({
        status: 'approved',
    }, {
        where: {
            profileId: id,
            status: 'waiting',
        },
    });
});
exports.approveManagerById = approveManagerById;
const declineManagerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield managerRequestsModel_1.default.update({
        status: 'declined',
    }, {
        where: {
            profileId: id,
            status: 'waiting',
        },
    });
});
exports.declineManagerById = declineManagerById;
const BanProfileById = (id, reason) => __awaiter(void 0, void 0, void 0, function* () {
    yield associate_1.SuspendModel.update({
        isActive: 'false',
        suspendReason: reason,
    }, {
        where: {
            profileId: id,
        },
    });
});
exports.BanProfileById = BanProfileById;
const UnbanProfileById = (id, reason) => __awaiter(void 0, void 0, void 0, function* () {
    yield associate_1.SuspendModel.update({
        isActive: 'true',
        suspendReason: reason,
    }, {
        where: {
            profileId: id,
        },
    });
});
exports.UnbanProfileById = UnbanProfileById;
