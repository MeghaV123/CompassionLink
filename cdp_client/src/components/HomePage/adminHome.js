// Updated AdminHome.js
import React from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import UsersList from '../Tables/UsersList';
import DonorsList from '../Tables/RecipientList';
import DeliveryboyList from '../Tables/Admin/DeliveryboyList';
import CategoriesList from '../Tables/Admin/CategoriesList';
import RecipientList from '../Tables/RecipientList';
import DonationConfirmation from '../Tables/Admin/DonationConfirmation';
import Chart from '../Tables/Admin/Chart';

function AdminHome() {
  return (
    <>
      <Sidebar />
      <div className="content">
        <Navbar />
        
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            <RecipientList />
            <CategoriesList />
            {/* <Chart/> */}
            <DeliveryboyList />
            <DonationConfirmation/>
            <UsersList />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
