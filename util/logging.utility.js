const winston = require('winston');
const RequestContext = require('./RequestContext');
const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    // console.log(message.split('|')[0]);
    // console.log(message.split('|')[1]);
    const context = RequestContext.get();
    const path = context?.req?.originalUrl || 'N/A';
    const body = JSON.stringify(context?.req?.body) || 'N/A';

    
    return `${timestamp} [${level}] [${path}]: ${message.split('|')[0]} | ${message.split('|')[1]} | ${body}`;
});

// Create a logger instance
const MyLogger = winston.createLogger({
    level: 'info', // Default logging level
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
        logFormat // Apply custom log format
    ),
    transports: [
        // Log to console
        new winston.transports.Console({
            format: combine(
                colorize(), // Add colors to console logs
                logFormat
            ),
        }),
        // Log errors to a file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error', // Only log errors to this file
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
    ],
});

// Add a function to log unhandled exceptions
MyLogger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
);

// Add a function to log unhandled promise rejections
MyLogger.rejections.handle(
    new winston.transports.File({ filename: 'logs/rejections.log' })
);

module.exports = MyLogger;