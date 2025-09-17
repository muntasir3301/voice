const { Pool } = require('pg'); 

const express = require("express");
const router = express.Router();



const pool = new Pool({
  user: "myuser",
  host: "localhost",   // or DB server IP
  database: "mydb",
  password: "mypassword",
  port: 5432,
});



router.get("/", async (req, res) => {
 const result = await pool.query("SELECT NOW()");
  console.log(result.rows);
  res.send("Hi");
});



module.exports = router;