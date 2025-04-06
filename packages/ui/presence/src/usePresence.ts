import { useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useEventCallback } from '@barebone-ui/hooks'

type PresenceState = 'MOUNTED' | 'UNMOUNT_SUSPENDED' | 'UNMOUNTED'
type PresenceAction =
  | { type: 'mount' }
  | { type: 'unmount' }
  | { type: 'unmountSuspend' }

const TRANSITION_MAP: Record<
  PresenceState,
  Partial<Record<PresenceAction['type'], PresenceState>>
> = {
  MOUNTED: {
    unmount: 'UNMOUNTED',
    unmountSuspend: 'UNMOUNT_SUSPENDED',
  },
  UNMOUNT_SUSPENDED: {
    mount: 'MOUNTED',
    unmount: 'UNMOUNTED',
  },
  UNMOUNTED: {
    mount: 'MOUNTED',
  },
}

export function usePresence(present: boolean) {
  const elementRef = useRef<HTMLElement | null>(null)
  const stylesRef = useRef<CSSStyleDeclaration | null>(null)
  const unmountAnimationNameRef = useRef<string | null>(null)
  const prevAnimationNameRef = useRef<string | null>(null)

  const [state, dispatch] = useReducer(
    (state: PresenceState, action: PresenceAction) => {
      const nextState = TRANSITION_MAP[state][action.type]
      return nextState ?? state
    },
    present ? 'MOUNTED' : 'UNMOUNTED',
  )

  const mountAction = useEventCallback(() => {
    dispatch({ type: 'mount' })
    requestAnimationFrame(() => {
      prevAnimationNameRef.current = getAnimationName(stylesRef.current)
    })
  })

  const unmountAction = useEventCallback(() => {
    dispatch({ type: 'unmount' })
    prevAnimationNameRef.current = null
  })

  useLayoutEffect(() => {
    if (present) {
      mountAction()
      return
    }

    if (
      !present &&
      elementRef.current?.ownerDocument.visibilityState === 'hidden'
    ) {
      unmountAction()
      return
    }

    const animationName = getAnimationName(stylesRef.current)
    requestAnimationFrame(() => {
      unmountAnimationNameRef.current = animationName
      if (
        animationName === 'none' ||
        animationName === prevAnimationNameRef.current ||
        stylesRef.current?.display === 'none' ||
        stylesRef.current?.animationDuration === '0s'
      ) {
        unmountAction()
      } else {
        dispatch({ type: 'unmountSuspend' })
      }
    })
  }, [present, mountAction, unmountAction])

  useEffect(
    function trackAnimationEvents() {
      if (state !== 'UNMOUNT_SUSPENDED') return
      if (!elementRef.current) return
      const element = elementRef.current

      const onStart = (event: AnimationEvent) => {
        const target = event.composedPath?.()?.[0] ?? event.target
        if (target === element) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current)
        }
      }

      const onEnd = (event: AnimationEvent) => {
        const animationName = getAnimationName(stylesRef.current)
        const target = event.composedPath?.()?.[0] ?? event.target
        if (
          target === element &&
          animationName === unmountAnimationNameRef.current
        ) {
          ReactDOM.flushSync(() => unmountAction())
        }
      }

      element.addEventListener('animationstart', onStart)
      element.addEventListener('animationcancel', onEnd)
      element.addEventListener('animationend', onEnd)

      return () => {
        element.removeEventListener('animationstart', onStart)
        element.removeEventListener('animationcancel', onEnd)
        element.removeEventListener('animationend', onEnd)
      }
    },
    [state, unmountAction],
  )

  return {
    isPresent: state === 'MOUNTED' || state === 'UNMOUNT_SUSPENDED',
    ref: (element: HTMLElement | null) => {
      if (!element) return
      elementRef.current = element
      stylesRef.current = getComputedStyle(element)
    },
  } as const
}

function getAnimationName(styles?: CSSStyleDeclaration | null) {
  return styles?.animationName || 'none'
}
