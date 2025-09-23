export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

class TaskStorage {
  private tasks: Task[] = [];
  private listeners: ((tasks: Task[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('productivity-tasks');
      if (stored) {
        try {
          this.tasks = JSON.parse(stored).map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          }));
        } catch (error) {
          console.error('Failed to load tasks from storage:', error);
          this.tasks = [];
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('productivity-tasks', JSON.stringify(this.tasks));
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.tasks]));
  }

  addTask(text: string, priority: 'low' | 'medium' | 'high' = 'medium'): Task {
    const task: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority
    };
    
    this.tasks.unshift(task); // Add to beginning
    this.saveToStorage();
    this.notifyListeners();
    
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    this.saveToStorage();
    this.notifyListeners();
    
    return true;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    
    this.tasks.splice(index, 1);
    this.saveToStorage();
    this.notifyListeners();
    
    return true;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getActiveTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

  subscribe(listener: (tasks: Task[]) => void): () => void {
    this.listeners.push(listener);
    // Call immediately with current tasks
    listener([...this.tasks]);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const taskStorage = new TaskStorage();


