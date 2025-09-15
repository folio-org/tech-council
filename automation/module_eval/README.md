# FOLIO Module Evaluator

A TypeScript framework for evaluating FOLIO modules against technical council criteria.

## Overview

This tool provides a modular, extensible framework for automatically evaluating FOLIO modules against acceptance criteria. It currently supports Java modules with a pluggable architecture for adding support for additional programming languages.

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Install globally (optional)
npm install -g .
```

## Usage

### Command Line Interface

```bash
# Evaluate a repository
folio-eval evaluate https://github.com/folio-org/mod-users

# Use custom criteria file
folio-eval evaluate <repo-url> --criteria ./my-criteria.md

# Generate only JSON report
folio-eval evaluate <repo-url> --json-only

# Custom output directory
folio-eval evaluate <repo-url> --output ./my-reports

# List supported languages
folio-eval list-languages

# Show framework information
folio-eval info
```

## Architecture

### Core Components

1. **ModuleEvaluator**: Main orchestrator that coordinates the evaluation process
2. **LanguageEvaluator Interface**: Contract for language-specific evaluators
3. **GitUtils**: Handles repository cloning and cleanup
4. **CriteriaLoader**: Parses acceptance criteria from Markdown files
5. **ReportGenerator**: Creates HTML and JSON reports

### Language Evaluators

The framework uses a pluggable architecture for language-specific evaluation logic:

- **JavaEvaluator**: Detects Java projects (Maven/Gradle) and evaluates Java-specific criteria
- **Future Evaluators**: Can be added by implementing the `LanguageEvaluator` interface

### Evaluation Process

1. Clone the target repository
2. Load acceptance criteria from Markdown file
3. Detect appropriate language evaluator
4. Run evaluation against criteria
5. Generate reports (HTML + JSON)
6. Clean up temporary files

## Adding New Language Support

To add support for a new programming language:

1. Create a new evaluator class implementing `LanguageEvaluator`:

```typescript
export class MyLanguageEvaluator implements LanguageEvaluator {
  async canEvaluate(repoPath: string): Promise<boolean> {
    // Logic to detect if this is a repository for your language
  }

  async evaluate(repoPath: string, criteria: Criterion[]): Promise<CriterionResult[]> {
    // Implementation of criteria evaluation logic
  }

  getLanguage(): string {
    return 'MyLanguage';
  }
}
```

2. Register the evaluator in `ModuleEvaluator`:

```typescript
// In module-evaluator.ts constructor
this.evaluators = [
  new JavaEvaluator(),
  new MyLanguageEvaluator() // Add your evaluator
];
```

## Criteria Format

The framework expects criteria in a Markdown file with the following structure:

```markdown
# Section Name

1. First criterion description
2. Second criterion description

## Subsection

- Bullet point criterion
- Another criterion
```

Each criterion is automatically assigned:
- **ID**: Unique identifier (e.g., `criterion-1`)
- **Code**: Generated code based on section (e.g., `SEC001`)
- **Description**: Extracted text content
- **Section**: Header under which it appears

## Report Output

### HTML Report
- Visual dashboard with color-coded results
- Statistics summary (pass/fail/manual counts)
- Detailed criterion-by-criterion breakdown
- Responsive design for various screen sizes

### JSON Report
- Machine-readable format for integration
- Complete evaluation data including evidence
- Suitable for further processing or analysis

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

## Current Limitations

This is a **framework shell** - the specific criteria evaluation logic is not yet implemented. The current Java evaluator provides:

- **Framework Structure**: Complete architecture for extensible evaluation
- **Basic Checks**: README and LICENSE file detection as examples
- **Stubbed Results**: Most criteria return "manual review required"

## Future Development

To complete the evaluator, implement specific criteria checks in the language evaluators:

1. **Code Quality**: Analyze code structure, complexity, patterns
2. **Documentation**: Check for required documentation files and formats
3. **Testing**: Verify test coverage and test structure
4. **Dependencies**: Analyze dependency management and security
5. **Build Configuration**: Validate build scripts and configuration
6. **API Standards**: Check API design and compatibility

## Contributing

1. Implement specific criteria evaluation logic
2. Add support for additional programming languages
3. Enhance report generation with more detailed analysis
4. Add integration with CI/CD pipelines
5. Improve error handling and user experience

## License

Apache-2.0 License
