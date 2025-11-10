# react-custom-scrollbars

[![npm](https://img.shields.io/badge/npm-react--custom--scrollbars-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/react-custom-scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/react-custom-scrollbars)
[![npm downloads](https://img.shields.io/npm/dm/react-custom-scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/react-custom-scrollbars)

Modern React scrollbars component with TypeScript support and React 19 compatibility.

## ✨ Features

* 🚀 **Modern React Hooks** - Built with React hooks and TypeScript
* 📱 **Native mobile scrolling** - Native scrollbars for mobile devices
* 🎨 **Fully customizable** - Complete control over scrollbar appearance
* 🔄 **Auto hide** - Configurable auto-hide functionality
* 📏 **Auto height** - Dynamic height based on content
* 🌐 **Universal** - SSR compatible (runs on client & server)
* ⚡ **60fps performance** - Smooth scrolling with requestAnimationFrame
* 🎯 **Zero dependencies** - No external dependencies in production
* 📘 **TypeScript ready** - Full TypeScript support with proper types
* ✅ **Well tested** - Comprehensive test coverage

## 📦 Installation

```bash
npm install react-custom-scrollbars
```

## 🚀 Usage

### Basic Example

```typescript
import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

function App() {
  return (
    <Scrollbars style={{ width: 500, height: 300 }}>
      <p>Some great content...</p>
    </Scrollbars>
  )
}
```

### Advanced Example with TypeScript

```typescript
import React, { useRef } from 'react'
import { Scrollbars, ScrollbarsRef, ScrollValues } from 'react-custom-scrollbars'

function CustomScrollbars() {
  const scrollbars = useRef<ScrollbarsRef>(null)

  const handleScrollFrame = (values: ScrollValues) => {
    const { top } = values
    if (top > 0.8) {
      console.log('Near bottom!')
    }
  }

  const scrollToTop = () => {
    scrollbars.current?.scrollToTop()
  }

  return (
    <div>
      <button onClick={scrollToTop}>Scroll to top</button>
      <Scrollbars
        ref={scrollbars}
        onScrollFrame={handleScrollFrame}
        renderThumbVertical={({ style, ...props }) => (
          <div
            style={{
              ...style,
              backgroundColor: '#007bff',
              borderRadius: '3px',
            }}
            {...props}
          />
        )}
        style={{ width: 500, height: 300 }}
      >
        <div style={{ padding: 20 }}>
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>Content line {i + 1}</p>
          ))}
        </div>
      </Scrollbars>
    </div>
  )
}
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onScroll` | `(event: Event) => void` | - | Event handler for scroll events |
| `onScrollFrame` | `(values: ScrollValues) => void` | - | Runs inside the animation frame |
| `onScrollStart` | `() => void` | - | Called when scrolling starts |
| `onScrollStop` | `() => void` | - | Called when scrolling stops |
| `onUpdate` | `(values: ScrollValues) => void` | - | Called when component updates |
| `renderView` | `(props: RenderElementProps) => ReactElement` | - | Custom view component |
| `renderTrackHorizontal` | `(props: RenderElementProps) => ReactElement` | - | Custom horizontal track |
| `renderTrackVertical` | `(props: RenderElementProps) => ReactElement` | - | Custom vertical track |
| `renderThumbHorizontal` | `(props: RenderElementProps) => ReactElement` | - | Custom horizontal thumb |
| `renderThumbVertical` | `(props: RenderElementProps) => ReactElement` | - | Custom vertical thumb |
| `hideTracksWhenNotNeeded` | `boolean` | `false` | Hide tracks when content doesn't overflow |
| `thumbSize` | `number` | - | Fixed thumb size in px |
| `thumbMinSize` | `number` | `30` | Minimum thumb size in px |
| `autoHide` | `boolean` | `false` | Enable auto-hide mode |
| `autoHideTimeout` | `number` | `1000` | Hide delay in ms |
| `autoHideDuration` | `number` | `200` | Duration for hide animation in ms |
| `autoHeight` | `boolean` | `false` | Enable auto-height mode |
| `autoHeightMin` | `number \| string` | `0` | Minimum height for auto-height mode |
| `autoHeightMax` | `number \| string` | `200` | Maximum height for auto-height mode |
| `universal` | `boolean` | `false` | Enable universal/SSR rendering |
| `tagName` | `string` | `'div'` | Container element tag name |

### Ref Methods

The component provides imperative methods through refs:

```typescript
interface ScrollbarsRef {
  getScrollLeft(): number
  getScrollTop(): number
  getScrollWidth(): number
  getScrollHeight(): number
  getClientWidth(): number
  getClientHeight(): number
  getValues(): ScrollValues
  scrollLeft(left?: number): void
  scrollTop(top?: number): void
  scrollToLeft(): void
  scrollToTop(): void
  scrollToRight(): void
  scrollToBottom(): void
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## 📝 Migration from v4

This is a major version with breaking changes:

### Breaking Changes
- **Node.js 18+** required
- **React 18+** required
- Component converted to **hooks** (no more class component)
- **TypeScript first** (JavaScript still supported)
- **ES modules only** (no UMD build)
- Removed deprecated props and methods
### Methods (via ref)

| Method | Description |
|--------|-------------|
| `scrollTop(top: number)` | Scroll to specific top position |
| `scrollLeft(left: number)` | Scroll to specific left position |
| `scrollToTop()` | Scroll to top |
| `scrollToBottom()` | Scroll to bottom |
| `scrollToLeft()` | Scroll to left |
| `scrollToRight()` | Scroll to right |
| `getScrollLeft()` | Get current scrollLeft value |
| `getScrollTop()` | Get current scrollTop value |
| `getScrollWidth()` | Get scrollable width |
| `getScrollHeight()` | Get scrollable height |
| `getClientWidth()` | Get view client width |
| `getClientHeight()` | Get view client height |
| `getValues()` | Get current scroll values object |

## 📋 Requirements

- **Node.js**: 20.0.0 or higher
- **React**: 18.0.0 or higher (React 19 supported)
- **TypeScript**: 5.8+ (optional, but recommended)

## 📖 Documentation

- [API Reference](docs/API.md) - Complete API documentation
- [Customization Guide](docs/customization.md) - Learn how to customize scrollbars
- [Usage Examples](docs/usage.md) - More usage examples
- [Upgrade Guide](docs/upgrade-guide-v4-v5.md) - Migrating from v4.x to v5.0

## 🚀 Migration from v4.x

Version 5.0 maintains API compatibility while modernizing the internals:

```typescript
// ✅ Your existing v4 code mostly works as-is
<Scrollbars
  style={{ width: 500, height: 300 }}
  autoHide
  autoHideTimeout={1000}
  onScrollStart={() => console.log('Started')}
  onScrollStop={() => console.log('Stopped')}
>
  {content}
</Scrollbars>
```

**Key Changes:**
- Now requires React 18+ and Node.js 20+
- Written in TypeScript with built-in types
- Modern hooks-based implementation
- ES modules only (no CommonJS)
- Smaller bundle size and better performance

See the [complete upgrade guide](docs/upgrade-guide-v4-v5.md) for details.

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and breaking changes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT © [Malte Wessel](https://github.com/malte-wessel) (original author)

v5.0 modernization by [Ahmed Mahmoud](https://github.com/dev-ahmedmahmoud)
