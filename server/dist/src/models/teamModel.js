"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgresdb_1 = __importDefault(require("../db/postgresdb"));
class TeamModel extends sequelize_1.Model {
}
TeamModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: postgresdb_1.default,
    updatedAt: false,
    createdAt: false,
    modelName: 'teams',
});
exports.default = TeamModel;
