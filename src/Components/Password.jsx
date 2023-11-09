import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./AxiosInstance";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
      axiosInstance
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
    <Paper elevation={3} className="auth-wrapper">
      <form className="auth-form" method="POST" onSubmit={changePassword} autoComplete={'off'}>
        {/* Username */}
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />

        {/* Current Password */}
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          label="Current Password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
        />

        {/* New Password */}
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />

        <div className="text-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="theme-btn"
          >
            Change Password
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default ChangePassword;
