import path from "path";
import fs from "fs";
import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = path.join(__dirname, "../../../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const errorRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxFiles: "10d",
  zippedArchive: true,
});

const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.json()),
  transports: [errorRotateTransport],
});

export default logger;
