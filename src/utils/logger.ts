import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';

class LoggerService {
  private readonly logDir: string;
  private readonly traceDir: string;
  private logger: winston.Logger;
  private currentTraceId: string = '';

  constructor() {
    this.logDir = path.resolve('logs');
    this.traceDir = path.resolve('allure-results');

    // Create directories
    [this.logDir, this.traceDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Initialize Winston logger
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'qa-automation' },
      transports: [
        // Console output
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, traceId }) => {
              const trace = traceId ? ` [TRACE: ${traceId}]` : '';
              return `${timestamp} [${level}]${trace} ${message}`;
            })
          )
        }),
        // Daily rotating file
        new winston.transports.File({
          filename: path.join(this.logDir, `test-run-${new Date().toISOString().split('T')[0]}.log`),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          format: winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          })
        })
      ]
    });
  }

  setTraceId(traceId: string): void {
    this.currentTraceId = traceId;
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { ...meta, traceId: this.currentTraceId });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { ...meta, traceId: this.currentTraceId });
  }

  error(message: string, error?: Error | Record<string, unknown>): void {
    if (error instanceof Error) {
      this.logger.error(message, { error: error.message, stack: error.stack, traceId: this.currentTraceId });
    } else {
      this.logger.error(message, { ...error, traceId: this.currentTraceId });
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { ...meta, traceId: this.currentTraceId });
  }

  getTraceDir(): string {
    return this.traceDir;
  }

  getLogDir(): string {
    return this.logDir;
  }
}

const Logger = new LoggerService();
export default Logger;
