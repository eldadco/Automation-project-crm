const { createLogger, format, transports } = require('winston');

const LOGGER = createLogger({
    level: 'debug',
    format: format.simple(),
    // You can also comment out the line above and uncomment the line below for JSON format
    // format: format.json(),
    transports: [new transports.Console()]
});

LOGGER.info('Hello world');
LOGGER.debug('Debugging info');