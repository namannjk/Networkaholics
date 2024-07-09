import mongoose from "mongoose";

// Define your Mongoose schema and model
const Schema = mongoose.Schema;
const objSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  health: {
    type: Number,
    default: 100
  },
  uptime: {
    type: Date,
    default: Date.now
  },
  cpuUsage: {
    type: Number,
    default: 0
  }
});

// Create the Mongoose model
const User = mongoose.model('User', objSchema);

export default User;
