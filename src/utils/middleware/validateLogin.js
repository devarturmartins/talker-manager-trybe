function validateEmail(req, res, next) {
    const { email } = req.body;
    const regex =  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i;
    if(!email) {
        return res.status(400).json({
            message: "O campo \"email\" é obrigatório"
        });
    }

    if(!(regex.test(email)) && email.length > 0) {
        return res.status(400).json({
            message: "O \"email\" deve ter o formato \"email@email.com\""
        });
    }
    return next();
};

function validatePassword(req, res, next) {
    const { password } = req.body;
    if(!password) {
        return res.status(400).json({
            message: "O campo \"password\" é obrigatório"
        });
    }
    if(password.length < 6) {
        return res.status(400).json({
            message: "O \"password\" deve ter pelo menos 6 caracteres"
          });
    }
    return next();
};

module.exports = { validateEmail, validatePassword }

