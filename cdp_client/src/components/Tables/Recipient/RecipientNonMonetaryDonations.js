import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Navbar from "../../common/Navbar";

function RecipientNonMonetaryDonations() {
    const [nonmonetary, setNonMonetary] = useState([]);

    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const userId = userdata._id;

    useEffect(() => {
        if (userdata && userdata._id) {
            fetch(`http://localhost:4000/admin/ViewNonMonetaryDonations`)
                .then((res) => res.json())
                .then((result) => {
                    // Filter donations where recipientId matches the logged-in user
                    const userDonations = result.filter(donation => donation.donationId.recipientId === userId);
                    setNonMonetary(userDonations);
                })
                .catch((error) => {
                    console.error("Error fetching donation history:", error);
                });
        }
    }, [userId]);

    return (
        <>
            <Sidebar />
            <div className="content">
                <Navbar />
                <div className="container-fluid pt-4 px-4">
                    <div className="row g-4">
                        <div className="col-sm-12 col-xl-12">
                            <div className="bg-secondary rounded h-100 p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="mb-2">Non-Monetary Donations</h4>
                                </div>
                                <div className="site-blocks-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Donation Name</th>
                                                <th>Description</th>
                                                <th>Donation Type</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nonmonetary.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5">No donations made yet</td>
                                                </tr>
                                            ) : (
                                                nonmonetary.map((donations) => (
                                                    <tr key={donations._id}>
                                                        <td className="product-thumbnail">
                                                            <img
                                                                src={`http://localhost:4000${donations.donationId.donationimage}`} 
                                                                alt="Image"
                                                                className="img-fluid"
                                                            />
                                                        </td>
                                                        <td className="product-name">
                                                            <h2 className="h5 text-black">{donations.donationId.donationName}</h2>
                                                        </td>
                                                        <td>{donations.donationId.donationDescription}</td>
                                                        <td>{donations.donationId.donationType}</td>
                                                        <td>
                                                            <Link
                                                                // to="/ViewRecipientNonMonetaryDonationDetails"
                       
                                                                to="/ViewAdminNonMonetaryDonationDetails"
                                                                state={{ id: donations._id }}
                                                                className="btn btn-info ms-1"
                                                                style={{ padding: "5px 20px", color: "#eb1616 " }}
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RecipientNonMonetaryDonations;
