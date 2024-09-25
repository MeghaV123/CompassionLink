import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';
import Navbar from '../../common/Navbar';

function UpdateProfile() {
  const location = useLocation();
  const recipientId = location.state.id;

  const [recipient, setRecipient] = useState({
    recipientname: '',
    authid: { email: '' },
    contact: '',
    address: ''
  });

  const [errors, setErrors] = useState({}); // State to track validation errors

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

  const validate = () => {
    let errors = {};

    if (!recipient.recipientname.trim()) {
      errors.recipientname = "Name is required";
    }
    if (!recipient.authid.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(recipient.authid.email)) {
      errors.email = "Email address is invalid";
    }
    if (!recipient.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(recipient.contact)) {
      errors.contact = "Contact number must be exactly 10 digits";
    }
    if (!recipient.address.trim()) {
      errors.address = "Address is required";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setRecipient((prevState) => ({
        ...prevState,
        authid: { ...prevState.authid, email: value }
      }));
    } else {
      setRecipient((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    if (validate()) {
      fetch("http://localhost:4000/recipient/updateRecipient", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipient)
      })
        .then((res) => res.json())
        .then(() => {
          navigate('/profile', { state: { id: recipientId } });
        })
        .catch((error) => {
          console.error("Error updating recipient:", error);
        });
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            <div className="col-md-6 offset-md-3">
              <div className="card">
                <div className="card-header">
                  <h2>Edit Profile</h2>
                </div>
                <div className="card-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="recipientname">Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="recipientname"
                        name="recipientname"
                        value={recipient.recipientname}
                        onChange={handleChange}
                      />
                      {errors.recipientname && <small className="text-danger">{errors.recipientname}</small>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={recipient.authid.email}
                        onChange={handleChange}
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact">Contact:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="contact"
                        name="contact"
                        value={recipient.contact}
                        onChange={handleChange}
                      />
                      {errors.contact && <small className="text-danger">{errors.contact}</small>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={recipient.address}
                        onChange={handleChange}
                      />
                      {errors.address && <small className="text-danger">{errors.address}</small>}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
                <div className="card-footer text-center">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;
