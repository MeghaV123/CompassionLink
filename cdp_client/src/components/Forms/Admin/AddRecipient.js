import React, { useState } from "react";
import Sidebar from "../../common/Sidebar";
import { useNavigate } from "react-router-dom";
// import RecipientList from "../../Tables/RecipientList";
function AddRecipient() {
  const [recipientname, setRecipientName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};

    if (!recipientname) errors.recipientname = "Donor name is required.";
    if (!contact) errors.contact = "Contact is required.";
    else if (!/^\d+$/.test(contact)) errors.contact = "Contact must be numeric.";
    if (!location) errors.location = "Location is required.";
    if (!address) errors.address = "Address is required.";
    if (!email) errors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email format.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < 3) errors.password = "Password must be at least 3 characters long.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveDonor = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    let params = {
      recipientname,
      contact,
      location,
      address,
      email,
      password,
      usertype: 1,
    };

    fetch("http://localhost:4000/admin/AddRecipient", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to add Donor.");
      })
      .then((result) => {
        if (result === 'success') {
          setMessage("Recipient added successfully.");
          setErrors({});
          setRecipientName("");
          setContact("");
          setLocation("");
          setAddress("");
          setEmail("");
          setPassword("");
          setTimeout(() => {
            navigate("/AdminHome");
          }, 2000);
        } else {
          setMessage("Failed to add Recipient. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error adding Recipient:", error);
        setMessage("Failed to add Recipient. Please try again.");
      });
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
                  <h3>ADD RECIPIENT</h3>
                </div>

                {/* Success or Error Message */}
                {message && (
                  <div
                    className={`alert ${
                      message.includes("successfully")
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                    role="alert"
                  >
                    {message}
                  </div>
                )}

                <form>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="RecipientNameInput"
                      placeholder="Kerala Disaster management"
                      value={recipientname}
                      onChange={(event) => setRecipientName(event.target.value)}
                    />
                    <label htmlFor="recipientNameInput">Recipient Name</label>
                    {errors.donorname && (
                      <div className="text-danger">{errors.recipientname}</div>
                    )}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="contactInput"
                      placeholder="Contact"
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                    />
                    <label htmlFor="contactInput">Contact</label>
                    {errors.contact && (
                      <div className="text-danger">{errors.contact}</div>
                    )}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="locationInput"
                      placeholder="Location"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                    />
                    <label htmlFor="locationInput">Location</label>
                    {errors.location && (
                      <div className="text-danger">{errors.location}</div>
                    )}
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Address"
                      id="floatingTextarea"
                      style={{ height: "100px" }}
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    ></textarea>
                    <label htmlFor="floatingTextarea">Address</label>
                    {errors.address && (
                      <div className="text-danger">{errors.address}</div>
                    )}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <label htmlFor="emailInput">Email</label>
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <label htmlFor="passwordInput">Password</label>
                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary py-3 w-100 mb-4"
                    onClick={saveDonor}
                  >
                    <strong>CREATE</strong>
                    <i className="fa fa-plus"></i>
                  </button>
                  
                </form>
              </div>
            </div>
            {/* <RecipientList/> */}

          </div>
        </div>
      </div>
    </>
  );
}

export default AddRecipient;
