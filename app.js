const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const superHeros = require("./src/super-heros/super-heros.json");

app.get("/super-heros", (req, res) => {
  return res.json(superHeros);
});

// app.listen(port, () => {
//   console.log("Servido iniciado na porta 3000: http://localhost:3000/");
// });

//Ajuste para AWS
app.listen(7000, '0.0.0.0', () => {
  console.log('Servidor iniciado na porta 7000');
});

