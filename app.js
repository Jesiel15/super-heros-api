const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const superHeros = require("./src/super-heros/super-heros.json");

app.get("/", (req, res) => {
  return res.json(superHeros);
});

app.listen(port, () => {
  console.log("Servido iniciado na porta 3000: http://localhost:3000/");
});
