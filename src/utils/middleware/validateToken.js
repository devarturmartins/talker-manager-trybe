const tokenn = require('crypto');

function generationToken() {
    return tokenn.randomBytes(8).toString('hex');
}

function validateToken(req, res, next) {
    const { authorization: token } = req.headers;
    if (!token) {
        return res.status(401).json({
            message: 'Token não encontrado',
        });
    }

    if (token.length !== 16) {
        return res.status(401).json({
            message: 'Token inválido',
        });
    }
    return next();
}

module.exports = { validateToken, generationToken };