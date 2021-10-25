"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fileStorageEngine = multer_1.default.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, './uploads/avatars');
    },
    filename: (_req, file, callback) => {
        callback(null, `${Date.now()}--${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage: fileStorageEngine });
exports.default = upload;
