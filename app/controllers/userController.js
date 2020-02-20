'use strict';

/**
 * User service.
 */
const userService = require('../services/userService');

/**
 * Find an user by its identificator.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
exports.findById = function(req, res) {
    userService.findById(req, res);
};

/**
 * Save a new user.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
exports.save = function(req, res) {
    userService.save(req, res);
};
