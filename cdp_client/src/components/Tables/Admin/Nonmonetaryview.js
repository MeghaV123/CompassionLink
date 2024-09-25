import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import AddDonation from '../../Forms/Admin/AddDonation';
import Sidebar from "../../common/Sidebar";
import Navbar from "../../common/Navbar";

function Nonmonetaryview() {
  const [donations, setDonations] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [nonmonetary, setNonMonetory] = useState([]);
  const [NonMonetaryDonations, setMyNonMonetaryDonations] = useState([]);
  const userdata = JSON.parse(localStorage.getItem('userdata'));
  const userId = userdata._id

  useEffect(() => {
    fetch("http://localhost:4000/admin/viewDonations")
      .then((res) => res.json())
      .then((result) => {
        setDonations(result);
      })
      .catch((error) => {
        console.error("Error fetching Donations:", error);
      });
  }, [refresh]);

  useEffect(() => {
    if (userdata && userdata._id) {
      fetch(`http://localhost:4000/admin/ViewNonMonetaryDonations`
      )
        .then((res) => res.json())
        .then((result) => {
          setNonMonetory(result);
        })
        .catch((error) => {
          console.error("Error fetching donation history:", error);
        });
    }
  }, []);

  const deleteDonation = (id) => {
    fetch("http://localhost:4000/admin/deleteDonation", {
      method: "post",
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
        } else {
          toast.error("Failed to delete donation", {
            position: "top-right",
            autoClose: 1000,
          });
        }
        setTimeout(() => {
          setRefresh((prev) => prev + 1); // Trigger a refresh
        }, 2000);
      })
      .catch((error) => {
        console.error("Error deleting donation:", error);
        setTimeout(() => {
          toast.error("An error occurred while deleting the donation", {
            position: "top-right",
            autoClose: 2000,
          });
        }, 2000);
      });
  };

  return (
    <>
      <Sidebar />
      <div class="content">
        <Navbar />
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            
            
            <div className="col-sm-12 col-xl-12">
              <div className="bg-secondary rounded h-100 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-2">Non-Monetary Donations</h4>
                </div>
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
                      {nonmonetary.length === 0 ? (
                        <tr>
                          <td colSpan="6">No donations made yet</td>
                        </tr>
                      ) : (
                        nonmonetary.map((donations) => (
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
                              to="/ViewAdminNonMonetaryDonationDetails"
                              state={{ id: donations._id }}
                              className="btn btn-info ms-1"
                              style={{ padding: "5px 20px", color: "#eb1616 " }}
                            >
                              View
                            </Link></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Nonmonetaryview;
