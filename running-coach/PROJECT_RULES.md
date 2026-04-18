# Project Workflow Rules

- **Package Manager**: Use `npm`.
- **Git Workflow**: Always stage all changes and provide a conventional commit message.
- **Deployment**: Use `npm run build` before pushing to ensure type safety.
- **Component Style**: Keep components small and extracted to sibling files in the same directory.

## Custom Commands
- `ship-it "<message>"`: Runs validation and build, stages all changes, and commits with the provided message. Use with `npm run ship-it -- "your message"`.
- `validate`: Runs `npm run lint && tsc --noEmit`.
- `gen-commit`: Outputs the diff of staged changes (or unstaged changes if none are staged) to provide context for Gemini to generate a conventional commit message.
