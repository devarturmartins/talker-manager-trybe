const express = require('express');

const app = express();
app.use(express.json());

const { getTalkers, writeTalkers } = require('./utils/fs/fs');
const { validateId } = require('./utils/middleware/validateId');
const { validateEmail, validatePassword } = require('./utils/middleware/validateLogin');
const { validateToken, generationToken } = require('./utils/middleware/validateToken');
const {
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  validateRateInexistente,
  validateRateQueryInexistente,
  validateRateQuery,
} = require('./utils/middleware/validateTalker');

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker/search',
  validateToken,
  validateRateQueryInexistente,
  validateRateQuery,
  async (req, res) => {
  const { q, rate } = req.query;
  const talkers = await getTalkers();
  if (rate && q) {
    const paramQ = talkers.filter((e) => e.name.includes(q));
    const newFilter = paramQ.filter((el) => el.talk.rate === +rate);
    return res.status(200).json(newFilter);
  }
  if (rate) {
    const talkerFiltered = talkers.filter((e) => e.talk.rate === +rate);
    console.log(talkerFiltered);
    return res.status(200).json(talkerFiltered);
  }
  if (q) {
    const talkerFiltered = talkers.filter((e) => e.name.includes(q));
    return res.status(200).json(talkerFiltered);
  }
  return res.status(200).json(talkers);
});

app.get('/talker', async (_req, res) => {
  const talkers = await getTalkers();
  if (talkers.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).json(talkers);
});

app.get('/talker/:id', validateId, async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();
  const idTalkers = talkers.find((e) => e.id === +id);
  return res.status(200).json(idTalkers);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generationToken();
  res.status(200).json({ token });
});

app.post('/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRateInexistente,
  validateRate,
  async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await getTalkers();
    const newIdTalker = talkers.length + 1;
  
    const newTalker = {
      id: newIdTalker,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
  
    await writeTalkers([...talkers, newTalker]);
    res.status(201).json(newTalker);
});

app.put('/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRateInexistente,
  validateRate,
  async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await getTalkers();

  const indexTalker = talkers.findIndex((e) => +e.id === +id);
  if (indexTalker === -1) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  
  talkers[indexTalker] = { ...talkers[indexTalker], name, age, talk: { watchedAt, rate } };

  const aux = talkers[indexTalker];

  await writeTalkers(talkers);
  return res.status(200).json(aux);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();

  const talkerFiltered = talkers.filter((e) => +e.id !== +id);
  await writeTalkers(talkerFiltered);
  return res.sendStatus(204);
});
