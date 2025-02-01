import { catchAsync } from "#/lib/utils";
import { Channel } from "amqplib";

export const rabbitMiddleware = catchAsync(async (req, res, next) => {
  const channel = req.app.get("rabbit") as Channel;
  req.channel = channel;
  next();
});
