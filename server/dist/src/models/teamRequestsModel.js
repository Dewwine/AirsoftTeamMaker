"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgresdb_1 = __importDefault(require("../db/postgresdb"));
class TeamRequestModel extends sequelize_1.Model {
}
TeamRequestModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    profileId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    teamRequest: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: postgresdb_1.default,
    modelName: 'teamRequests',
});
TeamRequestModel.sync();
exports.default = TeamRequestModel;
