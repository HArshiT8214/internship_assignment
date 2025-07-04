import React, { useState } from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ status, label, tasks, onUpdateTask, onSmartAssign }) => {
  const [isOver, setIsOver] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragOver = e => {
    e.preventDefault();
    setIsOver(true);
  };
  const handleDragLeave = () => setIsOver(false);
  const handleDrop = e => {
    setIsOver(false);
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask(draggedTask._id, { status });
    }
    setDraggedTask(null);
  };
  const handleDragStart = (e, task) => setDraggedTask(task);
  const handleDragEnd = () => setDraggedTask(null);

  return (
    <div
      className={`kanban-column kanban-column-${status.replace(/\s/g, '').toLowerCase()}${isOver ? ' drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3>{label}</h3>
      <div className="kanban-tasks">
        {tasks.map(task => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onSmartAssign={onSmartAssign}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn; 