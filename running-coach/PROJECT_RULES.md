# Project Workflow Rules

- **Package Manager**: Use `npm`.
- **Git Workflow**: Always stage all changes and provide a conventional commit message.
- **Deployment**: Use `npm run build` before pushing to ensure type safety.
- **Component Style**: Keep components small and extracted to sibling files in the same directory.

## Custom Commands
- `ship-it "<message>"`: Runs `npm run lint && tsc --noEmit && npm run build && git add . && git commit -m "$1" && git push origin main`.
- `validate`: Runs `npm run lint && tsc --noEmit`.
