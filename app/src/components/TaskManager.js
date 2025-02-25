'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data.slice(0, 5)); // Limit to 5 tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    const taskData = { title: newTask, completed: false };
    try {
      const response = await axios.post(API_URL, taskData);
      setTasks([response.data, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
    
    setNewTask('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Task Manager</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a new task"
          className="p-2 border rounded flex-1"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="p-2 bg-white flex justify-between items-center rounded shadow">
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleComplete(task.id)} className="text-green-500">✔</button>
                <button onClick={() => deleteTask(task.id)} className="text-red-500">✖</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
