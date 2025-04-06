import {
  getContentId,
  getBackdropId,
  getTriggerId,
  getCloseTriggerId,
  getTitleId,
  getDescriptionId,
} from './id'

export function getContentEl(rootId: string) {
  return document.getElementById(getContentId(rootId))
}

export function getBackdropEl(rootId: string) {
  return document.getElementById(getBackdropId(rootId))
}

export function getTriggerEl(rootId: string) {
  return document.getElementById(getTriggerId(rootId))
}

export function getCloseTriggerEl(rootId: string) {
  return document.getElementById(getCloseTriggerId(rootId))
}

export function getTitleEl(rootId: string) {
  return document.getElementById(getTitleId(rootId))
}

export function getDescriptionEl(rootId: string) {
  return document.getElementById(getDescriptionId(rootId))
}
