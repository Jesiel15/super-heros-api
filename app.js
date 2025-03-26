const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 7000;
const FIRST_HERO_ID = 1;

// Carregar certificados SSL (coloque os arquivos na pasta 'ssl/')
const options = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.cert"),
};

app.use(express.json());
app.use(cors());

// Funções para leitura e escrita no JSON
const readFile = () => {
  const content = fs.readFileSync("./data/super-heros.json", "utf-8");
  return JSON.parse(content);
};

const writeFile = (content) => {
  const updateFile = JSON.stringify(content, null, 2);
  fs.writeFileSync("./data/super-heros.json", updateFile, "utf-8");
};

// Endpoints
app.get("/", (req, res) => {
  res.send(readFile());
});

app.get("/:name", (req, res) => {
  const { name } = req.params;
  const heroes = readFile().filter(hero => hero.name.toLowerCase() === name.toLowerCase());

  if (heroes.length > 0) {
    res.send(heroes);
  } else {
    res.status(404).send({ message: "Nenhum herói encontrado com esse nome!" });
  }
});

app.post("/", (req, res) => {
  const { name, power, img, description, lore, origin, sex } = req.body;
  const currentContent = readFile();

  let id = (currentContent[currentContent.length - 1]?.id || FIRST_HERO_ID - 1) + 1;

  const newHero = { id, name, power, img, description, lore, origin, sex };
  currentContent.push(newHero);
  writeFile(currentContent);

  res.status(201).send(newHero);
});

app.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, power, img, description, lore, origin, sex } = req.body;
  const currentContent = readFile();

  const index = currentContent.findIndex(hero => hero.id.toString() === id);
  if (index === -1) {
    return res.status(404).send({ message: "Herói não encontrado!" });
  }

  currentContent[index] = { ...currentContent[index], name, power, img, description, lore, origin, sex };
  writeFile(currentContent);
  res.send(currentContent[index]);
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  const currentContent = readFile();

  const index = currentContent.findIndex(hero => hero.id.toString() === id);
  if (index === -1) {
    return res.status(404).send({ message: "Herói não encontrado!" });
  }

  currentContent.splice(index, 1);
  writeFile(currentContent);
  res.send({ message: "Herói deletado com sucesso!" });
});

// Iniciar HTTPS na AWS (porta 443)
https.createServer(options, app).listen(443, "0.0.0.0", () => {
  console.log("Servidor HTTPS rodando na porta 443");
});

// Iniciar HTTP para desenvolvimento local (porta 7000)
//if (process.env.NODE_ENV !== "production") {
  //app.listen(port, () => {
   // console.log(`Servidor rodando na porta ${port}: http://localhost:${port}/`);
 // });
//}
