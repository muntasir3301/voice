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

 
mongoose.connect(uri)
.then(()=> console.log("MongoDb Conneted Successfully"))
.catch((err)=> console.log("Connection Error on mongodb"))



const voiceSchema = new mongoose.Schema({
  audio: Buffer,
  contentType: String,
});

const Voice = mongoose.model("Voice", voiceSchema);

app.post("/upload-voice", upload.single("voice"), async (req, res) => {
    console.log("voiceing");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const voice = new Voice({
      audio: req.file.buffer,
      contentType: req.file.mimetype,
    });

    console.log(voice)
    await voice.save();
    res.json({ message: "Voice saved!" });
  } catch (err) {
    console.error("Error saving voice:", err);
    res.status(500).json({ error: "Error saving voice" });
  }
});


app.get("/voices", async (req, res) => {
  try {
    const voices = await Voice.find();

    const voiceData = voices.map(v => ({
      id: v._id,
      contentType: v.contentType,
      audio: v.audio.toString("base64"), // send as base64
    }));

    res.json(voiceData);
  } catch (err) {
    console.error("Error fetching voices:", err);
    res.status(500).json({ error: "Error fetching voices" });
  }
});



// Home Route
app.get('/', (req, res) => {
  res.send('Hello Blood Donors!')
})



app.listen(5000, () => console.log("Server running on port 5000"));
