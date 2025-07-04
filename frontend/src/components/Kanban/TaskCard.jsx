import React from 'react';

const statusOrder = ['Todo', 'In Progress', 'Done'];

const TaskCard = ({ task, onUpdateTask, onDragStart, onDragEnd, onSmartAssign }) => {
  const nextStatus = statusOrder[statusOrder.indexOf(task.status) + 1];
  return (
    <div
      className="task-card"
      draggable
      onDragStart={e => onDragStart && onDragStart(e, task)}
      onDragEnd={e => onDragEnd && onDragEnd(e, task)}
    >
      <div className="task-title">{task.title}</div>
      <div className="task-desc">{task.description}</div>
      <div className="task-meta">
        <span className="task-user">👤 {task.assignedUser}</span>
        <span className={`task-priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
      {nextStatus && onUpdateTask && (
        <button style={{marginTop:8}} onClick={() => onUpdateTask(task._id, { status: nextStatus })}>
          Move to {nextStatus}
        </button>
      )}
      {onSmartAssign && (
        <button style={{marginTop:8, marginLeft:8}} onClick={() => onSmartAssign(task._id)}>
          Smart Assign
        </button>
      )}
    </div>
  );
};

export default TaskCard; 