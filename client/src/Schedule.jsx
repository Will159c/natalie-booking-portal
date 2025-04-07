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
  const { userName } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/slots/getAvailableSlots');
      setAvailableSlots(res.data);
    } catch (err) {
      console.error('Failed to load available slots:', err);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const dayStr = newDate.toISOString().split('T')[0];
    const slotsForDay = availableSlots.filter(slot =>
      new Date(slot.date).toISOString().split('T')[0] === dayStr
    );
    setSelectedDateSlots(slotsForDay);
  };

  const handleBook = async (slotId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/slots/bookSlot',
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking confirmed!");
      fetchSlots();
      handleDateChange(date);
    } catch (err) {
      alert("Booking failed.");
      console.error(err);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasSlot = availableSlots.some(slot =>
        new Date(slot.date).toISOString().split('T')[0] === date.toISOString().split('T')[0]
      );
      return hasSlot ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.1rem' }}>
          <span style={{
            width: '6px',
            height: '6px',
            backgroundColor: 'black',
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
        </div>
      ) : null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Image Section */}
      <div
        style={{
          flex: '1',
          backgroundImage: 'url("/schedulePicture(1).jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Right Content Section */}
      <div style={{ flex: '1.3', padding: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>Schedule an Appointment</h2>
        <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
          Select a date to view and book available times.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          {/* Calendar */}
          <div>
            <Calendar
              onChange={handleDateChange}
              value={date}
              tileContent={tileContent}
            />
          </div>

          {/* Slot Info Box */}
          <div
            style={{
              background: '#f5f5f5',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              width: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}
          >
            {selectedDateSlots.length > 0 ? (
              <>
                <h3 style={{ textAlign: 'center' }}>{date.toDateString()}</h3>
                <p><strong>Location:</strong> {selectedDateSlots[0]?.location}</p>
                <p><strong>Available Times:</strong></p>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {selectedDateSlots.map((slot, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>
                      {slot.time}
                      <button
                        style={{
                          marginLeft: '1rem',
                          padding: '0.25rem 0.5rem',
                          background: 'blue',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleBook(slot._id)}
                      >
                        Book
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                Select a date with a black dot to view available times and location.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}