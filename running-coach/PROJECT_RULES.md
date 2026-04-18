# Project Workflow Rules

- **Package Manager**: Use `npm`.
- **Git Workflow**: Always stage all changes and provide a conventional commit message.
- **Deployment**: Use `npm run build` before pushing to ensure type safety.
- **Component Style**: Keep components small and extracted to sibling files in the same directory.

## Custom Commands
- `ship-it ["message"]`: Runs validation and build. If a message is provided, commits and pushes; otherwise, falls back to `gen-commit` to provide diff context for AI message generation.
- `validate`: Runs `npm run lint && tsc --noEmit`.
- `gen-commit`: Outputs the diff of staged changes (or unstaged if none are staged) to provide context for AI-generated commit messages.
