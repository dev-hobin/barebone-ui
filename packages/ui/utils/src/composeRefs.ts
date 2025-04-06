import { RefCallback, RefObject } from 'react'

export type PossibleRef<T> =
  | ((instance: T | null) => void | (() => void))
  | RefObject<T | null>
  | undefined
  | null

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    return ref(value)
  } else if (ref !== null && ref !== undefined) {
    ref.current = value
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node) => {
    const cleanups: (() => void)[] = []

    refs.forEach((ref) => {
      const cleanup = setRef(ref, node)
      if (typeof cleanup == 'function') {
        cleanups.push(cleanup)
      }
    })

    if (cleanups.length > 0) {
      return () => {
        cleanups.forEach((cleanup) => cleanup())
      }
    }
  }
}
