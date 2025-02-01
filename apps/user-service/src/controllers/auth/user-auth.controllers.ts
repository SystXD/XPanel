import { catchAsync } from "#/lib/utils";
import { User } from "#/models/user.model";
import { ApiResponse, ApiError } from "#lib/structures";
import bcrypt from "bcrypt";

export const loginUser = catchAsync(async (req, res) => {
  const { creds, password } = req.body as Record<string, string>;

  const user = await User.findOne({
    $or: [{ userName: creds }, { email: creds }],
  }).select("-password -refreshToken");
  if (!user)
    throw new ApiError(404, `User not found. Please check and try again`);

  if (!(await bcrypt.compare(password, user.password)))
    throw new ApiError(401, `Invalid Credentials`);

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
    .json(new ApiResponse(200, "User Logged in Successfully"));
});

export const registerUser = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  if (await User.exists({ email }))
    throw new ApiError(409, "The email is already in used");
  const user = await User.create({
    userName: username,
    email,
    password,
  });

  res.status(200).json(new ApiResponse(200, "The user has been created", user));
});
