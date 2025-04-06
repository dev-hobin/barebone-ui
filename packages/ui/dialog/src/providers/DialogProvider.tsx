import {
  ActionDispatch,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'
import { useEventCallback } from '@barebone-ui/hooks'
import { DialogEvent } from '../reducers'

type PublicDialogContext = {
  /** 다이얼로그 고유 식별자 */
  id: string
  /** 다이얼로그가 열려있는지 여부 */
  open: boolean
  /** 다이얼로그 이벤트 핸들러 */
  dispatch: ActionDispatch<[event: DialogEvent]>
}

type PrivateDialogContext = {
  /** 다이얼로그의 aria 속성 */
  aria: {
    labelledby: string | undefined
    describedby: string | undefined
  }
  /** 다이얼로그의 aria 속성 업데이트 */
  updateAria: (
    aria: Partial<{
      labelledby: string | undefined
      describedby: string | undefined
    }>,
  ) => void
}

const Context = createContext<
  (PublicDialogContext & PrivateDialogContext) | null
>(null)

interface DialogProviderProps extends PublicDialogContext {
  children: ReactNode
}

export function DialogProvider({ children, ...rest }: DialogProviderProps) {
  const [aria, setAria] = useState<PrivateDialogContext['aria']>({
    labelledby: undefined,
    describedby: undefined,
  })

  const updateAria = useEventCallback(
    (aria: Partial<PrivateDialogContext['aria']>) => {
      setAria((prev) => ({ ...prev, ...aria }))
    },
  )

  return (
    <Context.Provider value={{ ...rest, aria, updateAria }}>
      {children}
    </Context.Provider>
  )
}

export function useDialogContext() {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider')
  }

  return context
}
