# Instructions for GitHub Copilot

# General Guidelines

- Follow the project's coding standards and conventions.
- Prioritize readability and maintainability in generated code.
- Use early returns whenever possible.
- Avoid complex nested structures; prefer flat structures.
- Use camelCase for variable and function names.
- Use PascalCase for class names.
- Use classes instead of functions when possible
- Use async/await for asynchronous code.
- Use template literals for string interpolation.


# Specific Rules

- Use TypeScript best practices.
- Ensure compatibility with Node.js 22-alpine.
- Avoid suggesting deprecated libraries or APIs.
- Use ES6+ syntax where applicable.
- ensure libraries are real and not hallucinated.

# Testing

- Include unit tests for new features or changes.
- Use Jest as the testing framework.

# Files

- For new files, include a brief comment at the top explaining the file's purpose.
