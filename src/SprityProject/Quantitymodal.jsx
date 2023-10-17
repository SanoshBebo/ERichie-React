import React from 'react';

const ConfirmationModal = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>Proceed</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
