const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require("fs");

const FIRST_HERO = 0

app.use(express.json());

const readFile = () => {
  const content = fs.readFileSync("./data//super-heros.json", "utf-8");
  return JSON.parse(content);
};

const writeFile = (content) => {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync("./data//super-heros.json", updateFile, "utf-8");
};

app.get("/", (req, res) => {
  const content = readFile();
  res.send(content);
});

app.post("/", (req, res) => {
  const { name, power, img, description, lore } = req.body;
  const currentContent = readFile();

  let hero = currentContent[currentContent.length - 1] || {};
  let id = hero.id + 1 || FIRST_HERO;

  currentContent.push({ id, name, power, img, description, lore });
  writeFile(currentContent);

  res.send(currentContent);
});

app.listen(port, () => {
  console.log("Servidor iniciado na porta 3000: http://localhost:3000/");
});
