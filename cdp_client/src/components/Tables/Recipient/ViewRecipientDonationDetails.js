import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form, Navbar } from "react-bootstrap";
import Sidebar from "../../common/Sidebar";

function ViewRecipientDonationDetails() {


  const [deliveryStatus, setDeliveryStatus] = useState('processing');
  const [isAccepted, setIsAccepted] = useState(false);

  const [donation, setDonation] = useState(null);
  const [NonMonetarydonation, setNonMonetaryDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state;
  // const donationId = location.state.id;


  const handleDonateClick = () => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    if (!userdata || !userdata._id) {
      navigate("/SignIn");
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
  };

  const handleCustomAmountSubmit = () => {
    const remainingBalance = donation.donationPrice - donation.amountDonated;

    if (!customAmount || isNaN(customAmount) || customAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (customAmount > remainingBalance) {
      toast.error(
        `Amount exceeds the remaining balance of ₹${remainingBalance}.`
      );
      return;
    }

    const options = {
      key: "rzp_test_4Ex6Tyjkp79GFy",
      amount: customAmount * 100,
      currency: "INR",
      name: "Donation",
      description: "Thank you for your donation",
      image: "/your_logo.png",
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "Donor Name",
        email: "donor@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Donor Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentSuccess = (response) => {
    fetch(`http://localhost:4000/admin/addDonationAmount/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: customAmount,
        paymentId: response.razorpay_payment_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("Donation successful!");
          setDonation((prev) => ({
            ...prev,
            amountDonated: prev.amountDonated + parseFloat(customAmount),
            balance: prev.balance - parseFloat(customAmount),
          }));
          handleModalClose();
          window.location.reload();
        } else {
          toast.error("Failed to donate.");
        }
      })
      .catch((error) => {
        console.error("Error donating:", error);
        toast.error("An error occurred. Please try again.");
      });
  };

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
      })
      .catch((error) => {
        console.error("Error fetching Donation details:", error);
      });
  }, [id]);

  const donationProgress = donation
    ? (donation.amountDonated / donation.donationPrice) * 100
    : 0;




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
            setDeliveryStatus(result.deliveryStatus || 'processing');
          }
        })
        .catch((error) => {
          console.error("Error fetching Donation details:", error);
        });
    }, [id]);

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
        <div className="container-fluid pt-6 px-6">
          <div className="row g-6">
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
                  <h3 className="mb-4">
                    {donation.donationName}</h3>
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
                            // minWidth: "300px",
                            // minWidth: "300px",
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


                  {/* {donation.donationType !== "monetary" && (
                  <div className="mt-4">
                      <h5 style={{textAlign:"start"}}> Delivery Status:</h5>
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
                    </div>
                  )} */}

                  <div className="mt-4">
                    {donation.donationPrice === donation.amountDonated ? (
                      <button
                        className="btn btn-success"
                        style={{ fontSize: "12px" }}
                        disabled
                      >
                        Donation Complete
                      </button>
                    ) : (
                      ""
                      //   <button
                      //     onClick={handleDonateClick}
                      //     className="btn btn-secondary"
                      //     style={{ fontSize: "12px" }}
                      //   >
                      //     Donate Now
                      //   </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Donation Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formDonationAmount">
            <Form.Label>
              Enter the Amount (₹) you want to donate:
              <br />
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCustomAmountSubmit}>
            Donate
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default ViewRecipientDonationDetails;
