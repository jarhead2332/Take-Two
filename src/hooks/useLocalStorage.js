import { useCallback, useEffect, useState } from 'react';

// Persist a piece of state to localStorage under `key`.
// On first run (key missing or unparseable), falls back to `seed`.
// Every update is written back to localStorage immediately.
export function useLocalStorage(key, seed) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return seed;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return seed;
      return JSON.parse(raw);
    } catch {
      return seed;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable (e.g. private mode) — keep working in-memory.
    }
  }, [key, value]);

  // Keep multiple tabs/windows on the same device in sync.
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== key || e.newValue == null) return;
      try {
        setValue(JSON.parse(e.newValue));
      } catch {
        // ignore malformed external writes
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const reset = useCallback(() => setValue(seed), [seed]);

  return [value, setValue, reset];
}
