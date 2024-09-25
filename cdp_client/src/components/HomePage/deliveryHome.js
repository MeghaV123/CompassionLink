import React from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import AddedDonationsList from "../Tables/Delivery_Agent/AddedDonationsList";
import AgentProfile from "../Tables/Delivery_Agent/AgentProfile";


function DeliveryHome() {
  return (
    <>
    <Sidebar />
    <div className="content">
      <Navbar />
      <div class="container-fluid pt-4 px-4">
        <div class="row g-4">
          <AddedDonationsList/>,
          
         
          {/* <VolunteerList /> */}
        </div>
      </div>
    </div>
  </>
  )
}

export default DeliveryHome;