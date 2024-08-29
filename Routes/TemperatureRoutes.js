const express = require('express');
const router = express.Router();

const cidade = "rj";
let temp = 32.85;  //valor inicial setado para fins de simulação



function getRandomTemperature() {

  const variation = (Math.random() * 4) - 2;
  
  return temp + variation;
}



let currentTemperature = getRandomTemperature();
temp = currentTemperature;


setInterval(() => {
  currentTemperature = getRandomTemperature(temp);
  console.log(`Nova temperatura gerada: ${currentTemperature.toFixed(2)}°C`);
}, 1000); 

router.get('/temperature', (req, res) => {

  let warningMessage = "none";

  if (currentTemperature < 20) {
    warningMessage = "Aumente a temperatura";
  } else if (currentTemperature > 32) {
    warningMessage = "Abaixe a temperatura";
  }

    res.json({
      city: cidade,
      temperature: `${currentTemperature.toFixed(2)}°C`,
      Warning: warningMessage
    });

});

router.put('/temperature', async (req, res) => {
  try {
    const newTemperature = req.body.temperature;

    currentTemperature = newTemperature;
    console.log(`Temperatura atualizada para: ${currentTemperature}°C`);

    res.json({
      message: 'Temperatura atualizada com sucesso.',
      newTemperature: `${currentTemperature.toFixed(2)}°C`
    });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro ao atualizar a temperatura.' });
  }
});

module.exports = router;
