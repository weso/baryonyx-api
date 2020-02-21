'use strict';

const controller = require('../controllers/healthController');

module.exports = function(app) {

    app.route('/health').get(function (req, res) {
        controller.health(req, res);
    });
};
