import React, { useState, useEffect } from 'react';
import TopicSelection from './TopicSelection';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VenueBookingForm() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null); // Store selected venue as VenueId
  const [bookingDate, setBookingDate] = useState('');
  const [lectureSeries, setLectureSeries] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [venues, setVenues] = useState([]); // Store the list of venues

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
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

    // Make an API call to save the booking details
    const userName = localStorage.getItem('username');
    const bookingDetails = {
      userName,
      topicId: selectedTopic,
      venueId: selectedVenue, // Store selected venue as VenueId
      bookingDate,
      lectureSeries,
    };

    try {
      await axios.post('https://localhost:7003/api/VenueBookingProcesses', bookingDetails);
      setBookingConfirmed(true);
      toast.success('Booking confirmed! You can view your bookings in your profile.');
    } catch (error) {
      toast.error('Error booking the venue. Please try again later.');
      console.error('Error booking the venue:', error);
    }
  };

  // Fetch the list of venues from the API
  useEffect(() => {
    axios.get('https://localhost:7003/api/Venues')
      .then((response) => {
        setVenues(response.data);
      })
      .catch((error) => {
        toast.error('Error fetching venues. Please try again later.');
        console.error('Error fetching venues:', error);
      });
  }, []);

  return (
    <div>
      <ToastContainer /> {/* Add Toastify container */}
      {bookingConfirmed ? (
        <p style={{ color: 'darkgreen' }}>
  Booking confirmed! You can view your bookings in your profile.
</p>      ) : (
        <div>
          <TopicSelection onSelectTopic={handleTopicSelect} />
          <select value={selectedVenue} onChange={(e) => handleVenueSelect(e.target.value)}>
            <option value="">Select a venue</option>
            {venues.map((venue) => (
              <option key={venue.venueId} value={venue.venueId}>
                {venue.venueName}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Lecture Series"
            value={lectureSeries}
            onChange={(e) => setLectureSeries(e.target.value)}
          />
          <button onClick={handleVenueBooking}>Book Venue</button>
        </div>
      )}
    </div>
  );
}

export default VenueBookingForm;
