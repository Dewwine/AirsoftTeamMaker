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
const sequelize_1 = require("sequelize");
const postgresdb_1 = __importDefault(require("../db/postgresdb"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ProfileModel extends sequelize_1.Model {
    getSignedJwtToken() {
        return jsonwebtoken_1.default.sign({
            login: this.login,
            id: this.id,
            time: this.createdAt,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    }
    matchPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, this.password);
        });
    }
    toResponse() {
        const { id, login, roleId, avatar, teamId } = this;
        return { id, login, roleId, avatar, teamId };
    }
}
ProfileModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    login: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
    },
    resetPasswordExpire: {
        type: sequelize_1.DataTypes.DATE,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'uploads/avatars/1635170908486--png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png',
    },
}, {
    sequelize: postgresdb_1.default,
    updatedAt: false,
    modelName: 'profile',
});
exports.default = ProfileModel;
