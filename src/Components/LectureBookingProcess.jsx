import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, Paper, Container, Typography } from '@mui/material';
import  Navbar  from './NavBar';
import { ToastContainer, toast } from 'react-toastify';

function LectureBookingProcess() {
  const [venueBookings, setVenueBookings] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(false);


  // Fetch all venue bookings from the server
  useEffect(() => {
   

    axios.get('https://localhost:7003/api/VenueBookingProcesses')
      .then((response) => {
        const updatedVenueBookings = response.data.map(async (booking) => {
          const topicId = booking.topicId;
          const venueId = booking.venueId;
          const lectureSeries = booking.lectureSeries;
          // Fetch TopicName
          const topicResponse = await axios.get(`https://localhost:7003/api/Topics/${topicId}`);
          const topicName = topicResponse.data.topicName || 'N/A';
          const semesterNo = topicResponse.data.semesterNo || 'N/A';

          // Fetch CourseName
          const courseId = topicResponse.data.courseId;
          const courseResponse = await axios.get(`https://localhost:7003/api/Course/${courseId}`);
          const courseName = courseResponse.data.courseName || 'N/A';


          const venueResponse = await axios.get(`https://localhost:7003/api/Venues/${venueId}`);
          const venueName = venueResponse.data.venueName || 'N/A';
          return {
            ...booking,
            topicName,
            courseName,
            venueName,
            semesterNo,
            lectureSeries
          };
        });

        // Update state with the fetched data
        Promise.all(updatedVenueBookings).then((updatedBookings) => {
          setVenueBookings(updatedBookings);
        });
      })
      .catch((error) => {
        console.error('Error fetching venue bookings:', error);
      });
  }, []);

  const checkEnrollmentStatus = (username, courseId) => {
    return axios.get(`https://localhost:7003/api/UserEnrollment?username=${username}&courseId=${courseId}`)
      .then((response) => {
        return response.data.isEnrolled;
      })
      .catch((error) => {
        console.error('Error checking enrollment status:', error);
        return false;
      });
  };
  

  const getNextExpectedLecture = (username, venueBookingId,lectureSeries) => {
    return axios
      .get(`https://localhost:7003/api/Attendance/LastAttendedLectureSeries?username=${username}&venueBookingId=${venueBookingId}`)
      .then((response) => {
        const expectedLecture = response.data;
        console.log(expectedLecture)
        console.log(lectureSeries)

        if (expectedLecture === lectureSeries) {
          // The student can attend the next lecture in sequence
          return true;
        } else {
          // The student needs to attend the correct lecture in sequence
          return false;
        }
      })
      .catch((error) => {
        console.error('Error getting next expected lecture:', error);
        return false; // Return false in case of an error
      });
  };
  


const handleEnroll = async (venueBookingId,lectureSeries) => {
  const username = localStorage.getItem('username');
  const courseId = 16;
  const lectureEnrollmentData = {
    venueBookingId,
    username,
    enrollmentCount: 1,
    attendance: true,
  };

  console.log(lectureEnrollmentData);

  try {
      // Check enrollment status
      const isEnrolled = await checkEnrollmentStatus(username, courseId);
      if (isEnrolled) {
          // Check the next expected lecture
          const nextExpectedLecture = await getNextExpectedLecture(username, venueBookingId,lectureSeries);
          console.log(nextExpectedLecture)
          if (nextExpectedLecture) {
              // If both conditions pass, make the POST request
              await axios.post('https://localhost:7003/api/LectureEnrollments', lectureEnrollmentData);
              // Enrollment successful
              setEnrollmentStatus(true);
          } else {
              toast.error('User must attend the correct lecture in sequence');
          }
      } else {
          toast.error('User is not  enrolled in this course');
      }
  } catch (error) {
      toast.error('Error enrolling in the lecture:', error);
  }
};


  return (
    <Container maxWidth="md">
    <ToastContainer/>
      <Navbar />

      <Paper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Lecture Booking Process
        </Typography>
        <List>
          {venueBookings.map((booking) => (
            <ListItem key={booking.venueBookingId}>
              <ListItemText primary={`Venue: ${booking.venueName}`} />
              <ListItemText primary={`Date: ${booking.bookingDate}`} />
              <ListItemText primary={`Course: ${booking.courseName}`} />
              <ListItemText primary={`Topic: ${booking.topicName}`} />
              <ListItemText primary={`Professor Name: ${booking.userName}`} />
              <ListItemText primary={`Semester: ${booking.semesterNo}`} />
              <ListItemText primary={`Lecture No: ${booking.lectureSeries}`} />

              {!enrollmentStatus ? (
                <Button variant="contained" color="primary" onClick={() => handleEnroll(booking.venueBookingId,booking.lectureSeries)}>
                  Enroll
                </Button>
              ) : (
                <span>Enrolled</span>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default LectureBookingProcess;
