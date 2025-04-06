export function getRootId(id: string) {
  return `dialog::${id}`
}

export function getContentId(rootId: string) {
  return `dialog::${rootId}::content`
}

export function getBackdropId(rootId: string) {
  return `dialog::${rootId}::backdrop`
}

export function getTriggerId(rootId: string) {
  return `dialog::${rootId}::trigger`
}

export function getCloseTriggerId(rootId: string) {
  return `dialog::${rootId}::close-trigger`
}

export function getTitleId(rootId: string) {
  return `dialog::${rootId}::title`
}

export function getDescriptionId(rootId: string) {
  return `dialog::${rootId}::description`
}
