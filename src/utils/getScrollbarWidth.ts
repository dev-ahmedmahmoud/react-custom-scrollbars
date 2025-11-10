let scrollbarWidth: number | null = null

export function getScrollbarWidth(): number {
  if (scrollbarWidth !== null) return scrollbarWidth

  if (typeof document !== 'undefined') {
    const div = document.createElement('div')

    Object.assign(div.style, {
      width: '100px',
      height: '100px',
      position: 'absolute',
      top: '-9999px',
      overflow: 'scroll',
    })

    document.body.appendChild(div)
    scrollbarWidth = div.offsetWidth - div.clientWidth
    document.body.removeChild(div)
  } else {
    scrollbarWidth = 0
  }

  return scrollbarWidth
}
