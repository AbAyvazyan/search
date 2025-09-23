/**
 * Logger service for production-ready logging
 * Provides different log levels and can be configured for different environments
 */

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
} as const;

interface LoggerConfig {
  level: number;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  private shouldLog(level: number): boolean {
    return level >= this.config.level;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  private log(
    level: number,
    levelName: string,
    message: string,
    ...args: unknown[]
  ): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelName, message);

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, ...args);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, ...args);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, ...args);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, ...args);
          break;
      }
    }

    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.sendToRemote(levelName, message);
    }
  }

  private async sendToRemote(level: string, message: string): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch {
      // Silently fail for remote logging to avoid infinite loops
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, 'INFO', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, 'WARN', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, 'ERROR', message, ...args);
  }

  // Performance logging
  time(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(label);
    }
  }

  // Search-specific logging
  searchStarted(query: string): void {
    this.debug('Search started', { query });
  }

  searchCompleted(query: string, resultCount: number, duration: number): void {
    this.info('Search completed', { query, resultCount, duration });
  }

  searchError(query: string, error: Error): void {
    this.error('Search failed', { query, error: error.message });
  }

  // URL logging
  urlUpdated(url: string): void {
    this.debug('URL updated', { url });
  }

  urlError(error: Error): void {
    this.warn('URL update failed', { error: error.message });
  }
}

// Create logger instances for different environments
const isDevelopment = import.meta.env.DEV;

// Development logger - verbose logging
export const devLogger = new Logger({
  level: LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: false,
});

// Production logger - minimal logging
export const prodLogger = new Logger({
  level: LogLevel.ERROR,
  enableConsole: false,
  enableRemote: true,
  remoteEndpoint: '/api/logs', // Configure your logging endpoint
});

// Default logger based on environment
export const logger = isDevelopment ? devLogger : prodLogger;

// Export the Logger class for custom configurations
export { Logger };
