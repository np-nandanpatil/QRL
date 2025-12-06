# Contributing to QRL

Thank you for your interest in contributing to QRL! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect differing viewpoints

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser and OS** information

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title** describing the enhancement
- **Provide detailed description** of the suggested enhancement
- **Explain why** this enhancement would be useful
- **List examples** of how it would work

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our code style
3. **Test thoroughly** across different browsers
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/QRL.git
cd QRL

# Create a branch for your changes
git checkout -b feature/your-feature-name

# Make your changes and test locally
# You can use any local server, e.g., Python's simple server:
python -m http.server 8000
# Or Node.js http-server:
npx http-server

# Open http://localhost:8000 in your browser
```

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Keep proper indentation (2 spaces)

### CSS
- Follow existing naming conventions
- Use CSS custom properties for theming
- Ensure responsive design
- Test on multiple screen sizes

### JavaScript
- Use modern ES6+ syntax
- Follow functional programming patterns where appropriate
- Add comments for complex logic
- Handle errors gracefully
- Test edge cases

### Accessibility
- Ensure keyboard navigation works
- Add appropriate ARIA attributes
- Test with screen readers
- Maintain sufficient color contrast

## Testing

Before submitting:

1. **Browser Testing**: Test on Chrome, Firefox, Safari, and Edge
2. **Mobile Testing**: Test on actual mobile devices
3. **Accessibility**: Test keyboard navigation and screen reader compatibility
4. **Performance**: Check PageSpeed Insights score

## Commit Message Guidelines

Follow the conventional commits specification:

```
feat: add dark mode toggle
fix: resolve QR generation error on Safari
docs: update README with new features
style: improve button hover states
refactor: simplify URL validation logic
test: add tests for QR generation
chore: update dependencies
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions about contributing!

Thank you for contributing to QRL! 🎉
