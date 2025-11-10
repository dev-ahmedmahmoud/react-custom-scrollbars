# Change log

This project adheres to [Semantic Versioning](http://semver.org/).

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
