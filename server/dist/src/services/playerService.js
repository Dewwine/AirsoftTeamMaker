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
exports.getTeamByName = exports.getTeamRequestByProfileId = exports.leaveTeamById = exports.cancelTeamById = exports.requestTeamById = void 0;
const teamModel_1 = __importDefault(require("../models/teamModel"));
const teamRequestsModel_1 = __importDefault(require("../models/teamRequestsModel"));
const getTeamRequestByProfileId = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield teamRequestsModel_1.default.findOne({ where: { profileId: id, status: 'waiting' } }); });
exports.getTeamRequestByProfileId = getTeamRequestByProfileId;
// Player
const requestTeamById = (teamId, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield teamRequestsModel_1.default.create({
        teamRequest: teamId,
        status: 'waiting',
        profileId: id,
    });
});
exports.requestTeamById = requestTeamById;
const cancelTeamById = (teamRequest) => __awaiter(void 0, void 0, void 0, function* () {
    yield teamRequest.destroy();
});
exports.cancelTeamById = cancelTeamById;
const leaveTeamById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield teamRequestsModel_1.default.create({
        teamRequest: null,
        status: 'waiting',
        profileId: id,
    });
});
exports.leaveTeamById = leaveTeamById;
const getTeamByName = (teamName) => __awaiter(void 0, void 0, void 0, function* () { return yield teamModel_1.default.findOne({ where: { name: teamName } }); });
exports.getTeamByName = getTeamByName;
