import { useCallback, useRef } from 'react'

export function useEventCallback<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(callback: T = (() => {}) as T): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return callbackRef.current(...args)
  }, []) as T
}
