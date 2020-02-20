'use strict';

const mongoose = require('../core/mongoose');

var Schema = mongoose.Schema;

/**
 * User schema
 */
const userSchema = new Schema({
    /**
     * User name
     */
    name: {
        type: String,
        default: '',
        trim: true
    },
    /**
     * User email
     */
    email: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        default: '',
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    }
});

/**
 * Register
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
