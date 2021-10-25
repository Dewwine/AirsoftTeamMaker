"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app_1.default);
const socket_1 = __importDefault(require("./socket"));
// Load enviroment variables
require('dotenv').config();
const PORT = process.env.PORT || 5000;
(0, socket_1.default)(server);
server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
