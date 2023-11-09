import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';

function EnrollmentProcessList() {
  const [enrollmentProcesses, setEnrollmentProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEnrollmentId, setDeleteEnrollmentId] = useState(null);

  useEffect(() => {
    // Fetch the list of enrollment processes from the API
    axiosInstance.get('EnrollmentProcesses')
      .then((response) => {
        setEnrollmentProcesses(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching enrollment processes:', error);
        setError('An error occurred while fetching enrollment processes.');
        setIsLoading(false);
      });
  }, []);

  const fetchCourseName = async (courseId) => {
    try {
      const courseResponse = await axiosInstance.get(`Course/${courseId}`);
      return courseResponse.data.courseName;
    } catch (error) {
      console.error('Error fetching course name:', error);
      return 'N/A'; // Default value if course name cannot be fetched
    }
  };

  const handleDelete = (id) => {
    setDeleteEnrollmentId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteEnrollmentId) {
      // Make an API call to delete the enrollment process
      axiosInstance.delete(`EnrollmentProcesses/${deleteEnrollmentId}`)
        .then(() => {
          // Remove the deleted enrollment process from the list
          setEnrollmentProcesses((prevProcesses) =>
            prevProcesses.filter((process) => process.enrollmentId !== deleteEnrollmentId)
          );
          setDeleteDialogOpen(false);
        })
        .catch((error) => {
          console.error('Error deleting enrollment process:', error);
          setError('An error occurred while deleting the enrollment process.');
          setDeleteDialogOpen(false);
        });
    }
  };

  // Fetch course names for all enrollment processes
  useEffect(() => {
    const fetchCourseNames = async () => {
      const updatedProcesses = await Promise.all(
        enrollmentProcesses.map(async (process) => {
          const courseName = await fetchCourseName(process.courseId);
          return {
            ...process,
            courseName,
          };
        })
      );

      setEnrollmentProcesses(updatedProcesses);
    };

    if (enrollmentProcesses.length > 0) {
      fetchCourseNames();
    }
  }, [enrollmentProcesses]);

  return (
    <Paper elevation={3} style={styles.container}>
      <Typography variant="h4" style={styles.header}>
        Enrollment Processes
      </Typography>

      {isLoading ? (
        <Typography variant="body1" style={styles.loading}>
          Loading...
        </Typography>
      ) : error ? (
        <Typography variant="body1" style={styles.error}>
          {error}
        </Typography>
      ) : (
        <Table style={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Enrollment ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollmentProcesses.map((process) => (
              <TableRow key={process.enrollmentId}>
                <TableCell>{process.enrollmentId}</TableCell>
                <TableCell>{process.courseName}</TableCell>
                <TableCell>{process.studentName}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(process.enrollmentId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this enrollment process?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
    color: 'black',
  },
  loading: {
    marginTop: '20px',
    color: 'black',
  },
  error: {
    color: 'red',
  },
  table: {
    minWidth: 650,
  },
};

export default EnrollmentProcessList;
