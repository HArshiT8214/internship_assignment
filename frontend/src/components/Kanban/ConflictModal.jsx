import React, { useState } from 'react';

const ConflictModal = ({ current, attempted, onMerge, onOverwrite, onCancel }) => {
  const [merged, setMerged] = useState({ ...current, ...attempted });

  return (
    <div className="conflict-modal-backdrop">
      <div className="conflict-modal">
        <h2>Conflict Detected</h2>
        <p>Another user has updated this task. Please resolve the conflict:</p>
        <div className="conflict-versions">
          <div>
            <h4>Current Version</h4>
            <pre>{JSON.stringify(current, null, 2)}</pre>
          </div>
          <div>
            <h4>Your Attempt</h4>
            <pre>{JSON.stringify(attempted, null, 2)}</pre>
          </div>
        </div>
        <div className="conflict-actions">
          <button onClick={() => onMerge(merged)}>Merge</button>
          <button onClick={() => onOverwrite(attempted)}>Overwrite</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal; 