import { ApiError, ApiResponse } from "#/lib/structures";
import { catchAsync } from "#/lib/utils";
import { User } from "#/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
export const updateUser = catchAsync(async (req, res) => {
  const allowedFields = ["username", "bio"];
  const keys = Object.keys(req.body).filter((k) => !allowedFields.includes(k));
  if (keys.length > 0)
    throw new ApiError(
      400,
      `The following fields are not allowed ${keys.join(", ")} to be updated`
    );
  try {
    const token = jwt.verify(
      req.body.accessToken,
      process.env.JWTUserSecret as string
    ) as JwtPayload;
    if (!token) throw new ApiError(401, "Unauthorized Request");
    const user = await User.findById({ _id: token?._id });
    if (!user) throw new ApiError(401, "Unauthorized Request");
    Object.keys(req.body).forEach(
      (key) => ((user as any)[key] = req.body[key])
    );
    await user.save();
    res.status(200).json(new ApiResponse(200, "Updated the user credentials"));
  } catch (error) {
    throw new ApiError(401, "Unauthorized Request");
  }
});
