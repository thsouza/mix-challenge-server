const express = require('express')
const router = express.Router()

/** Service */
const UserService = require('../services/userService');

// @route  POST api/user/register
// @desc   Register user
// @access Public
router.post('/register', UserService.register);

// @route  POST api/user/login
// @desc   Login user / Returning JWT token
// @access Public
router.post('/login', UserService.login);

module.exports = router