import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, Paper, Container, Typography } from '@mui/material';
import  Navbar  from './NavBar';
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


  // Check if the user is enrolled in the course (pseudo-code)
  // const username = localStorage.getItem('username');
  // const topicId = 32;

  // axios.get(`https://localhost:7003/api/UserEnrollment?username=${username}&topicId=${topicId}`)
  //   .then((response) => {
  //     if (response.data.isEnrolled) {
  //       setEnrollmentStatus(true);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Error checking enrollment status:', error);
  //   });


  const handleEnroll = (venueBookingId) => {
    // Enroll the user in the lecture (pseudo-code)
    const username = localStorage.getItem('username');
    const lectureEnrollmentData = {
      venueBookingId,
      username,
      enrollmentCount: 1,
      attendance: false,
    };
    console.log(lectureEnrollmentData);

    axios.post('https://localhost:7003/api/LectureEnrollments', lectureEnrollmentData)
      .then(() => {
        // Enrollment successful
        setEnrollmentStatus(true);
      })
      .catch((error) => {
        console.error('Error enrolling in the lecture:', error);
      });
  };

  return (
    <Container maxWidth="md">
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
                <Button variant="contained" color="primary" onClick={() => handleEnroll(booking.venueBookingId)}>
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
