import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function LandFooter() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const auth = useState(JSON.parse(localStorage.getItem("userdata")));
  console.log(auth);
  
  const submitFeedback = () => {
    
    const userdata = JSON.parse(localStorage.getItem('userdata'));

    if (!userdata || !userdata._id) {
      navigate('/SignIn');
      return;
    }


    let params = {
      title: title,
      description: description,
      user_id: userdata._id,
      email: userdata.authid.email
    };

    fetch('http://localhost:4000/admin/addfeedback', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message) {
          toast.success('Feedback submitted successfully!');
          setTimeout(() => {
            window.location.reload()
          }, 1000);
          
        } else {
          toast.error('Failed to submit feedback.');
        }
      })
      .catch((error) => {
        toast.error('An error occurred. Please try again.');
      });
  };

  return (
    <>
      <footer className="footer-sections">
        <div className="container relative">
          <div className="row g-5 mb-5">
            <div className="col-lg-4">
              <div className="mb-4 footer-logo-wrap">
                <a href="#" className="footer-logo">Compassion Link: Donation Platform</a>
              </div>
              <p className="mb-4" style={{textAlign:'justify'}}>
                Welcome to our Compassion Link Donation Platform. At Compassion Link, we believe in spreading compassion and making a positive impact on the world. Our mission is driven by a passion for uplifting communities and providing aid to those in need. Through the generosity of donors like you, we can continue our efforts to create lasting change.
              </p>
            </div>
            <div className="col-lg-8">
              <div className="h-100 p-4 mb-3" style={{backgroundColor:"rgb(255, 227, 225)", borderRadius:"20px"}}>
                <h2 className="mb-5">Add Feedback / Complaint</h2>
                <div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Subject</label>
                    <input
                      type="text"
                      id="title"
                      name='title'
                      className="form-control"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      id="description"
                      name='description'
                      className="form-control"
                      rows="4"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <button type="button" onClick={submitFeedback} className="btn btn-success w-100">Submit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
              <h5>Follow Us</h5>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a href="https://facebook.com" className="text-decoration-none">
                    <i className="fab fa-facebook-f"></i> Facebook
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="https://twitter.com" className="text-decoration-none">
                    <i className="fab fa-twitter"></i> Twitter
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="https://instagram.com" className="text-decoration-none">
                    <i className="fab fa-instagram"></i> Instagram
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="https://linkedin.com" className="text-decoration-none">
                    <i className="fab fa-linkedin"></i> LinkedIn
                  </a>
                </li>
              </ul>
            </div>


          <div className="border-top copyright">
            <div className="row pt-4">
              <div className="col-lg-6">
                <p className="mb-2 text-center text-lg-start">
                  Copyright &copy;<script>document.write(new Date().getFullYear());</script>. All Rights Reserved. &mdash; Designed and Distributed with love by <a href="https://logipromptproacademy.com" style={{color:"#FF9494"}}>Logiprompt Pro Academy</a>  
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </>
  );
}

export default LandFooter;
