// import React, { useState } from 'react';
// import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

// const Reminder = () => {
//   const [message, setMessage] = useState('');
//   const [dateTime, setDateTime] = useState('');

//   const handleSetReminder = async () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user) {
//       return Swal.fire({
//         icon: 'error',
//         title: 'Not logged in',
//         text: 'Please log in to set a reminder.'
//       });
//     }

//     try {
//       const res = await fetch('http://localhost:5000/api/reminder', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message,
//           remindAt: dateTime,
//           email: user.email,
//           userId: user.id,
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Reminder Set!',
//           text: data.message || 'Your reminder was successfully saved.'
//         });
//         setMessage('');
//         setDateTime('');
//       } else {
//         throw new Error(data.error || 'Something went wrong');
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Failed to Set Reminder',
//         text: err.message
//       });
//     }
//   };

//   return (
//     <div className="container">
//       <h1>🔔 Set a Reminder</h1>
//       <input
//         type="text"
//         placeholder="Reminder message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <input
//         type="datetime-local"
//         value={dateTime}
//         onChange={(e) => setDateTime(e.target.value)}
//       />
//       <button id="btn" onClick={handleSetReminder}>✅ Set Reminder</button>
//     </div>
//   );
// };

// export default Reminder;


// components/Reminder.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Reminder = () => {
  const [message, setMessage] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSetReminder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return Swal.fire({
        icon: 'error',
        title: 'Not logged in',
        text: 'Please log in to set a reminder.',
        confirmButtonColor: '#f512c0',
      });
    }

    if (!message.trim() || !dateTime) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter both a reminder message and a date/time.',
        confirmButtonColor: '#f512c0',
      });
    }

    try {
      const res = await axios.post('http://localhost:5000/api/reminder', {
        message,
        remindAt: dateTime,
        email: user.email,
        userId: user.id,
      });

      Swal.fire({
        icon: 'success',
        title: 'Reminder Set!',
        text: res.data.message || 'Your reminder was successfully saved.',
        confirmButtonColor: '#1cd6eb',
      });

      setMessage('');
      setDateTime('');

    } catch (err) {
      console.error('Reminder error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Set Reminder',
        text: err.response?.data?.error || err.message || 'Something went wrong.',
        confirmButtonColor: '#f512c0',
      });
    }
  };

  return (
    <div className="container">
      <h1>🔔 Set a Reminder</h1>
      <input
        type="text"
        placeholder="Reminder message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ padding: '8px', margin: '10px', width: '300px' }}
      />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        style={{ padding: '8px', margin: '10px' }}
      />
      <button id="btn" onClick={handleSetReminder} style={{ padding: '8px 16px', margin: '10px' }}>
        ✅ Set Reminder
      </button>
    </div>
  );
};

export default Reminder;
