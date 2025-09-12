const express = require("express");
const Sentence = require("../schemaModel/sentenceSchemaModel");
const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const allSentence = await Sentence.find({});

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


router.post("/", async (req, res) => {
  try {
    const allSentence = await Sentence.insertMany(req.body);

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

module.exports = router;