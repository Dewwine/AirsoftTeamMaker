"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgresdb_1 = __importDefault(require("../db/postgresdb"));
class kickModel extends sequelize_1.Model {
}
kickModel.init({
    isActive: {
        type: sequelize_1.DataTypes.STRING,
    },
    kickReason: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: postgresdb_1.default,
    modelName: 'kickTable',
});
exports.default = kickModel;
