import React, { useState, useRef, useCallback } from 'react'
import { Scrollbars, ScrollbarsRef, ScrollValues } from '@dev-ahmed-mahmoud/react-custom-scrollbars'

function App() {
  const [scrollValues, setScrollValues] = useState<ScrollValues | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollbarsRef = useRef<ScrollbarsRef>(null)

  const handleScrollFrame = useCallback((values: ScrollValues) => {
    setScrollValues(values)
  }, [])

  const handleScrollStart = useCallback(() => {
    setIsScrolling(true)
  }, [])

  const handleScrollStop = useCallback(() => {
    setIsScrolling(false)
  }, [])

  const scrollToTop = () => scrollbarsRef.current?.scrollToTop()
  const scrollToBottom = () => scrollbarsRef.current?.scrollToBottom()

  const customThumb = ({ style, ...props }: any) => (
    <div
      style={{
        ...style,
        backgroundColor: isScrolling ? '#ff6b6b' : '#4ecdc4',
        borderRadius: '6px',
        transition: 'background-color 0.3s ease',
        cursor: 'grab',
      }}
      {...props}
    />
  )

  const customTrack = ({ style, ...props }: any) => (
    <div
      style={{
        ...style,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
      }}
      {...props}
    />
  )

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '700' }}>
          🚀 React Custom Scrollbars v5.0
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Modern TypeScript implementation with React 19 support
        </p>
      </div>

      {/* Main Demo */}
      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: '1fr 300px', 
        gap: '20px',
        minHeight: 0
      }}>
        {/* Scrollable Content */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '12px', 
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#fff' }}>
            📜 Scrollable Content
            {isScrolling && (
              <span style={{ 
                marginLeft: '10px', 
                color: '#ff6b6b', 
                fontSize: '0.8em' 
              }}>
                ● SCROLLING
              </span>
            )}
          </h2>
          
          <Scrollbars
            ref={scrollbarsRef}
            style={{ height: '100%' }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            onScrollFrame={handleScrollFrame}
            onScrollStart={handleScrollStart}
            onScrollStop={handleScrollStop}
            renderThumbVertical={customThumb}
            renderTrackVertical={customTrack}
            renderThumbHorizontal={customThumb}
            renderTrackHorizontal={customTrack}
          >
            <div style={{ padding: '20px', fontSize: '16px', lineHeight: '1.6' }}>
              <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>
                ✨ New in v5.0.0
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#fff', marginBottom: '10px' }}>🎯 Modern React Features</h4>
                <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                  <li style={{ marginBottom: '8px' }}>✅ React 19 compatibility</li>
                  <li style={{ marginBottom: '8px' }}>✅ TypeScript first approach</li>
                  <li style={{ marginBottom: '8px' }}>✅ Hooks-based implementation</li>
                  <li style={{ marginBottom: '8px' }}>✅ Zero runtime dependencies</li>
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#fff', marginBottom: '10px' }}>📦 Bundle Optimization</h4>
                <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                  <li style={{ marginBottom: '8px' }}>📉 28% smaller bundle size</li>
                  <li style={{ marginBottom: '8px' }}>⚡ Tree-shakable ES modules</li>
                  <li style={{ marginBottom: '8px' }}>🛡️ Type-safe API</li>
                  <li style={{ marginBottom: '8px' }}>🔧 Modern build tools (Vite)</li>
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#fff', marginBottom: '10px' }}>🎨 Enhanced Features</h4>
                <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                  <li style={{ marginBottom: '8px' }}>🕐 autoHideTimeout prop restored</li>
                  <li style={{ marginBottom: '8px' }}>📊 Improved scroll detection</li>
                  <li style={{ marginBottom: '8px' }}>🎭 Custom render props support</li>
                  <li style={{ marginBottom: '8px' }}>📱 Mobile-optimized scrolling</li>
                </ul>
              </div>

              {/* Generate more content */}
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ 
                  marginBottom: '20px', 
                  padding: '15px', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h5 style={{ color: '#4ecdc4', marginBottom: '10px' }}>
                    📝 Demo Section {i + 1}
                  </h5>
                  <p>
                    This is a demonstration of the scrollable content. The scrollbars 
                    are fully customizable and provide smooth, 60fps scrolling performance. 
                    Try scrolling to see the enhanced scroll detection in action!
                  </p>
                  <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
                    Features like auto-hide, custom styling, and TypeScript support 
                    make this the perfect solution for modern React applications.
                  </p>
                </div>
              ))}
            </div>
          </Scrollbars>
        </div>

        {/* Control Panel */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '12px', 
          padding: '20px',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '10px' }}>🎛️ Controls</h3>
          
          <button
            onClick={scrollToTop}
            style={{
              padding: '12px 16px',
              background: '#4ecdc4',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45b7aa'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4ecdc4'}
          >
            ⬆️ Scroll to Top
          </button>
          
          <button
            onClick={scrollToBottom}
            style={{
              padding: '12px 16px',
              background: '#ff6b6b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff5252'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
          >
            ⬇️ Scroll to Bottom
          </button>

          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#fff', marginBottom: '10px', fontSize: '14px' }}>
              📊 Scroll Values
            </h4>
            {scrollValues ? (
              <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                <div>Top: {(scrollValues.top * 100).toFixed(1)}%</div>
                <div>Left: {(scrollValues.left * 100).toFixed(1)}%</div>
                <div>ScrollTop: {scrollValues.scrollTop}px</div>
                <div>ClientH: {scrollValues.clientHeight}px</div>
                <div>ScrollH: {scrollValues.scrollHeight}px</div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                Start scrolling to see values
              </div>
            )}
          </div>

          <div style={{ 
            marginTop: 'auto',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Installation:</strong>
            </div>
            <code style={{ 
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              npm install @dev-ahmed-mahmoud/react-custom-scrollbars
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App