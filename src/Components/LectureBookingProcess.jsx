import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar,
} from '@mui/material';
import  Navbar  from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from './AxiosInstance';
import Pagination from '@mui/material/Pagination';

function LectureBookingProcess() {
  const [venueBookings, setVenueBookings] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);


  // Fetch all venue bookings from the server
  useEffect(() => {
   

    axiosInstance.get('VenueBookingProcesses')
      .then((response) => {
        const updatedVenueBookings = response.data.map(async (booking) => {
          const topicId = booking.topicId;
          const venueId = booking.venueId;
          const lectureSeries = booking.lectureSeries;
          // Fetch TopicName
          const topicResponse = await axiosInstance.get(`Topics/${topicId}`);
          const topicName = topicResponse.data.topicName || 'N/A';
          const semesterNo = topicResponse.data.semesterNo || 'N/A';

          // Fetch CourseName
          const courseId = topicResponse.data.courseId;
          const courseResponse = await axiosInstance.get(`Course/${courseId}`);
          const courseName = courseResponse.data.courseName || 'N/A';


          const venueResponse = await axiosInstance.get(`Venues/${venueId}`);
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
    return axiosInstance.get(`UserEnrollment?username=${username}&courseId=${courseId}`)
      .then((response) => {
        return response.data.isEnrolled;
      })
      .catch((error) => {
        console.error('Error checking enrollment status:', error);
        return false;
      });
  };
  

  const getNextExpectedLecture = (username, venueBookingId,lectureSeries) => {
    return axiosInstance
      .get(`Attendance/LastAttendedLectureSeries?username=${username}&venueBookingId=${venueBookingId}`)
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
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; 

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Paginate the list of venue bookings
  const paginatedVenueBookings = venueBookings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
      if (!isEnrolled) {
          // Check the next expected lecture
          const nextExpectedLecture = await getNextExpectedLecture(username, venueBookingId,lectureSeries);
          console.log(nextExpectedLecture)
          if (nextExpectedLecture) {
              // If both conditions pass, make the POST request
              await axiosInstance.post('LectureEnrollments', lectureEnrollmentData);
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
    <Navbar/>
    <ToastContainer/>
    <Paper elevation={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Lecture Booking Process
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Venue</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Professor Name</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Lecture No</TableCell>
              <TableCell>Enroll</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVenueBookings.map((booking) => (
              <TableRow key={booking.venueBookingId}>
                <TableCell>{booking.venueName}</TableCell>
                <TableCell>{booking.bookingDate}</TableCell>
                <TableCell>{booking.courseName}</TableCell>
                <TableCell>{booking.topicName}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>{booking.semesterNo}</TableCell>
                <TableCell>{booking.lectureSeries}</TableCell>
                <TableCell>
                  {process.env.NODE_ENV !== 'test' && !enrollmentStatus ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleEnroll(booking.venueBookingId, booking.lectureSeries);
                        setOpenSnackbar(true);
                      }}
                    >
                      Enroll
                    </Button>
                  ) : (
                    <span>Enrolled</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={() => setOpenSnackbar(false)}
      message="Enrollment successful!"
    />
    <Pagination
      count={Math.ceil(venueBookings.length / itemsPerPage)}
      page={page}
      onChange={handlePageChange}
      color="primary"
      size="large"
      style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
    />
  </Container>
);



}

export default LectureBookingProcess;
