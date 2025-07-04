import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

async function fetchActions(limit = 20) {
  const res = await fetch(`/api/actions?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch actions');
  return res.json();
}

const actionLabels = {
  create: 'created',
  update: 'updated',
  delete: 'deleted',
};

const ActivityLogPanel = () => {
  const [actions, setActions] = useState([]);
  const [animId, setAnimId] = useState(null);
  const logRef = useRef(null);

  useEffect(() => {
    fetchActions().then(setActions).catch(console.error);
    const socket = io();
    const addAction = (action) => {
      setActions(prev => [action, ...prev.slice(0, 19)]);
      setAnimId(action._id || Math.random());
    };
    socket.on('taskCreated', task => addAction({ user: 'demoUser', action: 'create', taskId: task._id, timestamp: new Date(), details: { title: task.title } }));
    socket.on('taskUpdated', task => addAction({ user: 'demoUser', action: 'update', taskId: task._id, timestamp: new Date(), details: { title: task.title } }));
    socket.on('taskDeleted', ({ _id }) => addAction({ user: 'demoUser', action: 'delete', taskId: _id, timestamp: new Date(), details: {} }));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [actions]);

  return (
    <div className="activity-log-panel">
      <h3>Activity Log</h3>
      <div className="activity-log-list" ref={logRef}>
        {actions.map((a, i) => (
          <div
            key={a._id || i}
            className={`activity-log-entry${animId === (a._id || i) ? ' animate' : ''}`}
            style={{ animationDelay: animId === (a._id || i) ? '0s' : 'none' }}
          >
            <span className="log-user">{a.user}</span> <span className="log-action">{actionLabels[a.action] || a.action}</span> task <span className="log-task">{a.details?.title || a.taskId}</span>
            <span className="log-time">{new Date(a.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogPanel; 