import React, { useState } from 'react';
import { useLocalStorage, Habit } from '../types';
import { Plus, Check, Flame, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfToday, subDays, eachDayOfInterval } from 'date-fns';
import { cn } from '../lib/utils';

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [newHabitName, setNewHabitName] = useState('');
  
  // Get last 7 days including today
  const last7Days = eachDayOfInterval({
    start: subDays(startOfToday(), 6),
    end: startOfToday()
  }).map(date => format(date, 'yyyy-MM-dd'));

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      streak: 0,
      completedDates: [],
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabitDate = (habitId: string, dateStr: string) => {
    setHabits(habits.map(h => {
      if (h.id !== habitId) return h;
      
      const isCompleted = h.completedDates.includes(dateStr);
      let newDates = [...h.completedDates];
      
      if (isCompleted) {
        newDates = newDates.filter(d => d !== dateStr);
      } else {
        newDates.push(dateStr);
      }
      
      // Recalculate streak (consecutive days back from today)
      let streak = 0;
      let checkDate = startOfToday();
      while (newDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
        streak++;
        checkDate = subDays(checkDate, 1);
      }
      
      return { ...h, completedDates: newDates, streak };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const moveHabit = (index: number, direction: 'up' | 'down') => {
    const newHabits = [...habits];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newHabits.length) return;
    
    const [movedHabit] = newHabits.splice(index, 1);
    newHabits.splice(targetIndex, 0, movedHabit);
    setHabits(newHabits);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Habits</h2>
          <p className="text-muted-foreground text-sm">Weekly progress</p>
        </div>
      </header>

      <form onSubmit={addHabit} className="ios-card p-1 flex items-center gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New habit..."
          className="flex-1 bg-transparent px-4 py-3 outline-none"
        />
        <button type="submit" className="ios-btn bg-orange-500 text-white p-3 rounded-xl">
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {habits.map((habit, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={habit.id}
              className="ios-card p-5 space-y-4 group"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1 transition-opacity">
                    <button 
                      onClick={() => moveHabit(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-300 hover:text-orange-500 disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveHabit(index, 'down')}
                      disabled={index === habits.length - 1}
                      className="text-gray-300 hover:text-orange-500 disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{habit.name}</h3>
                    <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      <Flame size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{habit.streak}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl">
                {last7Days.map((dateStr) => {
                  const isDone = habit.completedDates.includes(dateStr);
                  const dayLabel = format(new Date(dateStr), 'EEEEE');
                  const isTodayDate = dateStr === format(startOfToday(), 'yyyy-MM-dd');
                  
                  return (
                    <div key={dateStr} className="flex flex-col items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        isTodayDate ? "text-orange-500" : "text-gray-400"
                      )}>
                        {dayLabel}
                      </span>
                      <button
                        onClick={() => toggleHabitDate(habit.id, dateStr)}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all border-2",
                          isDone 
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm" 
                            : "bg-white border-gray-200 text-transparent"
                        )}
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
