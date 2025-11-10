# Upgrade Guide: v4.x to v5.0

This guide will help you upgrade from react-custom-scrollbars v4.x to v5.0.

## Overview

Version 5.0 is a complete modernization of the library with breaking changes. The core API remains the same to maintain compatibility, but the underlying implementation has been completely rewritten.

## Breaking Changes

### Node.js Requirements
- **Before**: Node.js 6+ 
- **After**: Node.js 20+ ✨

### React Requirements
- **Before**: React 15-17
- **After**: React 18+ (with React 19 support) ✨

### Module System
- **Before**: CommonJS and ES modules
- **After**: ES modules only ✨

```typescript
// ✅ This still works
import { Scrollbars } from 'react-custom-scrollbars'

// ❌ This no longer works
const { Scrollbars } = require('react-custom-scrollbars')
```

### TypeScript Support
- **Before**: Community types via @types/react-custom-scrollbars
- **After**: Built-in TypeScript support ✨

```typescript
// ✅ Built-in types (new in v5.0)
import { Scrollbars, ScrollbarsRef, ScrollValues } from 'react-custom-scrollbars'
```

### Implementation Changes
- **Before**: Class-based component
- **After**: Hooks-based functional component ✨

## What's New

### TypeScript First
Version 5.0 is written in TypeScript from the ground up:

```typescript
import React, { useRef } from 'react'
import { Scrollbars, ScrollbarsRef } from 'react-custom-scrollbars'

function MyComponent() {
  const scrollbars = useRef<ScrollbarsRef>(null)
  
  return (
    <Scrollbars ref={scrollbars}>
      {/* Your content */}
    </Scrollbars>
  )
}
```

### Restored Features
- ✅ `autoHideTimeout` prop (was missing in some versions)
- ✅ `onScrollStart` and `onScrollStop` callbacks
- ✅ All original APIs maintained

### Modern Tooling
- **Build**: Webpack → Vite
- **Testing**: Karma/Mocha → Vitest + React Testing Library
- **Linting**: ESLint 9 with flat config
- **Types**: Full TypeScript support

## Migration Steps

### 1. Update Dependencies

```bash
# Update to latest versions
npm install react@^18 react-dom@^18 react-custom-scrollbars@^5.0.0

# Or if using React 19
npm install react@^19 react-dom@^19 react-custom-scrollbars@^5.0.0
```

### 2. Update Node.js
Ensure you're using Node.js 20 or later:

```bash
node --version  # Should be 20.0.0 or higher
```

### 3. Update Import Statements
If you're using TypeScript, you can now import types:

```typescript
// Before (external types)
import { Scrollbars } from 'react-custom-scrollbars'
import { ScrollbarsProps } from '@types/react-custom-scrollbars'

// After (built-in types)
import { Scrollbars, ScrollbarsProps, ScrollbarsRef } from 'react-custom-scrollbars'
```

### 4. Update Build Configuration
If you're using bundlers, ensure they support ES modules:

```javascript
// vite.config.js
export default {
  // react-custom-scrollbars v5.0 uses ES modules
  optimizeDeps: {
    include: ['react-custom-scrollbars']
  }
}
```

## Compatibility

### API Compatibility ✅
All public APIs from v4.x are maintained:

```typescript
// ✅ All of these still work exactly the same
<Scrollbars
  style={{ width: 500, height: 300 }}
  autoHide
  autoHideTimeout={1000}
  autoHideDuration={200}
  onScrollStart={() => console.log('Scroll started')}
  onScrollStop={() => console.log('Scroll stopped')}
  renderTrackHorizontal={props => <div {...props} className="track-h" />}
  renderThumbHorizontal={props => <div {...props} className="thumb-h" />}
>
  {/* Your content */}
</Scrollbars>
```

### Performance Improvements
- ✅ Modern React hooks implementation
- ✅ Better tree-shaking support
- ✅ Smaller bundle size: ~18.5KB (5.4KB gzipped)
- ✅ 60fps performance with requestAnimationFrame

## Browser Support

### Dropped Support
- ❌ Internet Explorer (all versions)
- ❌ Legacy browsers without ES2020 support

### Current Support
- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Edge 88+

## Troubleshooting

### CommonJS Import Errors
```
Error: require() of ES modules is not supported
```

**Solution**: Use ES module imports only
```typescript
// ✅ Correct
import { Scrollbars } from 'react-custom-scrollbars'

// ❌ No longer supported
const { Scrollbars } = require('react-custom-scrollbars')
```

### React Version Errors
```
Error: React 18+ is required
```

**Solution**: Upgrade React
```bash
npm install react@^18 react-dom@^18
```

### Node.js Version Errors
```
Error: Node.js 20+ is required
```

**Solution**: Upgrade Node.js
```bash
# Using nvm
nvm install 20
nvm use 20
```

## Credits

- Original library by [Malte Wessel](https://github.com/malte-wessel)
- v5.0 modernization by [Ahmed Mahmoud](https://github.com/dev-ahmedmahmoud)

---

Need help? [Open an issue](https://github.com/dev-ahmedmahmoud/react-custom-scrollbars/issues) on GitHub.