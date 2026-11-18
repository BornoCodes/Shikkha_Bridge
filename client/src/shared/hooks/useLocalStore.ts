import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';

/**
 * Tiny localStorage-backed state that stays in sync across every component
 * (and browser tab) that uses the same key. Used for the profile character,
 * the guide's looks, sound on/off and the kids/university mode.
 *
 * Pass a module-level constant as `initial` so its identity stays stable.
 */
const listeners = new Map<string, Set<() => void>>();

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function subscribe(key: string) {
  return (cb: () => void) => {
    let set = listeners.get(key);
    if (!set) listeners.set(key, (set = new Set()));
    set.add(cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) cb();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      set!.delete(cb);
      window.removeEventListener('storage', onStorage);
    };
  };
}

export function useLocalStore<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void] {
  const initialRef = useRef(initial);
  const sub = useMemo(() => subscribe(key), [key]);
  const raw = useSyncExternalStore(sub, () => read(key), () => null);

  const value = useMemo<T>(() => {
    if (raw == null) return initialRef.current;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialRef.current;
    }
  }, [raw]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      let prev = initialRef.current;
      const current = read(key);
      if (current != null) {
        try {
          prev = JSON.parse(current) as T;
        } catch {
          /* keep initial */
        }
      }
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* storage full or blocked: ignore */
      }
      listeners.get(key)?.forEach((cb) => cb());
    },
    [key],
  );

  return [value, set];
}
