'use strict';

/**
 * User model.
 */
const User = require('../model/user');

/**
 * Find an user by its identificator.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
exports.findById = function(req, res) {
    const userId = req.params.id;

    User.findById(userId, function(err, user) {
        if(err) {
            return res.status(500).send({
                message: err.message
            });
        }

        if(!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        return res.status(200).send(user);
    });
};

/**
 * Save a new user.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */
exports.save = function (req, res) {
    var body = JSON.parse(JSON.stringify(req.body));

    const user = new User({
        name: body.name,
        email: body.email
    });

    user.save(function(err, user) {
        if (err && err.code === 11000) {
            let field;
            if(err.message.includes('.$')) {
                field = err.message.split('.$')[1];
            } else if (err.message.includes('index: ')) {
                field = err.message.split('index: ')[1];
            } else {
                res.status(400).send({
                    message: 'User save error'
                });
                return;
            }

            field = field.split(' dup key')[0];
            field = field.substring(0, field.lastIndexOf('_'));

            if (field === 'email') {
                res.status(400).send({
                    message: 'Duplicated email'
                });
            } else {
                res.status(400).send({
                    message: 'Validation failed'
                });
            }
        } else {
            res.status(200).send(user);
        }
    });
};
