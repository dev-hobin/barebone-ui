import { Children, cloneElement, ReactElement, Ref } from 'react'
import { composeRefs } from '@barebone-ui/utils'
import { usePresence } from './usePresence'

export interface PresenceProps {
  children: ReactElement
  present: boolean
}

export function Presence({ children, present }: PresenceProps) {
  const presence = usePresence(present)
  const child = Children.only(children) as ReactElement<{
    ref?: Ref<HTMLElement>
  }>

  if (!presence.isPresent && !present) {
    return null
  }

  return cloneElement(child, {
    ref: composeRefs(presence.ref, child.props.ref),
  })
}
