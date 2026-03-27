import React, { useState, useRef } from 'react';
import { useLocalStorage, UserSettings } from '../types';
import { User, Moon, Sun, ChevronRight, Edit2, Check, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('user-settings', {
    name: 'User',
    theme: 'light'
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(settings.name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    setSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const handleEditName = () => {
    if (isEditingName) {
      setSettings({ ...settings, name: tempName });
      setIsEditingName(false);
    } else {
      setIsEditingName(true);
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">Personalize your experience</p>
      </header>

      <div className="space-y-4">
        <div className="ios-card overflow-hidden">
          <div className="p-4 flex items-center gap-4 border-b border-[var(--border-ios)]">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
              <User size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-bold uppercase text-gray-400 block">Display Name</label>
              <input
                ref={nameInputRef}
                type="text"
                readOnly={!isEditingName}
                value={isEditingName ? tempName : settings.name}
                onChange={(e) => setTempName(e.target.value)}
                className={cn(
                  "w-full bg-transparent outline-none text-lg font-medium transition-all",
                  isEditingName ? "text-blue-500 bg-blue-50/50 px-2 rounded" : "text-[var(--text-ios)]"
                )}
                placeholder="Your name"
              />
            </div>
            <button 
              onClick={handleEditName}
              className={cn(
                "p-2 rounded-full transition-colors",
                isEditingName ? "bg-green-500 text-white" : "text-gray-300 hover:text-blue-500"
              )}
            >
              {isEditingName ? <Check size={18} /> : <Edit2 size={18} />}
            </button>
          </div>

          <button 
            onClick={toggleTheme}
            className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                settings.theme === 'light' ? "bg-orange-400" : "bg-indigo-600"
              )}>
                {settings.theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <span className="font-medium text-lg">Appearance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 capitalize">{settings.theme} Mode</span>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          </button>
        </div>

        <div className="ios-card p-4 space-y-3">
          <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Support</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium uppercase">Contact Email</p>
              <a 
                href="mailto:sashaggwp84@gmail.com" 
                className="text-blue-500 font-semibold text-lg hover:underline active:opacity-70 transition-opacity"
              >
                sashaggwp84@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="ios-card p-4 space-y-4">
          <h3 className="text-sm font-bold uppercase text-gray-400">About myFlow</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            myFlow is your unified personal dashboard. Designed for speed, privacy, and simplicity.
          </p>
          <div className="text-[10px] text-gray-400 font-mono">Version 2.2.0 • Local Storage Mode</div>
        </div>
      </div>
    </div>
  );
}
