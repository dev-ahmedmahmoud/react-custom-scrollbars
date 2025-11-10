import type { CSSProperties, ReactElement, ReactNode, UIEvent } from 'react'

export interface ScrollValues {
  left: number
  top: number
  scrollLeft: number
  scrollTop: number
  scrollWidth: number
  scrollHeight: number
  clientWidth: number
  clientHeight: number
}

export interface RenderElementProps {
  style: CSSProperties
}

export interface RenderViewProps {
  style?: CSSProperties
  className?: string
  [key: string]: unknown
}

export interface RenderTrackProps {
  style?: CSSProperties
  className?: string
  [key: string]: unknown
}

export interface RenderThumbProps {
  style?: CSSProperties
  className?: string
  [key: string]: unknown
}

export interface ScrollbarsProps {
  // Core props
  style?: CSSProperties
  children?: ReactNode
  className?: string

  // Auto height mode
  autoHeight?: boolean
  autoHeightMin?: number
  autoHeightMax?: number

  // Auto hide behavior
  autoHide?: boolean
  autoHideTimeout?: number
  autoHideDuration?: number

  // Hide tracks
  hideTracksWhenNotNeeded?: boolean

  // Scroll event handlers
  onScroll?: (_arg0?: UIEvent) => void
  onScrollFrame?: (_arg0: ScrollValues) => void
  onScrollStart?: () => void
  onScrollStop?: () => void
  onUpdate?: (_arg0: ScrollValues) => void

  // Render props for customization
  renderView?: (_arg0: RenderViewProps) => ReactElement
  renderTrackHorizontal?: (_arg0: RenderTrackProps) => ReactElement
  renderTrackVertical?: (_arg0: RenderTrackProps) => ReactElement
  renderThumbHorizontal?: (_arg0: RenderThumbProps) => ReactElement
  renderThumbVertical?: (_arg0: RenderThumbProps) => ReactElement

  // Universal/SSR support
  universal?: boolean

  // Scrolling behavior
  thumbSize?: number
  thumbMinSize?: number
  tagName?: string
}

export interface ScrollbarsRef {
  getScrollLeft(): number
  getScrollTop(): number
  getScrollWidth(): number
  getScrollHeight(): number
  getClientWidth(): number
  getClientHeight(): number
  getValues(): ScrollValues
  scrollLeft(_arg0?: number): void
  scrollTop(_arg0?: number): void
  scrollToLeft(): void
  scrollToTop(): void
  scrollToRight(): void
  scrollToBottom(): void
}
