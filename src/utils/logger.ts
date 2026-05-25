import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class LoggerService {
  private readonly logDir: string;

  constructor() {
    this.logDir = path.resolve('logs');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  private write(level: LogLevel, message: string): void {
    const line = this.format(level, message);
    console.log(line);
    const logFile = path.join(this.logDir, `test-run-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, line + '\n', 'utf8');
  }

  info(message: string): void {
    this.write('INFO', message);
  }

  warn(message: string): void {
    this.write('WARN', message);
  }

  error(message: string): void {
    this.write('ERROR', message);
  }

  debug(message: string): void {
    this.write('DEBUG', message);
  }
}

const Logger = new LoggerService();
export default Logger;
