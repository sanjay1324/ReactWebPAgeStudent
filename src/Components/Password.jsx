import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios or your preferred HTTP library

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validate, setValidate] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateChangePassword = () => {
    // Add validation logic here if needed
    return true; // Return true for simplicity, adjust this as needed
  };

  const changePassword = (e) => {
    e.preventDefault();

    if (validateChangePassword()) {
      // Prepare the JSON request payload
      const requestPayload = {
        username: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      // Send the API request
      axios
        .post("https://localhost:7003/api/Authorization/ChangePassword", requestPayload)
        .then((response) => {
          // Handle the API response, e.g., show a success message
          alert("Password changed successfully.");
        })
        .catch((error) => {
          // Handle API errors, e.g., display an error message
          alert("Error changing password. Please try again.");
        });
    }
  };

  return (
    <div className="row g-0 auth-wrapper">
      {/* Your existing UI code goes here */}
      <form className="auth-form" method="POST" onSubmit={changePassword} autoComplete={'off'}>
        {/* Username */}
        <div className="username mb-3">
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            placeholder="Username"
            onChange={handleInputChange}
          />
        </div>

        {/* Current Password */}
        <div className="current-password mb-3">
          <input
            type="password"
            name="currentPassword"
            className="form-control"
            value={formData.currentPassword}
            placeholder="Current Password"
            onChange={handleInputChange}
          />
        </div>

        {/* New Password */}
        <div className="new-password mb-3">
          <input
            type="password"
            name="newPassword"
            className="form-control"
            value={formData.newPassword}
            placeholder="New Password"
            onChange={handleInputChange}
          />
        </div>

        {/* Confirm Password */}
        <div className="confirm-password mb-3">
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleInputChange}
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary w-100 theme-btn mx-auto">Change Password</button>
        </div>
      </form>
      {/* Rest of your UI code */}
    </div>
  );
};

export default ChangePassword;
