import React, { useEffect, useState } from "react";

function AgentProfile() {
  const [agentDetails, setAgentDetails] = useState({
    agentname: "",
    contact: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));

    if (userdata && userdata._id) {
      const userId = userdata._id;
      console.log(userId);
      fetch(`http://localhost:4000/agent/getAgentProfile/${userId}`)
        .then((res) => res.json())
        .then((result) => {
          if (result && result.agent) {
            setAgentDetails(result.agent);
          }
        })
        .catch((error) => {
          console.error("Error fetching agent data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-sm-12 col-xl-6">
      <div className="bg-secondary rounded h-100 p-4">
        <h6 className="mb-4">My Profile</h6>
        <div className="testimonial-item text-center">
          <h5 className="mb-1">{agentDetails.agentname}</h5>
          <p>Contact: {agentDetails.contact}</p>
          <p className="mb-0">Address: {agentDetails.address}</p>
        </div>
      </div>
    </div>
  );
}

export default AgentProfile;
