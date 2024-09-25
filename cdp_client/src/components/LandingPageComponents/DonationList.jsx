import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DonationList() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/admin/ViewDonations')
      .then(response => response.json())
      .then(data => {
        const approvedDonations = data.filter(donation => donation.status === 1);
        setDonations(approvedDonations.slice(0, 3)); // Limit to first 3 donations
      })
      .catch(error => console.error('Error fetching donations:', error));
  }, []);

  return (
    <div className="product-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
            <h2 className="mb-4 section-title">Every Donation Matters</h2>
            <p className="mb-4" style={{ color: 'black' , textAlign:'justify'}}>
              Your donations play a vital role in fueling our mission and
              enabling us to contribute to the cause, such as providing
              essential services, funding research, supporting communities, etc.
            </p>
            <p>
              <a href="/Donations" className="btn btn-secondary">
                View More
              </a>
            </p>
          </div>
          {donations.map(donation => {
            const donationProgress = (donation.amountDonated / donation.donationPrice) * 100;

            return (
              <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0" key={donation._id}>
                <div className="product-item">
                  <img
                    src={`http://localhost:4000${donation.donationimage}`}
                    className="img-fluid product-thumbnail"
                    alt={donation.donationName}
                    style={{ width: '290px', height: '200px', borderRadius: '10px 10px 3px 3px' }}
                  />
                  <h3 className="product-title">{donation.donationName}</h3>
                  <p>{donation.description}</p>
                  {donation.donationType === "non-monetary" ? (
                    <strong className="product-price">{donation.categoryId.categoryname}</strong>
                  ) : (
                    <>
                      <strong className="product-price">₹{donation.donationPrice}</strong>
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
                    </>
                  )}
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
          })}
        </div>
      </div>
    </div>
  );
}

export default DonationList;
