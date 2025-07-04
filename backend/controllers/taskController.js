const Task = require('../models/Task');
const Action = require('../models/Action');
const User = require('../models/User');

const COLUMN_NAMES = ['Todo', 'In Progress', 'Done'];

function isTitleInvalid(title) {
  if (!title) return true;
  const lower = title.trim().toLowerCase();
  return COLUMN_NAMES.map(n => n.toLowerCase()).includes(lower);
}

function emitTaskEvent(req, event, data) {
  const io = req.app.get('io');
  if (io) io.emit(event, data);
}

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedUser, status, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required.' });
    if (isTitleInvalid(title)) return res.status(400).json({ message: 'Title cannot match column names.' });
    const exists = await Task.findOne({ title: { $regex: `^${title}$`, $options: 'i' } });
    if (exists) return res.status(400).json({ message: 'Task title must be unique.' });
    const task = new Task({ title, description, assignedUser, status, priority });
    await task.save();
    await Action.create({
      user: 'demoUser',
      action: 'create',
      taskId: task._id,
      details: { title, assignedUser, status, priority }
    });
    emitTaskEvent(req, 'taskCreated', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedUser, status, priority, version } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    if (version !== undefined && version !== task.version) {
      // Conflict detected
      return res.status(409).json({
        message: 'Conflict detected.',
        current: task,
        attempted: { ...task.toObject(), ...req.body }
      });
    }
    // Validation
    if (title !== undefined) {
      if (isTitleInvalid(title)) return res.status(400).json({ message: 'Title cannot match column names.' });
      const exists = await Task.findOne({ _id: { $ne: id }, title: { $regex: `^${title}$`, $options: 'i' } });
      if (exists) return res.status(400).json({ message: 'Task title must be unique.' });
      task.title = title;
    }
    // Update fields
    const oldTask = { ...task.toObject() };
    if (description !== undefined) task.description = description;
    if (assignedUser !== undefined) task.assignedUser = assignedUser;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    task.updatedAt = Date.now();
    task.version += 1;
    await task.save();
    // Log action
    await Action.create({
      user: 'demoUser',
      action: 'update',
      taskId: task._id,
      details: { before: oldTask, after: task.toObject() }
    });
    emitTaskEvent(req, 'taskUpdated', task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    // Log action
    await Action.create({
      user: 'demoUser',
      action: 'delete',
      taskId: id,
      details: { deleted: task }
    });
    emitTaskEvent(req, 'taskDeleted', { _id: id });
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.smartAssignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    // Find all users
    const users = await User.find();
    if (!users.length) return res.status(400).json({ message: 'No users to assign.' });
    // Count active tasks per user
    const counts = {};
    for (const user of users) {
      counts[user.username] = await Task.countDocuments({ assignedUser: user.username, status: { $ne: 'Done' } });
    }
    // Find user with fewest active tasks
    let minUser = users[0].username;
    let minCount = counts[minUser];
    for (const user of users) {
      if (counts[user.username] < minCount) {
        minUser = user.username;
        minCount = counts[user.username];
      }
    }
    // Assign task
    task.assignedUser = minUser;
    task.updatedAt = Date.now();
    task.version += 1;
    await task.save();
    // Log action
    await Action.create({
      user: 'demoUser',
      action: 'smart-assign',
      taskId: task._id,
      details: { assignedUser: minUser }
    });
    emitTaskEvent(req, 'taskUpdated', task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 