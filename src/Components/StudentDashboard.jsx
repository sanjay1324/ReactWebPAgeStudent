import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EnrollmentProcessList() {
  const [enrollmentProcesses, setEnrollmentProcesses] = useState([]);

  useEffect(() => {
    // Fetch the list of enrollment processes from the API
    axios.get('https://localhost:7003/api/EnrollmentProcesses')
      .then((response) => {
        setEnrollmentProcesses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching enrollment processes:', error);
      });
  }, []);

  const handleDelete = (id) => {
    // Make an API call to delete the enrollment process
    axios.delete(`https://localhost:7003/api/EnrollmentProcesses/${id}`)
      .then(() => {
        // Remove the deleted enrollment process from the list
        setEnrollmentProcesses((prevProcesses) =>
          prevProcesses.filter((process) => process.enrollmentId !== id)
        );
      })
      .catch((error) => {
        console.error('Error deleting enrollment process:', error);
      });
  };

  return (
    <div>
      <h2>Enrollment Processes</h2>
      <table>
        <thead>
          <tr>
            <th>Enrollment ID</th>
            <th>Course ID</th>
            <th>Student Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollmentProcesses.map((process) => (
            <tr key={process.enrollmentId}>
              <td>{process.enrollmentId}</td>
              <td>{process.courseId}</td>
              <td>{process.studentName}</td>
              <td>
                <button onClick={() => handleDelete(process.enrollmentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EnrollmentProcessList;
