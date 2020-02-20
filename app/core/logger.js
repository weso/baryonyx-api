'use strict';

const log4js = require('log4js');
const config = require('./config');

if(config.log.graylog.enable) {
    log4js.configure({
        appenders: {
            gelf: { type: '@log4js-node/gelf', host: config.log.graylog.host, port: config.log.graylog.port, customFields: { 'app_name': config.log.graylog.appName }}
        },
        categories: {
            default: { appenders: ['gelf'], level: config.log.level }
        }
    });
}

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : config.log.level;

module.exports = logger;
