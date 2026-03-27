import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  FileText,
  Activity,
  Bell,
  BarChart3,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TodoList from './components/TodoList';
import Notes from './components/Notes';
import HabitTracker from './components/HabitTracker';
import Reminders from './components/Reminders';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import { cn } from './lib/utils';
import { useLocalStorage, UserSettings } from './types';

type Tab = 'tasks' | 'notes' | 'habits' | 'reminders' | 'analytics' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [settings] = useLocalStorage<UserSettings>('user-settings', {
    name: 'User',
    theme: 'light'
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const tabs: { id: Tab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'text-blue-500' },
    { id: 'notes', label: 'Notes', icon: FileText, color: 'text-yellow-500' },
    { id: 'analytics', label: 'Stats', icon: BarChart3, color: 'text-green-500' },
    { id: 'habits', label: 'Habits', icon: Activity, color: 'text-orange-500' },
    { id: 'reminders', label: 'Reminders', icon: Bell, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[var(--bg-ios)] relative overflow-hidden transition-colors duration-300">
      {activeTab !== 'settings' && (
        <header className="px-6 pt-12 pb-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              myFlow
            </h1>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ios-btn transition-colors",
              activeTab === 'settings' ? "bg-gray-800" : "bg-blue-500 shadow-blue-200 dark:shadow-none"
            )}
          >
            <User size={20} />
          </button>
        </header>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'tasks' && <TodoList />}
            {activeTab === 'notes' && <Notes />}
            {activeTab === 'habits' && <HabitTracker />}
            {activeTab === 'reminders' && <Reminders />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'settings' && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[var(--card-ios)]/80 backdrop-blur-xl border-t border-[var(--border-ios)] px-4 pt-3 pb-8 z-40">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200",
                  isActive ? tab.color : "text-gray-400"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive && "bg-current/10"
                )}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
