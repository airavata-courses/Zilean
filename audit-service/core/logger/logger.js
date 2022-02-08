const { createLogger, transports, format } = require('winston');
// const requestTracing = require('request-tracing');
const _ = require('lodash');

const {
    combine, printf, colorize, simple, splat, timestamp
} = format;
const loggerFormat = printf((info) => {
// ${requestTracing.getTracingId() || '-'} 
    let formatObject = `${info.level || '-'} ${info.timestamp || '-'} ${info.message} ${JSON.stringify(_.omit(info, ['level', 'message', 'stack', 'timestamp'])) || '-'}`;

    if (info.stack) {
        formatObject += `\n${info.stack}`;
    }
    return formatObject;
});

const formats = {
    colorized: combine(
        colorize(),
        splat(),
        simple(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        loggerFormat
    ),
    non_colorized: combine(
        splat(),
        simple(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        loggerFormat
    )
};

const logger = createLogger({
    transports: [
    new transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.COLORIZE_LOGS === 'true' ? formats.colorized : formats.non_colorized
    })
    ]
});

logger.stream = {
    write: (message) => {
        logger.info((message || '').trim());
    }
};

module.exports = logger;
