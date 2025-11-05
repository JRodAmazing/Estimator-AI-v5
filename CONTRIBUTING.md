# Contributing to Estimator AI v5

First off, thank you for considering contributing to Estimator AI! This project is built by developers who care about making construction estimation more efficient and accessible.

## 🎯 Project Vision

Our goal is to transform manual construction estimation workflows into intelligent, automated processes. We value:

- **Simplicity**: Keep the Discord interface intuitive
- **Reliability**: Construction professionals depend on accurate estimates
- **Extensibility**: Make it easy to add new features
- **Performance**: Fast responses for real-time workflows

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title**: Summarize the issue in one line
- **Steps to reproduce**: Detailed steps to recreate the problem
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: Node version, OS, Discord.js version
- **Screenshots**: If applicable

**Example:**
```
Title: !submittal command fails with TypeError

Steps:
1. Run !generateprojects 1
2. Run !submittal project_123
3. Error appears in console

Expected: PDF downloads successfully
Actual: TypeError: Cannot read property 'name' of undefined

Environment: Node 22.0.0, Windows 11, Discord.js 14.23.2
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use case**: Why is this enhancement needed?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches you thought about
- **Additional context**: Screenshots, mockups, examples

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards (see below)
3. **Test your changes** using the provided commands
4. **Update documentation** if you changed APIs or added features
5. **Write clear commit messages** using conventional commits
6. **Open a PR** with a clear title and description

#### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(commands): add !export-excel command for spreadsheet export

Added new command that exports project data to Excel format.
Includes formatted sheets for estimates, materials, and labor.

Closes #42
```

```
fix(submittal): resolve TypeError when project has no revisions

Previously crashed when calling generatePdf on projects without
revision history. Now gracefully handles empty revision arrays.

Fixes #58
```

## 💻 Development Setup

### Prerequisites
- Node.js 22 or higher
- npm 10+
- A Discord bot token (for testing)

### Setup

```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/estimator-ai-v5.git
cd estimator-ai-v5

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Discord bot token to .env

# Start mock API (separate terminal)
npm run mock-api

# Start bot in development mode
npm run dev
```

### Project Structure

```
estimator_ai_v5/
├── commands/          # Discord command handlers
├── modules/           # Core business logic
├── data/              # JSON data storage
├── mock-api/          # Supplier API simulator
└── index.js           # Entry point
```

### Adding a New Command

1. Create a new file in `/commands/`:

```javascript
// commands/mycommand.js
export default {
  name: "mycommand",
  description: "Brief description of what this command does",
  async execute(message, args) {
    try {
      // Your command logic here
      await message.reply("✅ Command executed successfully!");
    } catch (error) {
      console.error("Error in mycommand:", error);
      await message.reply("❌ An error occurred.");
    }
  },
};
```

2. The command will be automatically loaded by `index.js`
3. Test with `!mycommand` in Discord
4. Run `!checkcommands` to verify it's properly formatted

### Coding Standards

- **Use ESM imports** (`import`/`export` instead of `require`)
- **Async/await** for asynchronous operations
- **Error handling**: Always wrap in try/catch
- **Descriptive names**: Use clear variable and function names
- **Comments**: Add JSDoc comments for functions
- **Consistency**: Match existing code style

**Good Example:**
```javascript
/**
 * Generates a PDF submittal for a project
 * @param {string} projectId - The project identifier
 * @returns {Promise<string>} Path to generated PDF
 */
async function generateSubmittal(projectId) {
  try {
    const project = await getProject(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }
    
    const pdfPath = await createPdf(project);
    return pdfPath;
  } catch (error) {
    console.error("Submittal generation failed:", error);
    throw error;
  }
}
```

### Testing Your Changes

Before submitting a PR:

```bash
# 1. Start the bot
npm run dev

# 2. Test your command in Discord
!mycommand

# 3. Check for errors in console

# 4. Verify command integrity
!checkcommands

# 5. Test edge cases (missing args, invalid input, etc.)
```

## 📚 Documentation

If your contribution changes behavior or adds features:

1. **Update README.md** with new commands/features
2. **Update inline code comments**
3. **Add examples** of how to use new features
4. **Update INSTALL_GUIDE.md** if setup changes

## 🎨 Design Principles

### Keep It Simple
Discord commands should be intuitive. Avoid requiring complex syntax.

❌ Bad: `!project create --name "Example" --type residential --budget 50000`  
✅ Good: `!createproject Example` (then prompt for details)

### Fail Gracefully
Always handle errors and provide helpful messages.

❌ Bad: Crash with stack trace in Discord  
✅ Good: `❌ Project not found. Use !projects to see available projects.`

### Maintain Performance
Construction professionals need fast responses.

- Minimize API calls
- Use caching where appropriate
- Async operations for heavy tasks

### Preserve Data Integrity
Never lose user data.

- Validate inputs before writing to JSON
- Create backups before destructive operations
- Log important state changes

## 🐛 Common Issues

### "Module not found" errors
Make sure you're using ESM syntax and the file exists in the correct directory.

### Commands not loading
Check that your command file exports a default object with `name`, `description`, and `execute`.

### Bot not responding
Verify your `.env` has a valid `DISCORD_TOKEN` and the bot has proper permissions in your server.

## 🤝 Community

- **Be respectful**: We're all here to learn and build
- **Be patient**: Maintainers review PRs in their spare time
- **Be helpful**: Share knowledge and help others

## 📞 Questions?

If you have questions about contributing:

1. Check existing [GitHub Issues](https://github.com/yourusername/estimator-ai-v5/issues)
2. Open a new issue with the "question" label
3. Join our [Discord server] (if applicable)

---

Thank you for contributing to Estimator AI! 🎉
