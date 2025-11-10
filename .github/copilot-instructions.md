# react-custom-scrollbars AI Development Guide

## Project Architecture

This is a React component library that provides customizable scrollbars. The core component wraps native browser scrolling while allowing full visual customization through render props.

### Key Components Structure
- `src/Scrollbars/index.js` - Main component (647 lines, handles all scrolling logic)
- `src/Scrollbars/styles.js` - CSS-in-JS style definitions for different modes
- `src/Scrollbars/defaultRenderElements.js` - Default render functions for scrollbar parts
- `src/utils/` - Browser compatibility utilities (scrollbar width detection, dimension helpers)

### Render Props Pattern
The component uses render props for all visual elements:
- `renderView` - Container for scrollable content
- `renderTrackHorizontal/Vertical` - Scrollbar track backgrounds  
- `renderThumbHorizontal/Vertical` - Draggable scrollbar handles

Example customization in `examples/simple/components/ColoredScrollbars/`:
```javascript
renderThumb({ style, ...props }) {
    const thumbStyle = { backgroundColor: dynamicColor };
    return <div style={{ ...style, ...thumbStyle }} {...props}/>;
}
```

## Development Workflow

### Build & Test Commands
```bash
# Development
npm run build          # Babel transpilation to lib/
npm run build:umd      # Webpack UMD build for browsers
npm run test           # Karma + Mocha browser tests
npm run test:watch     # Watch mode for development

# Publishing
npm run prepublish     # Full pipeline: lint, test, build, es3ify transform
```

### Testing Architecture
- Tests are organized by feature in `test/Scrollbars/` (autoHide, universal, etc.)
- Uses Karma with Chrome for browser environment testing
- Each test module exports a function that takes scrollbar width parameters
- Main test runner in `test/Scrollbars/index.js` orchestrates all test suites

## Critical Patterns

### Universal/SSR Handling
The component supports server-side rendering through the `universal` prop:
- Initial render uses `viewStyleUniversalInitial` (hidden overflow)
- `componentDidMountUniversal()` updates state to show scrollbars client-side
- Prevents hydration mismatches between server/client

### Auto-Height Mode
Key behavioral difference from standard mode:
- Container height adapts to content (`containerStyleAutoHeight`)
- View positioning changes from absolute to relative (`viewStyleAutoHeight`)
- Used for dynamic content where container shouldn't constrain height

### Animation & Performance
- Uses `requestAnimationFrame` for 60fps scrolling
- Centralized RAF management in main component
- Auto-hide timing controlled via `autoHideTimeout` and `autoHideDuration`

### Browser Compatibility
- ES3 transformation via `es3ify` for older browsers (see `prepublish.js`)
- Scrollbar width detection handles different browser behaviors
- Webkit overflow scrolling touch support for mobile

## Examples as Reference
The `examples/simple/components/` directory shows common patterns:
- `ColoredScrollbars` - Dynamic styling based on scroll position
- `ShadowScrollbars` - CSS shadows for visual depth
- `SpringScrollbars` - Physics-based scrolling animations

When adding features, follow the render props pattern and ensure both auto-height and universal modes are considered.