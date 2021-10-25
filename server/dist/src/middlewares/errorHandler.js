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
exports.errorHandler = void 0;
const mongoError_1 = __importDefault(require("../models/mongoError"));
const errorHandler = (err, _req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const error = new mongoError_1.default({
        error: `${err.message}`,
    });
    try {
        yield error.save();
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Error: ${err.message}`);
    res.status(500).send(`${err.message}`);
    next(err);
});
exports.errorHandler = errorHandler;
