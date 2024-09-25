import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditAgent() {
  const [agentname, setAgentName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [authid, setAuthid] = useState("");
  const [errors, setErrors] = useState({}); // State to track validation errors

  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const ids = { id: loc.state.id };
    fetch("http://localhost:4000/admin/updateAgentById", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        setAgentName(result.agentDetails.agentname);
        setLocation(result.agentDetails.location);
        setContact(result.agentDetails.contact);
        setAddress(result.agentDetails.address);
        setEmail(result.authDetails.email);
        setAuthid(result.authDetails._id); // Store auth ID for update
      });
  }, [loc.state.id]);

  const validate = () => {
    let errors = {};

    if (!agentname.trim()) {
      errors.agentname = "Agent name is required";
    }
    if (!contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(contact)) {
      errors.contact = "Contact number must be exactly 10 digits";
    }
    if (!address.trim()) {
      errors.address = "Address is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const updateAgent = () => {
    if (validate()) {
      const params = {
        id: loc.state.id,
        agentname: agentname,
        contact: contact,
        location: location,
        address: address,
        email: email,
        userstatus: 3,
        authid: authid // Pass auth ID for update
      };
      fetch("http://localhost:4000/admin/editAndUpdateAgent", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then(() => {
          toast.success('Agent updated successfully!', {
            position: "top-right",
            autoClose: 2000,
          });

          setTimeout(() => {
            navigate('/AdminHome'); // Redirect to desired page
          }, 2000);
        })
        .catch(() => {
          toast.error('Failed to update agent. Please try again.', {
            position: "top-right",
            autoClose: 2000,
          });
        });
    } else {
      toast.error('Please correct the highlighted errors and try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <div className="container-fluid">
          <div
            className="row h-100 align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-6">
              <div className="bg-secondary rounded p-4 p-sm-5 my-4 mx-3">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <h3>UPDATE AGENT</h3>
                </div>
                <div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.agentname ? 'is-invalid' : ''}`}
                      id="agentnameInput"
                      placeholder="Agent Name"
                      value={agentname}
                      onChange={(event) => setAgentName(event.target.value)}
                    />
                    <label htmlFor="agentnameInput">Agent Name</label>
                    {errors.agentname && <div className="invalid-feedback">{errors.agentname}</div>}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                      id="contactInput"
                      placeholder="Contact"
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                    />
                    <label htmlFor="contactInput">Contact</label>
                    {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      id="addressInput"
                      placeholder="Address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    />
                    <label htmlFor="addressInput">Address</label>
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="emailInput"
                      placeholder="Email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <label htmlFor="emailInput">Email</label>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary py-3 w-100 mb-4"
                    onClick={updateAgent}
                  >
                    <strong>UPDATE</strong>{" "}
                    <i className="fa fa-upload" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default EditAgent;
