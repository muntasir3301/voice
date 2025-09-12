const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
}, {versionKey: false});

module.exports = mongoose.model("Sentence", sentenceSchema);



[
    {
        "text" : "Sentence One"
    },{
        "text" : "Sentence Two"
    },{
        "text" : "Sentence Three"
    },{
        "text" : "Sentence Four"
    },{
        "text" : "Sentence Five"
    }
]