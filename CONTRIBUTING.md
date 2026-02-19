# Contributing to ChatFlow

First off, thank you for considering contributing to ChatFlow! It's people like you that make ChatFlow such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript and React coding standards
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Setup

### Prerequisites

* Node.js (v18 or higher)
* npm or pnpm
* Git

### Setup Steps

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/chatflow.git
   cd chatflow
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Make your changes and test them:
   ```bash
   npm run dev
   ```

6. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Create a Pull Request

## Coding Standards

### TypeScript

* Use TypeScript for all new files
* Define proper types and interfaces
* Avoid using `any` type
* Use meaningful variable and function names

### React

* Use functional components with hooks
* Keep components small and focused
* Use proper prop typing
* Follow React best practices

### CSS/Tailwind

* Use Tailwind utility classes
* Follow the existing design system
* Ensure responsive design
* Test on multiple screen sizes

### File Organization

* Place components in `/src/app/components/`
* Place types in `/src/app/types/`
* Place utilities in appropriate directories
* Keep files focused and modular

### Commit Messages

Follow the conventional commits specification:

* `feat:` - A new feature
* `fix:` - A bug fix
* `docs:` - Documentation changes
* `style:` - Code style changes (formatting, etc.)
* `refactor:` - Code refactoring
* `test:` - Adding or updating tests
* `chore:` - Maintenance tasks

Examples:
```
feat: add message threading functionality
fix: resolve typing indicator not clearing
docs: update installation instructions
refactor: simplify message component logic
```

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Test on different browsers and devices
* Test edge cases and error scenarios

## Documentation

* Update README.md if needed
* Add JSDoc comments for complex functions
* Update BACKEND_GUIDE.md for backend changes
* Include usage examples

## Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## Questions?

Feel free to open an issue with the question label or reach out to the maintainers directly.

## Recognition

Contributors will be recognized in our README.md and release notes.

Thank you for contributing to ChatFlow! 🎉
