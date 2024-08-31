const WebSocket = require('ws');
const { getTemperatureData, updateTemperatureData } = require('./Routes/TemperatureRoutes'); 
const lightRoutes = require('./Routes/LightsRoutes');

const wss = new WebSocket.Server({ port: 8080 });

console.log('Servidor WebSocket rodando na porta 8080...');

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado.');

  const temperatureData = getTemperatureData();
  const energy = lightRoutes.getLightData();

  ws.send(JSON.stringify({ type: 'temperatures', data: temperatureData }));
  ws.send(JSON.stringify({ type: 'energy', data: energy }));

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === 'updateTemperature') {
        // nova temperatura do cliente e pra atualizar no arquivo JSON
        const newTemperatureData = parsedMessage.data;
        console.log('Atualizando temperatura para:', newTemperatureData);
        updateTemperatureData(newTemperatureData);

        // Envia para todos os clientes conectados
        const updatedData = getTemperatureData();
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'temperatures', data: updatedData }));
          }
        });
      }

      else if (parsedMessage.type === 'updateEnergyStatus') {
        // Atualiza o status de energia
        const { ambiente, nome, status } = parsedMessage.data;
        const lights = lightRoutes.getLightData();
        const updatedLights = lights.map((ambienteData) => {
          if (ambienteData.nome === ambiente) {
            ambienteData.energias = ambienteData.energias.map((energia) => {
              if (energia.nome === nome) {
                energia.status = status;
              }
              return energia;
            });
          }
          return ambienteData;
        });
        lightRoutes.updateLightData(updatedLights);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'energy', data: updatedLights }));
          }
        });
      }

    } catch (error) {
      console.error('Erro ao processar a mensagem:', error);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });
});