"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModel = exports.SuspendModel = exports.ProfileModel = exports.RoleModel = void 0;
const profileModel_1 = __importDefault(require("./profileModel"));
exports.ProfileModel = profileModel_1.default;
const roleModel_1 = __importDefault(require("./roleModel"));
exports.RoleModel = roleModel_1.default;
const teamModel_1 = __importDefault(require("./teamModel"));
exports.TeamModel = teamModel_1.default;
const kickModel_1 = __importDefault(require("./kickModel"));
const suspendModel_1 = __importDefault(require("./suspendModel"));
exports.SuspendModel = suspendModel_1.default;
const postgresdb_1 = __importDefault(require("../db/postgresdb"));
profileModel_1.default.belongsTo(teamModel_1.default);
teamModel_1.default.hasMany(profileModel_1.default);
kickModel_1.default.belongsTo(profileModel_1.default);
profileModel_1.default.hasOne(kickModel_1.default);
suspendModel_1.default.belongsTo(profileModel_1.default);
profileModel_1.default.hasOne(suspendModel_1.default);
profileModel_1.default.belongsTo(roleModel_1.default);
roleModel_1.default.hasMany(profileModel_1.default);
const initialRoles = () => {
    roleModel_1.default.create({
        id: 1,
        name: 'admin',
    });
    roleModel_1.default.create({
        id: 2,
        name: 'manager',
    });
    roleModel_1.default.create({
        id: 3,
        name: 'player',
    });
};
const initialTeams = () => {
    teamModel_1.default.create({
        id: 1,
        name: 'teamA',
    });
    teamModel_1.default.create({
        id: 2,
        name: 'teamB',
    });
};
postgresdb_1.default.sync({ force: true }).then(() => {
    initialRoles();
    initialTeams();
});
