import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import {
  Typography,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  Box,
} from '@mui/material';

function TopicSelection({ onSelectTopic }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTopicDetails, setSelectedTopicDetails] = useState(null);

  const fetchCourseName = async (courseId) => {
    try {
      const response = await axiosInstance.get(`Course/${courseId}`);
      return response.data.courseName;
    } catch (error) {
      console.error('Error fetching course name:', error);
      return null; // Handle the error gracefully
    }
  };

  useEffect(() => {
    axiosInstance
      .get('Topics')
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error('Error fetching topics:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      axiosInstance
        .get(`Topics/${selectedTopic}`)
        .then(async (response) => {
          const topicDetails = response.data;
          const courseName = await fetchCourseName(topicDetails.courseId);
          topicDetails.courseName = courseName;
          setSelectedTopicDetails(topicDetails);
        })
        .catch((error) => {
          console.error('Error fetching topic details:', error);
        });
    }
  }, [selectedTopic]);

  const handleTopicSelect = () => {
    if (selectedTopic) {
      onSelectTopic(selectedTopic);
    }
  };

  return (
    <Box p={2}>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Select a Topic
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              fullWidth
              style={{ width: '100%' }}
            >
              <MenuItem value="">
                <em>Select a topic</em>
              </MenuItem>
              {topics.map((topic) => (
                <MenuItem key={topic.topicId} value={topic.topicId}>
                  {topic.topicName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTopicSelect}
              fullWidth
              style={{ width: '100%' }}
            >
              Select Topic
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {selectedTopicDetails && (
        <Paper elevation={3} style={{ marginTop: '16px' }}>
          <Box p={2}>
            <Typography variant="h6">Topic Details</Typography>
            <Typography variant="body1">
              Topic Name: {selectedTopicDetails.topicName}
            </Typography>
            <Typography variant="body1">
              Course Name: {selectedTopicDetails.courseName || selectedTopicDetails.courseId}
            </Typography>
            <Typography variant="body1">
              Semester: {selectedTopicDetails.semesterNo}
            </Typography>
            <Typography variant="body1">
              Duration of Topic: {selectedTopicDetails.topicDuration}
            </Typography>
            <Typography variant="body1">
              No. of Lectures: {selectedTopicDetails.noOfLectures}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default TopicSelection;
