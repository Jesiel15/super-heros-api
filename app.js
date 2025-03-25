const express = require("express");
const app = express();
const port = process.env.PORT || 7000;
const fs = require("fs");
const cors = require('cors')
const FIRST_HERO_ID = 1;

app.use(express.json());
app.use(cors())

const readFile = () => {
  const content = fs.readFileSync("./data/super-heros.json", "utf-8");
  return JSON.parse(content);
};

const writeFile = (content) => {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync("./data/super-heros.json", updateFile, "utf-8");
};

app.get("/", (req, res) => {
  const content = readFile();
  res.send(content);
});

app.get("/:name", (req, res) => {
  const { name } = req.params;
  const currentContent = readFile();
  const arrayHero = [];
  
  i = 0;
  currentContent.findIndex((hero) => {
    hero.name === name ? (arrayHero[i] = hero,  i++) : null
  });

  arrayHero.length > 0 ?  res.send(arrayHero) :  res.send("Nenhum hero com esse nome na lista!");
});

app.post("/", (req, res) => {
  const { name, power, img, description, lore, origin, sex } = req.body;
  const currentContent = readFile();

  let hero = currentContent[currentContent.length - 1] || {};
  let id = hero.id + 1 || FIRST_HERO_ID;

  currentContent.push({ id, name, power, img, description, lore, origin, sex });
  writeFile(currentContent);

  res.send(currentContent);
});

app.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, power, img, description, lore, origin, sex } = req.body;
  const currentContent = readFile();

  const selectedHero = currentContent.findIndex(
    (hero) => hero.id.toString() === id
  );

  const {
    id: currentId,
    name: currentName,
    power: currentPower,
    img: currentImg,
    description: currentDescription,
    lore: currentLore,
    origin: currentOrigin,
    sex: currentSex
  } = currentContent[selectedHero];

  const newObjectHero = {
    id: currentId,
    name: name ? name : currentName,
    power: power ? power : currentPower,
    img: img ? img : currentImg,
    description: description ? description : currentDescription,
    lore: lore ? lore : currentLore,
    origin: origin ? origin : currentOrigin,
    sex: sex ? sex : currentSex
  };

  currentContent[selectedHero] = newObjectHero;
  writeFile(currentContent);
  res.send(newObjectHero);
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  const currentContent = readFile();
  const selectedHero = currentContent.findIndex(
    (hero) => hero.id.toString() === id
  );

  if (selectedHero >= 0) {
    currentContent.splice(selectedHero, 1);
    writeFile(currentContent);
    res.send("Herói deletado!");
  } else {
    res.send("Herói não encontrado!");
  }
});


// app.listen(port, () => {
//   console.log("Servidor iniciado na porta 7000: http://0.0.0.0:7000/");
// });

// Ajuste para AWS
app.listen(7000, '45.230.85.174', () => {
  console.log('Servidor iniciado na porta 7000');
});

