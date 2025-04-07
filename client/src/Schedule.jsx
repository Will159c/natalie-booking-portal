import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Schedule() {
  const [date, setDate] = useState(new Date());

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem',
        textAlign: 'center'
      }}
    >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Schedule an Appointment
        </h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Here you'll be able to view available time slots and book one.
        </p>

        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Availability</h2>

        <div style={{ transform: 'scale(1.5)', transformOrigin: 'top center' }}>
        <Calendar onChange={setDate} value={date} />
        </div>
    </div>
  );
}


  