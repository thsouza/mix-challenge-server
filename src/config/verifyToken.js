const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('dotenv').config();

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, errorMessage: res.__('error.no.token.provided') });

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET_OR_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, errorMessage: res.__('error.failed.autenticate.token') });

        // if everything is good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;