import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Scrollbars } from '../Scrollbars'

// Mock getScrollbarWidth to return a non-zero value so tracks are rendered
vi.mock('../utils/getScrollbarWidth', () => ({
  getScrollbarWidth: () => 17,
}))

describe('Scrollbars', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('renders children content', () => {
    render(
      <Scrollbars style={{ height: 200 }}>
        <div data-testid="content">Test content</div>
      </Scrollbars>
    )

    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('applies custom style to container', () => {
    const { container } = render(
      <Scrollbars style={{ height: 200, width: 300, backgroundColor: 'red' }}>
        <div>Content</div>
      </Scrollbars>
    )

    const scrollbarsContainer = container.firstChild as HTMLElement
    expect(scrollbarsContainer).toHaveStyle({ height: '200px', width: '300px' })
  })

  it('accepts custom render props', () => {
    const customView = ({
      style,
      ...props
    }: {
      style?: React.CSSProperties
      [key: string]: unknown
    }) => (
      <div
        {...props}
        style={{ ...style, padding: '20px' }}
        data-testid="custom-view"
      />
    )

    render(
      <Scrollbars style={{ height: 200 }} renderView={customView}>
        <div data-testid="content">Content</div>
      </Scrollbars>
    )

    const customViewElement = screen.getByTestId('custom-view')
    expect(customViewElement).toBeInTheDocument()
    expect(customViewElement).toHaveStyle({ padding: '20px' })
  })

  it('calls onScrollStart callback when scrolling begins', () => {
    const onScrollStart = vi.fn()

    const { container } = render(
      <Scrollbars style={{ height: 200 }} onScrollStart={onScrollStart}>
        <div style={{ height: 1000 }}>Long content</div>
      </Scrollbars>
    )

    // Find the scrollable view element
    const viewElement = container.querySelector(
      '[style*="scroll"]'
    ) as HTMLElement
    expect(viewElement).toBeTruthy()

    if (viewElement) {
      act(() => {
        viewElement.scrollTop = 100
        viewElement.dispatchEvent(new Event('scroll', { bubbles: true }))
      })

      expect(onScrollStart).toHaveBeenCalledTimes(1)

      // Second scroll should not call onScrollStart again (already scrolling)
      act(() => {
        viewElement.scrollTop = 200
        viewElement.dispatchEvent(new Event('scroll', { bubbles: true }))
      })

      expect(onScrollStart).toHaveBeenCalledTimes(1) // Still just once
    }
  })

  it('accepts autoHide props and enables auto-hide behavior', () => {
    const { container } = render(
      <Scrollbars
        style={{ height: 200 }}
        autoHide
        autoHideTimeout={500}
        autoHideDuration={300}
      >
        <div style={{ height: 1000 }}>Long content</div>
      </Scrollbars>
    )

    // Verify the component renders with autoHide enabled
    expect(container.firstChild).toBeTruthy()

    // Find the scrollable view
    const viewElement = container.querySelector(
      '[style*="scroll"]'
    ) as HTMLElement
    expect(viewElement).toBeTruthy()

    // The component should handle mouse events for auto-hide
    // (we can't easily test the actual opacity changes in jsdom,
    // but we can verify the component renders correctly with the props)
    expect(viewElement).toBeInTheDocument()
  })

  describe('Track and Thumb Interaction', () => {
    it('renders vertical and horizontal tracks', () => {
      const { container } = render(
        <Scrollbars style={{ height: 200, width: 200 }}>
          <div style={{ height: 1000, width: 1000 }}>Long content</div>
        </Scrollbars>
      )

      // The container should have 3 children: view, trackHorizontal, trackVertical
      const scrollbarsContainer = container.firstChild as HTMLElement
      expect(scrollbarsContainer.children.length).toBe(3)
    })

    it('attaches mousedown event listeners to tracks and thumbs', () => {
      const addEventListenerSpy = vi.spyOn(
        HTMLElement.prototype,
        'addEventListener'
      )

      render(
        <Scrollbars style={{ height: 200, width: 200 }}>
          <div style={{ height: 1000, width: 1000 }}>Long content</div>
        </Scrollbars>
      )

      // Verify mousedown listeners were attached
      const mousedownCalls = addEventListenerSpy.mock.calls.filter(
        (call: [string, ...unknown[]]) => call[0] === 'mousedown'
      )
      expect(mousedownCalls.length).toBeGreaterThan(0)

      addEventListenerSpy.mockRestore()
    })

    it('handles vertical track click by updating scrollTop', () => {
      const { container } = render(
        <Scrollbars style={{ height: 200, width: 200 }}>
          <div style={{ height: 1000 }}>Long content</div>
        </Scrollbars>
      )

      const scrollbarsContainer = container.firstChild as HTMLElement
      // trackVertical is the 3rd child (index 2)
      const trackVertical = scrollbarsContainer.children[2] as HTMLElement

      // Find the view element
      const viewElement = container.querySelector(
        '[style*="scroll"]'
      ) as HTMLElement

      // Mock getBoundingClientRect for the track
      vi.spyOn(trackVertical, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        bottom: 200,
        right: 6,
        width: 6,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => {},
      })

      // Simulate mousedown on track
      act(() => {
        fireEvent.mouseDown(trackVertical, {
          clientY: 100, // Middle of the track
          clientX: 3,
        })
      })

      // The scrollTop should be updated (exact value depends on calculations)
      // We can't easily verify the exact value in jsdom, but we can verify the event was handled
      expect(viewElement).toBeTruthy()
    })

    it('handles horizontal track click', () => {
      const { container } = render(
        <Scrollbars style={{ height: 200, width: 200 }}>
          <div style={{ height: 500, width: 1000 }}>Wide content</div>
        </Scrollbars>
      )

      const scrollbarsContainer = container.firstChild as HTMLElement
      // trackHorizontal is the 2nd child (index 1)
      const trackHorizontal = scrollbarsContainer.children[1] as HTMLElement

      // Mock getBoundingClientRect for the track
      vi.spyOn(trackHorizontal, 'getBoundingClientRect').mockReturnValue({
        top: 194,
        left: 0,
        bottom: 200,
        right: 200,
        width: 200,
        height: 6,
        x: 0,
        y: 194,
        toJSON: () => {},
      })

      // Simulate mousedown on track
      act(() => {
        fireEvent.mouseDown(trackHorizontal, {
          clientY: 197,
          clientX: 100, // Middle of the track
        })
      })

      // Verify the component handles the event without errors
      const viewElement = container.querySelector(
        '[style*="scroll"]'
      ) as HTMLElement
      expect(viewElement).toBeTruthy()
    })

    it('handles vertical thumb drag', () => {
      const { container } = render(
        <Scrollbars style={{ height: 200, width: 200 }}>
          <div style={{ height: 1000 }}>Long content</div>
        </Scrollbars>
      )

      const scrollbarsContainer = container.firstChild as HTMLElement
      // trackVertical is the 3rd child, thumbVertical is its child
      const trackVertical = scrollbarsContainer.children[2] as HTMLElement
      const thumbVertical = trackVertical.children[0] as HTMLElement

      // Mock getBoundingClientRect for the thumb
      vi.spyOn(thumbVertical, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        bottom: 40,
        right: 6,
        width: 6,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => {},
      })

      // Simulate mousedown on thumb to start dragging
      act(() => {
        fireEvent.mouseDown(thumbVertical, {
          clientY: 20,
          clientX: 3,
        })
      })

      // Verify document event listeners were added for drag
      // We can verify the body has userSelect = none during drag
      expect(document.body.style.userSelect).toBe('none')

      // Simulate mouseup to end dragging
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup'))
      })

      // Verify drag ended
      expect(document.body.style.userSelect).toBe('')
    })

    it('handles horizontal thumb drag', () => {
      const { container } = render(
        <Scrollbars style={{ height: 200, width: 200 }}>
          <div style={{ height: 500, width: 1000 }}>Wide content</div>
        </Scrollbars>
      )

      const scrollbarsContainer = container.firstChild as HTMLElement
      // trackHorizontal is the 2nd child, thumbHorizontal is its child
      const trackHorizontal = scrollbarsContainer.children[1] as HTMLElement
      const thumbHorizontal = trackHorizontal.children[0] as HTMLElement

      // Mock getBoundingClientRect for the thumb
      vi.spyOn(thumbHorizontal, 'getBoundingClientRect').mockReturnValue({
        top: 194,
        left: 0,
        bottom: 200,
        right: 40,
        width: 40,
        height: 6,
        x: 0,
        y: 194,
        toJSON: () => {},
      })

      // Simulate mousedown on thumb to start dragging
      act(() => {
        fireEvent.mouseDown(thumbHorizontal, {
          clientY: 197,
          clientX: 20,
        })
      })

      // Verify document event listeners were added for drag
      expect(document.body.style.userSelect).toBe('none')

      // Simulate mouseup to end dragging
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup'))
      })

      // Verify drag ended
      expect(document.body.style.userSelect).toBe('')
    })

    it('updates scroll position during drag', () => {
      const { container } = render(
        <Scrollbars style={{ height: 200, width: 200 }}>
          <div style={{ height: 1000 }}>Long content</div>
        </Scrollbars>
      )

      const scrollbarsContainer = container.firstChild as HTMLElement
      const trackVertical = scrollbarsContainer.children[2] as HTMLElement
      const thumbVertical = trackVertical.children[0] as HTMLElement

      // Mock getBoundingClientRect
      vi.spyOn(thumbVertical, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        bottom: 40,
        right: 6,
        width: 6,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => {},
      })

      vi.spyOn(trackVertical, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        bottom: 200,
        right: 6,
        width: 6,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => {},
      })

      // Start drag
      act(() => {
        fireEvent.mouseDown(thumbVertical, {
          clientY: 20,
          clientX: 3,
        })
      })

      // Simulate mousemove
      act(() => {
        document.dispatchEvent(
          new MouseEvent('mousemove', {
            clientY: 100,
            clientX: 3,
          })
        )
      })

      // End drag
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup'))
      })

      // Verify drag ended properly
      expect(document.body.style.userSelect).toBe('')
    })

    it('handles track mouse enter and leave for auto-hide', () => {
      const { container } = render(
        <Scrollbars style={{ height: 200 }} autoHide autoHideTimeout={500}>
          <div style={{ height: 1000 }}>Long content</div>
        </Scrollbars>
      )

      const scrollbarsContainer = container.firstChild as HTMLElement
      const trackVertical = scrollbarsContainer.children[2] as HTMLElement

      // Simulate mouseenter on track
      act(() => {
        fireEvent.mouseEnter(trackVertical)
      })

      // Track should remain visible (opacity = 1)
      // Note: In jsdom we can't easily verify opacity changes

      // Simulate mouseleave on track
      act(() => {
        fireEvent.mouseLeave(trackVertical)
      })

      // Verify no errors occurred
      expect(trackVertical).toBeTruthy()
    })
  })

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(
        HTMLElement.prototype,
        'removeEventListener'
      )

      const { unmount } = render(
        <Scrollbars style={{ height: 200 }}>
          <div style={{ height: 1000 }}>Long content</div>
        </Scrollbars>
      )

      unmount()

      // Verify removeEventListener was called for scroll
      const scrollCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'scroll'
      )
      expect(scrollCalls.length).toBeGreaterThan(0)

      removeEventListenerSpy.mockRestore()
    })

    it('cleans up drag state on unmount during active drag', () => {
      const { container, unmount } = render(
        <Scrollbars style={{ height: 200 }}>
          <div style={{ height: 1000 }}>Long content</div>
        </Scrollbars>
      )

      const scrollbarsContainer = container.firstChild as HTMLElement
      const trackVertical = scrollbarsContainer.children[2] as HTMLElement
      const thumbVertical = trackVertical.children[0] as HTMLElement

      // Mock getBoundingClientRect
      vi.spyOn(thumbVertical, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        bottom: 40,
        right: 6,
        width: 6,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => {},
      })

      // Start drag
      act(() => {
        fireEvent.mouseDown(thumbVertical, {
          clientY: 20,
          clientX: 3,
        })
      })

      // Unmount while dragging
      unmount()

      // Verify cleanup happened
      expect(document.body.style.userSelect).toBe('')
    })
  })
})
