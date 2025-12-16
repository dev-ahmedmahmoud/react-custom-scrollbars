# Change log

This project adheres to [Semantic Versioning](http://semver.org/).

## [5.0.3] - 2025-12-16

### Fixed
- 🖱️ **Scrollbar Interactivity**: Fixed critical issue where dragging the scrollbar thumb or clicking on the track did not scroll content (#1)
- 📜 **Vertical/Horizontal Scroll**: Both vertical and horizontal scrollbars now properly respond to user interaction

### Added
- 🧪 **Comprehensive Tests**: Added 10 new tests for scrollbar interaction functionality:
  - Track click handling (vertical/horizontal)
  - Thumb drag functionality (vertical/horizontal)
  - Drag state management (userSelect, cleanup)
  - Event listener attachment/removal
  - Auto-hide track mouse enter/leave
  - Cleanup on unmount during active drag

### Changed
- ⚡ **Event Handling**: Implemented proper event listener attachment using wrapper functions for better TypeScript compatibility
- 🔧 **Examples**: Migrated `examples/simple` from Webpack to Vite for easier development

## [5.0.2] - 2025-11-11

### Fixed
- 🔧 **Jest Compatibility**: Added CommonJS build alongside ESM for better Jest/testing compatibility
- 📦 **Dual Module Export**: Package now exports both ESM and CJS formats
- ✅ **No Configuration Needed**: Works out-of-the-box with Jest in Next.js, CRA, and other environments

### Changed
- **Build Output**: Now generates both `index.js` (ESM) and `index.cjs` (CommonJS)
- **Package Exports**: Updated to properly expose both module formats

## [5.0.1] - 2025-11-11

### Fixed
- 📝 **Documentation**: Updated README with correct scoped package name and installation instructions
- 🔗 **Package Links**: Fixed npm badges and import examples

## [5.0.0] - 2025-11-10

### Breaking Changes
- **Modernization**: Complete rewrite with React hooks and TypeScript
- **Node.js**: Minimum Node.js version is now 20.0.0 (was 6.x)
- **React**: Updated to support React 18/19 (was React 15/16)
- **Build**: Migrated from Webpack to Vite, ES modules only
- **TypeScript**: Now written in TypeScript with full type support

### Added
- ✨ **TypeScript Support**: Complete TypeScript rewrite with proper types
- 🚀 **React Hooks**: Modern hooks-based implementation
- 📦 **Modern Build**: Vite build system with optimized output
- 🧪 **Modern Testing**: Vitest with React Testing Library
- 📏 **New Props**: Added missing `autoHideTimeout` prop
- 🔄 **Scroll Detection**: Restored `onScrollStart` and `onScrollStop` callbacks
- 🌐 **React 19**: Full compatibility with latest React versions

### Changed
- **Architecture**: Class component → hooks-based functional component
- **Bundle Size**: Optimized to ~18.5KB (5.4KB gzipped)
- **Performance**: Improved scrolling performance with modern React patterns
- **API**: All original APIs maintained for backward compatibility

### Removed
- **IE Support**: Removed Internet Explorer support
- **Legacy Node**: Dropped support for Node.js < 20

### Credits
- Original library created by [Malte Wessel](https://github.com/malte-wessel)
- v5.0 modernization by [Ahmed Mahmoud](https://github.com/dev-ahmedmahmoud)

---

For earlier versions, see: [Original releases](https://github.com/malte-wessel/react-custom-scrollbars/releases)
