const { getTalkers } = require('../fs/fs');

async function validateId (req, res, next) { 
    const talkers = await getTalkers();
    if(talkers.find((e) => +e.id === +req.params.id)){
      return next();
    }
    res.status(404).json({
      message: "Pessoa palestrante não encontrada"
    });
  }

module.exports = { validateId };