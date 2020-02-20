'use strict';

/**
 * Checks system availability. If all is OK, returns a JSON with status UP.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
exports.health = function(req, res) {
    res.json({status: 'UP'});
};
