import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LandNavbar from '../common/LandNavbar';

function UserProfileUpdate() {
  const location = useLocation();
  const userId = location.state.id;

  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    authid: { email: '' },
    contact: '',
    address: ''
  });

  const [errors, setErrors] = useState({}); // State to track validation errors

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/recipient/getUsers", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result);
      })
      .catch((error) => {
        console.error("Error fetching Users:", error);
      });
  }, [userId]);

  const validate = () => {
    let errors = {};

    if (!user.firstname.trim()) {
      errors.firstname = "First name is required";
    }
    if (!user.lastname.trim()) {
      errors.lastname = "Last name is required";
    }
    if (!user.authid.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.authid.email)) {
      errors.email = "Email address is invalid";
    }
    if (!user.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(user.contact)) {
      errors.contact = "Contact number must be exactly 10 digits";
    }
    if (!user.address.trim()) {
      errors.address = "Address is required";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setUser((prevState) => ({
        ...prevState,
        authid: { ...prevState.authid, email: value }
      }));
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    if (validate()) {
      fetch("http://localhost:4000/recipient/updateUser", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
        .then((res) => res.json())
        .then(() => {
          navigate(-1);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    }
  };

  return (
    <>
      <LandNavbar />
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
                    <label htmlFor="recipientname">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipientname"
                      name="firstname"
                      value={user.firstname}
                      onChange={handleChange}
                    />
                    {errors.firstname && <small className="text-danger">{errors.firstname}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="recipientname">Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipientname"
                      name="lastname"
                      value={user.lastname}
                      onChange={handleChange}
                    />
                    {errors.lastname && <small className="text-danger">{errors.lastname}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={user.authid.email}
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
                      value={user.contact}
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
                      value={user.address}
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
    </>
  );
}

export default UserProfileUpdate;
