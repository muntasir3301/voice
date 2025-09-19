const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// All voice data
router.get("/:ref_code", async (req, res) => {
  const { ref_code } = req.params;

  try {
      const voiceData = await prisma.voiceData.findMany({
        where: {status: false, ref_code: Number(ref_code)},
        include: {
          user: {                 
            select: {
              username: true, 
            }
          }, 
          sentence: {
            select:{
              text: true
            }
          }
        }
      });

    res.json(voiceData);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


router.post("/", async (req, res) => {
  try {
    const allSentence = await prisma.voiceData.create({
        data: req.body
    });

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


router.delete("/", async (req, res) => {
  try {
    const allSentence = await prisma.voiceData.deleteMany()

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

module.exports = router;