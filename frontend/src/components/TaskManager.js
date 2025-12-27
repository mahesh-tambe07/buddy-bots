// // 📁 src/components/TaskManager.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './TaskManager.css';

// const TaskManager = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [editTaskId, setEditTaskId] = useState(null);
//   const [editText, setEditText] = useState('');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = () => {
//     axios.get('http://localhost:5000/api/tasks')
//       .then(res => setTasks(res.data))
//       .catch(err => console.error('Error fetching tasks:', err));
//   };

//   const addTask = () => {
//     if (!newTask.trim()) return;
//     axios.post('http://localhost:5000/api/tasks', { task: newTask, due_date: dueDate })
//       .then(res => {
//         setTasks([...tasks, res.data]);
//         setNewTask('');
//         setDueDate('');
//       })
//       .catch(err => console.error('Error adding task:', err));
//   };

//   const deleteTask = (id) => {
//     axios.delete(`http://localhost:5000/api/tasks/${id}`)
//       .then(() => fetchTasks())
//       .catch(err => console.error('Error deleting task:', err));
//   };

//   const toggleComplete = (id, currentStatus) => {
//     axios.put(`http://localhost:5000/api/tasks/${id}`, { status: currentStatus === 'completed' ? 'pending' : 'completed' })
//       .then(() => fetchTasks())
//       .catch(err => console.error('Error updating status:', err));
//   };

//   const startEdit = (task) => {
//     setEditTaskId(task.id);
//     setEditText(task.task);
//   };

//   const saveEdit = (id) => {
//     axios.put(`http://localhost:5000/api/tasks/${id}`, { task: editText })
//       .then(() => {
//         fetchTasks();
//         setEditTaskId(null);
//         setEditText('');
//       })
//       .catch(err => console.error('Error editing task:', err));
//   };

//   return (
//     <div className="task-manager">
//       <h2>📋 Task Manager</h2>
//       <div className="task-input">
//         <input
//           type="text"
//           placeholder="Enter new task"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//         />
//         <input
//           type="date"
//           value={dueDate}
//           onChange={(e) => setDueDate(e.target.value)}
//         />
//         <button onClick={addTask}>Add</button>
//       </div>

//       <ul className="task-list">
//         {tasks.map((task) => (
//           <li key={task.id} className="task-item">
//             <div className="task-content">
//               {editTaskId === task.id ? (
//                 <>
//                   <input
//                     type="text"
//                     value={editText}
//                     onChange={(e) => setEditText(e.target.value)}
//                   />
//                   <button onClick={() => saveEdit(task.id)}>💾 Save</button>
//                 </>
//               ) : (
//                 <>
//                   <p className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>📝 {task.task}</p>
//                   <p className="task-info">
//                     <span>Status: <strong>{task.status}</strong></span><br />
//                     <span>Created At: <strong>{new Date(task.created_at).toLocaleString()}</strong></span><br />
//                     <span>Due Date: <strong>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</strong></span>
//                   </p>
//                   <button onClick={() => toggleComplete(task.id, task.status)}>
//                     {task.status === 'completed' ? '↩️ Mark Pending' : '✔️ Complete'}
//                   </button>
//                   <button onClick={() => startEdit(task)}>✏️ Edit</button>
//                   <button onClick={() => deleteTask(task.id)}>🗑 Delete</button>
//                 </>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TaskManager;


// src/components/TaskManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error('Error fetching tasks:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch tasks.',
          confirmButtonColor: '#f512c0',
        });
      });
  };

  const addTask = () => {
    if (!newTask.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Empty Task',
        text: 'Please enter a task before adding.',
        confirmButtonColor: '#f512c0',
      });
    }

    axios.post('http://localhost:5000/api/tasks', { task: newTask, due_date: dueDate })
      .then(res => {
        setTasks([...tasks, res.data]);
        setNewTask('');
        setDueDate('');
        Swal.fire({
          icon: 'success',
          title: 'Task Added',
          text: 'Your task was added successfully!',
          confirmButtonColor: '#1cd6eb',
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(err => {
        console.error('Error adding task:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add task.',
          confirmButtonColor: '#f512c0',
        });
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        fetchTasks();
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Task deleted successfully.',
          confirmButtonColor: '#1cd6eb',
          timer: 1200,
          showConfirmButton: false,
        });
      })
      .catch(err => {
        console.error('Error deleting task:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete task.',
          confirmButtonColor: '#f512c0',
        });
      });
  };

  const toggleComplete = (id, currentStatus) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`, { status: currentStatus === 'completed' ? 'pending' : 'completed' })
      .then(() => {
        fetchTasks();
      })
      .catch(err => {
        console.error('Error updating status:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update task status.',
          confirmButtonColor: '#f512c0',
        });
      });
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditText(task.task);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Empty Task',
        text: 'Task cannot be empty.',
        confirmButtonColor: '#f512c0',
      });
    }

    axios.put(`http://localhost:5000/api/tasks/${id}`, { task: editText })
      .then(() => {
        fetchTasks();
        setEditTaskId(null);
        setEditText('');
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Task updated successfully!',
          confirmButtonColor: '#1cd6eb',
          timer: 1200,
          showConfirmButton: false,
        });
      })
      .catch(err => {
        console.error('Error editing task:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update task.',
          confirmButtonColor: '#f512c0',
        });
      });
  };

  return (
    <div className="task-manager">
      <h2>📋 Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>💾 Save</button>
                </>
              ) : (
                <>
                  <p className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                    📝 {task.task}
                  </p>
                  <p className="task-info">
                    <span>Status: <strong>{task.status}</strong></span><br />
                    <span>Created At: <strong>{new Date(task.created_at).toLocaleString()}</strong></span><br />
                    <span>Due Date: <strong>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</strong></span>
                  </p>
                  <button onClick={() => toggleComplete(task.id, task.status)}>
                    {task.status === 'completed' ? '↩️ Mark Pending' : '✔️ Complete'}
                  </button>
                  <button onClick={() => startEdit(task)}>✏️ Edit</button>
                  <button onClick={() => deleteTask(task.id)}>🗑 Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
