import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Fixed collection path — no auth needed, personal app only
const STORE = 'myflow-store';

/**
 * Drop-in replacement for useLocalStorage.
 * Syncs with Firestore in real-time across all devices.
 * Falls back to localStorage if Firebase is not configured.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const isConfigured = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

  const [storedValue, setStoredValueState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const storedValueRef = useRef(storedValue);
  storedValueRef.current = storedValue;

  // Firestore real-time listener
  useEffect(() => {
    if (!isConfigured) return;

    const docRef = doc(db, STORE, key);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const remote = snap.data().value as T;
        setStoredValueState(remote);
        try { window.localStorage.setItem(key, JSON.stringify(remote)); } catch {}
      } else {
        // First run: push existing localStorage data to Firestore
        try {
          const item = window.localStorage.getItem(key);
          const seed = item ? JSON.parse(item) : initialValue;
          setDoc(docRef, { value: seed });
        } catch {
          setDoc(docRef, { value: initialValue });
        }
      }
    });

    return unsubscribe;
  }, [key, isConfigured]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function'
      ? (value as (prev: T) => T)(storedValueRef.current)
      : value;

    setStoredValueState(newValue);
    try { window.localStorage.setItem(key, JSON.stringify(newValue)); } catch {}

    if (isConfigured) {
      const docRef = doc(db, STORE, key);
      setDoc(docRef, { value: newValue }).catch(console.error);
    }
  }, [key, isConfigured]);

  return [storedValue, setValue] as const;
}
