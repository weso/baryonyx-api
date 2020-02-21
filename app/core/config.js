'use strict';

require('dotenv').config();

function getEnvironmentValue(value, defaultValue) {
    return value ? value : defaultValue;
}

module.exports = {
    isDevMode() {
        return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    },

    isProductionMode() {
        return process.env.NODE_ENV === 'production';
    },
    port: getEnvironmentValue(process.env.SERVER_PORT, 8440),
    log: {
        level: getEnvironmentValue(process.env.LOG_LEVEL, 'info'),
        graylog: {
            enable: getEnvironmentValue(process.env.GRAYLOG_ENABLE, false),
            host: getEnvironmentValue(process.env.GRAYLOG_HOST, 'graylog'),
            port: getEnvironmentValue(process.env.GRAYLOG_PORT, 12201),
            appName: getEnvironmentValue(process.env.GRAYLOG_APP_NAME, 'node-baseapp')
        }
    },
    //solid url
    url: getEnvironmentValue(process.env.SOLID_URL, 'https://localhost:8443/symmetry/')
};
