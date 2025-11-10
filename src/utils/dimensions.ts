export function getInnerWidth(el: HTMLElement | null): number {
  if (!el) return 0
  const { clientWidth } = el
  const { paddingLeft, paddingRight } = getComputedStyle(el)
  return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)
}

export function getInnerHeight(el: HTMLElement | null): number {
  if (!el) return 0
  const { clientHeight } = el
  const { paddingTop, paddingBottom } = getComputedStyle(el)
  return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)
}
