import mongoose from 'mongoose';

// Define the Node schema
const nodeSchema = new mongoose.Schema({

  value: {
    type: String,
    required: true
  },
  adjacents: [],
  cpuUsage: {
    type: Number,
    required: true,
    default: 0
  },
  track : []
});

// Create the Node model
const Node = mongoose.model('Node', nodeSchema);

export default Node;
