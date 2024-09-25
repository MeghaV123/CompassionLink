import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Sidebar from '../../common/Sidebar';
import Navbar from '../../common/Navbar';

function ViewProfile() {
  const location = useLocation();
  const recipientId = location.state.id;

  const [recipient, setRecipient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/recipient/getRecipient", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId })
    })
      .then((res) => res.json())
      .then((result) => {
        setRecipient(result);
      })
      .catch((error) => {
        console.error("Error fetching recipient:", error);
      });
  }, [recipientId]);

  const handleUpdateProfile = () => {
    navigate('/updateProfile', { state: { id: recipientId } });
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <Navbar/>
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            {recipient ? (
              <div className="col-md-6 offset-md-3">
                <div className="card">
                  <div className="card-header">
                    <h2>Profile Information</h2>
                  </div>
                  <div className="card-body">
                    <p><strong>Name:</strong> {recipient.recipientname}</p>
                    <p><strong>Email:</strong> {recipient.authid.email}</p>
                    <p><strong>Contact:</strong> {recipient.contact}</p>
                    <p><strong>Address:</strong> {recipient.address}</p>
                    {/* Add more recipient details as needed */}
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={handleUpdateProfile}
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-6 offset-md-3">
                <div className="alert alert-info">Loading profile...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewProfile;
