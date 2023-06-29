const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require("fs");

const FIRST_HERO_ID = 1;

app.use(express.json());

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

app.post("/", (req, res) => {
  const { name, power, img, description, lore } = req.body;
  const currentContent = readFile();

  let hero = currentContent[currentContent.length - 1] || {};
  let id = hero.id + 1 || FIRST_HERO_ID;

  currentContent.push({ id, name, power, img, description, lore });
  writeFile(currentContent);

  res.send(currentContent);
});

app.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, power, img, description, lore } = req.body;
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
  } = currentContent[selectedHero];

  const newObjectHero = {
    id: currentId,
    name: name ? name : currentName,
    power: power ? power : currentPower,
    img: img ? img : currentImg,
    description: description ? description : currentDescription,
    lore: lore ? lore : currentLore,
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
    res.send("Hero adicionado!");
  } else {
    res.send("Hero não encontrado!");
  }
});

app.listen(port, () => {
  console.log("Servidor iniciado na porta 3000: http://localhost:3000/");
});
