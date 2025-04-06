import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = {
  children: ReactNode
  container?: Element | DocumentFragment
}

export const Portal = (props: PortalProps) => {
  return createPortal(props.children, props.container ?? document.body)
}

Portal.displayName = 'DialogPortal'
