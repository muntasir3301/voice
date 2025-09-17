require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const uri = process.env.DB_URI;
const multer = require("multer");
const upload = multer(); // memory storage
const cors = require("cors");

app.use(cors());
app.use(express.json());


 
// mongoose.connect(uri)
// .then(()=> console.log("MongoDb Conneted Successfully"))
// .catch((err)=> console.log("Connection Error on mongodb"))



const { Pool } = require('pg');

const pool = new Pool({
  connectionString: uri,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(client => {
    console.log("PostgreSQL connected ✅");
    client.release(); // release the client back to the pool
  })
  .catch(err => {
    console.error("PostgreSQL connection error ❌", err);
  });




const userHanlder = require('./routerHandler/userRouteHanlder');
const sentenceHanlder = require('./routerHandler/sentenceRouteHandler');
const sql = require('./routerHandler/sql');

app.use('/users', userHanlder);
app.use('/sentence', sentenceHanlder);
app.use('/sql', sql);

const voiceSchema = new mongoose.Schema({
  audio: Buffer,
  contentType: String,
},{versionKey: false});

const voiceDataSchema = new mongoose.Schema({
  userId:  { type: String, required: true },
  voiceId:  { type: String, required: true },
  sentenceId:  { type: String, required: true },
  length:  { type: Number, required: true },
  sentence:  { type: String, required: true }
}, {versionKey: false});

const Voice = mongoose.model("Voice", voiceSchema);
const voiceData = mongoose.model("VoiceData", voiceDataSchema);

app.post("/upload-voice", upload.single("voice"), async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const length =  parseInt(req.body.length);
    const {userId, sentence, sentenceId} = req.body;
    const voiceId = new mongoose.Types.ObjectId();

    const voice = new Voice({
      _id: voiceId,
      audio: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const result =  await voice.save();

    await voiceData({userId, voiceId, sentenceId, length, sentence}).save();

    
    res.json(result);
  } catch (err) {
    console.error("Error saving voice:", err);
    res.status(500).json({ error: "Error saving voice" });
  }
});


app.get("/voices", async (req, res) => {
  try {
    const voices = await Voice.find({});

    const voiceData = voices.map(v => ({
      id: v._id,
      userId: v.userId,
      contentType: v.contentType,
      audio: v.audio.toString("base64"), // send as base64
    }));

    res.json(voiceData);
  } catch (err) {
    console.error("Error fetching voices:", err);
    res.status(500).json({ error: "Error fetching voices" });
  }
});

app.get("/voices/:voiceId", async (req, res) => {
  const { voiceId } = req.params;
  try {
    const voice = await Voice.findOne({_id: voiceId});
    if (!voice) {
      return res.status(404).json({ error: "Voice not found" });
    }

    const voiceData = {
      _id: voice._id,
      contentType: voice.contentType,
      audio: voice.audio.toString("base64"),
    };

    res.json(voiceData);
  } catch (err) {
    console.error("Error fetching voices:", err);
    res.status(500).json({ error: "Error fetching voices" });
  }
});


app.get("/voice-data", async (req, res) => {
  try {
    const data = await voiceData.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});

app.get("/voice-data/:userId", async (req, res) => {
  const {userId} = req.params;
  try {
    const data = await voiceData.find({userId});
    if(!data){
      res.json({message: "No voice data exists"})
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});


app.delete("/voice-data", async (req, res) => {
  try {
    const data = await voiceData.deleteMany({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voices" });
  }
});



app.delete('/voice', async(req, res) => {
  await Voice.deleteMany({});
})

// Home Route
app.get('/', (req, res) => {
  res.send('Hello Blood Donors!')
})



app.listen(5000, () => console.log("Server running on port 5000"));
