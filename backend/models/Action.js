const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  timestamp: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Action', actionSchema); 