import winston, { format, transports } from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.json(),
    format.splat(),
    format.colorize(),
    format.prettyPrint(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'prod') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

export default logger;
