'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import DeleteTaskModal from './DeleteTaskModale';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data.slice(0, 10)); 
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
    
    const taskData = { title: newTask, completed: false, status: 'Pending', priority: 'Medium' };
    try {
      const response = await axios.post(API_URL, taskData);
      setTasks([response.data, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
    
    setNewTask('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed, status: task.completed ? 'Pending' : 'Done' } : task));
  };

  const confirmDeleteTask = (id) => {
    setTaskToDelete(id);
    setIsModalOpen(true);
  };

  const deleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await axios.delete(`${API_URL}/${taskToDelete}`);
      setTasks(tasks.filter(task => task.id !== taskToDelete));
    } catch (error) {
      console.error('Error deleting task:', error);
    }

    setTaskToDelete(null);
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">All Tasks</h1>
      <div className="mb-4 flex gap-2">
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded">Add a New Task</button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Tasks</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Priority</th>
              <th className="p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-2">{task.title}</td>
                <td className="p-2 text-center">
                  {task.completed ? (
                    <p className="flex items-center justify-center gap-1">
                      <span className="w-4 h-4 flex items-center justify-center bg-green-600 text-white rounded-full">✔</span>
                      Done
                    </p>
                  ) : (
                    <p className="flex items-center justify-center gap-1">
                      <span className="w-4 h-4 flex items-center justify-center bg-gray-400 text-grey-400 rounded-full"></span>
                      Pending
                    </p>
                  )}
                </td>
                <td className="p-2 text-center">
                    <span
                        className={`px-2 py-1 rounded ${
                        task.priority === "Urgent"
                            ? "bg-red-500 text-white"
                            : task.priority === "High"
                            ? "bg-orange-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                    >
                        {task.priority}
                    </span>
                    </td>

                <td className="p-2 text-center">
                  <button onClick={() => confirmDeleteTask(task.id)} className="text-red-500">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteTask}
      />
    </div>
  );
}
