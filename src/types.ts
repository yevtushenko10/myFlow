export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  createdAt: number;
  dueDate?: string; // YYYY-MM-DD
};

export type Note = {
  id: string;
  content: string;
  updatedAt: number;
};

export type Habit = {
  id: string;
  name: string;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
};

export type Reminder = {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  completed: boolean;
};

export type UserSettings = {
  name: string;
  theme: 'light' | 'dark';
};

export { useLocalStorage } from './hooks/useFirestore';
