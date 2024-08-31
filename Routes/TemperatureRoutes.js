const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../Bd.json');
function getTemperatureData() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Mapeia os dados de temperatura de cada ambiente
    const temperatures = jsonData.espaco.ambientes.map((ambiente) => ({
      nome: ambiente.nome,
      temperatura: ambiente.temperatura.value,
      mac: ambiente.temperatura.mac,
      warning: ambiente.temperatura.warning
    }));

    return temperatures;
  } catch (error) {
    console.error('Erro ao ler o arquivo bd.json:', error);
    return [];
  }
}

function updateTemperatureData(updatedTemperatures) {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);

    // Atualiza os dados de temperatura
    jsonData.espaco.ambientes.forEach((ambiente) => {
      const updated = updatedTemperatures.find(temp => temp.nome === ambiente.nome);
      if (updated) {

        if(updated.temperatura<20){
          ambiente.temperatura.warning = "Low";
        }
        else if(updated.temperatura>32){
          ambiente.temperatura.warning = "High";
        }
        else{
          ambiente.temperatura.warning = "Normal";
        }

        ambiente.temperatura.value = updated.temperatura;
      }
    });

    fs.writeFileSync(dbPath, JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.error('Erro ao atualizar o arquivo bd.json:', error);
  }
}

module.exports = { getTemperatureData, updateTemperatureData };
