import React, { useEffect, useState } from "react";
import { Table } from 'react-bootstrap';
import { Link } from "react-router-dom";

function MyDonations() {
  const [myDonations, setMyDonations] = useState([]);
  const [nonmonetary, setNonMonetory] = useState([]);
  const [NonMonetaryDonations, setMyNonMonetaryDonations] = useState([]);
  const userdata = JSON.parse(localStorage.getItem('userdata'));
  const userId = userdata._id

  useEffect(() => {
    if (userdata && userdata._id) {
      fetch(`http://localhost:4000/admin/getDonationHistory`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId})
      })
        .then((res) => res.json())
        .then((result) => {
          setMyDonations(result);
        })
        .catch((error) => {
          console.error("Error fetching donation history:", error);
        });
    }
  }, []);


  useEffect(() => {
    if (userdata && userdata._id) {
      fetch(`http://localhost:4000/admin/getMyNonMonetaryDonations`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId})
      })
        .then((res) => res.json())
        .then((result) => {
          setMyNonMonetaryDonations(result);
        })
        .catch((error) => {
          console.error("Error fetching donation history:", error);
        });
    }
  }, []);

  // useEffect(() => {
  //   if (userdata && userdata._id) {
  //     fetch(`http://localhost:4000/admin/ViewNonMonetaryDonations`
  //       )
  //       .then((res) => res.json())
  //       .then((result) => {
  //         setNonMonetory(result);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching donation history:", error);
  //       });
  //   }
  // }, []);

  return (
    <>
      <div className="untree_co-section before-footer-section">
        <div className="container">
          <div className="row mb-5">
            <form className="col-md-12" method="post">
              <h4>Monetary Donations</h4>
              <div className="site-blocks-table ">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Donation Name</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDonations.length === 0 ? (
                      <tr>
                        <td colSpan="6">No donations made yet</td>
                      </tr>
                    ) : (
                      myDonations.map((donation) => (
                        <tr key={donation._id}>
                          <td className="product-thumbnail">
                            <img
                              src={`http://localhost:4000${donation.donationId.donationimage}`} // Adjust the path as needed
                              alt="Image"
                              className="img-fluid"
                            />
                          </td>
                          <td className="product-name">
                            <h2 className="h5 text-black">{donation.donationId.donationName}</h2>
                          </td>
                          <td>{donation.donationId.donationDescription}</td>
                          <td>₹{donation.amount.toFixed(2)}</td>
                          <td>{new Date(donation.paymentDate).toLocaleDateString()}</td>
                          <td>{donation.paymentStatus}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <hr/>
              <br></br>
              <h4>Non-Monetary Donations</h4>
              <div className="site-blocks-table ">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Donation Name</th>
                      <th>Description</th>
                      {/* <th>Amount</th> */}
                      <th>Donation Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NonMonetaryDonations.length === 0 ? (
                      <tr>
                        <td colSpan="6">No donations made yet</td>
                      </tr>
                    ) : (
                      NonMonetaryDonations.map((donations) => (
                        <tr key={donations._id}>
                          <td className="product-thumbnail">
                            <img
                              src={`http://localhost:4000${donations.donationId.donationimage}`} // Adjust the path as needed
                              alt="Image"
                              className="img-fluid"
                            />
                          </td>
                          <td className="product-name">
                            <h2 className="h5 text-black">{donations.donationId.donationName}</h2>
                          </td>
                          <td>{donations.donationId.donationDescription}</td>
                          {/* <td>₹{donations.amount.toFixed(2)}</td> */}
                          <td>{donations.donationId.donationType}</td>
                          <td> <Link
                        to="/ViewDonorDonationDetails"
                        state={{ id: donations._id }}
                        className="btn btn-info ms-1"
                        style={{ padding: "5px 20px" }}
                      >
                        View
                      </Link></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyDonations;
