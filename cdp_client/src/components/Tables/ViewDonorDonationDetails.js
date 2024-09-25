import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandNavbar from '../common/LandNavbar';


function ViewDonorDonationDetails() {
  const [donation, setDonation] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('processing');
  const location = useLocation();
  const donationId = location.state.id;

  const agentId = JSON.parse(localStorage.getItem('userdata'))._id;

  useEffect(() => {
    fetch(`http://localhost:4000/admin/viewAgentDonationById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ donationId }),
    })
      .then((res) => res.json())
      .then((result) => {
        setDonation(result);
        if (result.AgentStatus === 1) {
          setIsAccepted(true);
          setDeliveryStatus(result.deliveryStatus || 'processing');
        }
      })
      .catch((error) => {
        console.error("Error fetching Donation details:", error);
      });
  }, [donationId]);
  const statusOptions = [
    { value: 'processing', label: 'Processing' },
    { value: 'pickedup', label: 'Product Picked Up' },
    { value: 'on-the-way', label: 'On the Way' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <>
    <LandNavbar/>
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
                  {/* <h5>Donor Details:</h5>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Name:</strong> {donation.userId.firstname + " " + donation.userId.lastname}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Address:</strong> {donation.userId.address}
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    <strong>Contact:</strong> {donation.userId.contact}
                  </p> */}

                  {/* <div className="mt-4">
                    <button
                      className="btn btn-success ms-1"
                      style={{ padding: "10px 30px", marginRight: "10px" }}
                      onClick={handleApproval}
                      disabled={isAccepted}
                    >
                      {isAccepted ? "Accepted" : "Accept Delivery"}
                    </button>
                  </div> */}

                  {isAccepted && (
                    <div className="mt-4">
                      <h5 style={{textAlign:"start"}}> Delivery Status:</h5>
                      <div className="container">
                        <div className="row">
                          <div className="col-12 col-md-10 hh-grayBox pt45 pb20">
                            <div className="row justify-content-between">
                              {statusOptions.map((option, index) => (
                                <div key={option.value} className={`order-tracking ${deliveryStatus === option.value ? 'completed' : ''}`}>
                                  <span className="is-complete"></span>
                                  <p>{option.label}<br /><span>{/* Add your date logic here */}</span></p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      
      <ToastContainer />
    </>
  );
}

export default ViewDonorDonationDetails;
