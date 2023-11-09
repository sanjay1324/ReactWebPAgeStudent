import React, { Fragment, useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './NavBar';
import axiosInstance from "./AxiosInstance";
import './Crud.css'; // Import your custom CSS for styling

const Crud = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);

    const [courseName, setCourseName] = useState('');
    const [durationOfCourse, setDurationOfCourse] = useState('');
    const [amountForCourse, setAmountForCourse] = useState('');
    const [noOfSemester, setNoOfSemester] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editDurationOfCourse, setEditDurationOfCourse] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editSemester, setEditSemester] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axiosInstance
            .get('Course')
            .then((result) => {
                setData(result.data);
                console.log(result.data);
            })
            .catch((error) => {
                console.log("An error occurred while fetching data:", error);
            });
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEdit = (courseId) => {
        handleShow();
        axiosInstance.get(`Course/${courseId}`)
            .then((result) => {
                setEditName(result.data.courseName);
                setEditDurationOfCourse(result.data.durationOfCourse);
                setEditAmount(result.data.amountForCourse);
                setEditSemester(result.data.noOfSemester);
                setEditDescription(result.data.courseDescription);
                setEditId(courseId);
            });
    };

    const handleDelete = (courseId) => {
        if (window.confirm("Are you sure you want to delete?")) {
            axiosInstance.delete(`Course/${courseId}`)
                .then((response) => {
                    if (response.status === 200) {
                        toast.success('Course Has Been Deleted Successfully');
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error('An error occurred while deleting the course:', error);
                });
        }
    };

    const handleUpdate = () => {
        const url = `Course/${editId}`;
        const data = {
            "courseId": editId,
            "courseName": editName,
            "durationOfCourse": editDurationOfCourse,
            "amountForCourse": editAmount,
            "noOfSemester": editSemester,
            "courseDescription": editDescription,
        };

        axiosInstance.put(url, data).then((result) => {
            handleClose();
            getData();
            clear();
            toast.success('Course Has been Updated Successfully');
        }).catch((error) => {
            toast.error(error);
        });

        handleClose();
    };

    const handleSave = () => {
        const url = 'Course';
        const data = {
            "courseName": courseName,
            "durationOfCourse": durationOfCourse,
            "amountForCourse": amountForCourse,
            "noOfSemester": noOfSemester,
            "courseDescription": courseDescription,
        };

        axiosInstance.post(url, data).then((result) => {
            getData();
            clear();
            toast.success('Course Added Successfully');
        }).catch((error) => {
            toast.error(error);
        });
    };

    const clear = () => {
        setCourseName('');
        setDurationOfCourse('');
        setAmountForCourse('');
        setNoOfSemester('');
        setCourseDescription('');

        setEditName('');
        setEditDurationOfCourse('');
        setEditAmount('');
        setEditSemester('');
        setEditDescription('');
        setEditId('');
    };

    return (
        <div className="sanjay">
        <Fragment >
            <Nav />
            <ToastContainer />
            <Container>
                <Row>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Course Name"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Duration Of Course"
                            value={durationOfCourse}
                            onChange={(e) => setDurationOfCourse(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Amount"
                            value={amountForCourse}
                            onChange={(e) => setAmountForCourse(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Semester"
                            value={noOfSemester}
                            onChange={(e) => setNoOfSemester(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Description"
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>CourseId</th>
                        <th>Course Name</th>
                        <th>DurationOfCourse</th>
                        <th>Amount</th>
                        <th>Semester</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.courseId}</td>
                                    <td>{item.courseName}</td>
                                    <td>{item.durationOfCourse}</td>
                                    <td>{item.amountForCourse}</td>
                                    <td>{item.noOfSemester}</td>
                                    <td>{item.courseDescription}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleEdit(item.courseId)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(item.courseId)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7">Loading....</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify / Update Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter Duration Of Course"
                                value={editDurationOfCourse}
                                onChange={(e) => setEditDurationOfCourse(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter Amount"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter Semester"
                                value={editSemester}
                                onChange={(e) => setEditSemester(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
        </div>
    );
}

export default Crud;
