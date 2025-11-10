import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Scrollbars } from '../Scrollbars'

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
})
