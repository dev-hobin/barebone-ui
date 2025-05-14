import { ReactNode, useEffect, useId } from 'react'
import { handleSync } from '@barebone-ui/utils'
import { useEventCallback } from '@barebone-ui/hooks'
import { dismissLayer } from '@barebone-ui/dismiss-layer'
import * as focusTrap from 'focus-trap'
import { DialogProvider } from '../providers'
import { useDialog } from '../reducers/dialogReducer'
import {
  getBackdropEl,
  getContentEl,
  getBackdropId,
  getContentId,
  inertBackground,
} from '../dom'

export interface RootProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children?: ReactNode
  closeOnEscape?: boolean
  closeOnInteractOutside?: boolean
}

export function Root({
  closeOnEscape = true,
  closeOnInteractOutside = true,
  ...props
}: RootProps) {
  const [state, dispatch] = useDialog({
    context: {
      id: useId(),
      open: props.open ?? props.defaultOpen ?? false,
    },
    action: {
      onOpenChange: useEventCallback(props.onOpenChange ?? (() => {})),
    },
  })

  // 외부에서 변경된 상태를 동기화
  handleSync({
    target: state.context,
    source: props,
    keys: ['open'],
    handler: (context) => {
      dispatch({
        type: 'SYNC',
        payload: context,
      })
    },
  })

  // dismissLayer에 등록
  useEffect(() => {
    if (state.context.open) {
      dismissLayer.register(state.context.id, () => {
        dispatch({ type: 'CLOSE' })
      })
    }

    return () => {
      dismissLayer.dismiss(state.context.id)
    }
  }, [state.context.id, dispatch, state.context.open])

  // 포커스 가두는 이팩트
  useEffect(() => {
    const contentEl = getContentEl(state.context.id)
    if (!state.context.open || !contentEl) {
      return
    }

    const trap = focusTrap
      .createFocusTrap(contentEl, {
        fallbackFocus: contentEl,
      })
      .activate()

    return () => {
      trap.deactivate()
    }
  }, [state.context.id, state.context.open])

  // 배경 요소 inert 처리 이팩트
  useEffect(() => {
    const contentEl = getContentEl(state.context.id)
    if (!state.context.open || !contentEl) {
      return
    }

    const interactive = inertBackground(
      getContentId(state.context.id),
      getBackdropId(state.context.id),
    )
    return () => {
      interactive()
    }
  }, [state.context.id, state.context.open])

  // 모달 open 상태에 따라 스크롤 제어
  useEffect(() => {
    if (state.context.open) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [state.context.open])

  // ESC 눌렀을 때 닫기
  useEffect(() => {
    if (!state.context.open || !closeOnEscape) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissLayer.dismiss(state.context.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [state.context.open, closeOnEscape, state.context.id])

  // 배경 요소 클릭 시 다이얼로그 닫기
  useEffect(() => {
    if (!state.context.open || !closeOnInteractOutside) {
      return
    }

    const backdropEl = getBackdropEl(state.context.id)
    const contentEl = getContentEl(state.context.id)

    if (!backdropEl || !contentEl) {
      return
    }

    const handleClick = (event: MouseEvent) => {
      if (contentEl.contains(event.target as Node)) {
        return
      }

      dismissLayer.dismiss(state.context.id)
    }

    window.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('click', handleClick, true)
    }
  }, [state.context.open, closeOnInteractOutside, dispatch, state.context.id])

  return (
    <DialogProvider
      open={state.context.open}
      id={state.context.id}
      dispatch={dispatch}
    >
      {props.children}
    </DialogProvider>
  )
}

Root.displayName = 'DialogRoot'
