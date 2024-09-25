import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

function RecipientSignUp() {
    const [recipientname, setRecipientName] = useState("");
    const [contact, setContact] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let errors = {};

        if (!recipientname) errors.recipientname = "Recipient name is required.";
        if (!contact) errors.contact = "Contact is required.";
        else if (!/^\d{10}$/.test(contact)) errors.contact = "Contact must be a 10-digit number.";
        if (!location) errors.location = "Location is required.";
        if (!address) errors.address = "Address is required.";
        if (!email) errors.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email format.";
        if (!password) errors.password = "Password is required.";
        else if (password.length < 3) errors.password = "Password must be at least 3 characters long.";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const saveRecipient = async (event) => {
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

        try {
            const response = await fetch("http://localhost:4000/admin/AddRecipient", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });

            if (response.status === 409) {
                setErrors({ ...errors, email: "Email already exists." });
                return;
            }

            if (response.ok) {
                const result = await response.json();
                if (result === 'success') {
                    toast.success("Recipient added successfully.");
                    setErrors({});
                    setRecipientName("");
                    setContact("");
                    setLocation("");
                    setAddress("");
                    setEmail("");
                    setPassword("");
                    setTimeout(() => {
                        navigate("/SignIn");
                    }, 2000);
                } else {
                    toast.error("Failed to add Recipient. Please try again.");
                }
            } else {
                throw new Error("Failed to add Recipient.");
            }
        } catch (error) {
            console.error("Error adding Recipient:", error);
            toast.error("Failed to add Recipient. Please try again.");
        }
    };

    return (
        <div className="background3">
            <div className="container-fluid">
                <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                    <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-6">
                        <div className="glassmorphic rounded p-4 p-sm-5 my-4 mx-3">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <h3>ADD RECIPIENT</h3>
                            </div>

                            <ToastContainer />

                            <form>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.recipientname ? 'is-invalid' : ''}`}
                                        id="RecipientNameInput"
                                        placeholder="Recipient Name"
                                        value={recipientname}
                                        onChange={(event) => setRecipientName(event.target.value)}
                                    />
                                    <label htmlFor="RecipientNameInput">Recipient Name</label>
                                    {errors.recipientname && (
                                        <div className="invalid-feedback">{errors.recipientname}</div>
                                    )}
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
                                    {errors.contact && (
                                        <div className="invalid-feedback">{errors.contact}</div>
                                    )}
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                        id="locationInput"
                                        placeholder="Location"
                                        value={location}
                                        onChange={(event) => setLocation(event.target.value)}
                                    />
                                    <label htmlFor="locationInput">Location</label>
                                    {errors.location && (
                                        <div className="invalid-feedback">{errors.location}</div>
                                    )}
                                </div>

                                <div className="form-floating mb-3">
                                    <textarea
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        placeholder="Address"
                                        id="floatingTextarea"
                                        style={{ height: "100px" }}
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                    ></textarea>
                                    <label htmlFor="floatingTextarea">Address</label>
                                    {errors.address && (
                                        <div className="invalid-feedback">{errors.address}</div>
                                    )}
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
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                <div className="form-floating mb-4">
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="passwordInput"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                    <label htmlFor="passwordInput">Password</label>
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="glow-on-hover w-100 mb-4"
                                    onClick={saveRecipient}
                                >
                                    CREATE <i className="fa fa-user-plus"></i>
                                </button>
                                <p className="text-center mb-0">
                Already have an Account? <a href="/SignIn">Sign In</a>
              </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipientSignUp;
