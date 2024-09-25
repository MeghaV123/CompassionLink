import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from '../../common/Sidebar'
import Navbar from '../../common/Navbar'
import AddAgent from "../../Forms/Admin/AddAgent";



function Agents() {
  const [agent, setAgent] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/admin/viewAgent")
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "aserdtfgh");
        setAgent(result);
      })
      .catch((error) => {
        console.error("Error fetching agent:", error);
      });
  }, [refresh]);

  const deleteAgent = (id) => {
    fetch("http://localhost:4000/admin/deleteAgent", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setRefresh((prev) => prev + 1); // Trigger a refresh
      })
      .catch((error) => {
        console.error("Error deleting state:", error);
      });
  };
  return (
    <>
      <Sidebar />
      <div class="content">
        <Navbar />
        <div class="container-fluid pt-4 px-4">
          <div class="row g-4">
            <AddAgent/>
            <div className="col-sm-12 col-xl-12">
              <div className="bg-secondary rounded h-100 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="mb-4">DELIVERY AGENTS</h6>
                </div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Agent Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Address</th>
                      <th scope="col">Contact</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agent.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Delivery Agents are registered.
                        </td>
                      </tr>
                    ) : (
                      agent.map((agent, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{agent.agentname}</td>
                          <td>{agent.authid.email}</td>
                          <td>{agent.address}</td>
                          <td>{agent.contact}</td>
                          <td>
                            <Link to="/EditAgent" state={{ id: agent._id }}>
                              <button className="btn btn-success" style={{ padding: "5px 20px" }}>
                                Edit
                              </button>
                            </Link>
                            <button
                              className="btn btn-danger ms-1" style={{ padding: "5px 20px" }}
                              onClick={() => deleteAgent(agent._id)}
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Agents