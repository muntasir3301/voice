// const express = require("express");
// const User = require("../schemaModel/userSchemaModel"); // after fixing export
// const router = express.Router();

// // Get all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

// // Register new user
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "User already exists" });

//     // create new user (password will be hashed automatically by pre("save"))
//     const newUser = new User({ name, email, password });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Error registering user" });
//   }
// });

// // Login user
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // find user
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid email or password" });

//     // compare passwords using schema method
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

//     res.json({ message: "Login successful", user: { id: user._id, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: "Error logging in" });
//   }
// });

// module.exports = router;



const express = require("express");
const User = require("../schemaModel/userSchemaModel"); // path to your model
const router = express.Router();


// // Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    res.json({ message: "Login successful", user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;

