import { useSyncExternalStore, useCallback, useRef } from "react";

function getStorageValue<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? (JSON.parse(item) as T) : defaultValue;
    } catch {
        return defaultValue;
    }
}

const subscribers = new Map<string, Set<() => void>>();

function notifySubscribers(key: string) {
    subscribers.get(key)?.forEach((callback) => callback());
}

export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
    const defaultValueRef = useRef(defaultValue);

    const subscribe = useCallback(
        (callback: () => void) => {
            if (!subscribers.has(key)) {
                subscribers.set(key, new Set());
            }
            subscribers.get(key)!.add(callback);

            const handleStorage = (e: StorageEvent) => {
                if (e.key === key) callback();
            };
            window.addEventListener("storage", handleStorage);

            return () => {
                subscribers.get(key)!.delete(callback);
                if (subscribers.get(key)!.size === 0) {
                    subscribers.delete(key);
                }
                window.removeEventListener("storage", handleStorage);
            };
        },
        [key],
    );

    const getSnapshot = useCallback(
        () => getStorageValue(key, defaultValueRef.current),
        [key],
    );

    const getServerSnapshot = useCallback(
        () => defaultValueRef.current,
        [],
    );

    const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setValue = useCallback(
        (newValue: T | ((prev: T) => T)) => {
            const current = getStorageValue(key, defaultValueRef.current);
            const resolved =
                typeof newValue === "function"
                    ? (newValue as (prev: T) => T)(current)
                    : newValue;
            try {
                localStorage.setItem(key, JSON.stringify(resolved));
            } catch {
                // storage full or unavailable
            }
            notifySubscribers(key);
        },
        [key],
    );

    return [value, setValue];
}
