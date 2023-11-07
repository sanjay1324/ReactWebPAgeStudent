import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    createTheme,
    ThemeProvider,
    Button,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';

import axios from 'axios';
import Navbar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
const CourseList = () => {
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [courses, setCourses] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState({
        courseId: '',
        dateOfJoining: '',
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        axios
            .get('https://localhost:7003/api/Course')
            .then((response) => {
                setCourses(response.data);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    };
    const containerStyles = {
        marginTop: '55px', // Adjust this value to match your Navbar height
        // backgroundImage: 'url("your-background-image.jpg")', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%', // Set width to 100% to match the screen width
        minHeight: 'calc(100vh - 45px)', // Adjust this value to account for the Navbar height
        // padding: '16px', // Add padding as needed
    };
    const isStudentAlreadyEnrolled = async (userName, courseId) => {
        try {
            // Make an API request to check if the student is already enrolled in the course
            const response = await axios.get(`https://localhost:7003/api/EnrollmentProcesses?userName=${userName}&courseId=${courseId}`);
            
            // If there is any enrollment data for this student and course, they are already enrolled
            return response.data.length > 0;
        } catch (error) {
            // Handle the error, e.g., by showing a toast message
            console.error('Error checking enrollment:', error);
            return false; // Default to false in case of an error
        }
    };
    const handleEnroll = async (course) => {
        const userName = localStorage.getItem('username');
        const courseId = course.courseId;
        const dateOfJoining = enrollmentData.dateOfJoining;

        if (!dateOfJoining) {
            toast.error('Please fill in all Date Of Joining.');
            return;
        }
        
        if (isEnrolled) {
            toast.info('You are already enrolled in this course.');
            return;
        }
        // Check if any field is empty
        
    
        const selectedDate = new Date(dateOfJoining);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
    
        if (year >= 2023 && (month === 0 || month === 6)) {
            const newEnrollment = {
                userName,
                courseId,
                dateOfJoining,
                enrollmentCount: 1,
            };
    
            axios
                .post('https://localhost:7003/api/EnrollmentProcesses', newEnrollment)
                .then(() => {
                    setIsEnrolled(true);
                    toast.success('Enrollment successful!');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        // If the error has a response and response data, display it in the toast message
                        if(error.response.data== "You are already enrolled in this course."){
                            setIsEnrolled(true);
                            toast.error("You are already enrolled in this course.");
                        }
                    } else {
                        // If no response data is available, display a generic error message
                        toast.error('Error enrolling in the course.');
                    }
                })
        } else {
            toast.info('Enrollment is only open in January and July for 2023 and above.');
        }
    }

    
    const theme = createTheme({
        palette: {
            primary: {
                main: '#2196F3', // Customize the primary color
            },
        },
    });
    const [currentPage, setCurrentPage] = useState(0);
    const coursesPerPage = 5;
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };
    const displayedCourses = courses.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
    );
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer/>
            <Navbar />
            <div style={containerStyles}>
                <div>
                    <h1>Course List</h1>
                    <TableContainer component={Paper} style={{ width: '1000px', overflowX: 'auto' }}>
                        <Table style={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Course Name</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>No Of Semesters</TableCell>
                                    <TableCell>Course Description</TableCell>
                                    <TableCell>Enroll</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedCourses.map((course) => (
                                    <TableRow key={course.courseId}>
                                        <TableCell>{course.courseName}</TableCell>
                                        <TableCell>{course.durationOfCourse}</TableCell>
                                        <TableCell>{course.amountForCourse}</TableCell>
                                        <TableCell>{course.noOfSemester}</TableCell>
                                        <TableCell>{course.courseDescription}</TableCell>
                                        <TableCell>
                                            <div>
                                                <TextField

                                                    type="datetime-local"
                                                    value={enrollmentData.dateOfJoining}
                                                    onChange={(e) =>
                                                        setEnrollmentData({
                                                            ...enrollmentData,
                                                            dateOfJoining: e.target.value,
                                                        })
                                                    }
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleEnroll(course)}
                                                    disabled={isEnrolled} // Disable the button if user is already enrolled
                                                >
                                                    Enroll
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default CourseList;
