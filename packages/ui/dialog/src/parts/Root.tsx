import { ReactNode, useEffect, useId } from 'react'
import { syncState } from '@barebone-ui/utils'
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
    id: useId(),
    open: props.open ?? props.defaultOpen ?? false,
    onOpenChange: useEventCallback(props.onOpenChange ?? (() => {})),
  })

  // 외부에서 변경된 상태를 동기화
  syncState(props, 'open', state.open, () => {
    dispatch({ type: 'SYNC', payload: { open: props.open } })
  })

  // dismissLayer에 등록
  useEffect(() => {
    if (state.open) {
      dismissLayer.register(state.id, () => {
        dispatch({ type: 'CLOSE' })
      })
    }

    return () => {
      dismissLayer.dismiss(state.id)
    }
  }, [state.id, dispatch, state.open])

  // 포커스 가두는 이팩트
  useEffect(() => {
    const contentEl = getContentEl(state.id)
    if (!state.open || !contentEl) {
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
  }, [state.id, state.open])

  // 배경 요소 inert 처리 이팩트
  useEffect(() => {
    const contentEl = getContentEl(state.id)
    if (!state.open || !contentEl) {
      return
    }

    const interactive = inertBackground(
      getContentId(state.id),
      getBackdropId(state.id),
    )
    return () => {
      interactive()
    }
  }, [state.id, state.open])

  // 모달 open 상태에 따라 스크롤 제어
  useEffect(() => {
    if (state.open) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [state.open])

  // ESC 눌렀을 때 닫기
  useEffect(() => {
    if (!state.open || !closeOnEscape) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissLayer.dismiss(state.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [state.open, closeOnEscape, state.id])

  // 배경 요소 클릭 시 다이얼로그 닫기
  useEffect(() => {
    if (!state.open || !closeOnInteractOutside) {
      return
    }

    const backdropEl = getBackdropEl(state.id)
    const contentEl = getContentEl(state.id)

    if (!backdropEl || !contentEl) {
      return
    }

    const handleClick = (event: MouseEvent) => {
      if (contentEl.contains(event.target as Node)) {
        return
      }

      dismissLayer.dismiss(state.id)
    }

    window.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('click', handleClick, true)
    }
  }, [state.open, closeOnInteractOutside, dispatch, state.id])

  return (
    <DialogProvider open={state.open} id={state.id} dispatch={dispatch}>
      {props.children}
    </DialogProvider>
  )
}

Root.displayName = 'DialogRoot'
