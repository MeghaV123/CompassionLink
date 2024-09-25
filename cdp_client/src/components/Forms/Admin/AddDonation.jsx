import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddDonation() {
  const [donationName, setDonationName] = useState("");
  const [donationDescription, setDonationDescription] = useState("");
  const [donationPrice, setDonationAmount] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [donationType, setDonationType] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [incomeCertificate, setIncomeCertificate] = useState(null);
  const [medicalCertificate, setMedicalCertificate] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountOwnerName: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState({});
  const categoryId = selectedCategory;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin/viewcategories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    let formErrors = {};
    const aadharPattern = /^\d{12}$/;
    const accountNumberPattern = /^\d{16}$/;
    const ifscPattern =   /^[A-Za-z0-9]{11}$/;

    // const ifscPattern = /^\d{11}$/;

    if (!donationName.trim()) {
      formErrors.donationName = "Donation Name is required";
    }
    if (!donationDescription.trim()) {
      formErrors.donationDescription = "Description is required";
    }
    if (donationType === "monetary" && (!donationPrice.trim() || isNaN(donationPrice) || parseFloat(donationPrice) <= 0)) {
      formErrors.donationPrice = "Donation Amount must be a valid positive number";
    }
    if (!selectedCategory) {
      formErrors.selectedCategory = "Category is required";
    }
    if (!image) {
      formErrors.image = "Image is required";
    }
    if (!aadharNumber.trim() || !aadharPattern.test(aadharNumber)) {
      formErrors.aadharNumber = "Aadhar Number is required and must be a 12-digit number";
    }
    // if (!incomeCertificate) {
    //   formErrors.incomeCertificate = "Income Certificate is required";
    // }
    // if (!medicalCertificate) {
    //   formErrors.medicalCertificate = "Medical Certificate is required";
    // }
    if (!bankDetails.accountOwnerName.trim()) {
      formErrors.accountOwnerName = "Account Owner Name is required";
    }
    if (!bankDetails.bankName.trim()) {
      formErrors.bankName = "Bank Name is required";
    }
    if (!bankDetails.ifscCode.trim() || !ifscPattern.test(bankDetails.ifscCode)) {
      formErrors.ifscCode = "IFSC code must be 11 characters long and contain only letters and numbers";
    }
    if (!bankDetails.accountNumber.trim() || !accountNumberPattern.test(bankDetails.accountNumber)) {
      formErrors.accountNumber = "Account Number is required and must be a 16-digit number";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAadharChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D/g, "").slice(0, 12); // Remove non-digits and limit to 12 characters
    setAadharNumber(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (incomeCertificate && incomeCertificate.type !== "application/pdf") {
      toast.error("Income Certificate must be a PDF file.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (medicalCertificate && medicalCertificate.type !== "application/pdf") {
      toast.error("Medical Certificate must be a PDF file.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const recipientId = JSON.parse(localStorage.getItem("userdata"))._id;

    const formData = new FormData();
    formData.append("donationName", donationName);
    formData.append("donationDescription", donationDescription);
    formData.append("donationPrice", donationPrice);
    formData.append("donationimage", image);
    formData.append("recipientId", recipientId);
    formData.append("categoryId", categoryId);
    formData.append("donationType", donationType);
    formData.append("aadharNumber", aadharNumber);
    formData.append("incomeCertificate", incomeCertificate);
    formData.append("medicalCertificate", medicalCertificate);
    formData.append("accountOwnerName", bankDetails.accountOwnerName);
    formData.append("bankName", bankDetails.bankName);
    formData.append("ifscCode", bankDetails.ifscCode);
    formData.append("accountNumber", bankDetails.accountNumber);
    formData.append("status", JSON.stringify({ status: 0 }));

    try {
      const response = await fetch("http://localhost:4000/admin/AddDonation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add donation");
      }

      const result = await response.json();
      toast.success(result.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => { 
        window.location.reload();
      }, 1000);

      // Clear form fields after successful submission
      setDonationName("");
      setDonationDescription("");
      setDonationAmount("");
      setImage(null);
      setSelectedCategory("");
      setDonationType("");
      setAadharNumber("");
      setIncomeCertificate(null);
      setMedicalCertificate(null);
      setBankDetails({
        accountOwnerName: "",
        bankName: "",
        ifscCode: "",
        accountNumber: "",
      });
      setTimeout(() => {
        window.location.reload(); // Replace with actual route if needed
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add donation. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="bg-secondary rounded p-4 p-sm-5 my-4 mx-3">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <h3>Add Donation</h3>
          </div>
          <form onSubmit={handleSubmit}>

            <h4>Donation Request Details</h4>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="donationNameInput"
                placeholder="Donation Name"
                name="donationName"
                value={donationName}
                onChange={(event) => setDonationName(event.target.value)}
              />
              <label htmlFor="donationNameInput">Donation Name</label>
              {errors.donationName && <small className="text-danger">{errors.donationName}</small>}
            </div>
            <div className="form-floating mb-3">
              <textarea
                style={{ height: "100px" }}
                className="form-control"
                id="donationDescriptionInput"
                placeholder="Donation Description"
                name="donationDescription"
                value={donationDescription}
                onChange={(event) => setDonationDescription(event.target.value)}
              />
              <label htmlFor="donationDescriptionInput">Donation Description</label>
              {errors.donationDescription && <small className="text-danger">{errors.donationDescription}</small>}
            </div>
            <div className="form-floating mb-3">
              <select
                className="form-control"
                id="donationTypeSelect"
                value={donationType}
                onChange={(event) => setDonationType(event.target.value)}
              >
                <option value="">Select Donation Type</option>
                <option value="monetary">Monetary</option>
                <option value="non-monetary">Non-Monetary</option>
              </select>
              {errors.donationType && <small className="text-danger">{errors.donationType}</small>}
            </div>
            {donationType === "monetary" && (
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="donationPriceInput"
                  placeholder="Donation Price"
                  name="donationPrice"
                  value={donationPrice}
                  onChange={(event) => setDonationAmount(event.target.value)}
                />
                <label htmlFor="donationPriceInput">Donation Price</label>
                {errors.donationPrice && <small className="text-danger">{errors.donationPrice}</small>}
              </div>
            )}
            <div className="form-floating mb-3">
               <select
                 className="form-control"
                 id="categorySelect"
                 value={selectedCategory}
                 onChange={(event) => setSelectedCategory(event.target.value)}
               >
                 <option value="">Select Category</option>
                 {categories.map((category) => (
                   <option key={category._id} value={category._id}>
                     {category.categoryname}
                   </option>
                 ))}
               </select>
               {errors.selectedCategory && <small className="text-danger">{errors.selectedCategory}</small>}
             </div>
            {/* <div className="form-floating mb-3">
              <select
                className="form-control"
                id="categorySelect"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option style={{color:"black"}} key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.selectedCategory && <small className="text-danger">{errors.selectedCategory}</small>}
            </div> */}
            <div className="mb-3">
              <label htmlFor="imageUpload">Upload Image:</label>
              <input
                type="file"
                className="form-control-file"
                id="imageUpload"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {errors.image && <small className="text-danger">{errors.image}</small>}
            </div>


<hr/>
            <h4>Recipient Details</h4>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="aadharInput"
                placeholder="Aadhar Number"
                name="aadharNumber"
                value={aadharNumber}
                onChange={handleAadharChange}
              />
              <label htmlFor="aadharInput">Aadhar Number</label>
              {errors.aadharNumber && <small className="text-danger">{errors.aadharNumber}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="incomeCertificateUpload">Upload Income Certificate:</label>
              <input
                type="file"
                className="form-control-file"
                id="incomeCertificateUpload"
                onChange={(e) => setIncomeCertificate(e.target.files[0])}
              />
              {errors.incomeCertificate && <small className="text-danger">{errors.incomeCertificate}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="medicalCertificateUpload">Upload Medical Certificate:</label>
              <input
                type="file"
                className="form-control-file"
                id="medicalCertificateUpload"
                onChange={(e) => setMedicalCertificate(e.target.files[0])}
              />
              {errors.medicalCertificate && <small className="text-danger">{errors.medicalCertificate}</small>}
            </div>
            <hr/>
            <h4>Bank Details</h4>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="accountOwnerNameInput"
                placeholder="Account Owner Name"
                name="accountOwnerName"
                value={bankDetails.accountOwnerName}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, accountOwnerName: e.target.value })
                }
              />
              <label htmlFor="accountOwnerNameInput">Account Owner Name</label>
              {errors.accountOwnerName && <small className="text-danger">{errors.accountOwnerName}</small>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="bankNameInput"
                placeholder="Bank Name"
                name="bankName"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              />
              <label htmlFor="bankNameInput">Bank Name</label>
              {errors.bankName && <small className="text-danger">{errors.bankName}</small>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="ifscCodeInput"
                placeholder="IFSC Code"
                name="ifscCode"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
              />
              <label htmlFor="ifscCodeInput">IFSC Code</label>
              {errors.ifscCode && <small className="text-danger">{errors.ifscCode}</small>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="accountNumberInput"
                placeholder="Account Number"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                }
              />
              <label htmlFor="accountNumberInput">Account Number</label>
              {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
            </div>

            <button type="submit" className="btn btn-primary py-3 w-100 mb-4">
              Submit
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default AddDonation;















// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function AddDonation() {
//   const [donationName, setDonationName] = useState("");
//   const [donationDescription, setDonationDescription] = useState("");
//   const [donationPrice, setDonationAmount] = useState("");
//   const [image, setImage] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [donationType, setDonationType] = useState("");
//   const [aadharNumber, setAadharNumber] = useState("");
//   const [incomeCertificate, setIncomeCertificate] = useState(null);
//   const [medicalCertificate, setMedicalCertificate] = useState(null);
//   const [bankDetails, setBankDetails] = useState({
//     accountOwnerName: "",
//     bankName: "",
//     ifscCode: "",
//     accountNumber: "",
//   });
//   const [errors, setErrors] = useState({});
//   const categoryId = selectedCategory;

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/admin/viewcategories");
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const validateForm = () => {
//     let formErrors = {};
//     const aadharPattern = /^\d{12}$/;

//     if (!donationName.trim()) {
//       formErrors.donationName = "Donation Name is required";
//     }
//     if (!donationDescription.trim()) {
//       formErrors.donationDescription = "Description is required";
//     }
//     if (donationType === "monetary" && (!donationPrice.trim() || isNaN(donationPrice) || parseFloat(donationPrice) <= 0)) {
//       formErrors.donationPrice = "Donation Amount must be a valid positive number";
//     }
//     if (!selectedCategory) {
//       formErrors.selectedCategory = "Category is required";
//     }
//     if (!image) {
//       formErrors.image = "Image is required";
//     }
//     if (!aadharNumber.trim() || !aadharPattern.test(aadharNumber)) {
//       formErrors.aadharNumber = "Aadhar Number is required and must be a 12-digit number";
//     }
//     if (!incomeCertificate) {
//       formErrors.incomeCertificate = "Income Certificate is required";
//     }
//     if (!medicalCertificate) {
//       formErrors.medicalCertificate = "Medical Certificate is required";
//     }
//     if (!bankDetails.accountOwnerName.trim() || !bankDetails.bankName.trim() || !bankDetails.ifscCode.trim() || !bankDetails.accountNumber.trim()) {
//       formErrors.bankDetails = "All bank details are required";
//     }
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleAadharChange = (e) => {
//     const { value } = e.target;
//     const formattedValue = value.replace(/\D/g, "").slice(0, 12); // Remove non-digits and limit to 12 characters
//     setAadharNumber(formattedValue);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;
//     if (incomeCertificate && incomeCertificate.type !== "application/pdf") {
//       toast.error("Income Certificate must be a PDF file.", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//       return;
//     }
//     if (medicalCertificate && medicalCertificate.type !== "application/pdf") {
//       toast.error("Medical Certificate must be a PDF file.", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//       return;
//     }

//     const recipientId = JSON.parse(localStorage.getItem("userdata"))._id;

//     const formData = new FormData();
//     formData.append("donationName", donationName);
//     formData.append("donationDescription", donationDescription);
//     formData.append("donationPrice", donationPrice);
//     formData.append("donationimage", image);
//     formData.append("recipientId", recipientId);
//     formData.append("categoryId", categoryId);
//     formData.append("donationType", donationType);
//     formData.append("aadharNumber", aadharNumber);
//     formData.append("incomeCertificate", incomeCertificate);
//     formData.append("medicalCertificate", medicalCertificate);
//     formData.append("accountOwnerName", bankDetails.accountOwnerName);
//     formData.append("bankName", bankDetails.bankName);
//     formData.append("ifscCode", bankDetails.ifscCode);
//     formData.append("accountNumber", bankDetails.accountNumber);
//     formData.append("status", JSON.stringify({ status: 0 }));

//     try {
//       const response = await fetch("http://localhost:4000/admin/AddDonation", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add donation");
//       }

//       const result = await response.json();
//       toast.success(result.message, {
//         position: "top-right",
//         autoClose: 2000,
//       });

//       // Clear form fields after successful submission
//       setDonationName("");
//       setDonationDescription("");
//       setDonationAmount("");
//       setImage(null);
//       setSelectedCategory("");
//       setDonationType("");
//       setAadharNumber("");
//       setIncomeCertificate(null);
//       setMedicalCertificate(null);
//       setBankDetails({
//         accountOwnerName: "",
//         bankName: "",
//         ifscCode: "",
//         accountNumber: "",
//       });
//       setTimeout(() => {
//         window.location.reload(); // Replace with actual route if needed
//       }, 2000);
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to add donation. Please try again.", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   return (
//     <>
//       <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="bg-secondary rounded p-4 p-sm-5 my-4 mx-3">
//           <div className="d-flex align-items-center justify-content-center mb-3">
//             <h3>Add Donation</h3>
//           </div>
//           <form onSubmit={handleSubmit}>

//             <h4>Donation Request Details</h4>
//             <div className="form-floating mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 id="donationNameInput"
//                 placeholder="Donation Name"
//                 name="donationName"
//                 value={donationName}
//                 onChange={(event) => setDonationName(event.target.value)}
//               />
//               <label htmlFor="donationNameInput">Donation Name</label>
//               {errors.donationName && <small className="text-danger">{errors.donationName}</small>}
//             </div>
//             <div className="form-floating mb-3">
//               <textarea
//                 style={{ height: "100px" }}
//                 className="form-control"
//                 id="donationDescriptionInput"
//                 placeholder="Donation Description"
//                 name="donationDescription"
//                 value={donationDescription}
//                 onChange={(event) => setDonationDescription(event.target.value)}
//               />
//               <label htmlFor="donationDescriptionInput">Donation Description</label>
//               {errors.donationDescription && <small className="text-danger">{errors.donationDescription}</small>}
//             </div>
//             <div className="form-floating mb-3">
//               <select
//                 className="form-control"
//                 id="donationTypeSelect"
//                 value={donationType}
//                 onChange={(event) => setDonationType(event.target.value)}
//               >
//                 <option value="">Select Donation Type</option>
//                 <option value="monetary">Monetary</option>
//                 <option value="non-monetary">Non-Monetary</option>
//               </select>
//               {errors.donationType && <small className="text-danger">{errors.donationType}</small>}
//             </div>
//             {donationType === "monetary" && (
//               <div className="form-floating mb-3">
//                 <input
//                   type="number"
//                   className="form-control"
//                   id="donationPriceInput"
//                   placeholder="Donation Price"
//                   name="donationPrice"
//                   value={donationPrice}
//                   onChange={(event) => setDonationAmount(event.target.value)}
//                 />
//                 <label htmlFor="donationPriceInput">Donation Price</label>
//                 {errors.donationPrice && <small className="text-danger">{errors.donationPrice}</small>}
//               </div>
//             )}
//             <div className="form-floating mb-3">
//               <select
//                 className="form-control"
//                 id="categorySelect"
//                 value={selectedCategory}
//                 onChange={(event) => setSelectedCategory(event.target.value)}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.categoryname}
//                   </option>
//                 ))}
//               </select>
//               {errors.selectedCategory && <small className="text-danger">{errors.selectedCategory}</small>}
//             </div>
//             <div className="mb-3">
//               <label htmlFor="imageInput">Upload Image</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 name="donationimage"
//                 id="imageInput"
//                 accept="image/*"
//                 onChange={(event) => setImage(event.target.files[0])}
//               />
//               {errors.image && <small className="text-danger">{errors.image}</small>}
//             </div>

//             <h4>Supporting Documents</h4>
//             <div className="form-floating mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 id="aadharNumberInput"
//                 placeholder="Aadhar Number"
//                 name="aadharNumber"
//                 value={aadharNumber}
//                 onChange={handleAadharChange}
//                 maxLength="12"
//               />
//               <label htmlFor="aadharNumberInput">Aadhar Number</label>
//               {errors.aadharNumber && <small className="text-danger">{errors.aadharNumber}</small>}
//             </div>
//             <div className="mb-3">
//               <label htmlFor="incomeCertificateInput">Upload Income Certificate (PDF only)</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 name="incomeCertificate"
//                 id="incomeCertificateInput"
//                 accept="application/pdf"
//                 onChange={(event) => setIncomeCertificate(event.target.files[0])}
//               />
//               {errors.incomeCertificate && <small className="text-danger">{errors.incomeCertificate}</small>}
//             </div>
//             <div className="mb-3">
//               <label htmlFor="medicalCertificateInput">Upload Medical Certificate (PDF only)</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 name="medicalCertificate"
//                 id="medicalCertificateInput"
//                 accept="application/pdf"
//                 onChange={(event) => setMedicalCertificate(event.target.files[0])}
//               />
//               {errors.medicalCertificate && <small className="text-danger">{errors.medicalCertificate}</small>}
//             </div>

//             <h4>Bank Details</h4>
//             <div className="row mb-3">
//               <div className="col">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="accountOwnerNameInput"
//                   placeholder="Account Owner Name"
//                   name="accountOwnerName"
//                   value={bankDetails.accountOwnerName}
//                   onChange={(event) =>
//                     setBankDetails({ ...bankDetails, accountOwnerName: event.target.value })
//                   }
//                 />
//                 {errors.bankDetails && <small className="text-danger">{errors.bankDetails}</small>}
//               </div>
//               <div className="col">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="bankNameInput"
//                   placeholder="Bank Name"
//                   name="bankName"
//                   value={bankDetails.bankName}
//                   onChange={(event) =>
//                     setBankDetails({ ...bankDetails, bankName: event.target.value })
//                   }
//                 />
//               </div>
//             </div>
//             <div className="row mb-3">
//               <div className="col">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="ifscCodeInput"
//                   placeholder="IFSC Code"
//                   name="ifscCode"
//                   value={bankDetails.ifscCode}
//                   onChange={(event) =>
//                     setBankDetails({ ...bankDetails, ifscCode: event.target.value })
//                   }
//                 />
//               </div>
//               <div className="col">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="accountNumberInput"
//                   placeholder="Account Number"
//                   name="accountNumber"
//                   value={bankDetails.accountNumber}
//                   onChange={(event) =>
//                     setBankDetails({ ...bankDetails, accountNumber: event.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <button type="submit" className="btn btn-primary">
//               Submit Donation
//             </button>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </>
//   );
// }

// export default AddDonation;