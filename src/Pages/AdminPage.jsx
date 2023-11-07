import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Crud from '../Components/Crud';
import Topic  from '../Components/Topic';
import Venues from '../Components/Venue';

function AdminOperations() {


  

  return (
    <div>
      <h1>Welcome Admin!!!!</h1>
      <NavBar />
      <Routes>
        <Route path="/Courses" element={<Crud />} />
        <Route path="/Topic" element={<Topic />} />
        <Route path = '/Venue' element={<Venues/>}/>
      </Routes>
    </div>
  );
}

export default AdminOperations;
