import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../Components/NavBar'; // Import the Nav component
import VenueBookingForm from '../Components/VenueBooking';
function AdminOperations() {
 

 

  return (
    <div>
      <h1>Welcome Admin!!!!</h1>

      <NavBar />

      <Routes>
        <Route path="/VenueBookingProcess" element={<VenueBookingForm />} />
      </Routes>
     
    </div>
  );
}

export default AdminOperations;
