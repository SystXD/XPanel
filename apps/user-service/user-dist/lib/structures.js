"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ApiResponse = void 0;
class ApiResponse {
    statusCode;
    data;
    message;
    success;
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
exports.ApiResponse = ApiResponse;
class ApiError extends Error {
    message;
    statusCode;
    success;
    constructor(statusCode, message, errors, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        if (stack)
            this.stack = stack;
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
