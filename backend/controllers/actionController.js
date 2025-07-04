const Action = require('../models/Action');

exports.getRecentActions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const actions = await Action.find().sort({ timestamp: -1 }).limit(limit);
    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 