import React, { useEffect } from 'react';


const Popup = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type === 'success' ? 'active success' : 'active error'}`}>
      <div className="toast-content">
        <i className={`fas ${type === 'success' ? 'fa-check check' : 'fa-xmark close'}`}></i>
        <div className="messagess">
          <span className="text text-1">{type === 'success' ? 'Success' : 'Error'}</span>
          <span className="text text-2">{message}</span>
        </div>
      </div>
      <i className="fa-solid fa-xmark close" onClick={onClose}></i>
      <div className="progress active"></div>
    </div>
  );
};

export default Popup;
