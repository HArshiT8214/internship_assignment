import React, { useEffect, useState } from 'react';
import KanbanColumn from './KanbanColumn';
import ConflictModal from './ConflictModal';
import AddTaskForm from './AddTaskForm';
import { getTasks, updateTask, smartAssignTask, createTask } from '../../utils/api';
import { io } from 'socket.io-client';
import '../../styles/kanban.css';
import ActivityLogPanel from '../ActivityLog/ActivityLogPanel';

const columns = [
  { key: 'Todo', label: 'Todo' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Done', label: 'Done' },
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [conflict, setConflict] = useState(null); // {current, attempted, resolveFn}

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
    // Socket.IO real-time sync
    const socket = io();
    socket.on('taskCreated', task => {
      setTasks(ts => ts.some(t => t._id === task._id) ? ts : [...ts, task]);
    });
    socket.on('taskUpdated', task => {
      setTasks(ts => ts.map(t => t._id === task._id ? task : t));
    });
    socket.on('taskDeleted', ({ _id }) => {
      setTasks(ts => ts.filter(t => t._id !== _id));
    });
    return () => socket.disconnect();
  }, []);

  const handleAddTask = async (task) => {
    const created = await createTask(task);
    setTasks(ts => [...ts, created]);
  };

  const handleUpdateTask = async (id, updates) => {
    const oldTask = tasks.find(t => t._id === id);
    const { status, data } = await updateTask(id, { ...oldTask, ...updates, version: oldTask.version });
    if (status === 200) {
      setTasks(ts => ts.map(t => t._id === id ? data : t));
    } else if (status === 409) {
      setConflict({
        current: data.current,
        attempted: data.attempted,
        resolveFn: (resolvedTask) => handleResolveConflict(id, resolvedTask)
      });
    }
  };

  const handleSmartAssign = async (id) => {
    try {
      const updated = await smartAssignTask(id);
      setTasks(ts => ts.map(t => t._id === id ? updated : t));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolveConflict = async (id, resolvedTask) => {
    setConflict(null);
    const { status, data } = await updateTask(id, resolvedTask);
    if (status === 200) {
      setTasks(ts => ts.map(t => t._id === id ? data : t));
    } else if (status === 409) {
      setConflict({
        current: data.current,
        attempted: data.attempted,
        resolveFn: (resolvedTask) => handleResolveConflict(id, resolvedTask)
      });
    }
  };

  return (
    <div className="kanban-board">
      <AddTaskForm onAddTask={handleAddTask} />
      {columns.map(col => (
        <KanbanColumn
          key={col.key}
          status={col.key}
          label={col.label}
          tasks={tasks.filter(task => task.status === col.key)}
          onUpdateTask={handleUpdateTask}
          onSmartAssign={handleSmartAssign}
        />
      ))}
      {conflict && (
        <ConflictModal
          current={conflict.current}
          attempted={conflict.attempted}
          onMerge={conflict.resolveFn}
          onOverwrite={conflict.resolveFn}
          onCancel={() => setConflict(null)}
        />
      )}
      <ActivityLogPanel />
    </div>
  );
};

export default KanbanBoard; 