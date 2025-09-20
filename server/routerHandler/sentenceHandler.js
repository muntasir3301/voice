const express = require("express");
const router = express.Router();
const { PrismaClient, Prisma} = require('@prisma/client');
const prisma = new PrismaClient();


router.get("/all", async (req, res) => {
  try {
    const allSentence = await prisma.sentence.findMany();

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const sentence = await prisma.$queryRaw(Prisma.sql`
      SELECT * FROM "Sentence"
      WHERE "count" < 3
        AND NOT (COALESCE("usedBy", '{}') @> ARRAY[${user_id}]::int[])
      ORDER BY RANDOM()
      LIMIT 1;
    `);

    res.json(sentence[0]);
  } catch (err) {
    console.log(err)
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