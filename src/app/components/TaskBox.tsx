'use client';

import { useState, useEffect } from 'react';
import { taskStorage, Task } from '@/lib/task-storage';

export default function TaskBox() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = taskStorage.subscribe(setTasks);
    return unsubscribe;
  }, []);

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      taskStorage.updateTask(id, { completed: !task.completed });
    }
  };

  const deleteTask = (id: string) => {
    taskStorage.deleteTask(id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const displayTasks = showCompleted ? completedTasks : activeTasks;

  return (
    <div className="task-box">
      <div className="task-box-header">
        <h3>📋 Task Box ({activeTasks.length} active)</h3>
        <div className="task-box-controls">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`task-toggle-btn ${showCompleted ? 'active' : ''}`}
          >
            {showCompleted ? 'Hide' : 'Show'} Completed
          </button>
        </div>
      </div>

      <div className="task-list">
        {displayTasks.length === 0 ? (
          <div className="task-empty">
            <p>{showCompleted ? 'No completed tasks' : 'No active tasks'}</p>
            <p className="task-empty-hint">
              {showCompleted ? 'Complete some tasks first!' : 'Add tasks using the AI assistant'}
            </p>
          </div>
        ) : (
          displayTasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="task-checkbox"
                  title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {task.completed ? '✅' : '⭕'}
                </button>
                <div className="task-text">
                  <span className="task-text-content">{task.text}</span>
                  <div className="task-meta">
                    <span 
                      className="task-priority"
                      style={{ color: getPriorityColor(task.priority) }}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="task-date">
                      {task.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="task-delete"
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


