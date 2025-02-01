import { ApiError } from "#/lib/structures";
import { catchAsync } from "#lib/utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../../user-service/user-dist/models/user.model";
export const isLoggedIn = catchAsync(async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ??
    req.body.accessToken ??
    req.headers.authorization?.replace("Bearer", "")?.trim();
  if (!accessToken) throw new ApiError(401, "Unauthorized Request");
  try {
    const target = jwt.verify(
      accessToken,
      process.env.JWTUserSecret!
    ) as JwtPayload;
    if (!target?.accessToken) throw new ApiError(401, "Unauthorized Request");
    const user = await User.findOne({ _id: target._id });
    if (!user) throw new ApiError(401, "Unauthorized Request");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized Request");
  }
});

export const isAdminLoggedIn = catchAsync(async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ??
    req.body.accessToken ??
    req.headers.authorization?.replace("Bearer", "")?.trim();
  if (!accessToken) throw new ApiError(401, "Unauthorized Request");
  try {
    const target = jwt.verify(
      accessToken,
      process.env.JWTUserSecret!
    ) as JwtPayload;
    if (!target?.accessToken) throw new ApiError(401, "Unauthorized Request");
    if (!target?.isAdmin) throw new ApiError(403, "Access forbidden");
    const user = await User.findOne({ _id: target._id });
    if (!user) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      throw new ApiError(401, "Unauthorized Request");
    }
    if (!user.isAdmin) throw new ApiError(403, "Access forbidden");
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized Request");
  }
});
