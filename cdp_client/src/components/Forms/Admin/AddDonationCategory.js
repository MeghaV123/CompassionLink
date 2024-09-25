import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDonationCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!categoryName.trim()) {
      formErrors.categoryName = "Category Name is required";
    }
    if (!image) {
      formErrors.image = "Image is required";
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const saveCategory = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:4000/admin/AddCategory", {
        method: "post",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const result = await response.json();
      console.log(result);
      setMessage("Category added successfully.");
      setCategoryName("");
      setImage(null);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("Failed to add category. Please try again.");
    }
  };

  return (
    <>
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="bg-secondary rounded p-3 p-sm-5 my-4 mx-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <h3>ADD CATEGORY</h3>
          </div>
          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}
          <form onSubmit={saveCategory}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="categoryNameInput"
                placeholder="Category Name"
                name="categoryName"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
              />
              <label htmlFor="categoryNameInput">Category Name</label>
              {errors.categoryName && (
                <small className="text-danger">{errors.categoryName}</small>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                type="file"
                className="form-control"
                id="categoryImageInput"
                name="image" // Must match the multer single argument
                onChange={(event) => {setImage(event.target.files[0]);
                  
                }}
              />
              {errors.image && (
                <small className="text-danger">{errors.image}</small>
              )}
            </div>
            <button type="submit" className="btn btn-primary py-3 w-100 mb-4">
              <strong>CREATE</strong>
              <i className="fa fa-plus"></i>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddDonationCategory;
