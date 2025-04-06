import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { dismissLayer } from '@barebone-ui/dismiss-layer'
import { useDialogContext } from '../providers'
import { getCloseTriggerId } from '../dom'

export type CloseTriggerProps = ComponentPropsWithoutRef<'button'>

export const CloseTrigger = forwardRef<HTMLButtonElement, CloseTriggerProps>(
  ({ children, onClick, ...rest }, ref) => {
    const { id } = useDialogContext()

    return (
      <button
        id={getCloseTriggerId(id)}
        onClick={(ev) => {
          dismissLayer.dismiss(id)
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

CloseTrigger.displayName = 'DialogCloseTrigger'
