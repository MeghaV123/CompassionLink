import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CategoriesList() {
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

  const deleteCategories = (id) => {
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
        console.log(result);
        setRefresh((prev) => prev + 1); // Trigger a refresh
      })
      .catch((error) => {
        console.error("Error deleting state:", error);
      });
  };

  return (
    <div className="col-sm-12 col-xl-6">
      <div className="bg-secondary rounded h-100 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="mb-4">Categories</h6>
          <Link className="btn btn-primary" to="/DonationCategories">
            ADD CATEGORY
          </Link>
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
                      onClick={() => deleteCategories(category._id)}
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
  );
}

export default CategoriesList;
