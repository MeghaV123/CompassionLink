import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [usertype, setUsertype] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userdata = JSON.parse(localStorage.getItem('userdata'));

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('userdata'));  
    if (userdata && userdata._id) {
      setUsertype(userdata.authid.usertype);
      if (userdata.authid.usertype === 1) {
        setName(userdata.recipientname);
      } else if (userdata.authid.usertype === 2) {
        setName(userdata.agentname);
      } else {
        setName(`${userdata.firstname} ${userdata.lastname}`);
      }
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/notifications");
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const ids = unreadNotifications.map(n => n._id);

      if (ids.length > 0) {
        await fetch("http://localhost:4000/auth/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        });

        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top px-4 py-0 w-100">
      <a href="/" className="navbar-brand d-flex d-lg-none me-4">
        <h2 className="text-primary mb-0"><i className="fa fa-user-edit"></i></h2>
      </a>
      
      <div className="navbar-nav align-items-center ms-auto">
        <div className="nav-item dropdown">
          <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            <i className="fa fa-bell"></i>
            {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-secondary rounded-0 rounded-bottom m-0">
            <h6 className="dropdown-header">Notifications</h6>
            {notifications.length === 0 && <span className="dropdown-item">No notifications</span>}
            {notifications.map(notification => (
              <a href="#" key={notification._id} className={`dropdown-item ${notification.read ? '' : 'font-weight-bold'}`}>
                {notification.message}
              </a>
            ))}
            {notifications.length > 0 && (
              <button className="dropdown-item text-center" onClick={markNotificationsRead}>
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="nav-item dropdown">
          <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            <span className="d-none d-lg-inline-flex">{name}</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-secondary rounded-0 rounded-bottom m-0">
            {userdata.authid.usertype === 1 ? (
              <>
                <Link to="/profile" state={{ id: userdata._id }} className="dropdown-item">View Profile</Link>
                <a href="" className="dropdown-item" onClick={handleLogout}>Log Out</a>
              </>
            ) : (
              <a href="" className="dropdown-item" onClick={handleLogout}>Log Out</a>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </nav>
  );
}

export default Navbar;
