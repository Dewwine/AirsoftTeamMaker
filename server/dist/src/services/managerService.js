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
exports.getKickTable = exports.createKickTable = exports.getAllTeamRequests = exports.declineTeamById = exports.approveTeamById = void 0;
const associate_1 = require("../models/associate");
const kickModel_1 = __importDefault(require("../models/kickModel"));
const teamRequestsModel_1 = __importDefault(require("../models/teamRequestsModel"));
const getAllTeamRequests = () => __awaiter(void 0, void 0, void 0, function* () { return yield teamRequestsModel_1.default.findAll({ where: { status: 'waiting' } }); });
exports.getAllTeamRequests = getAllTeamRequests;
// Manager
const approveTeamById = (teamId, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield associate_1.ProfileModel.update({
        teamId: teamId,
    }, {
        where: {
            id: id,
        },
    });
    yield teamRequestsModel_1.default.update({
        status: 'approved',
    }, {
        where: {
            profileId: id,
            status: 'waiting',
        },
    });
    yield kickModel_1.default.update({
        isActive: true,
        kickReason: null,
    }, {
        where: {
            profileId: id,
        },
    });
});
exports.approveTeamById = approveTeamById;
const declineTeamById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield teamRequestsModel_1.default.update({
        status: 'declined',
    }, {
        where: {
            profileId: id,
            status: 'waiting',
        },
    });
});
exports.declineTeamById = declineTeamById;
const createKickTable = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield kickModel_1.default.create({
        profileId: body.id,
        isActive: body.teamId !== null ? false : true,
    });
});
exports.createKickTable = createKickTable;
const getKickTable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield kickModel_1.default.findOne({
        where: {
            profileId: id,
        },
    });
});
exports.getKickTable = getKickTable;
