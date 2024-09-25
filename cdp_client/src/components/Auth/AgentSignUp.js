import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AgentSignUp() {
  const [agentname, setAgentName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // Added state to handle message type
  const [errors, setErrors] = useState({
    agentname: '',
    contact: '',
    address: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      agentname: '',
      contact: '',
      address: '',
      email: '',
      password: ''
    };

    if (!agentname.trim()) {
      newErrors.agentname = 'Agent name is required';
      valid = false;
    }

    if (!contact.trim()) {
      newErrors.contact = 'Contact number is required';
      valid = false;
    } else if (isNaN(contact) || contact.length !== 10) {
      newErrors.contact = 'Contact number should be a 10-digit number';
      valid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const registerAgent = () => {
    if (validateForm()) {
      let params = {
        agentname,
        contact,
        address,
        email,
        password,
        usertype: 2
      };

      fetch('http://localhost:4000/auth/agentSignup', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(params)
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.message === 'Email already exists') {
            setMessage('Email already exists');
            setMessageType('error');
            setInterval(() => {
              window.location.reload();
            }, 2000); // Set message type to 'error' for red background
          } else if (result === 'success') {
            setMessage('Registered successfully');
            setMessageType('success'); // Set message type to 'success'
            setTimeout(() => {
              navigate('/SignIn'); // Redirect to the home page after 2 seconds
            }, 2000);
          } else {
            setMessage('Registration failed');
            setMessageType('error'); // Set message type to 'error' for red background
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage('Registration failed');
          setMessageType('error'); // Set message type to 'error' for red background
        });
    }
  };

  return (
    <div className="background2">
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-6">
            <div className="glassmorphic rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="text-primary">DONATION PLATFORM</h3>
                <h3>AGENT SIGN UP</h3>
              </div>
              {message && (
                <div
                  className={`alert ${
                    messageType === 'error' ? 'alert-danger' : 'alert-success'
                  }`}
                >
                  {message}
                </div>
              )}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.agentname ? 'is-invalid' : ''}`}
                  id="floatingText"
                  placeholder="Agent Name"
                  onChange={(e) => setAgentName(e.target.value)}
                />
                <label htmlFor="floatingText">Agent Name</label>
                <div className="invalid-feedback">{errors.agentname}</div>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                  id="floatingText"
                  placeholder="Phone Number"
                  onChange={(e) => setContact(e.target.value)}
                />
                <label htmlFor="floatingText">Contact</label>
                <div className="invalid-feedback">{errors.contact}</div>
              </div>
              <div className="form-floating mb-3">
                <textarea
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  placeholder="Enter Volunteer Address"
                  id="floatingTextarea"
                  name="address"
                  style={{ height: '100px' }}
                  onChange={(event) => setAddress(event.target.value)}
                ></textarea>
                <label htmlFor="floatingTextarea">Address</label>
                <div className="invalid-feedback">{errors.address}</div>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="floatingInput"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email Id</label>
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="floatingPassword"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback">{errors.password}</div>
              </div>
              <button
                type="button"
                className="glow-on-hover w-100 mb-4"
                onClick={registerAgent}
              >
                Sign Up <i className="fa fa-user-plus" aria-hidden="true"></i>
              </button>
              <p className="text-center mb-0">
                Already have an Account? <a href="/SignIn">Sign In</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentSignUp;
