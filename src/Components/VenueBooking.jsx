import React, { useState, useEffect } from 'react';
import TopicSelection from './TopicSelection';
import axiosInstance from './AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './NavBar'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function VenueBookingForm() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null); // Store selected venue as VenueId
  const [bookingDateOnly, setBookingDateOnly] = useState('');
  const [bookingTimeOnly, setBookingTimeOnly] = useState('');
  const [topics, setTopics] = useState([]); // Store the list of topics

  const [lectureSeries, setLectureSeries] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [venues, setVenues] = useState([]); // Store the list of venues
  const [lectureSeriesOptions, setLectureSeriesOptions] = useState([]);

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);

    const selectedTopicDetails = topics.find((topic) => topic.topicId === topicId);
    if (selectedTopicDetails) {
      const noOfLectures = selectedTopicDetails.noOfLectures;
      setLectureSeries('');
      setLectureSeriesOptions([...Array(noOfLectures).keys()].map((i) => `L${i + 1}`));
    }
  };

  const handleVenueSelect = (venueId) => {
    setSelectedVenue(venueId);
  };

  const handleVenueBooking = async () => {
    if (!selectedTopic) {
      toast.error('Please select a topic before booking a venue.');
      return;
    }

    if (!selectedVenue) {
      toast.error('Please select a venue before booking.');
      return;
    }

    

    // Combine the selected date and time
    if (!bookingDateOnly || !bookingTimeOnly) {
      toast.error('Please select both a date and a time for booking.');
      return;
    }

    const dateComponents = bookingDateOnly.split('-'); // Split date into [year, month, day]
const timeComponents = bookingTimeOnly.split(':'); // Split time into [hours, minutes]

const year = parseInt(dateComponents[0]);
const month = parseInt(dateComponents[1]) - 1; // Months are zero-based
const day = parseInt(dateComponents[2]);

const hours = parseInt(timeComponents[0]);
const minutes = parseInt(timeComponents[1]);
    
const combinedBookingDate = new Date(year, month, day, hours, minutes);

    console.log(combinedBookingDate)
    if (combinedBookingDate <= new Date()) {
      toast.error('Please select a future date and time for booking.');
      return;
    }

    // Make an API call to save the booking details
    const userName = localStorage.getItem('username');
    const bookingDetails = {
      userName,
      topicId: selectedTopic,
      venueId: selectedVenue, // Store selected venue as VenueId
      bookingDate: combinedBookingDate.toISOString(), // Convert to ISO8601 format
      lectureSeries,
    };

    console.log(bookingDetails.bookingDate)
    try {
      await axiosInstance.post('VenueBookingProcesses', bookingDetails);
      console.log(bookingDetails)
      setBookingConfirmed(true);
      toast.success('Booking confirmed! You can view your bookings in your profile.');
    } catch (error) {
      toast.error('Error booking the venue. Please try again later.');
      console.error('Error booking the venue:', error);
    }
  };

  // Fetch the list of venues from the API
  useEffect(() => {
    axiosInstance.get('Venues')
      .then((response) => {
        setVenues(response.data);
      })
      .catch((error) => {
        toast.error('Error fetching venues. Please try again later.');
        console.error('Error fetching venues:', error);
      });

    axiosInstance.get('Topics')
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        toast.error('Error fetching topics. Please try again later.');
        console.error('Error fetching topics:', error);
      });

  }, []);

  return (
    <div style={{ marginTop: '90px' }}>
      <ToastContainer /> {/* Add Toastify container */}
      <Nav />
      {bookingConfirmed ? (
        <p style={{ color: 'darkgreen' }}>
          Booking confirmed! You can view your bookings in your profile.
        </p>) : (
        <div>
          <TopicSelection onSelectTopic={handleTopicSelect} />
          <Select
            value={selectedVenue || ''}
            onChange={(e) => handleVenueSelect(e.target.value)}
            fullWidth
          >
            <MenuItem value="">
              <em>Select a venue</em>
            </MenuItem>
            {venues.map((venue) => (
              <MenuItem key={venue.venueId} value={venue.venueId}>
                {venue.venueName}
              </MenuItem>
            ))}
          </Select>


          <input
            type="date"
            value={bookingDateOnly}
            onChange={(e) => setBookingDateOnly(e.target.value)}
          />
          <input
            type="time"
            value={bookingTimeOnly}
            onChange={(e) => setBookingTimeOnly(e.target.value)} />
          <Select
            value={lectureSeries}
            onChange={(e) => setLectureSeries(e.target.value)}
            fullWidth
          >
            <MenuItem value="">
              <em>Select Lecture Series</em>
            </MenuItem>
            {lectureSeriesOptions.map((series) => (
              <MenuItem key={series} value={series}>
                {series}
              </MenuItem>
            ))}
          </Select>
          <button onClick={handleVenueBooking}>Book Venue</button>
        </div>
      )}
    </div>
  );
}

export default VenueBookingForm;
