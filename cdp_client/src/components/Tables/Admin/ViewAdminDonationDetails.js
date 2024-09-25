import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../common/Navbar";
import Sidebar from "../../common/Sidebar";

function ViewAdminDonationDetails() {
  const [donation, setDonation] = useState(null);

  const [isAccepted, setIsAccepted] = useState(false);
  const [NonMonetarydonation, setNonMonetaryDonation] = useState(null);
  const [nonmonetary, setNonMonetory] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState('processing');
  const [deliveryAgent, setDeliveryAgent] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state;
  const donationId = location.state.id;

  const userdata = JSON.parse(localStorage.getItem('userdata'));
  const userId = userdata._id



  

  useEffect(() => {
    fetch(`http://localhost:4000/admin/viewDonationById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        setDonation(result);
        if (result.deliveryStatus) {
          setDeliveryStatus(result.deliveryStatus);
        }
      })
      .catch((error) => {
        console.error("Error fetching Donation details:", error);
      });
  }, [id]);

  const deleteDonation = (id) => {
    fetch("http://localhost:4000/admin/deleteDonation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message) {
          toast.success(result.message, {
            position: "top-right",
            autoClose: 1000,
          });
        } else {
          toast.error("Failed to delete donation", {
            position: "top-right",
            autoClose: 1000,
          });
        }
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error deleting donation:", error);
        setTimeout(() => {
          toast.error("An error occurred while deleting the donation", {
            position: "top-right",
            autoClose: 2000,
          });
        }, 2000);
      });
  };

  const handleApproval = (status) => {
    fetch(`http://localhost:4000/admin/updateDonationStatus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(
            status === 1 ? "Donation approved!" : "Donation rejected!"
          );
          navigate(-1);
        } else {
          toast.error("Failed to update donation status.");
        }
      })
      .catch((error) => {
        console.error("Error updating donation status:", error);
        toast.error("An error occurred. Please try again.");
      });
  };

  const handleDeliveryStatusChange = (event) => {
    setDeliveryStatus(event.target.value);
  };


  
  useEffect(() => {
    fetch(`http://localhost:4000/admin/viewRecipientDonationsById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        setNonMonetaryDonation(result);
        if (result.AgentStatus === 1) {
          setIsAccepted(true);
          setDeliveryAgent(result.agentId)
          setDeliveryStatus(result.deliveryStatus || 'processing');
        }
      })
      .catch((error) => {
        console.error("Error fetching Donation details:", error);
      });
  }, [id]);

   

  const updateDeliveryStatus = () => {
    fetch(`http://localhost:4000/admin/updateAdminDeliveryStatus/${donationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deliveryStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("Delivery status updated!");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Failed to update delivery status.");
        }
      })
      .catch((error) => {
        console.error("Error updating delivery status:", error);
        toast.error("An error occurred. Please try again.");
      });
  };

  const donationProgress = donation
    ? (donation.amountDonated / donation.donationPrice) * 100
    : 0;

  const statusOptions = [
    { value: 'processing', label: 'Processing' },
    { value: 'pickedup', label: 'Product Picked Up' },
    { value: 'on-the-way', label: 'On the Way' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <>
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            {donation ? (
              <div className="col-sm-12 col-xl-12">
                <div className="bg-secondary rounded h-100 p-4 text-center">
                  <img
                    src={`http://localhost:4000${donation.donationimage}`}
                    alt={donation.donationName}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "600px",
                      marginBottom: "20px",
                    }}
                    className="img-fluid rounded"
                  />
                  <h3 className="mb-4">{donation.donationName}</h3>
                  {donation.donationType !== "non-monetary" && (
                    <>
                      <h4 className="mt-4">
                        <strong>₹</strong>
                        {donation.donationPrice}
                      </h4>
                      <hr />
                      <h5 className="mt-4">
                        Donations Received:
                        <strong> ₹ </strong>
                        {donation.amountDonated}
                      </h5>
                      <h5 className="mt-4">
                        Balance Needed:
                        <strong> ₹ </strong>
                        {donation.balance}
                      </h5>
                      <h5 style={{ textAlign: "start" }}>Donation Progress:</h5>
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped"
                          role="progressbar"
                          style={{
                            width: `${donationProgress}%`,
                          }}
                          aria-valuenow={donationProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {Math.round(donationProgress)}%
                        </div>
                      </div>
                      <hr />
                    </>
                  )}
                  <p style={{ textAlign: "justify" }}>
                    <strong>Description:</strong> {donation.donationDescription}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Donation Type:</strong> {donation.donationType}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Donation Category: </strong>{" "}
                    {donation.categoryId.categoryname}
                  </p>
                  <hr />
                  <h5>Recipient Details:</h5>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Name:</strong> {donation.recipientId.recipientname}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Address:</strong> {donation.recipientId.address}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Contact:</strong> {donation.recipientId.contact}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Aadhar Number:</strong> {donation.aadharNumber}
                  </p>

                  <p style={{ textAlign: "justify", fontSize: "20px" }}>
                    {" "}
                    <strong>Income Certificate:</strong>
                  </p>
                  <div
                    style={{ border: "1px solid #ccc", marginBottom: "15px" }}
                  >
                    <embed
                      src={`http://localhost:4000${donation.incomeCertificateUrl}`}
                      type="application/pdf"
                      width="65%"
                      height="550px"
                    />
                  </div>

                  <hr />
                  <p style={{ textAlign: "justify", fontSize: "20px" }}>
                    {" "}
                    <strong>Medical Certificate:</strong>
                  </p>
                  <div
                    style={{ border: "1px solid #ccc", marginBottom: "15px" }}
                  >
                    <embed
                      src={`http://localhost:4000${donation.medicalCertificateUrl}`}
                      type="application/pdf"
                      width="65%"
                      height="550px"
                    />
                  </div>

                  <hr />
                  {/* Add the tracking UI here */}
                  {/* {donation.donationType !== "monetary" && (
                  <div className="mt-4">
                    <h5 style={{textAlign:"start"}}>Update Delivery Status:</h5>
                    <h6 style={{textAlign:"start"}}>Delivery Accepted by: </h6>
                    <div style={{textAlign:"start"}}>
                    <p><b>Agent Name:</b> {deliveryAgent.agentname} </p>
                    <p><b>Agent Address:</b> {deliveryAgent.address} </p>
                    <p><b>Agent Contact:</b> {deliveryAgent.contact} </p>
                    </div>
                    <div className="container">
                      <div className="row">
                        <div className="col-12 col-md-10 hh-grayBox pt45 pb20">
                          <div className="row justify-content-between">
                            {statusOptions.map((option, index) => (
                              <div key={option.value} className={`order-tracking ${deliveryStatus === option.value ? 'completed' : ''}`}>
                                <span className="is-complete"></span>
                                <p>{option.label}<br /><span></span></p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <select
                      value={deliveryStatus}
                      onChange={handleDeliveryStatusChange}
                      className="form-select mt-3 bg-white"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={updateDeliveryStatus}
                    >
                      Update Status
                    </button>
                  </div>
                   )} */}

                  <button
                    className="btn btn-danger mt-4"
                    onClick={() => deleteDonation(donation._id)}
                  >
                    Delete Donation
                  </button>
                  <ToastContainer />
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewAdminDonationDetails;
