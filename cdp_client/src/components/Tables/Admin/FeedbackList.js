import React, { useEffect, useState } from "react";
import Sidebar from "../../common/Sidebar";
import Navbar from "../../common/Navbar";
import RecipientFeedbackList from "./RecipientFeedbackList";
import AgentFeedbackList from "./AgentFeedbackList";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin/feedbacks");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:4000/admin/deleteFeedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
    <Sidebar />
    <div className="content">
      <Navbar />
      
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
    <div className="col-12">
      <div className="rounded bg-secondary h-100 p-4">
        <h6 className="mb-2">User Feedback List</h6>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Sender Email</th>
                <th scope="col">Submitted At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback, index) => (
                  <tr key={feedback._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{feedback.title}</td>
                    <td>{feedback.description}</td>
                    <td>{feedback.email}</td>
                    <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                    <td>
                      <a href="#" onClick={() => deleteFeedback(feedback._id)}>
                        <i
                          class="fa fa-trash"
                          style={{ color: "grey" }}
                          aria-hidden="true"
                        ></i>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No feedbacks available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    <RecipientFeedbackList/>
    <AgentFeedbackList/>
    </div>
    </div>
  </>
  );
};

export default FeedbackList;
