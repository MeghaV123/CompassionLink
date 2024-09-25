import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RecipientList() {
  const [recipient, setRecipient] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/admin/viewRecipient")
      .then((res) => res.json())
      .then((result) => {
        setRecipient(result);
      })
      .catch((error) => {
        console.error("Error fetching recipient:", error);
      });
  }, [refresh]);

  const deleteRecipient = (id) => {
    fetch("http://localhost:4000/admin/deleteRecipient", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        toast.success('Recipient deleted successfully', {
          position: "top-right",
          autoClose: 2000,
        });
        setRefresh((prev) => prev + 1); // Trigger a refresh
      })
      .catch((error) => {
        console.error("Error deleting recipient:", error);
        toast.error('Failed to delete recipient', {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="col-sm-12 col-xl-6">
      <div className="bg-secondary rounded h-100 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="mb-0">RECIPIENT LIST</h6>
          <Link className="btn btn-primary" to="/AddRecipient">
            ADD RECIPIENT
          </Link>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Contact</th>
              {/* <th scope="col">Location</th> */}
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipient.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No Recipients are registered.
                </td>
              </tr>
            ) : (
              recipient.map((recipient, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{recipient.recipientname}</td>
                  <td>{recipient.contact}</td>
                  <td>{recipient.authid.email}</td>
                  <td>
                    <Link to="/EditRecipient" state={{ id: recipient._id }}>
                      <button className="btn btn-success" style={{ padding: "5px 20px" }}>
                        Edit
                      </button>
                    </Link>
                    <button
                      className="btn btn-danger ms-1" style={{ padding: "5px 20px" }}
                      onClick={() => deleteRecipient(recipient._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RecipientList;
