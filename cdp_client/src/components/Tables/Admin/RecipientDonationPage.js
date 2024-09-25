import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import AddDonation from '../../Forms/Admin/AddDonation';

function RecipientDonationPage() {
  const [donations, setDonations] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loggedInUserId, setLoggedInUserId] = useState(null); // Replace with actual user ID fetching logic

  useEffect(() => {
    // Fetch the logged-in user ID
    const fetchLoggedInUserId = () => {
      // Replace with actual logic to get logged-in user ID
      const userdata = JSON.parse(localStorage.getItem('userdata'));
      const userId = userdata._id;
      setLoggedInUserId(userId);
    };

    fetchLoggedInUserId();

    fetch("http://localhost:4000/recipient/viewRecipientDonations")
      .then((res) => res.json())
      .then((result) => {
        if (result && Array.isArray(result)) {
          // Filter donations based on logged-in user ID
          const filteredDonations = result.filter(donation => donation.recipientId === loggedInUserId);
          setDonations(filteredDonations);
        } else {
          console.error("Invalid response format:", result);
        }
      })
      .catch((error) => {
        console.error("Error fetching Donations:", error);
      });
  }, [refresh, loggedInUserId]);

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
          setDonations((prevDonations) => prevDonations.filter(donation => donation._id !== id));
        } else {
          toast.error("Failed to delete donation", {
            position: "top-right",
            autoClose: 1000,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting donation:", error);
        toast.error("An error occurred while deleting the donation", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  return (
    <>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <AddDonation />
          <div className="col-sm-12 col-xl-12">
            <div className="bg-secondary rounded h-100 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="mb-4">DONATIONS</h6>
              </div>
              {donations.length === 0 ? (
                <div className="text-center">
                  <p>No Donations available.</p>
                </div>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Donation Name</th>
                      <th scope="col">Donation Image</th>
                      <th scope="col">Donation Description</th>
                      <th scope="col">Donation Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{donation.donationName}</td>
                        <td>
                          <img
                            src={`http://localhost:4000${donation.donationimage}`}
                            alt={donation.donationName}
                            style={{ width: "150px", height: "150px" }}
                          />
                        </td>
                        <td style={{ maxWidth: "100px", textAlign: "center" }}>
                          {donation.donationDescription}
                        </td>
                        <td style={{ maxWidth: "100px", textAlign: "center" }}>
                          {donation.donationType === "non-monetary" ? (
                            <span>{donation.categoryId.categoryname}</span>
                          ) : (
                            <span><b>₹</b>{donation.donationPrice}</span>
                          )}
                        </td>
                        <td>
                          {donation.status === 0 ? <b style={{color:"black"}}>Pending</b> : donation.status === 1 ? <b style={{color:"green"}}>Approved</b> : <b style={{color:"red"}}>Rejected</b>}
                        </td>
                        <td>
                        <Link
                      to="/ViewRecipientDonationDetails"
                      state={{ id: donation._id }}
                      className="btn btn-secondary"
                      style={{ fontSize: "12px" }}
                    >
                      View Details
                    </Link>
                          <button
                            className="btn btn-danger ms-1"
                            style={{ padding: "5px 20px" }}
                            onClick={() => deleteDonation(donation._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default RecipientDonationPage;
