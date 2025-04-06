import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { Presence } from '@barebone-ui/presence'
import { useDialogContext } from '../providers'
import { getBackdropId } from '../dom'

export type BackdropProps = ComponentPropsWithoutRef<'div'>

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ children, ...rest }, ref) => {
    const { id, open } = useDialogContext()

    return (
      <Presence present={open}>
        <div
          id={getBackdropId(id)}
          data-state={open ? 'open' : 'closed'}
          {...rest}
          ref={ref}
        >
          {children}
        </div>
      </Presence>
    )
  },
)

Backdrop.displayName = 'DialogBackdrop'
