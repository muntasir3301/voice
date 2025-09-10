require("dotenv").config();

const express = require('express');
const Doner = require('./schemaModel/donorsSchemaModel');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const uri = process.env.DB_URI; 
app.use(express.json());

mongoose.connect(uri)
.then(()=> console.log("MongoDb Conneted Successfully"))
.catch((err)=> console.log("Connection Error on mongodb"))


// Home Route
app.get('/', (req, res) => {
  res.send('Hello Blood Donors!')
})

// All Doner Route
app.get('/donors', async(req, res)=>{
    try{
        const doners = await Doner.find({});
        res.status(200).json(doners);
    }catch(err){
        res.status(500).send(err);
    }
})

// Add new Doner
app.post('/donors', async(req, res)=>{
    try{
        const doners = await Doner.insertMany(req.body);
        res.status(200).json(doners);
    }catch(err){
        res.status(500).send(err);
    }
})

// Update new Doner
app.patch('/donors', async(req, res)=>{
    const {_id, name, phone, bloodGroup, address} = req.body;
    try{
        const doners = await Doner.findOneAndUpdate(
            {_id},
            {name, phone, bloodGroup, address},
            {new: true}
        );
        res.status(200).json(doners);
    }catch(err){
        res.status(500).send(err);
    }
})

// Delete a Doner
app.delete('/donors', async(req, res)=>{
    const {_id} = req.body;
    try{
        const doners = await Doner.deleteOne({_id})
        res.status(200).json(doners);
    }catch(err){
        res.status(500).send(err);
    }
})

app.listen(port, () => {
  console.log(`Docation web app runing on port ${port}`)
})