'use strict';

const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

function mongoOptions() {
    return {
        user: config.mongo.options.user,
        pass: config.mongo.options.pass,
        keepAlive: 1,
        useNewUrlParser: true
    };
}

if (mongoose.connection.readyState !== 1) {
    logger.info('Connecting to Mongo ' + config.mongo.uri + '...');

    mongoose.connect(config.mongo.uri, mongoOptions());

    mongoose.connection.on('error', function (err) {
        if (err.message.code === 'ETIMEDOUT') {
            logger.warn('Mongo connection timeout!', err);
            setTimeout(() => {
                mongoose.createConnection(config.mongo.uri, mongoOptions());
            }, 1000);
            return;
        }

        logger.error('Could not connect to MongoDB!', err);
        return;
    });

    mongoose.connection.once('open', function() {
        logger.info('Mongo DB connected.');
    });
}

module.exports = mongoose;
