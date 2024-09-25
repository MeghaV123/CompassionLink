import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../common/Sidebar'
import Navbar from '../../common/Navbar'

function AddRecipientFeedback() {
    const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [auth] = useState(JSON.parse(localStorage.getItem("userdata")));
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
      user_id: auth._id,
      email: auth.authid.email
    };

    fetch('http://localhost:4000/admin/addRecipientfeedback', {
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
    <ToastContainer />
     <Sidebar />
      <div className="content">
        <Navbar />
        
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
    <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="bg-secondary h-100 p-4 mb-3">
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
            </div>
            </div>
    </>
  )
}

export default AddRecipientFeedback