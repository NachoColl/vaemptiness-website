/**
 * Structured logging utility
 */

const config = require('./config');

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const COLORS = {
  error: '\x1b[31m', // Red
  warn: '\x1b[33m',  // Yellow
  info: '\x1b[36m',  // Cyan
  debug: '\x1b[90m', // Gray
  reset: '\x1b[0m'
};

class Logger {
  constructor(level = 'info') {
    this.level = LEVELS[level] || LEVELS.info;
    this.pretty = config.logging.pretty;
  }

  _log(level, message, meta = {}) {
    if (LEVELS[level] > this.level) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    };

    if (this.pretty) {
      const color = COLORS[level] || '';
      const reset = COLORS.reset;
      const metaStr = Object.keys(meta).length > 0
        ? `\n  ${JSON.stringify(meta, null, 2)}`
        : '';
      console.log(`${color}[${level.toUpperCase()}]${reset} ${message}${metaStr}`);
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message, meta) {
    this._log('error', message, meta);
  }

  warn(message, meta) {
    this._log('warn', message, meta);
  }

  info(message, meta) {
    this._log('info', message, meta);
  }

  debug(message, meta) {
    this._log('debug', message, meta);
  }
}

module.exports = new Logger(config.logging.level);
