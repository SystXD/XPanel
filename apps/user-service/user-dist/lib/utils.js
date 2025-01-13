"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (controller) => (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);
exports.catchAsync = catchAsync;
