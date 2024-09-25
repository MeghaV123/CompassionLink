import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../common/Sidebar";

function EditRecipient() {
  const [recipientname, setRecipientName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [authid, setAuthid] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const ids = { id: loc.state.id };
    fetch("http://localhost:4000/admin/updateRecipientById", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        setRecipientName(result.recipientDetails.recipientname || "");
        setLocation(result.recipientDetails.location || "");
        setContact(result.recipientDetails.contact || "");
        setAddress(result.recipientDetails.address || "");
        setEmail(result.authDetails.email || "");
        setAuthid(result.authDetails._id || ""); // Store auth ID for update
      });
  }, [loc.state.id]);

  const validateForm = () => {
    const newErrors = {};
    if (!recipientname.trim()) newErrors.recipientname = "Recipient name is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!contact.trim() || contact.length !== 10 || !/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact must be a valid 10-digit number";
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email must be a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateRecipient = () => {
    if (!validateForm()) return;

    const params = {
      id: loc.state.id,
      recipientname,
      contact,
      location,
      address,
      email,
      userstatus: 3,
      authid, // Pass auth ID for update
    };

    fetch("http://localhost:4000/admin/editAndUpdateRecipient", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/AdminHome");
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
                  <h3>UPDATE RECIPIENT</h3>
                </div>
                <div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="recipientNameInput"
                      placeholder="Recipient Name"
                      value={recipientname}
                      onChange={(event) => setRecipientName(event.target.value)}
                    />
                    <label htmlFor="recipientNameInput">Recipient Name</label>
                    {errors.recipientname && <span className="text-danger">{errors.recipientname}</span>}
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
                    {errors.contact && <span className="text-danger">{errors.contact}</span>}
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
                    {errors.location && <span className="text-danger">{errors.location}</span>}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="addressInput"
                      placeholder="Address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    />
                    <label htmlFor="addressInput">Address</label>
                    {errors.address && <span className="text-danger">{errors.address}</span>}
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
                    {errors.email && <span className="text-danger">{errors.email}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary py-3 w-100 mb-4"
                    onClick={updateRecipient}
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
    </>
  );
}

export default EditRecipient;
