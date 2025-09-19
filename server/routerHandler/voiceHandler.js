const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer(); 



router.get("/", async (req, res) => {
  try {
    const allVoice = await prisma.voice.findMany();
    res.json(allVoice);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   console.log(id)
//   try {
//     const singleVoice = await prisma.voice.findUnique({
//       where: { id: Number(id) }
//     });
//     res.json(singleVoice);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching voices" });
//   }
// });


router.get("/:id", async (req, res) => {
  try {
    const voice = await prisma.voice.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!voice) return res.status(404).json({ error: "Voice not found" });

    // Convert Buffer -> Base64
    const base64 = Buffer.from(voice.record).toString("base64");

    res.json({
      contentType: "audio/wav", // or "audio/mpeg" depending on what you saved
      record: base64
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching voices" });
  }
});



router.post("/", upload.single('file'), async (req, res) => {
  // console.log(req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const voice = await prisma.voice.create({
      data: {record: req.file.buffer}
    });
    const {user_id, sentence_id, ref_code, length} = req.body;
    

    await prisma.voiceData.create({
        data: {
          voice_id: voice.id,
          user_id: Number(user_id),
          sentence_id: Number(sentence_id),
          ref_code: Number(ref_code),
          length: Number(length)
        }
    });


    // increse sentence count for a profile
    await prisma.userProfile.update({
      where: { user_id: Number(user_id) },
      data: {
        sentence_id: { increment: 1 },
        total: { increment: 1 }
      }
    });

    res.json({message: "Successfully added"});
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


router.delete("/", async (req, res) => {
  try {
    const allVoice = await prisma.voice.deleteMany();
    res.json(allVoice);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

module.exports = router;