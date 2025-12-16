import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useCallback,
  cloneElement,
  createElement,
} from 'react'
import type { UIEvent } from 'react'
import { ScrollbarsProps, ScrollbarsRef, ScrollValues } from './types'
import { getScrollbarWidth } from './utils/getScrollbarWidth'
import { getInnerWidth, getInnerHeight } from './utils/dimensions'
import { isString } from './utils/isString'
import {
  renderViewDefault,
  renderTrackHorizontalDefault,
  renderTrackVerticalDefault,
  renderThumbHorizontalDefault,
  renderThumbVerticalDefault,
} from './defaultRenderElements'

// CSS-in-JS styles
const containerStyleDefault = {
  position: 'relative' as const,
  overflow: 'hidden' as const,
  width: '100%',
  height: '100%',
}

const containerStyleAutoHeight = {
  height: 'auto' as const,
}

const viewStyleDefault = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'scroll' as const,
  WebkitOverflowScrolling: 'touch' as const,
}

const viewStyleAutoHeight = {
  position: 'relative' as const,
  top: undefined,
  left: undefined,
  right: undefined,
  bottom: undefined,
}

const viewStyleUniversalInitial = {
  overflow: 'hidden' as const,
  marginRight: 0,
  marginBottom: 0,
}

const trackHorizontalStyleDefault = {
  position: 'absolute' as const,
  height: 6,
}

const trackVerticalStyleDefault = {
  position: 'absolute' as const,
  width: 6,
}

export const Scrollbars = forwardRef<ScrollbarsRef, ScrollbarsProps>(
  (
    {
      onScroll,
      onScrollFrame,
      onScrollStart,
      onScrollStop,
      onUpdate,
      renderView = renderViewDefault,
      renderTrackHorizontal = renderTrackHorizontalDefault,
      renderTrackVertical = renderTrackVerticalDefault,
      renderThumbHorizontal = renderThumbHorizontalDefault,
      renderThumbVertical = renderThumbVerticalDefault,
      tagName = 'div',
      hideTracksWhenNotNeeded = false,
      thumbSize,
      thumbMinSize = 30,
      autoHide = false,
      autoHideTimeout = 1000,
      autoHideDuration = 200,
      autoHeight = false,
      autoHeightMin = 0,
      autoHeightMax = 200,
      universal = false,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Refs for DOM elements
    const containerRef = useRef<HTMLElement>(null)
    const viewRef = useRef<HTMLElement>(null)
    const trackHorizontalRef = useRef<HTMLElement>(null)
    const trackVerticalRef = useRef<HTMLElement>(null)
    const thumbHorizontalRef = useRef<HTMLElement>(null)
    const thumbVerticalRef = useRef<HTMLElement>(null)

    // State
    const [didMountUniversal, setDidMountUniversal] = useState(false)
    const [scrolling, setScrolling] = useState(false)

    // Internal state refs
    const requestFrameRef = useRef<number>()
    const hideTracksTimeoutRef = useRef<number>()
    const detectScrollingIntervalRef = useRef<number>()
    const viewScrollLeftRef = useRef(0)
    const viewScrollTopRef = useRef(0)

    // Dragging state refs (following legacy pattern)
    const draggingRef = useRef(false)
    const prevPageXRef = useRef(0)
    const prevPageYRef = useRef(0)
    const trackMouseOverRef = useRef(false)

    // Utility functions
    const getValues = useCallback((): ScrollValues => {
      const view = viewRef.current
      if (!view) {
        return {
          left: 0,
          top: 0,
          scrollLeft: 0,
          scrollTop: 0,
          scrollWidth: 0,
          scrollHeight: 0,
          clientWidth: 0,
          clientHeight: 0,
        }
      }

      const {
        scrollLeft = 0,
        scrollTop = 0,
        scrollWidth = 0,
        scrollHeight = 0,
        clientWidth = 0,
        clientHeight = 0,
      } = view

      return {
        left: scrollLeft / (scrollWidth - clientWidth) || 0,
        top: scrollTop / (scrollHeight - clientHeight) || 0,
        scrollLeft,
        scrollTop,
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
      }
    }, [])

    const getThumbHorizontalWidth = useCallback(() => {
      const view = viewRef.current
      const trackHorizontal = trackHorizontalRef.current
      if (!view || !trackHorizontal) return 0

      const { scrollWidth, clientWidth } = view
      const trackWidth = getInnerWidth(trackHorizontal)
      const width = Math.ceil((clientWidth / scrollWidth) * trackWidth)

      if (trackWidth === width) return 0
      if (thumbSize) return thumbSize
      return Math.max(width, thumbMinSize)
    }, [thumbSize, thumbMinSize])

    const getThumbVerticalHeight = useCallback(() => {
      const view = viewRef.current
      const trackVertical = trackVerticalRef.current
      if (!view || !trackVertical) return 0

      const { scrollHeight, clientHeight } = view
      const trackHeight = getInnerHeight(trackVertical)
      const height = Math.ceil((clientHeight / scrollHeight) * trackHeight)

      if (trackHeight === height) return 0
      if (thumbSize) return thumbSize
      return Math.max(height, thumbMinSize)
    }, [thumbSize, thumbMinSize])

    // Helper functions for offset calculations (from legacy)
    const getScrollLeftForOffset = useCallback(
      (offset: number) => {
        const view = viewRef.current
        const trackHorizontal = trackHorizontalRef.current
        if (!view || !trackHorizontal) return 0

        const { scrollWidth, clientWidth } = view
        const trackWidth = getInnerWidth(trackHorizontal)
        const thumbWidth = getThumbHorizontalWidth()

        return (
          (offset / (trackWidth - thumbWidth)) * (scrollWidth - clientWidth)
        )
      },
      [getThumbHorizontalWidth]
    )

    const getScrollTopForOffset = useCallback(
      (offset: number) => {
        const view = viewRef.current
        const trackVertical = trackVerticalRef.current
        if (!view || !trackVertical) return 0

        const { scrollHeight, clientHeight } = view
        const trackHeight = getInnerHeight(trackVertical)
        const thumbHeight = getThumbVerticalHeight()

        return (
          (offset / (trackHeight - thumbHeight)) * (scrollHeight - clientHeight)
        )
      },
      [getThumbVerticalHeight]
    )

    // Drag setup/teardown (from legacy)
    const setupDragging = useCallback(() => {
      document.body.style.userSelect = 'none'
      document.onselectstart = () => false
    }, [])

    const teardownDragging = useCallback(() => {
      document.body.style.userSelect = ''
      document.onselectstart = null
    }, [])

    // handleDrag - called on mousemove during drag (from legacy)
    const handleDrag = useCallback(
      (event: MouseEvent) => {
        if (prevPageXRef.current) {
          const { clientX } = event
          const trackHorizontal = trackHorizontalRef.current
          if (trackHorizontal && viewRef.current) {
            const { left: trackLeft } = trackHorizontal.getBoundingClientRect()
            const thumbWidth = getThumbHorizontalWidth()
            const clickPosition = thumbWidth - prevPageXRef.current
            const offset = -trackLeft + clientX - clickPosition
            viewRef.current.scrollLeft = getScrollLeftForOffset(offset)
          }
        }
        if (prevPageYRef.current) {
          const { clientY } = event
          const trackVertical = trackVerticalRef.current
          if (trackVertical && viewRef.current) {
            const { top: trackTop } = trackVertical.getBoundingClientRect()
            const thumbHeight = getThumbVerticalHeight()
            const clickPosition = thumbHeight - prevPageYRef.current
            const offset = -trackTop + clientY - clickPosition
            viewRef.current.scrollTop = getScrollTopForOffset(offset)
          }
        }
        return false
      },
      [
        getScrollLeftForOffset,
        getScrollTopForOffset,
        getThumbHorizontalWidth,
        getThumbVerticalHeight,
      ]
    )

    // handleDragEnd - called on mouseup (from legacy)
    const handleDragEnd = useCallback(() => {
      draggingRef.current = false
      prevPageXRef.current = 0
      prevPageYRef.current = 0
      teardownDragging()
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
    }, [teardownDragging, handleDrag])

    // handleDragStart - called on thumb mousedown (from legacy)
    const handleDragStart = useCallback(
      (event: MouseEvent) => {
        draggingRef.current = true
        event.stopImmediatePropagation()
        setupDragging()
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
      },
      [setupDragging, handleDrag, handleDragEnd]
    )

    // Track mouse down handlers (from legacy)
    const handleHorizontalTrackMouseDown = useCallback(
      (event: MouseEvent) => {
        event.preventDefault()
        const target = event.target as HTMLElement
        const { clientX } = event
        const { left: targetLeft } = target.getBoundingClientRect()
        const thumbWidth = getThumbHorizontalWidth()
        const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2

        if (viewRef.current) {
          viewRef.current.scrollLeft = getScrollLeftForOffset(offset)
        }
      },
      [getScrollLeftForOffset, getThumbHorizontalWidth]
    )

    const handleVerticalTrackMouseDown = useCallback(
      (event: MouseEvent) => {
        event.preventDefault()
        const target = event.target as HTMLElement
        const { clientY } = event
        const { top: targetTop } = target.getBoundingClientRect()
        const thumbHeight = getThumbVerticalHeight()
        const offset = Math.abs(targetTop - clientY) - thumbHeight / 2

        if (viewRef.current) {
          viewRef.current.scrollTop = getScrollTopForOffset(offset)
        }
      },
      [getScrollTopForOffset, getThumbVerticalHeight]
    )

    // Thumb mouse down handlers (from legacy)
    const handleHorizontalThumbMouseDown = useCallback(
      (event: MouseEvent) => {
        event.preventDefault()
        handleDragStart(event)
        const target = event.target as HTMLElement
        const { clientX } = event
        const { offsetWidth } = target
        const { left } = target.getBoundingClientRect()
        prevPageXRef.current = offsetWidth - (clientX - left)
      },
      [handleDragStart]
    )

    const handleVerticalThumbMouseDown = useCallback(
      (event: MouseEvent) => {
        event.preventDefault()
        handleDragStart(event)
        const target = event.target as HTMLElement
        const { clientY } = event
        const { offsetHeight } = target
        const { top } = target.getBoundingClientRect()
        prevPageYRef.current = offsetHeight - (clientY - top)
      },
      [handleDragStart]
    )

    // Scroll methods for imperative API
    const scrollLeft = useCallback((left = 0) => {
      if (!viewRef.current) return
      viewRef.current.scrollLeft = left
    }, [])

    const scrollTop = useCallback((top = 0) => {
      if (!viewRef.current) return
      viewRef.current.scrollTop = top
    }, [])

    const scrollToLeft = useCallback(() => {
      scrollLeft(0)
    }, [scrollLeft])

    const scrollToTop = useCallback(() => {
      scrollTop(0)
    }, [scrollTop])

    const scrollToRight = useCallback(() => {
      if (!viewRef.current) return
      scrollLeft(viewRef.current.scrollWidth)
    }, [scrollLeft])

    const scrollToBottom = useCallback(() => {
      if (!viewRef.current) return
      scrollTop(viewRef.current.scrollHeight)
    }, [scrollTop])

    // Getter methods for imperative API
    const getScrollLeft = useCallback(() => {
      return viewRef.current?.scrollLeft || 0
    }, [])

    const getScrollTop = useCallback(() => {
      return viewRef.current?.scrollTop || 0
    }, [])

    const getScrollWidth = useCallback(() => {
      return viewRef.current?.scrollWidth || 0
    }, [])

    const getScrollHeight = useCallback(() => {
      return viewRef.current?.scrollHeight || 0
    }, [])

    const getClientWidth = useCallback(() => {
      return viewRef.current?.clientWidth || 0
    }, [])

    const getClientHeight = useCallback(() => {
      return viewRef.current?.clientHeight || 0
    }, [])

    // Update function with RAF
    const update = useCallback(
      (_callback?: (_arg0: ScrollValues) => void) => {
        if (requestFrameRef.current) {
          cancelAnimationFrame(requestFrameRef.current)
        }

        requestFrameRef.current = requestAnimationFrame(() => {
          const values = getValues()
          const scrollbarWidth = getScrollbarWidth()

          if (scrollbarWidth) {
            const { scrollLeft, clientWidth, scrollWidth } = values
            const trackHorizontalWidth = getInnerWidth(
              trackHorizontalRef.current
            )
            const thumbHorizontalWidth = getThumbHorizontalWidth()
            const thumbHorizontalX =
              (scrollLeft / (scrollWidth - clientWidth)) *
              (trackHorizontalWidth - thumbHorizontalWidth)

            const thumbHorizontalStyle = {
              width: `${thumbHorizontalWidth}px`,
              transform: `translateX(${thumbHorizontalX}px)`,
            }

            const { scrollTop, clientHeight, scrollHeight } = values
            const trackVerticalHeight = getInnerHeight(trackVerticalRef.current)
            const thumbVerticalHeight = getThumbVerticalHeight()
            const thumbVerticalY =
              (scrollTop / (scrollHeight - clientHeight)) *
              (trackVerticalHeight - thumbVerticalHeight)

            const thumbVerticalStyle = {
              height: `${thumbVerticalHeight}px`,
              transform: `translateY(${thumbVerticalY}px)`,
            }

            if (hideTracksWhenNotNeeded) {
              const trackHorizontalStyle = {
                visibility: scrollWidth > clientWidth ? 'visible' : 'hidden',
              }
              const trackVerticalStyle = {
                visibility: scrollHeight > clientHeight ? 'visible' : 'hidden',
              }
              Object.assign(
                trackHorizontalRef.current?.style || {},
                trackHorizontalStyle
              )
              Object.assign(
                trackVerticalRef.current?.style || {},
                trackVerticalStyle
              )
            }

            Object.assign(
              thumbHorizontalRef.current?.style || {},
              thumbHorizontalStyle
            )
            Object.assign(
              thumbVerticalRef.current?.style || {},
              thumbVerticalStyle
            )
          }

          onUpdate?.(values)
          _callback?.(values)
        })
      },
      [
        getValues,
        getThumbHorizontalWidth,
        getThumbVerticalHeight,
        hideTracksWhenNotNeeded,
        onUpdate,
      ]
    )

    // Scroll detection functionality
    const detectScrolling = useCallback(() => {
      if (!scrolling) {
        setScrolling(true)
        onScrollStart?.()
      }

      if (detectScrollingIntervalRef.current) {
        clearTimeout(detectScrollingIntervalRef.current)
      }

      detectScrollingIntervalRef.current = window.setTimeout(() => {
        setScrolling(false)
        onScrollStop?.()
      }, 150) // 150ms delay to detect when scrolling stops
    }, [scrolling, onScrollStart, onScrollStop])

    // Auto-hide functionality
    const hideScrollbars = useCallback(() => {
      if (hideTracksTimeoutRef.current) {
        clearTimeout(hideTracksTimeoutRef.current)
      }

      if (autoHide) {
        hideTracksTimeoutRef.current = window.setTimeout(() => {
          // Add opacity transition to hide tracks
          if (trackHorizontalRef.current) {
            trackHorizontalRef.current.style.opacity = '0'
          }
          if (trackVerticalRef.current) {
            trackVerticalRef.current.style.opacity = '0'
          }
        }, autoHideTimeout)
      }
    }, [autoHide, autoHideTimeout])

    const showScrollbars = useCallback(() => {
      if (hideTracksTimeoutRef.current) {
        clearTimeout(hideTracksTimeoutRef.current)
      }

      if (autoHide) {
        // Show tracks immediately
        if (trackHorizontalRef.current) {
          trackHorizontalRef.current.style.opacity = '1'
        }
        if (trackVerticalRef.current) {
          trackVerticalRef.current.style.opacity = '1'
        }
      }
    }, [autoHide])

    // Track mouse enter/leave handlers for auto-hide (from legacy)
    const handleTrackMouseEnter = useCallback(() => {
      trackMouseOverRef.current = true
      if (autoHide) {
        showScrollbars()
      }
    }, [autoHide, showScrollbars])

    const handleTrackMouseLeave = useCallback(() => {
      trackMouseOverRef.current = false
      if (autoHide) {
        hideScrollbars()
      }
    }, [autoHide, hideScrollbars])

    // Event handlers
    const handleScroll = useCallback(
      (event: Event) => {
        onScroll?.(event as unknown as UIEvent)
        detectScrolling()

        // Show scrollbars on scroll and reset hide timer
        if (autoHide) {
          showScrollbars()
          hideScrollbars()
        }

        update(_values => {
          const { scrollLeft, scrollTop } = _values
          viewScrollLeftRef.current = scrollLeft
          viewScrollTopRef.current = scrollTop
          onScrollFrame?.(_values)
        })
      },
      [
        onScroll,
        onScrollFrame,
        update,
        detectScrolling,
        autoHide,
        showScrollbars,
        hideScrollbars,
      ]
    )

    // Effects
    useEffect(() => {
      if (universal) {
        setDidMountUniversal(true)
      }
    }, [universal])

    useEffect(() => {
      update()
    })

    useEffect(() => {
      const view = viewRef.current
      const container = containerRef.current
      if (!view || !container) return

      view.addEventListener('scroll', handleScroll)

      // Auto-hide: show scrollbars on mouse enter, hide on mouse leave
      if (autoHide) {
        const handleMouseEnter = () => {
          showScrollbars()
        }

        const handleMouseLeave = () => {
          hideScrollbars()
        }

        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)

        // Initially hide scrollbars
        hideScrollbars()

        return () => {
          view.removeEventListener('scroll', handleScroll)
          container.removeEventListener('mouseenter', handleMouseEnter)
          container.removeEventListener('mouseleave', handleMouseLeave)

          if (requestFrameRef.current) {
            cancelAnimationFrame(requestFrameRef.current)
          }
          if (hideTracksTimeoutRef.current) {
            clearTimeout(hideTracksTimeoutRef.current)
          }
          if (detectScrollingIntervalRef.current) {
            clearTimeout(detectScrollingIntervalRef.current)
          }
        }
      } else {
        return () => {
          view.removeEventListener('scroll', handleScroll)
          if (requestFrameRef.current) {
            cancelAnimationFrame(requestFrameRef.current)
          }
          if (hideTracksTimeoutRef.current) {
            clearTimeout(hideTracksTimeoutRef.current)
          }
          if (detectScrollingIntervalRef.current) {
            clearTimeout(detectScrollingIntervalRef.current)
          }
        }
      }
    }, [handleScroll, autoHide, showScrollbars, hideScrollbars])

    // Effect to add track/thumb mouse listeners (from legacy addListeners)
    useEffect(() => {
      const trackHorizontal = trackHorizontalRef.current
      const trackVertical = trackVerticalRef.current
      const thumbHorizontal = thumbHorizontalRef.current
      const thumbVertical = thumbVerticalRef.current

      // Don't add listeners if no native scrollbar width
      if (!getScrollbarWidth()) return

      if (
        !trackHorizontal ||
        !trackVertical ||
        !thumbHorizontal ||
        !thumbVertical
      )
        return

      // Wrapper functions to properly type the event handlers
      const onHorizontalTrackMouseDown = (e: Event) =>
        handleHorizontalTrackMouseDown(e as MouseEvent)
      const onVerticalTrackMouseDown = (e: Event) =>
        handleVerticalTrackMouseDown(e as MouseEvent)
      const onHorizontalThumbMouseDown = (e: Event) =>
        handleHorizontalThumbMouseDown(e as MouseEvent)
      const onVerticalThumbMouseDown = (e: Event) =>
        handleVerticalThumbMouseDown(e as MouseEvent)

      // Add event listeners
      trackHorizontal.addEventListener('mouseenter', handleTrackMouseEnter)
      trackHorizontal.addEventListener('mouseleave', handleTrackMouseLeave)
      trackHorizontal.addEventListener('mousedown', onHorizontalTrackMouseDown)
      trackVertical.addEventListener('mouseenter', handleTrackMouseEnter)
      trackVertical.addEventListener('mouseleave', handleTrackMouseLeave)
      trackVertical.addEventListener('mousedown', onVerticalTrackMouseDown)
      thumbHorizontal.addEventListener('mousedown', onHorizontalThumbMouseDown)
      thumbVertical.addEventListener('mousedown', onVerticalThumbMouseDown)

      return () => {
        // Remove event listeners
        trackHorizontal.removeEventListener('mouseenter', handleTrackMouseEnter)
        trackHorizontal.removeEventListener('mouseleave', handleTrackMouseLeave)
        trackHorizontal.removeEventListener(
          'mousedown',
          onHorizontalTrackMouseDown
        )
        trackVertical.removeEventListener('mouseenter', handleTrackMouseEnter)
        trackVertical.removeEventListener('mouseleave', handleTrackMouseLeave)
        trackVertical.removeEventListener('mousedown', onVerticalTrackMouseDown)
        thumbHorizontal.removeEventListener(
          'mousedown',
          onHorizontalThumbMouseDown
        )
        thumbVertical.removeEventListener('mousedown', onVerticalThumbMouseDown)

        // Teardown any ongoing drag
        draggingRef.current = false
        prevPageXRef.current = 0
        prevPageYRef.current = 0
        document.body.style.userSelect = ''
        document.onselectstart = null
      }
    }, [
      handleTrackMouseEnter,
      handleTrackMouseLeave,
      handleHorizontalTrackMouseDown,
      handleVerticalTrackMouseDown,
      handleHorizontalThumbMouseDown,
      handleVerticalThumbMouseDown,
    ])

    // Imperative API
    useImperativeHandle(
      ref,
      () => ({
        getScrollLeft,
        getScrollTop,
        getScrollWidth,
        getScrollHeight,
        getClientWidth,
        getClientHeight,
        getValues,
        scrollLeft,
        scrollTop,
        scrollToLeft,
        scrollToTop,
        scrollToRight,
        scrollToBottom,
      }),
      [
        getScrollLeft,
        getScrollTop,
        getScrollWidth,
        getScrollHeight,
        getClientWidth,
        getClientHeight,
        getValues,
        scrollLeft,
        scrollTop,
        scrollToLeft,
        scrollToTop,
        scrollToRight,
        scrollToBottom,
      ]
    )

    // Render
    const scrollbarWidth = getScrollbarWidth()

    const containerStyle = {
      ...containerStyleDefault,
      ...(autoHeight && {
        ...containerStyleAutoHeight,
        minHeight: autoHeightMin,
        maxHeight: autoHeightMax,
      }),
      ...style,
    }

    const viewStyle = {
      ...viewStyleDefault,
      marginRight: scrollbarWidth ? -scrollbarWidth : 0,
      marginBottom: scrollbarWidth ? -scrollbarWidth : 0,
      ...(autoHeight && {
        ...viewStyleAutoHeight,
        minHeight: isString(autoHeightMin)
          ? `calc(${autoHeightMin} + ${scrollbarWidth}px)`
          : (autoHeightMin as number) + scrollbarWidth,
        maxHeight: isString(autoHeightMax)
          ? `calc(${autoHeightMax} + ${scrollbarWidth}px)`
          : (autoHeightMax as number) + scrollbarWidth,
      }),
      ...(autoHeight &&
        universal &&
        !didMountUniversal && {
          minHeight: autoHeightMin,
          maxHeight: autoHeightMax,
        }),
      ...(universal && !didMountUniversal && viewStyleUniversalInitial),
    }

    const trackAutoHideStyle = {
      transition: `opacity ${autoHideDuration}ms`,
      opacity: autoHide ? 1 : undefined, // Start visible when auto-hide is enabled
    }

    const trackHorizontalStyle = {
      ...trackHorizontalStyleDefault,
      ...(autoHide && trackAutoHideStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: 'none',
      }),
    }

    const trackVerticalStyle = {
      ...trackVerticalStyleDefault,
      ...(autoHide && trackAutoHideStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: 'none',
      }),
    }

    return createElement(
      tagName,
      { ...props, style: containerStyle, ref: containerRef },
      [
        cloneElement(
          renderView({ style: viewStyle }),
          { key: 'view', ref: viewRef },
          children
        ),
        cloneElement(
          renderTrackHorizontal({ style: trackHorizontalStyle }),
          { key: 'trackHorizontal', ref: trackHorizontalRef },
          cloneElement(renderThumbHorizontal({ style: {} }), {
            key: 'thumbHorizontal',
            ref: thumbHorizontalRef,
          })
        ),
        cloneElement(
          renderTrackVertical({ style: trackVerticalStyle }),
          { key: 'trackVertical', ref: trackVerticalRef },
          cloneElement(renderThumbVertical({ style: {} }), {
            key: 'thumbVertical',
            ref: thumbVerticalRef,
          })
        ),
      ]
    )
  }
)

Scrollbars.displayName = 'Scrollbars'

export default Scrollbars
