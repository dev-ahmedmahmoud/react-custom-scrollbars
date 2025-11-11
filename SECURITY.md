# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 5.0.x   | ✅ Yes             |
| < 5.0   | ❌ No              |

**Note**: This package (v5.0+) is a complete modernization. For older versions (4.x and below), please refer to the [original repository](https://github.com/malte-wessel/react-custom-scrollbars).

## Reporting a Vulnerability

If you discover a security vulnerability in this package, please help us maintain a safe environment by reporting it responsibly.

### How to Report

1. **Email**: Send details to dev.ahmedmahmoud@gmail.com
2. **Subject**: Use "SECURITY: react-custom-scrollbars vulnerability"
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 24-48 hours
- **Initial Assessment**: Within 1 week
- **Resolution Timeline**: Depending on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next scheduled release

### Security Updates

Security fixes will be:
- Released as patch versions (e.g., 5.0.1)
- Documented in CHANGELOG.md
- Announced in GitHub releases
- Published immediately to npm

## Security Considerations

### What We Monitor

- **Dependencies**: Regular audits with `npm audit`
- **Code Quality**: ESLint security rules
- **TypeScript**: Type safety to prevent runtime errors
- **Build Process**: Secure build pipeline with GitHub Actions

### Safe Usage Guidelines

1. **Keep Updated**: Always use the latest version
2. **Audit Dependencies**: Run `npm audit` in your project
3. **Input Sanitization**: Sanitize any user content passed to scrollbars
4. **CSP Headers**: Use Content Security Policy in production

### Known Security Features

- **No innerHTML Usage**: All DOM manipulation is safe
- **No eval() or Function()**: No dynamic code execution
- **Type Safety**: TypeScript prevents many runtime errors
- **Minimal Dependencies**: Zero runtime dependencies

## Vulnerability Disclosure

We follow responsible disclosure practices:
- Critical vulnerabilities are patched before public disclosure
- Security advisories are published on GitHub
- Users are notified through multiple channels

## Contact

For security-related questions or concerns:
- **Email**: dev.ahmedmahmoud@gmail.com
- **GitHub**: [@dev-ahmedmahmoud](https://github.com/dev-ahmedmahmoud)

Thank you for helping keep the community safe! 🛡️