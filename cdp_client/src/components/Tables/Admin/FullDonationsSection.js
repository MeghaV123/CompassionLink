import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandNavbar from '../common/LandNavbar';
import LandFooter from '../common/LandFooter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FullDonationsSection() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  function handleDonateClick(donationId, donationBalance, e) {
    e.preventDefault(); // Prevent default button click behavior
    const userdata = JSON.parse(localStorage.getItem('userdata'));

    if (!userdata || !userdata._id) {
      navigate('/SignIn');
      return;
    }

    const customAmount = prompt('Enter the amount you want to donate:');
    const donationAmount = parseFloat(customAmount);

    if (isNaN(donationAmount) || donationAmount <= 0 || donationAmount > donationBalance) {
      alert('Please enter a valid amount within the available balance.');
      return;
    }

    const options = {
      key: 'rzp_test_4Ex6Tyjkp79GFy',
      amount: donationAmount * 100,
      currency: 'INR',
      name: 'Your Organization Name',
      description: 'Donation Transaction',
      handler: function (response) {
        fetch('http://localhost:4000/admin/makeDonation', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ donationId, amount: donationAmount }),
        })
          .then(res => res.json())
          .then(data => {
            toast.success(data.message);
            setTimeout(() => {
              window.location.reload(); // Reload the page to see updated donation progress
            }, 2000);
          })
          .catch(error => {
            console.error('Error updating donation:', error);
            toast.error('Error updating donation');
          });
      },
      prefill: {
        name: userdata.name,
        email: userdata.email,
        contact: userdata.contact,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  useEffect(() => {
    fetch('http://localhost:4000/admin/ViewDonations')
      .then(response => response.json())
      .then(data => setDonations(data)) // Limit to first 3 donations
      .catch(error => console.error('Error fetching donations:', error));
  }, []);

  return (
    <>
      <LandNavbar />
      <div className="product-section" style={{ boxShadow: 'initial 50px black' }}>
        <div className="container">
          <div className="row">
            {donations.map(donation => (
              <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0" key={donation._id}>
                <div className="product-item">
                  <img
                    src={`http://localhost:4000${donation.donationimage}`}
                    className="img-fluid product-thumbnail"
                    alt={donation.donationName}
                    style={{ width: '290px', height: '200px', borderRadius: '10px 10px 3px 3px' }}
                  />
                  <h3 className="product-title">{donation.donationName}</h3>
                  <p>{donation.donationDescription}</p>
                  <strong className="product-price">₹{donation.donationPrice.toFixed(2)}</strong>
                  <p>Amount Donated: ₹{donation.amountDonated.toFixed(2)}</p>
                  <p>Remaining Balance: ₹{donation.balance.toFixed(2)}</p>
                  <button
                    onClick={(e) => handleDonateClick(donation._id, donation.balance, e)}
                    className="btn btn-secondary"
                  >
                    Donate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <LandFooter />
      <ToastContainer />
    </>
  );
}

export default FullDonationsSection;
