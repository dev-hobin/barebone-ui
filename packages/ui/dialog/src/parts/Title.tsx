import { ComponentPropsWithoutRef, forwardRef, useEffect } from 'react'
import { useDialogContext } from '../providers'
import { getTitleId } from '../dom'

export type TitleProps = ComponentPropsWithoutRef<'h2'>

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ children, ...rest }, ref) => {
    const { id, updateAria } = useDialogContext()

    const titleId = getTitleId(id)

    useEffect(() => {
      updateAria({ labelledby: titleId })

      return () => {
        updateAria({ labelledby: undefined })
      }
    }, [updateAria, titleId])

    return (
      <h2 id={titleId} {...rest} ref={ref}>
        {children}
      </h2>
    )
  },
)

Title.displayName = 'DialogTitle'
