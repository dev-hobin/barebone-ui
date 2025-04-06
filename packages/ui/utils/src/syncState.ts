export function syncState<P extends object, T>(
  props: P,
  propKey: keyof P,
  internalState: T,
  setInternalState: (value: T) => void,
) {
  if (propKey in props && internalState !== props[propKey]) {
    setInternalState(props[propKey] as T)
  }
}
