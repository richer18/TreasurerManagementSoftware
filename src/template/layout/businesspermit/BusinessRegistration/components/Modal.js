import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

const Modal = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

 const handleProceedClick = () => {
  if (selectedOption === 'New') {
    navigate('/my-app/new-application'); // Use an absolute path to navigate correctly
  } else {
    onClose();
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create Transaction</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <h4 className="modal-subtitle">Business Permit and Licensing System</h4>
          <form>
            {['New', 'Renewal', 'Quarterly', 'Delinquent', 'Change Request', 'Retirement'].map((type) => (
              <div className="form-group" key={type}>
                <label>
                  <input
                    type="radio"
                    name="transactionType"
                    value={type}
                    onChange={handleOptionChange}
                  />
                  {type}
                </label>
              </div>
            ))}
          </form>
        </div>
        <div className="modal-footer">
          <button
            className={`proceed-button ${selectedOption ? '' : 'disabled-button'}`}
            onClick={handleProceedClick}
            disabled={!selectedOption}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

// Define prop types for the Modal component
Modal.propTypes = {
  onClose: PropTypes.func.isRequired, // Ensures that onClose is a function and is required
};

export default Modal;
