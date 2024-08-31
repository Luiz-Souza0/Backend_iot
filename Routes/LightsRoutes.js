const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../Bd.json');

function getLightData() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);

    // Mapeia os dados de cada ambiente
    const lights = jsonData.espaco.ambientes.map((ambiente) => ({
      nome: ambiente.nome,
      energias: ambiente.energias.map((energia) => ({
        tipo: energia.tipo,
        nome: energia.nome,
        status: energia.status
      }))
    }));

    return lights;
  } catch (error) {
    console.error('Erro ao ler o arquivo bd.json:', error);
    return [];
  }
}

function updateLightData(updatedLights) {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);

    // Atualiza os dados
    jsonData.espaco.ambientes.forEach((ambiente) => {
      const updated = updatedLights.find(l => l.nome === ambiente.nome);
      if (updated) {
        ambiente.energias = updated.energias;
      }
    });

    fs.writeFileSync(dbPath, JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.error('Erro ao atualizar o arquivo bd.json:', error);
  }
}

module.exports = { getLightData, updateLightData};
