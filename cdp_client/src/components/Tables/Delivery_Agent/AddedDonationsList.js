import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AddedDonationsList() {
  const [donations, setDonations] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/admin/ViewNonMonetaryDonations")
      .then((res) => res.json())
      .then((result) => {
        setDonations(result);
      })
      .catch((error) => {
        console.error("Error fetching Donations:", error);
      });
  }, [refresh]);

  return (
    <div className="col-sm-12 col-xl-12">
      <div className="bg-secondary rounded h-100 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="mb-4">Non-Monetary Donations</h6>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Donation Name</th>
              <th scope="col">Donation Image</th>
              <th scope="col">Donation Description</th>
              <th scope="col">Donation Type</th>
              <th scope="col">Accepted Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No Non-Monetary Donations added.
                </td>
              </tr>
            ) : (
              donations.map((donation, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{donation.donationId.donationName}</td>
                  <td>
                    <img
                      src={`http://localhost:4000${donation.donationId.donationimage}`}
                      alt={donation.donationId.donationName}
                      style={{ width: "150px", height: "150px" }}
                    />
                  </td>
                  <td style={{ maxWidth: "100px", textAlign: "justify" }}>
                    {donation.donationId.donationDescription}
                  </td>
                  <td>{donation.donationId.donationType}</td>
                  <td>
                    {donation.AgentStatus === 1 ? (
                      <span className="badge bg-success">Accepted</span>
                    ) : (
                      <span className="badge bg-warning">Not Accepted</span>
                    )}
                  </td>
                  <td>
                    <Link
                      to="/ViewAgentDonationDetails"
                      state={{ id: donation._id }}
                      className="btn btn-warning ms-1"
                      style={{ padding: "5px 20px" }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddedDonationsList;
