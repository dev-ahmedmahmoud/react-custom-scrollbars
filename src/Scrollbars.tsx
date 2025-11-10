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
