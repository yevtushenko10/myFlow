import React, { useState } from 'react';
import { useLocalStorage, Reminder } from '../types';
import { Plus, Bell, Clock, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { cn } from '../lib/utils';

export default function Reminders() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);
  const [text, setText] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !time || !date) return;
    
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      text,
      date,
      time,
      completed: false,
    };
    
    setReminders([...reminders, newReminder].sort((a, b) => {
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;
      return dateTimeA.localeCompare(dateTimeB);
    }));
    setText('');
    setTime(format(new Date(), 'HH:mm'));
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getDateLabel = (dateStr: string) => {
    const d = parseISO(dateStr);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reminders</h2>
          <p className="text-muted-foreground text-sm">Don't forget the little things</p>
        </div>
      </header>

      <form onSubmit={addReminder} className="ios-card p-4 space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
          <Bell size={20} className="text-purple-500" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Remind me to..."
            className="flex-1 bg-transparent py-1 outline-none text-lg"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none text-xs font-bold"
              />
            </div>
            <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent outline-none text-xs font-bold"
              />
            </div>
          </div>
          <button type="submit" className="ios-btn bg-purple-500 text-white px-6 py-2 rounded-xl font-bold text-sm ml-auto">
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {reminders.map((reminder) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={reminder.id}
              className="ios-card p-4 flex items-center gap-4 group"
            >
              <button 
                onClick={() => toggleReminder(reminder.id)}
                className={cn(
                  "transition-colors flex-shrink-0",
                  reminder.completed ? "text-purple-500" : "text-gray-300"
                )}
              >
                {reminder.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-lg transition-all truncate",
                  reminder.completed && "text-gray-400 line-through"
                )}>
                  {reminder.text}
                </p>
                <div className="flex items-center gap-2 text-purple-500 font-bold text-[10px] uppercase tracking-wider">
                  <span>{getDateLabel(reminder.date)}</span>
                  <span>•</span>
                  <span>{reminder.time}</span>
                </div>
              </div>

              <button 
                onClick={() => deleteReminder(reminder.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
