import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../common/Navbar';
import Sidebar from '../../common/Sidebar';

function ViewApprovalDonation() {
  const [donation, setDonation] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state;

  useEffect(() => {
    fetch(`http://localhost:4000/admin/viewDonationById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        setDonation(result);
      })
      .catch((error) => {
        console.error("Error fetching Donation details:", error);
      });
  }, [id]);

  const handleApproval = (status) => {
    fetch(`http://localhost:4000/admin/updateDonationStatus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(status === 1 ? "Donation approved!" : "Donation rejected!");
          navigate(-1); // Redirect back to the donation list
        } else {
          toast.error("Failed to update donation status.");
        }
      })
      .catch((error) => {
        console.error("Error updating donation status:", error);
        toast.error("An error occurred. Please try again.");
      });
  };

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
                  <h4 className="mt-4">
                    <strong>₹</strong>
                    {donation.donationPrice}
                  </h4>
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


                  <p style={{ textAlign: "justify", fontSize:"20px" }}>  {/* Income Certificate View */}
                    <strong>Income Certificate:</strong>
                  </p>
                  <div
                    style={{ border: "1px solid #ccc", marginBottom: "15px" }}
                  >
                    <embed
                      src={`http://localhost:4000${donation.incomeCertificateUrl}`}
                      type="application/pdf"
                      width="70%"
                      height="550px"
                    />
                  </div>

<hr/>
                  <p style={{ textAlign: "justify", fontSize:"20px"}}> {/* Medical Certificate View */}
                    <strong>Medical Certificate:</strong>
                  </p>
                  <div
                    style={{ border: "1px solid #ccc", marginBottom: "15px" }}
                  >
                    <embed
                      src={`http://localhost:4000${donation.medicalCertificateUrl}`}
                      type="application/pdf"
                      width="70%"
                      height="550px"
                    />
                  </div>

                  <hr/>
                  <br/>

                  {/* Bank details */}
                  <h5>Bank Details:</h5>
                  <div className="row mb-3">
              <div className="col">
              <p style={{ textAlign: "justify" }}>
                    <strong>Account Owner Name:</strong> {donation.bankDetails.accountOwnerName}
                  </p>
                  </div>
                  <div className="col">
                  <p style={{ textAlign: "justify" }}>
                    <strong>Bank name:</strong> {donation.bankDetails.accountOwnerName}
                  </p>
                </div>
                </div>

                <div className="row mb-3">
              <div className="col">
              <p style={{ textAlign: "justify" }}>
                    <strong>Account Number:</strong> {donation.bankDetails.accountNumber}
                  </p>
                  </div>
                  <div className="col">
                  <p style={{ textAlign: "justify" }}>
                    <strong>IFSC Code:</strong> {donation.bankDetails.ifscCode}
                  </p>
                </div>
                </div>
                  


                  <div className="mt-4">
                    <button
                      className="btn btn-success ms-1"
                      style={{ padding: "10px 30px", marginRight: "10px" }}
                      onClick={() => handleApproval(1)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger ms-1"
                      style={{ padding: "10px 30px" }}
                      onClick={() => handleApproval(2)}
                    >
                      Reject
                    </button>
                  </div>
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

export default ViewApprovalDonation;
