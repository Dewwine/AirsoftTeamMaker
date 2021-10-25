"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgresdb_1 = __importDefault(require("../db/postgresdb"));
class suspendModel extends sequelize_1.Model {
}
suspendModel.init({
    isActive: {
        type: sequelize_1.DataTypes.STRING,
    },
    suspendReason: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: postgresdb_1.default,
    modelName: 'suspendTable',
});
exports.default = suspendModel;
