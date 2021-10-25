"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoName = process.env.MONGO_NAME || '';
const mongoUser = process.env.MONGODB_USER || '';
const mongoPassword = process.env.MONGODB_PASSWORD || '';
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.zmkox.mongodb.net/${mongoName}?retryWrites=true&w=majority`;
// const mongoUrl: string = `mongodb://mongo:27017/logSchema`;
exports.default = mongoUrl;
