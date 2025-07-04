import React, { useState } from 'react';

const defaultTask = {
  title: '',
  description: '',
  assignedUser: '',
  status: 'Todo',
  priority: 'Medium',
};

const columnNames = ['Todo', 'In Progress', 'Done'];

const AddTaskForm = ({ onAddTask, users }) => {
  const [task, setTask] = useState(defaultTask);
  const [error, setError] = useState('');
  const handleChange = e => {
    setTask({ ...task, [e.target.name]: e.target.value });
    setError('');
  };
  const handleSubmit = async e => {
    e.preventDefault();
    // Pre-validation
    if (!task.title.trim()) return setError('Title is required.');
    if (columnNames.map(n => n.toLowerCase()).includes(task.title.trim().toLowerCase())) {
      return setError('Title cannot match column names.');
    }
    try {
      await onAddTask(task);
      setTask(defaultTask);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={task.title} onChange={handleChange} />
      <input name="description" placeholder="Description" value={task.description} onChange={handleChange} />
      <input name="assignedUser" placeholder="Assign to (username)" value={task.assignedUser} onChange={handleChange} />
      <select name="status" value={task.status} onChange={handleChange}>
        {columnNames.map(col => <option key={col} value={col}>{col}</option>)}
      </select>
      <select name="priority" value={task.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit">Add Task</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default AddTaskForm; 