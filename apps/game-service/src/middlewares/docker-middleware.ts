import { catchAsync } from "#/lib/utils";
import type Docker from 'dockerode'
export const dockerMiddleware = catchAsync(async (req, res, next) => {
  const docker = req.app.get("docker") as Docker;
  req.docker = docker;
  next();
});
