


import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
import Node from './models/Node.js';  // Import the Node model
import { cpuUsage, uptime } from "process";

// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = dirname(__filename);

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://namankhrj:Ajain887800@interviewtrainer.mxzu5nl.mongodb.net/?retryWrites=true&w=majority&appName=InterviewTrainer",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      username,
      email,
      password: hashedPassword,
      health: 100,
      uptime: new Date(),
      cpuUsage: 0
    };

    const user = new User(data);
    await user.save();

    const node = new Node({
      value: user._id,
      adjacents: []
    });

    await node.save();

    res.send("Registration successful");
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/connect", async (req, res) => {
  try {
    const { sourceId, destinationId } = req.body;
   // console.log(sourceId);
   // console.log(destinationId);
    const sourceUser = await User.findOne({ email: sourceId });
    const destinationUser = await User.findOne({ email: destinationId });

  //  console.log(sourceUser);
   // console.log(destinationUser);
    if (!sourceUser || !destinationUser) {
      return res.status(404).send("Source or destination user not found");
    }

    const sourceNode = await Node.findOne({ value: sourceUser._id });
    const destinationNode = await Node.findOne({ value: destinationUser._id });

    if (!sourceNode || !destinationNode) {
      return res.status(404).send("Source or destination node not found");
    }
    const e1 = destinationUser._id
    if (!sourceNode.adjacents.includes(destinationNode._id)) {
      sourceNode.adjacents.push(e1);
    }
    const e2 = sourceUser._id;

    if (!destinationNode.adjacents.includes(sourceNode._id)) {
      destinationNode.adjacents.push(e2);
    }

    await sourceNode.save();
    await destinationNode.save();

    res.send("Request processed and adjacency list updated");
  } catch (error) {
    console.error("Error in processing request:", error);
    res.status(500).send("Internal Server Error");
  }
});




app.post("/sendPacket", async (req, res) => {
  try {
    const { sourceId, destinationId, cpuUsage } = req.body;

    const sourceUser = await User.findOne({ email: sourceId });
    const destinationUser = await User.findOne({ email: destinationId });


    if (!sourceUser || !destinationUser) {
      return res.status(404).send("Source or destination user not found");
    }

    console.log(sourceUser);
    console.log(destinationUser);

    const start = await Node.findOne({value:sourceUser._id});
    const startList = start.adjacents;
    console.log(start);
    console.log(startList);
    var path  = [];
    console.log(destinationUser._id);
    if(startList){
    for(var i=0;i<startList.length;i++){
        // console.log(startList[i],destinationUser._id);
        if(startList[i].equals(destinationUser._id)) {
            console.log(startList[i],destinationUser._id);
            path = [sourceUser._id,destinationUser._id];
            break;
        }
    }
}

    for (const nodeId of path) {
        const node = await Node.findOne({ value: nodeId });
        if (node) {
          node.cpuUsage += cpuUsage;
          node.track.push(cpuUsage);
          await node.save();
        }
      }
    res.send("good");

  } catch (error) {
    console.error("Error in processing request:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

import fs from 'fs';
// import path from 'path';

app.post("/details", async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Find the corresponding node by user id
        const node = await Node.findOne({ value: user._id });
        if (!node) {
            return res.status(404).send("Node not found");
        }

        // Collect the emails of adjacent nodes (friends)
        const friendList = [];
        for (const friendId of node.adjacents) {
            const friend = await User.findById(friendId);
            if (friend) {
                friendList.push(friend.email);
            }
        }

        // List image files in the uploads directory
        const uploadsDir = path.join(__dirname, 'uploads');
        const imageFiles = fs.readdirSync(uploadsDir);

        // Pick a random image file
        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        const randomImageUrl = `${req.protocol}://${req.get('host')}/uploads/${randomImage}`;
        console.log(randomImageUrl);
        // Prepare the response data
        const data = {
            uptime: user.uptime,
            cpuUsage: node.cpuUsage,
            friendList: friendList,
            track: node.track,
            randomImage: randomImageUrl // Add the random image URL to the response data
        };

        // Send the response
        res.send(data);
    } catch (error) {
        console.error("Error fetching details:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Middleware to serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/allUser", async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find({});
      // Send the users as the response
      res.send(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
    }
  });

// app.post("/details", async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Find the user by email
//         const user = await User.findOne({ email: email });
//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         // Find the corresponding node by user id
//         const node = await Node.findOne({ value: user._id });
//         if (!node) {
//             return res.status(404).send("Node not found");
//         }

//         // Collect the emails of adjacent nodes (friends)
//         const friendList = [];
//         for (const friendId of node.adjacents) {
//             const friend = await User.findById(friendId);
//             if (friend) {
//                 friendList.push(friend.email);
//             }
//         }

//         // Prepare the response data

//         const data = {
//             uptime: user.uptime,
//             cpuUsage: node.cpuUsage,
//             friendList: friendList,
//             track : node.track
//         };

//         // Send the response
//         res.send(data);
//     } catch (error) {
//         console.error("Error fetching details:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });


app.post("/setUptime", async (req, res) => {
    try {

        const { email } = req.body;
        console.log(email);
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.uptime = new Date();
        await user.save();

        res.send("Uptime refreshed");
    } catch (error) {
        console.error("Error updating uptime:", error);
        res.status(500).send("Internal Server Error");
    }
});
