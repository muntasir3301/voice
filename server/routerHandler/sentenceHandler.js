const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get("/", async (req, res) => {
  try {
    const allSentence = await prisma.sentence.findMany();

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const allSentence = await prisma.sentence.findUnique({
      where: {id: Number(id)}
    });

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


router.post("/", async (req, res) => {
    console.log(req.body);
    
  try {
    const allSentence = await prisma.sentence.createMany({
        data: req.body
    })

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const allSentence = await prisma.sentence.deleteMany({})

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

module.exports = router;