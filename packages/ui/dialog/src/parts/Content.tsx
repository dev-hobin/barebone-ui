import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { Presence } from '@barebone-ui/presence'
import { useDialogContext } from '../providers'
import { getContentId } from '../dom'

export type ContentProps = ComponentPropsWithoutRef<'div'>

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, ...rest }, ref) => {
    const { id, open, aria } = useDialogContext()

    return (
      <Presence present={open}>
        <div
          id={getContentId(id)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={aria.labelledby}
          aria-describedby={aria.describedby}
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

Content.displayName = 'DialogContent'
