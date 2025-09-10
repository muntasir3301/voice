const mongoose = require("mongoose");

const donorsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    bloodGroup: { type: String, required: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Donor", donorsSchema);