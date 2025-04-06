import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { useDialogContext } from '../providers'
import { getTriggerId } from '../dom'

export type TriggerProps = ComponentPropsWithoutRef<'button'>

export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, onClick, ...rest }, ref) => {
    const { id, open, dispatch } = useDialogContext()

    return (
      <button
        id={getTriggerId(id)}
        data-state={open ? 'open' : 'closed'}
        onClick={(ev) => {
          dispatch({ type: 'OPEN' })
          onClick?.(ev)
        }}
        {...rest}
        ref={ref}
      >
        {children}
      </button>
    )
  },
)

Trigger.displayName = 'DialogTrigger'
