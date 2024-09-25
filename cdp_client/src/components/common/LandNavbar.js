import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function LandNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    if (userdata) {
      setUserId(userdata._id);
      setIsLoggedIn(true); // Set true if userdata exists, false otherwise
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('userdata');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <nav className="customer-navbar navbar navbar-expand-md navbar-dark sticky-top" aria-label="Furni navigation bar">
        <div className="container">
          <a className="navbar-brand" style={{fontFamily:"Donegal One"}} href="/">COMPASSION LINK</a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsFurni" aria-controls="navbarsFurni" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsFurni">
            <ul className="customer-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
              <li className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className={`nav-item ${currentPath === '/Donations' ? 'active' : ''}`}>
                <a className="nav-link" href="/Donations">Donations</a>
              </li>
              
              <li>
                <a className="nav-link" href="#ourmission">Our Mission</a>
              </li>
              {isLoggedIn && ( // Conditionally render My Donations link
              <>
                <li className={`nav-item ${currentPath === '/MyDonations' ? 'active' : ''}`}>
                  <a className="nav-link" href="/MyDonations">My Donations</a>
                </li>

                <li className={`nav-item ${currentPath === '/MyProfile' ? 'active' : ''}`}>
                  <Link to= "/MyProfile" className="nav-link"  state={ {userId: userId} } >My Profile</Link>
                </li>
                <li className={`nav-item ${currentPath === '/Chatbot' ? 'active' : ''}`}>
                  <Link to= "/Chatbot" className="nav-link"  state={ {userId: userId} } >Support</Link>
                </li>
              </>
                
              )}
            </ul>
            {isLoggedIn ? (
              <button className="btn btn-secondary" onClick={handleLogout}><b>Log Out</b></button>
            ) : (
              <a className="btn btn-secondary" href='/SignIn'><b>Log In</b></a>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default LandNavbar;
