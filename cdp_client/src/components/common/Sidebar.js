import React, { useEffect, useState } from "react";
import { NavLink,useNavigate, Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function Sidebar() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [usertype, setUsertype] = useState(null);
const[userId,setUserId] = useState();
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    setUserId(userdata._id);
    if (userdata && userdata._id) {
      setUsertype(userdata.authid.usertype);
      if (userdata.authid.usertype === 1) {
        setName(userdata.recipientname); // Set the statename for state user
      } else if (userdata.authid.usertype === 2) {
        setName(userdata.agentname);
      } else {
        setName(`${userdata.firstname} ${userdata.lastname}`); // Set the fullname for other users
      }
    }
  }, []);

  const getUsertypeLabel = () => {
    switch (usertype) {
      case 0:
        return "Admin";
      case 1:
        return "Recipient";
      case 2:
        return "Delivery Personnel";
      case 3:
        return "User";
      default:
        return "";
    }
  };

  const getUsertypeIcon = (usertype) => {
    switch (usertype) {
      case 0:
        return "fa-user-secret"; // Admin icon
      case 1:
        return "fa-users"; // Recipient icon
      case 2:
        return "fa-truck"; // Agent icon
      case 3:
        return "fa-user"; // User icon
      default:
        return "fa-user"; // Default icon
    }
  };

  const getDashboardLink = () => {
    switch (usertype) {
      case 0:
        return "/AdminHome";
      case 1:
        return "/RecipientHome";
      case 2:
        return "/DeliveryHome";
      case 3:
        return "/UserHome";
      default:
        return "/";
    }
  };


  const handleLogout = () => {
    toast.success('Logged out successfully!', {
      position: "top-right",
      autoClose: 1000,
    });
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="sidebar pe-4 pb-3">
      <nav className="navbar bg-secondary navbar-dark">
        <a href="index.html" className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary">CDP</h3>
        </a>
        <div className="d-flex align-items-center ms-4 mb-4">
          <i className={`fa ${getUsertypeIcon(usertype)} fa-2x me-2`}></i>
          <div className="ms-3">
            <h6 className="mb-0">{name}</h6>
            <span>{getUsertypeLabel()}</span>
          </div>
        </div>
        <div className="navbar-nav w-100">
          {usertype === 0 && ( //admin
            <>
              <NavLink
                exact
                to={getDashboardLink()}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-tachometer-alt me-2"></i>Dashboard
              </NavLink>

              <NavLink
                exact
                to="/DonationCategories"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-th-list me-2"></i>Add category
              </NavLink>
              <NavLink
                exact
                to="/Donation"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-credit-card me-2"></i>Donations
              </NavLink>

              {/* <NavLink
                exact
                to="/Nonmonetaryview"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-credit-card me-2"></i>Non-monetary
              </NavLink> */}

              <NavLink
                exact
                to="/Agents"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-truck me-2"></i>Agents
              </NavLink>


              <NavLink
                exact
                to="/AddRecipient"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-user-plus me-2"></i>Add Recipient
              </NavLink>
              {/* <NavLink
                exact
                to="/DonationCategories"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-list-alt me-2"></i>Add Category
              </NavLink> */}
              <NavLink
                exact
                to="/Adminfeedbacks"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-comments me-2"></i>Feedbacks
              </NavLink>
              <NavLink
                to="/"
                onClick={handleLogout}
                state = {{id:userId}}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-power-off me-2"></i>Log Out
              </NavLink>
            </>
          )}
          {usertype === 1 && (  //Recipient
            <>
              <NavLink
                exact
                to={getDashboardLink()}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-tachometer-alt me-2"></i>Dashboard
              </NavLink>
             
              <NavLink
                
                to = "/profile"
                state = {{id:userId}}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-user me-2"></i>View Profile
              </NavLink>
              <NavLink
                
                to = "/recipientdonations"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-credit-card me-2"></i>Donations
              </NavLink>
              {/* <NavLink
                
                to = "/RecipientNonMonetaryDonations"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-credit-card me-2"></i>Non-Monetary
              </NavLink> */}
               <NavLink
                exact
                to="/Recipientfeedbacks"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-comment me-2"></i>Add Feedback
              </NavLink>
              <NavLink
                to="/"
                onClick={handleLogout}
                state = {{id:userId}}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-power-off me-2"></i>Log Out
              </NavLink>
             
              
            </>
          )}
          {usertype === 2 && (   //Delivery Agent

            <>
               <NavLink
                exact
                to={getDashboardLink()}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-tachometer-alt me-2"></i>Dashboard
              </NavLink>
              <NavLink
                exact
                to="/Agentfeedbacks"
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-comment me-2"></i>Add Feedback
              </NavLink>


              <NavLink
                to="/"
                onClick={handleLogout}
                state = {{id:userId}}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-power-off me-2"></i>Log Out
              </NavLink>

              
            </>
          )}
          {usertype === 3 && (  //Donor
            <>
              <NavLink
                exact
                to={getDashboardLink()}
                className="nav-item nav-link"
                activeClassName="active"
              >
                <i className="fa fa-tachometer-alt me-2"></i>Home Page
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
