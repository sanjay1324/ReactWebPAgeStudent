import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Container,
  TextField,
  Grid,
  Select,
  MenuItem,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Nav from './NavBar'

const Topics = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const [topicName, setTopicName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [topicDuration, setTopicDuration] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [semesterNo, setSemesterNo] = useState('');
  const [noOfLectures, setNoOfLectures] = useState('');

  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editCourseName, setEditCourseName] = useState(''); // Use editCourseName
  const [editDuration, setEditDuration] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSemesterNo, setEditSemesterNo] = useState('');
  const [editNoOfLectures, setEditNoOfLectures] = useState('');

  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    getData();
    fetchCourseList();
  }, []);

  const getData = () => {
    axios
      .get('https://localhost:7003/api/Topics')
      .then((result) => {
        setData(result.data);
        console.log(result.data)
      })
      .catch((error) => {
        console.log('An error occurred while fetching data:', error);
      });
  };

  const fetchCourseList = () => {
    axios
      .get('https://localhost:7003/api/Course')
      .then((result) => {
        setCourseList(result.data);
      })
      .catch((error) => {
        console.log('An error occurred while fetching course list:', error);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEdit = (topicId) => {
    handleShow();
    axios.get(`https://localhost:7003/api/Topics/${topicId}`).then((result) => {
      setEditName(result.data.topicName);
      setEditCourseName(result.data.course ? result.data.course.courseName : '');
      setEditDuration(result.data.topicDuration);
      setEditDescription(result.data.topicDescription);
      setEditSemesterNo(result.data.semesterNo);
      setEditNoOfLectures(result.data.noOfLectures);
      setEditId(topicId);
    });
  };

  // const handleEdit = (topicId) => {
  //   handleShow();
  //   axios.get(`https://localhost:7003/api/Topics/${topicId}`).then((result) => {
  //     setEditName(result.data.topicName);
  //     setEditDuration(result.data.topicDuration);
  //     setEditDescription(result.data.topicDescription);
  //     setEditSemesterNo(result.data.semesterNo);
  //     setEditNoOfLectures(result.data.noOfLectures);
  //     setEditId(topicId);

  //     // Check if a course is associated with the topic
  //     if (result.data.course) {
  //       // If a course is associated, fetch the course name
  //       axios.get(`https://localhost:7003/api/Course/GetCourseNameById/${result.data.course.courseId}`)
  //         .then((courseNameResult) => {
  //           setCourseName(courseNameResult.data); // Set the course name
  //         })
  //         .catch((error) => {
  //           // Handle any errors when fetching the course name
  //           console.error('Error fetching course name:', error);
  //         });
  //     } else {
  //       // If no course is associated, set the course name to an empty string or any appropriate default value
  //       setCourseName('B.Tech');
  //     }
  //   });
  // };


  const handleDelete = (topicId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      axios
        .delete(`https://localhost:7003/api/Topics/${topicId}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Topic Has Been Deleted Successfully');
            getData();
          }
        })
        .catch((error) => {
          toast.error('An error occurred while deleting the course:', error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7003/api/Topics/${editId}`;

    // Find the selected course from the list and get its courseId
    const selectedCourse = courseList.find((course) => course.courseName === editCourseName);

    const updatedData = {
      topicId: parseInt(editId),
      topicName: editName,
      courseId: selectedCourse ? selectedCourse.courseId : null, // Set the correct courseId
      topicDuration: parseInt(editDuration),
      topicDescription: editDescription,
      semesterNo: parseInt(editSemesterNo),
      noOfLectures: parseInt(editNoOfLectures),
    };

    axios
      .put(url, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.success('Topic Has been Updated Successfully');
      })
      .catch((error) => {
        console.log(error);
      });

    handleClose();
  };

  const handleSave = () => {
    // Find the selected course from the list and get its courseId
    const selectedCourse = courseList.find((course) => course.courseName === courseName);

    const url = `https://localhost:7003/api/Topics`;
    const newData = {
      topicName: topicName,
      courseId: selectedCourse ? selectedCourse.courseId : null, // Set the correct courseId
      topicDuration: parseInt(topicDuration),
      topicDescription: topicDescription,
      semesterNo: parseInt(semesterNo),
      noOfLectures: parseInt(noOfLectures),
    };

    axios
      .post(url, newData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((result) => {
        getData();
        clear();
        toast.success('Topic Added Successfully');
        console.log(result)
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const getCourseNameByCourseId = (courseId) => {
    // Make an API call to fetch the course name
    axios
      .get(`https://localhost:7003/api/Topics/GetCourseNameById/${courseId}`)
      .then((result) => {
        // Handle the successful response
        const courseName = result.data;
        // Do something with the courseName, e.g., display it
        // console.log(`Course Name for Course ID ${courseId}: ${courseName}`);
      })
      .catch((error) => {
        // Handle any errors when fetching the course name
        console.error('Error fetching course name:', error);
      });
  };


  const clear = () => {
    setTopicName('');
    setTopicDuration('');
    setTopicDescription('');
    setCourseName('');
    setSemesterNo('');
    setNoOfLectures('');

    setEditName('');
    setEditDuration('');
    setEditDescription('');
    setEditCourseName('');
    setEditSemesterNo('');
    setEditNoOfLectures('');
    setEditId('');
  };

  return (
    <Fragment>
      <Nav/>
      <ToastContainer />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              label="Topic Name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Topic Duration"
              value={topicDuration}
              onChange={(e) => setTopicDuration(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              label="Topic Description"
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              fullWidth
              variant="outlined"
              label="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            >
              {courseList.map((course) => (
                <MenuItem key={course.courseId} value={course.courseName}>
                  {course.courseName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Semester No"
              type="number"
              value={semesterNo}
              onChange={(e) => setSemesterNo(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="No Of Lectures"
              type="number"
              value={noOfLectures}
              onChange={(e) => setNoOfLectures(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Topic Id</TableCell>
              <TableCell>Topic Name</TableCell>
              <TableCell>Topic Duration</TableCell>
              <TableCell>Topic Description</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Semester No</TableCell>
              <TableCell>No Of Lectures</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.topicId}</TableCell>
                  <TableCell>{item.topicName}</TableCell>
                  <TableCell>{item.topicDuration}</TableCell>
                  <TableCell>{item.topicDescription}</TableCell>
                  <TableCell>
                    {getCourseNameByCourseId(item.courseId)}
                    {courseName}
                  </TableCell>
                  <TableCell>{item.semesterNo}</TableCell>
                  <TableCell>{item.noOfLectures}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(item.topicId)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDelete(item.topicId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>Loading....</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={show} onClose={handleClose}>
        <div
          style={{
            position: 'absolute',
            width: 400,
            backgroundColor: 'white',
            padding: 16,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <TextField
            fullWidth
            label="Topic Name"
            variant="outlined"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Topic Duration"
            variant="outlined"
            value={editDuration}
            onChange={(e) => setEditDuration(e.target.value)}
          />
          <TextField
            fullWidth
            label="Topic Description"
            variant="outlined"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <Select
            fullWidth
            label="Course Name"
            variant="outlined"
            value={editCourseName}
            onChange={(e) => setEditCourseName(e.target.value)}
          >
            {courseList.map((course) => (
              <MenuItem key={course.courseId} value={course.courseName}>
                {course.courseName}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Semester No"
            variant="outlined"
            value={editSemesterNo}
            onChange={(e) => setEditSemesterNo(e.target.value)}
          />
          <TextField
            fullWidth
            label="No Of Lectures"
            variant="outlined"
            value={editNoOfLectures}
            onChange={(e) => setEditNoOfLectures(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Topics;
