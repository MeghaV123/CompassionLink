import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!firstname) newErrors.firstname = 'First name is required';
    if (!lastname) newErrors.lastname = 'Last name is required';
    
    // Contact validation
    if (!contact) {
      newErrors.contact = 'Contact is required';
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = 'Contact must be a 10-digit number';
    }

    if (!address) newErrors.address = 'Address is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = () => {
    if (!validate()) return;
  
    const params = {
      firstname,
      lastname,
      contact,
      address,
      email,
      password,
      usertype: 3,
    };
  
    fetch("http://localhost:4000/auth/signup", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result === 'success') {
          toast.success('Registered successfully!', {
            position: 'top-right',
            autoClose: 2000,
            style: {
              backgroundColor: 'white',
              color: 'black',
            },
          });
          setTimeout(() => {
            navigate('/SignIn');
          }, 2000);
        } else if (result === 'Email already exists') {
          toast.error('Email already exists!', {
            position: 'top-right',
            autoClose: 2000,
            style: {
              backgroundColor: 'red',
              color: 'white',
            },
          });
        } else {
          toast.error('Registration failed!', {
            position: 'top-right',
            autoClose: 2000,
            style: {
              backgroundColor: 'red',
              color: 'white',
            },
          });
        }
      })
      .catch((error) => {
        toast.error('Something went wrong!', {
          position: 'top-right',
          autoClose: 2000,
          style: {
            backgroundColor: 'red',
            color: 'white',
          },
        });
      });
  };

  return (
    <div className="background1">
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-6">
            <div className="glassmorphic rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="text-primarys">Donation Platform</h3>
                <h3>REGISTER NOW!</h3>
              </div>
              <ToastContainer />

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingFirstName"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label htmlFor="floatingFirstName">First Name</label>
                {errors.firstname && <small className="text-danger">{errors.firstname}</small>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingLastName"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label htmlFor="floatingLastName">Last Name</label>
                {errors.lastname && <small className="text-danger">{errors.lastname}</small>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="floatingContact"
                  placeholder="Phone Number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                <label htmlFor="floatingContact">Contact</label>
                {errors.contact && <small className="text-danger">{errors.contact}</small>}
              </div>

              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  placeholder="Enter Address"
                  id="floatingAddress"
                  style={{ height: '100px' }}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                ></textarea>
                <label htmlFor="floatingAddress">Address</label>
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingEmail"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingEmail">Email address</label>
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <button type="button" className="glow-on-hover w-100 mb-4" onClick={registerUser}>
                Register <i className="fa fa-user-plus" aria-hidden="true"></i>
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

export default Signup;
