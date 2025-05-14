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

export type DialogState = {
  context: DialogContext
  action: DialogAction
}

export type DialogEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | {
      type: 'SYNC'
      payload: DialogContext
    }

type UseDialogProps = DialogState
export function useDialog(defaultState: UseDialogProps) {
  return useReducer((state: DialogState, event: DialogEvent) => {
    if (event.type === 'OPEN') {
      state.action.onOpenChange(true)
      return { ...state, context: { ...state.context, open: true } }
    }
    if (event.type === 'CLOSE') {
      state.action.onOpenChange(false)
      return { ...state, context: { ...state.context, open: false } }
    }
    if (event.type === 'SYNC') {
      return { ...state, context: event.payload }
    }
    return state
  }, defaultState)
}
