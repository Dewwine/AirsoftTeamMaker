"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load enviroment variables
require('dotenv').config();
const express_1 = __importDefault(require("express"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const admin_1 = __importDefault(require("./routes/admin"));
const manager_1 = __importDefault(require("./routes/manager"));
const player_1 = __importDefault(require("./routes/player"));
// PostgreSQL
const postgresdb_1 = __importDefault(require("./db/postgresdb"));
// MongoDB
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = __importDefault(require("./db/mongodb"));
// Middlewares
const logger_1 = require("./middlewares/logger");
const errorHandler_1 = require("./middlewares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
postgresdb_1.default
    .authenticate()
    .then(() => console.log('Connected to postgres'))
    .catch((err) => console.log(`Error: ${err}`));
mongoose_1.default.connect(mongodb_1.default, () => {
    console.log('Connected to mongo');
});
app.use(logger_1.logger);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.static('/uploads'));
app.use('/api/', auth_1.default);
app.use('/api/', manager_1.default);
app.use('/api/', player_1.default);
app.use('/api/', profiles_1.default);
app.use('/api/', admin_1.default);
app.use(errorHandler_1.errorHandler);
process.on('uncaughtException', (error) => {
    console.log(error.message);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    console.log(error.message);
});
exports.default = app;
