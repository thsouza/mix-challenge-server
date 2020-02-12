const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Método que verifica o token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function verifyToken(req, res, next) {
    // Verifica se o token está presente no header
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, errorMessage: "Nenhum token fornecido." });

    if (token.startsWith('Bearer ')) {
        // Remove Bearer da string
        token = token.slice(7, token.length);
    }

    // Verifica a chave secret e se o token expira
    jwt.verify(token, process.env.SECRET_OR_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, errorMessage: "Token inválido!" });

        // Se tudo está certo salva no requeste para proximas rotas
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;