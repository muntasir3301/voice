const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get("/", async (req, res) => {
  try {
    const allSentence = await prisma.voiceData.findMany()

    res.json(allSentence);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


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
  const { id, user_id, ref_code, sentence_id} = req.body;
  
  try{
    // voice data status true
    await prisma.voiceData.update({
      where: { id: Number(id)},
      data: {
        status: true
      }
    });

    // increase sentence count
    await prisma.sentence.update({
      where: {id: Number(sentence_id)},
      data: {
        count: {increment: 1},
        usedBy: { push: user_id }
      }
    })

    // Update user accpeted count
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
  const { id, voice_id, sentence_id, user_id} = req.body;
  
  try{
    // Delete voice data
    await prisma.voiceData.delete({
      where: {id: Number(id)}
    });
    

    // Delete voice record
    await prisma.voice.delete({
      where: {id: Number(voice_id)}
    });

    await prisma.$queryRaw`
      UPDATE "Sentence"
      SET "usedBy" = array_remove("usedBy", ${Number(user_id)}), 
      "count" = "count" - 1
      WHERE "id" = ${Number(sentence_id)};
    `;

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
    console.log(error)
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