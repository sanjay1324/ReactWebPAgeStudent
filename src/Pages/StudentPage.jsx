import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import LectureBookingProcess from '../Components/LectureBookingProcess';
import EnrollmentProcess from '../Components/Enrollment';

function AdminOperations() {


  

  return (
    <div>
      <h1>Welcome Admin!!!!</h1>
      <NavBar />
      <Routes>
        <Route path="/EnrollmentProcess" element={<EnrollmentProcess />} />
        <Route path="/LectureEnrollmentProcess" element={<LectureBookingProcess />} />
      </Routes>
    </div>
  );
}

export default AdminOperations;
