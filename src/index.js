const express = require('express');

const app = express();
app.use(express.json());

const { getTalkers, writeTalkers } = require('./utils/fs/fs.js');
const { validateId } = require('./utils/middleware/validateId');
const { validateEmail, validatePassword } = require('./utils/middleware/validateLogin');
const { validateToken } = require('./utils/middleware/validateToken');
const { validateName, validateAge, validateTalk, validateWatchedAt, validateRate } = require('./utils/middleware/validateTalker');


const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});


app.get('/talker', async (_req, res) => {
  const talkers = await getTalkers();
  if(talkers.length === 0) {
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
  const token = require('crypto').randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

app.post('/talker', validateToken, validateName, validateAge, validateTalk, validateWatchedAt, validateRate, async (req, res) => {
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
      }
    };
  
    await writeTalkers([...talkers, newTalker]);
    res.status(201).json(newTalker);
});

