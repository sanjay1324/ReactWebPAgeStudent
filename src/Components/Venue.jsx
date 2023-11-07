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
  Grid,
  TextField,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Header from './NavBar'

const Venues = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const [venueName, setVenueName] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');
  const [venueLocation, setVenueLocation] = useState('');

  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [editLocation, setEditLocation] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get('https://localhost:7003/api/Venues')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log('An error occurred while fetching data:', error);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEdit = (venueId) => {
    handleShow();
    axios.get(`https://localhost:7003/api/Venues/${venueId}`).then((result) => {
      setEditName(result.data.venueName);
      setEditCapacity(result.data.venueCapacity);
      setEditLocation(result.data.venueLocation);
      setEditId(venueId);
    });
  };

  const handleDelete = (venueId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      axios
        .delete(`https://localhost:7003/api/Venues/${venueId}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Venue Has Been Deleted Successfully');
            getData();
          }
        })
        .catch((error) => {
          toast.error('An error occurred while deleting the venue:', error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7003/api/Venues/${editId}`;
    const updatedData = {
      venueId: editId,
      venueName: editName,
      venueCapacity: editCapacity,
      venueLocation: editLocation,
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
        toast.success('Venue Has been Updated Successfully');
      })
      .catch((error) => {
        toast.error(error);
      });

    handleClose();
  };

  const handleSave = () => {
    const url = `https://localhost:7003/api/Venues`;
    const newData = {
      venueName: venueName,
      venueCapacity: venueCapacity,
      venueLocation: venueLocation,
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
        toast.success('Venue Added Successfully');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setVenueName('');
    setVenueCapacity('');
    setVenueLocation('');

    setEditName('');
    setEditCapacity('');
    setEditLocation('');
    setEditId('');
  };

  return (
    <Fragment>
      <Header/>
      <ToastContainer />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Venue Name"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Venue Capacity"
              value={venueCapacity}
              onChange={(e) => setVenueCapacity(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Venue Location"
              value={venueLocation}
              onChange={(e) => setVenueLocation(e.target.value)}
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
              <TableCell>Venue Id</TableCell>
              <TableCell>Venue Name</TableCell>
              <TableCell>Venue Capacity</TableCell>
              <TableCell>Venue Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.venueId}</TableCell>
                  <TableCell>{item.venueName}</TableCell>
                  <TableCell>{item.venueCapacity}</TableCell>
                  <TableCell>{item.venueLocation}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(item.venueId)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(item.venueId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>Loading....</TableCell>
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
            backgroundColor: 'white', // Set the background color to white
            padding: 16,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <TextField
            fullWidth
            label="Venue Name"
            variant="outlined"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Venue Capacity"
            variant="outlined"
            value={editCapacity}
            onChange={(e) => setEditCapacity(e.target.value)}
          />
          <TextField
            fullWidth
            label="Venue Location"
            variant="outlined"
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
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

export default Venues;
