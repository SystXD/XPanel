import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;
import { connectRabbit } from './rabbit/promise'
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
  ],
});

export default logger;