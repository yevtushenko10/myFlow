import React from 'react';
import { useLocalStorage, Todo, Habit, Reminder } from '../types';
import { BarChart3, PieChart, Activity, CheckCircle2, Bell, Flame } from 'lucide-react';
import { format, startOfToday, subDays, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

export default function Analytics() {
  const [todos] = useLocalStorage<Todo[]>('todos', []);
  const [habits] = useLocalStorage<Habit[]>('habits', []);
  const [reminders] = useLocalStorage<Reminder[]>('reminders', []);

  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const todoRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const completedReminders = reminders.filter(r => r.completed).length;
  const totalReminders = reminders.length;
  const reminderRate = totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0;

  const last7Days = eachDayOfInterval({
    start: subDays(startOfToday(), 6),
    end: startOfToday()
  });

  const habitCompletionData = last7Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
    return { date: format(date, 'EEE'), count: completedCount };
  });

  const maxHabits = habits.length || 1;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground text-sm">Your weekly productivity</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="ios-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase">Tasks</span>
          </div>
          <div className="text-2xl font-bold">{todoRate}%</div>
          <div className="text-[10px] text-gray-400 font-medium">Completion Rate</div>
        </div>
        <div className="ios-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-500">
            <Bell size={18} />
            <span className="text-xs font-bold uppercase">Reminders</span>
          </div>
          <div className="text-2xl font-bold">{reminderRate}%</div>
          <div className="text-[10px] text-gray-400 font-medium">Completion Rate</div>
        </div>
      </div>

      <div className="ios-card p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Activity size={20} className="text-orange-500" />
            Habit Consistency
          </h3>
        </div>

        <div className="flex items-end justify-between h-32 gap-2">
          {habitCompletionData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 dark:bg-white/5 rounded-t-lg relative flex items-end overflow-hidden h-24">
                <div 
                  className="w-full bg-orange-500 transition-all duration-500"
                  style={{ height: `${(data.count / maxHabits) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">{data.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ios-card p-5 space-y-4">
        <h3 className="font-bold text-lg">Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Total Activities</span>
            <span className="font-bold">{totalTodos + totalReminders + habits.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Longest Streak</span>
            <span className="font-bold text-orange-500 flex items-center gap-1">
              <Flame size={14} fill="currentColor" />
              {Math.max(...habits.map(h => h.streak), 0)} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
