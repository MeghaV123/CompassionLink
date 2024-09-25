import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import LandNavbar from "../../common/LandNavbar";
import LandFooter from "../../common/LandFooter";

function CategoryDonations() {
  const [donations, setDonations] = useState([]);
  const [category, setCategory] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDonation, setSelectedDonation] = useState(null);

  const categoryId = location.state.id;

  let params = {
    categoryId: categoryId,
  };

  useEffect(() => {
    fetch(`http://localhost:4000/admin/getCategorybyId`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => setCategory(data))
      .catch((error) => console.error("Error fetching category:", error));
  }, [categoryId]);

  useEffect(() => {
    fetch(`http://localhost:4000/admin/getDonationsbyCategory`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => {
        const approvedDonations = data.filter(donation => donation.status === 1);
        setDonations(approvedDonations);
      })
      .catch((error) => console.error("Error fetching donations:", error));
  }, [categoryId]);

  const handleDonateClick = (donation) => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    if (!userdata || !userdata._id) {
      navigate("/SignIn");
      return;
    }

    setSelectedDonation(donation);
    const options = {
      key: "rzp_test_4Ex6Tyjkp79GFy", // Replace with your Razorpay Key ID
      amount: donation.donationPrice * 100, // Amount in paise
      currency: "INR",
      name: `${donation.donationName}`,
      description: `Donation for ${donation.donationName}`,
      image:
        "https://static.vecteezy.com/system/resources/previews/013/766/012/non_2x/donation-box-and-charity-concept-human-hands-putting-money-cash-love-and-heart-to-donation-box-together-helping-doing-charity-illustration-free-vector.jpg",
      handler: function (response) {
        const donationDetails = {
          donationId: donation._id,
          amount: donation.donationPrice,
          paymentId: response.razorpay_payment_id,
        };

        const existingDonations =
          JSON.parse(localStorage.getItem("myDonations")) || [];
        existingDonations.push(donationDetails);
        localStorage.setItem("myDonations", JSON.stringify(existingDonations));

        alert(
          `Payment successful. Payment ID: ${response.razorpay_payment_id}`
        );
      },
      prefill: {
        name: userdata.name,
        email: userdata.email,
        contact: userdata.contact,
      },
      notes: {
        address: "Donor Address",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <LandNavbar />
      <div className="col-12 col-md-12 col-lg-12 p-3" style={{ backgroundColor: "#FF9485" }}>
        <div className="d-flex align-items-center" style={{ maxWidth: "fit-content" }}>
          <img
            src={`http://localhost:4000${category.image}`}
            alt={category.categoryname}
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          />
          <h3>{category.categoryname}</h3>
        </div>
      </div>
      <div className="product-section" style={{ boxShadow: "initial 50px black" }}>
        <div className="container">
          <div className="row">
            {donations.length === 0 ? (
              <div style={{ textAlign: 'center' }}>
                <img src="./img/no_donations.png" alt="Image" className="img-fluid" style={{ width: "300px", height: "300px" }} />
                <h2 style={{ color: 'black' }}>No Donations in this category yet!</h2>
              </div>
            ) : (
              donations.map((donation) => {
                const donationProgress = (donation.amountDonated / donation.donationPrice) * 100;

                return (
                  <div
                    className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0"
                    key={donation._id}
                  >
                    <div className="product-item neumorphism-card">
                      <img
                        src={`http://localhost:4000${donation.donationimage}`}
                        className="img-fluid product-thumbnail"
                        alt={donation.donationName}
                        style={{
                          width: "290px",
                          height: "200px",
                          borderRadius: "10px 10px 3px 3px",
                        }}
                      />
                      <h3 className="product-title">{donation.donationName}</h3>
                      <p>{donation.description}</p>
                      {donation.donationType === "non-monetary" ? (
                        <strong className="product-price">
                          {donation.categoryId.categoryname}
                        </strong>
                      ) : (
                        <strong className="product-price">
                          ₹{donation.donationPrice}
                        </strong>
                      )}
                      <h5 style={{ textAlign: "start" }}>Donation Progress:</h5>
                      <div className="progress">
                        <div 
                          className="progress-bar progress-bar-striped" 
                          role="progressbar" 
                          style={{ width: `${donationProgress}%` }}
                          aria-valuenow={donationProgress}
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        >
                          {Math.round(donationProgress)}%
                        </div>
                      </div>
                      <span className="icon-cross">
                      <Link
                        to="/ViewDonationDetails"
                        state={{ id: donation._id }}
                        className="btn btn-secondary"
                        style={{ fontSize: "12px" }}
                      >
                        View Details
                      </Link>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <LandFooter />
    </>
  );
}

export default CategoryDonations;
