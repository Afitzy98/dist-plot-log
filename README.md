# Distribution Plot Logger

[![npm version](https://img.shields.io/npm/v/dist-plot-log.svg)](https://www.npmjs.com/package/dist-plot-log)

A simple TypeScript library that estimates and logs a text-based probability density function (PDF) plot of your data to the console using [asciichart](https://www.npmjs.com/package/asciichart).

## Installation

Install the package via npm:

```bash
npm install dist-plot-log
```

## Usage

You can use the package in both JavaScript and TypeScript projects.

### TypeScript

```typescript
import { logDistributionPlot } from "dist-plot-log";

const data = [1, 2, 3, 4, 5, 3, 2, 1];
logDistributionPlot(data, "My Data Plot");
```

### JavaScript

```javascript
const { logDistributionPlot } = require("dist-plot-log");

const data = [1, 2, 3, 4, 5, 3, 2, 1];
logDistributionPlot(data, "My Data Plot");
```

In the above examples:

- The first argument is an array of numerical data.
- The second argument is an optional title for the plot.

## Development

### Installing packages

```bash
yarn
```

### Building

Before publishing or testing changes, compile the TypeScript source:

```bash
yarn build
```

### Running Tests

We use Jest for testing. To run the test suite:

```bash
yarn test
```

### Committing Changes

We use [Commitizen](https://github.com/commitizen/cz-conventional-changelog) for standardized commit messages. Instead of `git commit`, run:

```bash
yarn commit
```

### Automated Releases

We use [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) for automated versioning and release management. Make sure your commits follow Conventional Commits standards so that new versions are released automatically.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License.
