export type DismissItem = {
  id: string
  onDismiss: () => void
}

export const dismissLayer = (() => {
  let layer: DismissItem[] = []

  return {
    register: (id: string, onDismiss: () => void) => {
      layer.push({ id, onDismiss })
    },
    dismiss: (id?: string) => {
      if (layer.length === 0) {
        return
      }
      if (!!id && layer[layer.length - 1].id !== id) {
        return
      }
      layer.pop()?.onDismiss()
    },
  }
})()
