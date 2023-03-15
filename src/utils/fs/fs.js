const fs = require('fs').promises;
const path = require('path');

async function getTalkers() {
  const talkerJSON = path.resolve(__dirname, '../../talker.json');
  try {
    const data = await fs.readFile(talkerJSON, 'utf-8');
    return JSON.parse(data);
    // console.log(JSON.parse(data));
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
}

module.exports = {
  getTalkers
};