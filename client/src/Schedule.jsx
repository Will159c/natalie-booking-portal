import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

export default function Schedule() {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDateSlots, setSelectedDateSlots] = useState([]);
  const [bookingMessage, setBookingMessage] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const { userName } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    if (bookingMessage) {
      setFadeIn(true);
      const timeout = setTimeout(() => {
        setFadeIn(false);
        setTimeout(() => setBookingMessage(''), 300);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [bookingMessage]);

  const fetchSlots = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/slots/getAvailableSlots`);
      setAvailableSlots(res.data);
    } catch (err) {
      console.error('Failed to load available slots:', err);
    }
  };

  const handleDateChange = (newDate) => {
    if (newDate.toDateString() !== date.toDateString()) setBookingMessage('');
    setDate(newDate);

    const dayStr = newDate.toISOString().split('T')[0];
    const slotsForDay = availableSlots
      .filter((slot) => new Date(slot.date).toISOString().split('T')[0] === dayStr)
      .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

    setSelectedDateSlots(slotsForDay); // clears if no match
  };

  const handleBook = async (slotId) => {
    const confirm = window.confirm('Are you sure you want to book this appointment?');
    if (!confirm) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/slots/bookSlot`,
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingMessage('Booking confirmed! A confirmation email has been sent.');
      setIsBookingSuccess(true);
      fetchSlots();
      handleDateChange(date);
    } catch (err) {
      setBookingMessage('Booking failed. Please try again.');
      setIsBookingSuccess(false);
      console.error(err);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasSlot = availableSlots.some(
        (slot) => new Date(slot.date).toISOString().split('T')[0] === date.toISOString().split('T')[0]
      );
      return hasSlot ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.1rem' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'black',
              borderRadius: '50%',
              display: 'inline-block',
            }}
          ></span>
        </div>
      ) : null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Image */}
      <div
        style={{
          flex: 1.5,
          backgroundImage: 'url("/schedulePicture(1).jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Right Side */}
      <div style={{ flex: 1, padding: '4rem 3rem' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', fontWeight: '500' }}>
          Schedule an Appointment
        </h2>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', color: '#444' }}>
          Select a date to view and book available times.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4rem',
            marginTop: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Calendar */}
          <div
            style={{
              margin: '0 auto',
              transform: 'scale(1.2)',
              transformOrigin: 'center',
            }}
          >
            <Calendar onChange={handleDateChange} value={date} tileContent={tileContent} />
          </div>

          {/* Slot Info */}
          <div
            style={{
              background: '#f9f9f9',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '350px',
              width: '100%',
            }}
          >
            {selectedDateSlots.length > 0 ? (
              <>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{date.toDateString()}</h3>
                <p>
                  <strong>Location:</strong> {selectedDateSlots[0]?.location}
                </p>
                <p>
                  <strong>Available Times:</strong>
                </p>
                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: '250px',
                    paddingRight: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {selectedDateSlots.map((slot, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>{slot.time}</span>
                        <button
                          onClick={() => handleBook(slot._id)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            background: '#222',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                          }}
                        >
                          Book
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                Select a date with a black dot to view available times and location.
              </p>
            )}
          </div>
        </div>

        {/* Confirmation Message */}
        <div
          style={{
            marginTop: '2rem',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              opacity: fadeIn ? 1 : 0,
              transition: 'opacity 0.3s ease',
              padding: bookingMessage ? '0.75rem 1rem' : 0,
              borderRadius: '5px',
              backgroundColor: isBookingSuccess ? '#d4edda' : '#f8d7da',
              color: isBookingSuccess ? '#155724' : '#721c24',
              border: bookingMessage ? `1px solid ${isBookingSuccess ? '#c3e6cb' : '#f5c6cb'}` : 'none',
              textAlign: 'center',
              fontSize: '0.95rem',
              minWidth: bookingMessage ? '300px' : '0',
            }}
          >
            {bookingMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
