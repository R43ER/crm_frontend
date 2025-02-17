// src/components/EditableCell.jsx
import React, { useState, useEffect } from 'react';

const EditableCell = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  return editing ? (
    <input
      type="text"
      value={currentValue}
      onChange={(e) => setCurrentValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSave();
        }
      }}
      autoFocus
      style={{ width: '100%' }}
    />
  ) : (
    <span onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
      {value}
    </span>
  );
};

export default EditableCell;
