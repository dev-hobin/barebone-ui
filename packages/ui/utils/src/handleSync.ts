export function handleSync<
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey,
>({
  target,
  source,
  keys,
  handler,
}: {
  target: T
  source: Record<PropertyKey, unknown>
  keys: K[]
  handler: (syncedContext: T) => void
}) {
  if (keys.some((key) => key in source && source[key] !== target[key])) {
    handler(mergeContext(target, source, keys))
  }
}

function mergeContext<
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey,
>(
  internalContext: T,
  externalContext: Record<PropertyKey, unknown>,
  keys: K[],
) {
  const merged = keys
    .filter((key) => key in externalContext)
    .reduce<Partial<T>>((acc, key) => {
      acc[key] = externalContext[key] as T[K]
      return acc
    }, {})

  return Object.assign(internalContext, merged)
}
