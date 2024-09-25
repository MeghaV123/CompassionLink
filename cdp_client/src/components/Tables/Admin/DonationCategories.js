import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Navbar from "../../common/Navbar";
import AddDonationCategory from "../../Forms/Admin/AddDonationCategory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DonationCategories() {
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/admin/viewCategories")
      .then((res) => res.json())
      .then((result) => {
        setCategories(result);
      })
      .catch((error) => {
        console.error("Error fetching Categories:", error);
      });
  }, [refresh]);

  const deleteCategory = (id) => {
    fetch("http://localhost:4000/admin/deleteCategories", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message) {
          toast.success(result.message, {
            position: "top-right",
            autoClose: 2000,
          });
        } else {
          toast.error("Failed to delete category", {
            position: "top-right",
            autoClose: 2000,
          });
        }
        setTimeout(() => {
          window.location.reload(); // Trigger a refresh
        }, 2000);

      })
      
      .catch((error) => {
        console.error("Error deleting category:", error);
        setTimeout(() => {
        toast.error("An error occurred while deleting the category", {
          position: "top-right",
            autoClose: 2000,
          });
        }, 2000);
        });
      
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            <AddDonationCategory />
            <div className="col-sm-12 col-xl-12">
              <div className="bg-secondary rounded h-100 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="mb-4">Categories</h6>
                </div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Category Name</th>
                      <th scope="col">Category Image</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Categories added.
                        </td>
                      </tr>
                    ) : (
                      categories.map((category, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{category.categoryname}</td>
                          <td>
                            <img
                              src={`http://localhost:4000${category.image}`}
                              alt={category.categoryname}
                              style={{ width: "50px", height: "50px" }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-danger ms-1"
                              style={{ padding: "5px 20px" }}
                              onClick={() => deleteCategory(category._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default DonationCategories;
