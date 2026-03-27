import React, { useState } from 'react';
import { useLocalStorage, Todo } from '../types';
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Edit2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { format, isPast, isToday, parseISO } from 'date-fns';

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Personal');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const categories = ['Personal', 'Work', 'Urgent', 'Shopping'];

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      category,
      createdAt: Date.now(),
      dueDate: dueDate || undefined,
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
    setDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text: editValue } : t));
    setEditingId(null);
  };

  const getDueDateLabel = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">To-do List</h2>
          <p className="text-muted-foreground text-sm">{todos.filter(t => !t.completed).length} tasks remaining</p>
        </div>
      </header>

      <form onSubmit={addTodo} className="space-y-3">
        <div className="ios-card p-1 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent px-4 py-3 outline-none text-lg"
          />
          <button type="submit" className="ios-btn bg-blue-500 text-white p-3 rounded-xl">
            <Plus size={24} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-500">
            <Calendar size={14} />
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent outline-none text-xs font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap",
                  category === cat 
                    ? "bg-blue-500 text-white border-blue-500" 
                    : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={todo.id}
              className="ios-card p-4 flex items-center gap-4 group"
            >
              <button 
                onClick={() => toggleTodo(todo.id)}
                className={cn(
                  "transition-colors flex-shrink-0",
                  todo.completed ? "text-blue-500" : "text-gray-300"
                )}
              >
                {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1 min-w-0">
                {editingId === todo.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                      className="flex-1 bg-gray-50 px-2 py-1 rounded outline-none text-lg"
                    />
                  </div>
                ) : (
                  <p className={cn(
                    "text-lg transition-all truncate",
                    todo.completed && "text-gray-400 line-through"
                  )}>
                    {todo.text}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                    {todo.category}
                  </span>
                  {todo.dueDate && (
                    <span className={cn(
                      "text-[10px] font-bold flex items-center gap-1",
                      !todo.completed && isPast(parseISO(todo.dueDate)) && !isToday(parseISO(todo.dueDate)) 
                        ? "text-red-500" 
                        : "text-gray-400"
                    )}>
                      <Calendar size={10} />
                      {getDueDateLabel(todo.dueDate)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => startEditing(todo)}
                  className="text-blue-400 hover:text-blue-600 p-2 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-600 p-2 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
