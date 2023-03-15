function validateName(req, res, next) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            message: 'O campo "name" é obrigatório',
        });
    }
    if (name.length < 3) {
        return res.status(400).json({
            message: 'O "name" deve ter pelo menos 3 caracteres',
        });
    }
    return next();
}

function validateAge(req, res, next) {
    const { age } = req.body;
    if (!age) {
        return res.status(400).json({
            message: 'O campo "age" é obrigatório',
        });
    }
    if (Number(age) < 18 || typeof (age) !== 'number' || !Number.isInteger(age)) {
        return res.status(400).json({
            message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
        });
    }
    return next();
}

function validateTalk(req, res, next) {
    const { talk } = req.body;
    if (!talk) {
        return res.status(400).json({
            message: 'O campo "talk" é obrigatório',
        });
    }
    return next();
}

function validateWatchedAt(req, res, next) {
    const { talk: { watchedAt } } = req.body;
    const regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

    if (!watchedAt) {
        return res.status(400).json({
            message: 'O campo "watchedAt" é obrigatório',
        });
    }

    if (!regex.test(watchedAt)) {
        return res.status(400).json({
            message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
        });
    }
    return next();
}

function validateRateInexistente(req, res, next) {
    const { talk: { rate } } = req.body;
    if (!rate && rate !== 0) {
        return res.status(400).json({
            message: 'O campo "rate" é obrigatório',
        });
    }
    return next();
}

function validateRate(req, res, next) {
    const { talk: { rate } } = req.body;
    if (Number(rate) > 5 || Number(rate) < 1 || !Number.isInteger(rate)) {
        return res.status(400).json({
            message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
        });
    }
    return next();
}

module.exports = {
    validateName,
    validateAge,
    validateTalk,
    validateWatchedAt,
    validateRate,
    validateRateInexistente,
};