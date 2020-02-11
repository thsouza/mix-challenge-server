const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/** Load input validation */
const validateRegister = require('../validation/register');
const validateLogin = require('../validation/login');
const util = require('./util')

/** Models */
const User = require('../models/User');

class UserService {

    async register(req, res, next) {
        try {
            const { error, isValid } = validateRegister.validate(req.body);

            // Check validation
            if (!isValid) {
                return util.resultError400(res, error);
            }

            const user = await User.findOne({ email: req.body.userName });
                
            if (user) {
                return util.resultWarning400(res, 'Usuário já existe');
            }

            const newUser = new User({
                userName: req.body.userName,
                admin: req.body.admin,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            // User matched
                            const payload = {
                                id: user.id,
                                userName: user.userName,
                                admin: user.admin
                            }; // Create jwt payload

                            // Sign token                            
                            jwt.sign(
                                payload,
                                process.env.SECRET_OR_KEY,
                                {},
                                (err, token) => {
                                    const userData = {
                                        _id: user._id,
                                        userName: user.userName,
                                        admin: user.admin
                                    };

                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token,
                                        user: userData
                                    });
                                }
                            );
                        });
                });
            });            
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

    login(req, res, next) {
        try {
            const { error, isValid } = validateLogin.validate(req.body);

            // Check validation
            if (!isValid) {
                return util.resultError400(res, error);
            }

            const userName = req.body.userName;
            const password = req.body.password;

            // Find user by userName
            User.findOne({ userName: userName })
                .select('+password')
                .then(user => {
                    // Check for user
                    if (!user) {
                        return util.resultError400(res, 'Usuário não encontrado!');
                    }

                    // Check password
                    bcrypt.compare(password, user.password).then(isMatch => {
                        if (isMatch) {
                            // User matched
                            const payload = {
                                id: user.id,
                                userName: user.userName,
                                admin: user.admin
                            }; // Create jwt payload

                            // Sign token
                            // jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                            jwt.sign(
                                payload,
                                process.env.SECRET_OR_KEY,
                                {},
                                (err, token) => {
                                    const userData = {
                                        _id: user._id,
                                        userName: user.userName,
                                        admin: user.admin
                                    };

                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token,
                                        user: userData
                                    });
                                }
                            );
                        } else {
                            return util.resultError400(res, 'Senha incorreta!');
                        }
                    });
                }
            );

        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }
}

module.exports = new UserService();
