/**
 * 배경 요소들을 inert 처리하는 함수
 * @param targetIds - inert 처리하지 않을 대상 요소들의 id
 * @returns cleanup 함수
 */
export function inertBackground(...targetIds: string[]) {
  // 1. id로 target 요소들을 찾음
  const targets = targetIds
    .map((id) => document.getElementById(id))
    .filter((target): target is HTMLElement => target !== null)

  if (targets.length === 0) return () => {}

  // 2. inert 처리에서 제외할 요소들을 수집
  const excludeElements = collectExcludeElements(targets)

  // 3. inert 처리할 요소들을 수집
  const elementsToInert = collectInertElements(targets, excludeElements)

  // 4. inert 속성 추가
  elementsToInert.forEach((el) => el.setAttribute('inert', ''))

  // 5. 클린업 함수 반환
  return () => {
    elementsToInert.forEach((el) => el.removeAttribute('inert'))
  }
}

/**
 * inert 처리에서 제외할 요소들을 수집
 */
function collectExcludeElements(targets: HTMLElement[]): Set<Element> {
  const excludeElements = new Set<Element>()

  // 모든 target과 그들의 부모/자식 요소들을 한 번에 처리
  targets.forEach((target) => {
    // target 자신 추가
    excludeElements.add(target)

    // target의 모든 자식 요소들 추가
    const addChildren = (element: Element) => {
      Array.from(element.children).forEach((child) => {
        excludeElements.add(child)
        addChildren(child)
      })
    }
    addChildren(target)

    // target의 부모 요소들 추가
    let current = target
    while (current.parentElement) {
      current = current.parentElement
      excludeElements.add(current)
    }
  })

  // 이미 inert 속성이 있는 요소들 추가
  document.querySelectorAll('[inert]').forEach((el) => {
    excludeElements.add(el)
  })

  return excludeElements
}

/**
 * inert 처리할 요소들을 수집
 */
function collectInertElements(
  targets: HTMLElement[],
  excludeElements: Set<Element>,
): Set<Element> {
  const elementsToInert = new Set<Element>()

  // 모든 target의 형제 요소들을 한 번에 처리
  targets.forEach((target) => {
    if (target.parentElement) {
      Array.from(target.parentElement.children).forEach((sibling) => {
        if (!targets.includes(sibling as HTMLElement)) {
          elementsToInert.add(sibling)
        }
      })
    }
  })

  // 나머지 요소들 중 inert 처리할 요소들 추가
  // 중복 체크를 최소화하기 위해 한 번의 순회로 처리
  const processedParents = new Set<Element>()

  document.querySelectorAll('html *:not(head, head *)').forEach((el) => {
    // 이미 처리된 요소는 건너뛰기
    if (excludeElements.has(el)) return

    // 이미 inert 처리된 부모를 가진 요소는 건너뛰기
    let current = el
    while (current.parentElement) {
      if (processedParents.has(current.parentElement)) return
      if (elementsToInert.has(current.parentElement)) {
        processedParents.add(current.parentElement)
        return
      }
      current = current.parentElement
    }

    elementsToInert.add(el)
  })

  return elementsToInert
}
