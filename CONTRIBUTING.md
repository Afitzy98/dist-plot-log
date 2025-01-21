# Contributing to Distribution Plot Logger

Thank you for your interest in contributing to **Distribution Plot Logger**! Your contributions help improve this project and benefit the community. Below are guidelines to help you contribute effectively.

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Pull Requests](#pull-requests)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Documentation](#documentation)
- [License](#license)

## How to Contribute

1. **Fork the Repository:**  
   Fork the project on GitHub.

2. **Clone Your Fork:**

   ```bash
   git clone https://github.com/Afitzy98/dist-plot-log.git
   cd distribution-plot-logger
   ```

3. **Create a Branch for Your Feature or Bugfix:**  
   Use a descriptive branch name, for example:

   ```bash
   git checkout -b feature/new-awesome-feature
   ```

   or

   ```bash
   git checkout -b bugfix/fix-plot-issue
   ```

4. **Install Dependencies:**  
   Run the following command to install all required packages:

   ```bash
   yarn
   ```

5. **Implement Your Changes:**  
   Make your changes or add new features. Please ensure you follow the coding guidelines listed below and write tests for new functionality.

6. **Run Tests and Linting:**  
   Run the test suite to ensure everything is working:

   ```bash
   yarn test
   ```

   Also, check the code style and linting (if applicable).

7. **Commit Your Changes:**  
   We use [Commitizen](https://github.com/commitizen/cz-conventional-changelog) to ensure our commit messages follow the Conventional Commits standard. Instead of using `git commit`, run:

   ```bash
   yarn commit
   ```

   This will prompt you to create a well-structured commit message.

8. **Push Your Branch and Create a Pull Request:**  
   Push your branch:
   ```bash
   git push origin feature/new-awesome-feature
   ```
   Then, go to GitHub and create a Pull Request (PR) from your branch. Please include a detailed description of your changes and reference any related issues.

## Bug Reports

If you encounter a bug, please:

- Search existing issues to see if it has already been reported.
- Open a new issue with a clear and descriptive title.
- Provide detailed steps to reproduce the bug, expected behavior, and any relevant logs or screenshots.

## Feature Requests

For new features or improvements:

- Please open an issue to discuss your suggestion before starting work.
- Once discussed, you are welcome to implement the feature and submit a pull request.

## Pull Requests

When submitting a Pull Request:

- Ensure your branch is up to date with the latest `main` branch changes.
- Confirm that all tests pass by running `yarn test`.
- Update documentation as needed.
- Make sure your commit messages follow the Conventional Commits standard (see the [Commit Messages](#commit-messages) section below).

## Coding Guidelines

- **Language:** Please use TypeScript for all code.
- **Code Style:** Follow the existing code style. Consistency is key.
- **Testing:** Write tests for new features and bug fixes using Jest.
- **Documentation:** Update the README and add comments where necessary to help explain your changes.

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard. A commit message should have the following format:

```
<type>(<scope>): <subject>

<body>
```

**Examples:**

- `fix(parser): correct parsing of numbers`
- `feat(ui): add new chart color option`
- `docs(readme): update installation instructions`

## Testing

Our test suite is built using Jest. To run tests, execute:

```bash
yarn test
```

Please add tests for any new functionality or bug fixes you introduce.

## Documentation

Keep documentation up to date. If you modify code functionality or introduce new features, update the README and inline comments accordingly.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

Thank you for contributing to **Distribution Plot Logger**!
