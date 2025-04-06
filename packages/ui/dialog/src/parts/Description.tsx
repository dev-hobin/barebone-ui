import { ComponentPropsWithoutRef, forwardRef, useEffect } from 'react'
import { useDialogContext } from '../providers'
import { getDescriptionId } from '../dom'

export type DescriptionProps = ComponentPropsWithoutRef<'p'>

export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ children, ...rest }, ref) => {
    const { id, updateAria } = useDialogContext()

    const descriptionId = getDescriptionId(id)

    useEffect(() => {
      updateAria({ describedby: descriptionId })

      return () => {
        updateAria({ describedby: undefined })
      }
    }, [updateAria, descriptionId])

    return (
      <p id={getDescriptionId(id)} {...rest} ref={ref}>
        {children}
      </p>
    )
  },
)

Description.displayName = 'DialogDescription'
