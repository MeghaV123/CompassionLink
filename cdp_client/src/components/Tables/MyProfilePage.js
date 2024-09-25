import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LandNavbar from '../common/LandNavbar';



function MyProfilePage() {
  // const { user } = useContext(UserContext);
  const userdata = JSON.parse(localStorage.getItem('userdata'));
  const location = useLocation();

  const [users, setUser] = useState();
  const userId = location.state.userId;
  
  useEffect(() => {
    fetch("http://localhost:4000/recipient/getUsers", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result);
      })
      .catch((error) => {
        console.error("Error fetching recipient:", error);
      });
  }, [userId]);
  
  // Assume UserContext provides the current user's data
  return (
    <>
    <LandNavbar />
    
    <div>
      <div className="container-fluid pt-4 px-2">
        <div className="row g-2">
          {users ? (
            <div className="col-md-6 offset-md-3">
              <div className="card">
                <div className="card-header">
                  <h2>Profile Information</h2>
                </div>
                <div className="card-body">
                  <p><strong>Name:</strong> {users.firstname+" "+users.lastname}</p>
                  <p><strong>Email:</strong> {users.authid.email}</p>
                  <p><strong>Contact:</strong> {users.contact}</p>
                  <p><strong>Address:</strong> {users.address}</p>
                  {/* Add more recipient details as needed */}
                  <Link
                  to = "/UserProfileUpdate"
                  state={{id:userId}}
                  className="btn btn-primary mt-3"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-6 offset-md-3">
              <div className="alert alert-info">Loading profile...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
}

export default MyProfilePage;
