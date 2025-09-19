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
        },
        skip: 0,
        take: 10
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


router.post("/accept", async(req, res)=> {
  const { id, user_id, ref_code } = req.body;
  console.log(req.body)
  
  try{
    await prisma.voiceData.update({
      where: { id: Number(id)},
      data: {
        status: true
      }
    });

    await prisma.userProfile.update({
      where: { user_id: Number(user_id)},
      data: {
        accept: {increment: 1}
      }
    });


    
    const voiceData = await prisma.voiceData.findMany({
        where: {status: false, ref_code},
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
        },
        skip: 0,
        take: 10
      });


    res.status(201).json(voiceData)
  }catch(error){
    res.status(500).json({ error: "Error fetching voices" });
  }
})


router.post("/reject", async(req, res)=> {
  const { id, voice_id} = req.body;
  
  try{
    await prisma.voiceData.delete({
      where: {id: Number(id)}
    });
    
    await prisma.voice.delete({
      where: {id: Number(voice_id)}
    });

    const voiceData = await prisma.voiceData.findMany({
        where: {status: false, ref_code: 101},
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
        },
        skip: 0,
        take: 10
      });
    res.status(201).json(voiceData)
  }catch(error){
    res.status(500).json({ error: "Error fetching voices" });
  }
})



router.delete("/", async (req, res) => {
  try {
    const allSentence = await prisma.voiceData.deleteMany()

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

module.exports = router;