import { useReducer } from 'react'

type DeepPartial<T> = T extends object
  ? T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : {
        [P in keyof T]?: DeepPartial<T[P]>
      }
  : T

export type DialogContext = {
  /** 고유 식별자 */
  id: string
  /** 다이얼로그 열림 상태 */
  open: boolean
}

export type DialogAction = {
  /** 다이얼로그 열림 상태 변경 이벤트 핸들러 */
  onOpenChange: (open: boolean) => void
}

export type DialogState = DialogContext & DialogAction

export type DialogEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | {
      type: 'SYNC'
      payload: DeepPartial<DialogContext> & Partial<DialogAction>
    }

type UseDialogProps = DialogState
export function useDialog(defaultState: UseDialogProps) {
  return useReducer(
    (state: DialogContext & DialogAction, event: DialogEvent) => {
      if (event.type === 'OPEN') {
        state.onOpenChange(true)
        return { ...state, open: true }
      }
      if (event.type === 'CLOSE') {
        state.onOpenChange(false)
        return { ...state, open: false }
      }
      if (event.type === 'SYNC') {
        return { ...state, ...event.payload }
      }
      return state
    },
    defaultState,
  )
}
