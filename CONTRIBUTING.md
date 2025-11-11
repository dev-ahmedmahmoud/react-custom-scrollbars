# Contributing to @dev-ahmed-mahmoud/react-custom-scrollbars

Thank you for your interest in contributing! This project is a modern TypeScript/React 19 implementation of the original react-custom-scrollbars by [Malte Wessel](https://github.com/malte-wessel).

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md) that we expect all contributors to adhere to.

## How Can I Contribute?

### 🐛 Reporting Bugs
- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- Include a clear description and reproduction steps
- Provide environment details (React/Node.js versions, browser, OS)
- Include a minimal code example demonstrating the issue

### 💡 Suggesting Features
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml)
- Explain the use case and expected behavior
- Consider TypeScript implications

### 🔧 Contributing Code
- Fix bugs or implement new features
- Improve documentation
- Add tests for new functionality
- Optimize performance

## Development Setup

### Prerequisites
- **Node.js**: 20.0.0 or higher
- **npm**: Latest version
- **TypeScript**: 5.8+ knowledge helpful

### Setup Instructions

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/react-custom-scrollbars.git
   cd react-custom-scrollbars
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Commands**
   ```bash
   # Run tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   
   # Type checking
   npm run typecheck
   
   # Linting
   npm run lint
   npm run lint:fix
   
   # Build
   npm run build
   
   # Run all checks
   npm run prepublishOnly
   ```

## Pull Request Process

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes
- Write clear, concise commit messages following [Conventional Commits](https://conventionalcommits.org/)
- Add tests for new functionality
- Update documentation if needed
- Ensure TypeScript types are accurate

### 3. Test Your Changes
```bash
# Run all checks
npm run prepublishOnly

# Ensure all tests pass
npm test

# Check TypeScript compilation
npm run typecheck

# Verify linting
npm run lint
```

### 4. Commit and Push
```bash
git commit -m "feat: add new scrollbar customization option"
git push origin feature/your-feature-name
```

### 5. Create Pull Request
- Use a clear, descriptive title
- Reference any related issues
- Include a detailed description of changes
- Add screenshots for visual changes

## Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good: Proper typing
interface MyComponentProps {
  children: ReactNode
  className?: string
}

// ✅ Good: Use meaningful names
const handleScrollStart = useCallback(() => {
  // implementation
}, [])

// ❌ Avoid: Any types
const handleEvent = (event: any) => { }
```

### React Patterns
```typescript
// ✅ Good: Use hooks appropriately
const MyComponent = forwardRef<ScrollbarsRef, MyComponentProps>((props, ref) => {
  const scrollbarsRef = useRef<ScrollbarsRef>(null)
  
  useImperativeHandle(ref, () => ({
    scrollToTop: () => scrollbarsRef.current?.scrollToTop(),
  }))
  
  return <Scrollbars ref={scrollbarsRef} {...props} />
})
```

### Testing Requirements
- **Unit Tests**: For all new features and bug fixes
- **TypeScript Tests**: Ensure types are properly tested
- **Integration Tests**: For component interactions

```typescript
// Example test
describe('Scrollbars', () => {
  it('should call onScrollStart when scrolling begins', async () => {
    const onScrollStart = vi.fn()
    
    render(
      <Scrollbars onScrollStart={onScrollStart}>
        <div>Content</div>
      </Scrollbars>
    )
    
    // Test implementation
  })
})
```

## 📚 Documentation

### Code Documentation
- Use TypeScript for self-documenting code
- Add JSDoc comments for complex functions
- Include examples in documentation

### README Updates
- Update README.md for new features
- Add TypeScript examples
- Update API documentation

## 🔍 Code Review Process

1. **Automated Checks**: All PRs must pass CI checks
2. **Manual Review**: Code will be reviewed for:
   - Functionality and correctness
   - TypeScript best practices
   - Performance implications
   - Test coverage
   - Documentation completeness

## 🙏 Recognition

Contributors will be:
- Added to the contributors list
- Credited in release notes
- Mentioned in the README

## ❓ Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review the [API documentation](docs/API.md)

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Credits:**
- Original library by [Malte Wessel](https://github.com/malte-wessel)
- v5.0 modernization maintained by [Ahmed Mahmoud](https://github.com/dev-ahmedmahmoud)