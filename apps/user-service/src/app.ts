import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "../../../packages/shared/shared-dist/logger";
import { morganFormat } from "../../../packages/shared/shared-dist/constants";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
export default app;
