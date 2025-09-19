const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users
router.get("/", async (req, res) => {
  // console.log("hi")
  try {
    const users = await prisma.user.findMany(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// All users by ref code
router.get("/:ref_code", async (req, res) => {
  const { ref_code } = req.params;
  try {
    const users = await prisma.user.findMany({
      where: {ref_code: Number(ref_code), role: 'user'},
      select:{
        username: true,
        profile: {
          select:{
            user_id: true,
            city: true,
            age: true,
            total: true,
            accept: true
          }
        }
      }
    }); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/user-profile", async (req, res) => {
  try {
    const users = await prisma.userProfile.findMany({}); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/user-profile/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = parseInt(id)
  
  try {
    const user = await prisma.userProfile.findUnique({
      where: {user_id}
    }); 
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/admin-profile", async (req, res) => {
  try {
    const users = await prisma.UserProfile.findMany(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/supe-radmin--profile", async (req, res) => {
  try {
    const users = await prisma.UserProfile.findMany(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});


const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET || "mysecretkey", (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded; // attach user info to request
    next();
  });
};


router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword},
    });
    console.log(newUser)

    if(role === "user"){
      const {name} = req.body;

      await prisma.SuperAdminProfile.create({
        data: {user_id: newUser.id, name}
      })
    }else if(role === "admin"){
      const {user_id, name, email, address, phone, universiy} = req.body;
      
      await prisma.AdminProfile.create({
        data: {user_id: newUser.id, name, email, address, phone, universiy}
      });
    }else{
      const { city, age } = req.body;

      await prisma.UserProfile.create({
        data: {user_id: newUser.id, city, age}
      })
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // 3. Role-based profile fetch
    let profile = null;

    // if (user.role === "user") {
    //   profile = await prisma.user_profile.findUnique({
    //     where: { id: user.id },
    //   });
    // } else if (user.role === "admin") {
    //   profile = await prisma.admin_profile.findUnique({
    //     where: { id: user.id },
    //   });
    // } else if (user.role === "super_admin") {
    //   profile = await prisma.super_admin_profile.findUnique({
    //     where: { id: user.id },
    //   });
    // }

    // 4. Generate token (optional)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Send response
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        ref_code: user.ref_code,
        profile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // find user
//     const user = await prisma.user.findUnique({where: {username} });
//     if (!user) return res.status(400).json({ error: "Invalid username" });
//     console.log(user)

//     // compare password
//     // const isMatch = await user.comparePassword(password);
//     const isMatch = await user.password == password;
//     if (!isMatch) return res.status(400).json({ error: "Invalid password" });

//     // generate token
//     const token = jwt.sign(
//       { id: user._id, username: user.username },   
//        process.env.JWT_SECRET,
//       { expiresIn: "22h" } 
//     );

//     res.json({ 
//       message: "Login successful", 
//       token, 
//       user: { id: user.id, username: user.username } 
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Error logging in" });
//   }
// });



// Get all users
router.delete("/", async (req, res) => {
  // console.log
  try {
    const users = await prisma.user.deleteMany(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});


module.exports = router;

