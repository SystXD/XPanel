"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const utils_1 = require("#/lib/utils");
const user_model_1 = require("#/models/user.model");
const structures_1 = require("#lib/structures");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.loginUser = (0, utils_1.catchAsync)(async (req, res) => {
    const { creds, password } = req.body;
    const user = await user_model_1.User.findOne({
        $or: [{ userName: creds }, { email: creds }],
    }).select("-password -refreshToken");
    if (!user)
        throw new structures_1.ApiError(404, `User not found. Please check and try again`);
    if (!(await bcrypt_1.default.compare(password, user.password)))
        throw new structures_1.ApiError(401, `Invalid Credentials`);
    const [accessToken, refreshToken] = [
        user.getAccessToken(),
        user.getRefreshToken(),
    ];
    res
        .status(200)
        .cookie("accessToken", accessToken, {
        secure: process.env.NODE_ENV === "development",
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
        .cookie("refreshToken", refreshToken, {
        secure: process.env.NODE_ENV === "development",
        httpOnly: false,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
        .json(new structures_1.ApiResponse(200, "User Logged in Successfully"));
});
