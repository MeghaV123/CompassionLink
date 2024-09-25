import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DonationConfirmation() {
  const [donations, setDonations] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/admin/viewDonations")
      .then((res) => res.json())
      .then((result) => {
        const filteredDonations = result.filter(
          (donation) => donation.status === 0
        );
        setDonations(filteredDonations);
      })
      .catch((error) => {
        console.error("Error fetching Donations:", error);
      });
  }, [refresh]);

  const handleApproval = (id, status) => {
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
          setRefresh(refresh + 1);
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
      <div className="col-sm-12 col-xl-12">
        <div className="bg-secondary rounded h-100 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="mb-4">DONATION CONFIRMATION</h6>
          </div>
          {donations.length === 0 ? (
            <div className="text-center">
              <p>No Donations Pending for Approval</p>
            </div>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Donation Name</th>
                  <th scope="col">Donation Image</th>
                  <th scope="col">Donation Description</th>
                  <th scope="col">Donation</th>
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
                    {donation.donationType === "non-monetary" ? (
                      <td style={{ maxWidth: "100px", textAlign: "center" }}>
                        <b>{donation.categoryId.categoryname}</b>
                      </td>
                    ) : (
                      <td style={{ maxWidth: "100px", textAlign: "center" }}>
                        <b>₹</b>
                        {donation.donationPrice}
                      </td>
                    )}

                    <td>
                      <Link
                        to="/ViewApprovalDonation"
                        state={{ id: donation._id }}
                        className="btn btn-warning ms-1"
                        style={{ padding: "5px 20px" }}
                      >
                        View
                      </Link>

                      <button
                        className="btn btn-success ms-1"
                        style={{ padding: "5px 20px" }}
                        onClick={() => handleApproval(donation._id, 1)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger ms-1"
                        style={{ padding: "5px 20px" }}
                        onClick={() => handleApproval(donation._id, 2)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default DonationConfirmation;
