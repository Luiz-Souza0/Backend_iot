const TemperatureRoutes = require('./Routes/TemperatureRoutes');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
const cors = require("cors");

app.use(cors({ origin: '*', credentials: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//se precisar de um BD basicao - mongodb atlas
//mongoose.connect('mongodb+srv://{user}:{password}@{cluster}.mehdhep.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });



app.use('/', TemperatureRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
