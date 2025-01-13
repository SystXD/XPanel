"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false },
}, { timestamps: true, methods: {
        getAccessToken() {
            return jsonwebtoken_1.default.sign({ _id: this._id, userName: this.userName }, process.env.JWTUserSecret);
        },
        getRefreshToken() {
            return jsonwebtoken_1.default.sign({ _id: this._id, }, process.env.JWTUserSecret);
        },
    } });
exports.User = (0, mongoose_1.model)('user', userSchema);
