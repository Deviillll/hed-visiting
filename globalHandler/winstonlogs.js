// utils/logger.ts
import fs from "fs";
import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";

// Ensure logs directory exists
const logDirectory = path.resolve("logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Custom timestamp using local time format
const timestampFormat = winston.format.timestamp({
  format: () => new Date().toLocaleString("en-PK", {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
});

// Custom log format
const customFormat = winston.format.printf(({ message, timestamp }) => {
  return JSON.stringify({ message, timestamp });
});

// Setup Winston with Daily Rotate File
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    timestampFormat,
    customFormat
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '5m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    new winston.transports.Console(),
  ],
});

export default logger;
