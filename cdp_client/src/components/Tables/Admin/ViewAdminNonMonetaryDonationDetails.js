import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../common/Navbar';
import Sidebar from '../../common/Sidebar';

function ViewAdminNonMonetaryDonationDetails() {
  const [donation, setDonation] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isAcceptedAgent, setIsAcceptedAgent] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('processing');
  const location = useLocation();
  const donationId = location.state?.id;
  const agentId = JSON.parse(localStorage.getItem('userdata'))._id;

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/admin/viewAgentDonationById`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ donationId }),
        });
        const result = await response.json();
        setDonation(result);

        if (result.agentId === agentId) {
          setIsAcceptedAgent(true);
        }
        if (result.AgentStatus === 1) {
          setIsAccepted(true);
          setDeliveryStatus(result.deliveryStatus || 'processing');
        }
      } catch (error) {
        console.error("Error fetching donation details:", error);
      }
    };

    fetchDonationDetails();
  }, [donationId, agentId]);

  const handleApproval = async () => {
    try {
      const response = await fetch(`http://localhost:4000/admin/updateAgentDonationStatus/${donationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ AgentStatus: 1, agentId }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Donation accepted!");
        setIsAccepted(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to update donation status.");
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDeliveryStatusChange = (event) => {
    setDeliveryStatus(event.target.value);
  };

  const updateDeliveryStatus = async () => {
    try {
      const response = await fetch(`http://localhost:4000/admin/updateDeliveryStatus/${donationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryStatus }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Delivery status updated!");
      } else {
        toast.error("Failed to update delivery status.");
      }
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

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
                    src={`http://localhost:4000${donation.donationId.donationimage}`}
                    alt={donation.donationId.donationName}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "600px",
                      marginBottom: "20px",
                    }}
                    className="img-fluid rounded"
                  />
                  <h3 className="mb-4">{donation.donationId.donationName}</h3>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Description:</strong> {donation.donationId.donationDescription}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Donation Type:</strong> {donation.donationId.donationType}
                  </p>
                  <hr />


                  {/* Donation Recipient Details */}

                  <u><h5 style={{ textAlign: "start" }}>PICK UP DETAILS:</h5></u>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Name:</strong> {donation.donationId.recipientId.recipientname}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Address:</strong> {donation.donationId.recipientId.address}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Contact:</strong> {donation.donationId.recipientId.contact}
                  </p>

                  <hr/>

                  {/* Donation donor details */}
                  <u><h5 style={{ textAlign: "start" }}>DELIVERY DETAILS:</h5></u>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Name:</strong> {donation.userId.firstname + " " + donation.userId.lastname}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Address:</strong> {donation.userId.address}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Contact:</strong> {donation.userId.contact}
                  </p>


                  <hr />


 {/* <hr/> */}

{/* agent donor details */}
{/* <u><h5 style={{ textAlign: "start" }}>AGENT DETAILS:</h5></u>
<p style={{ textAlign: "justify" }}>
  <strong>Name:</strong> {donation.agentId.agentname}
</p>
<p style={{ textAlign: "justify" }}>
  <strong>Contact:</strong> {donation.agentId.contact}
</p>
<p style={{ textAlign: "justify" }}>
  <strong>Address:</strong> {donation.agentId.address}
</p> */}



                  <div className="mt-4">
                    <button
                      className="btn btn-success ms-1"
                      style={{ padding: "10px 30px", marginRight: "10px" }}
                      onClick={handleApproval}
                      disabled={isAccepted}
                    >
                      {isAccepted ? "Accepted" : "Accept Delivery"}
                    </button>
                  </div>

                  {isAccepted && (
                    <div className="mt-4">
                      <h5 style={{textAlign:"start"}}>Update Delivery Status:</h5>
                      <div className="container">
                        <div className="row">
                          <div className="col-12 col-md-10 hh-grayBox pt45 pb20">
                            <div className="row justify-content-between">
                              {statusOptions.map((option) => (
                                <div key={option.value} className={`order-tracking ${deliveryStatus === option.value ? 'completed' : ''}`}>
                                  <span className="is-complete"></span>
                                  <p>{option.label}<br /><span>{/* Add your date logic here */}</span></p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                        <>
                          <select
                            value={deliveryStatus}
                            onChange={handleDeliveryStatusChange}
                            className="form-select d-flex"
                            style={{ color: "black", backgroundColor: "white", minWidth: "500px", maxWidth: "500px", alignContent: "center" }}
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          <button
                            className="btn btn-primary mt-2"
                            style={{ textAlign: "start" }}
                            onClick={updateDeliveryStatus}
                          >
                            Update Status
                          </button>
                        </>
                      
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ViewAdminNonMonetaryDonationDetails;
