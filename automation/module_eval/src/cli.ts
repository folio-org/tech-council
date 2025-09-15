#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { ModuleEvaluator } from './module-evaluator';
import { ReportGenerator } from './utils/report-generator';
import { EvaluationConfig } from './types';

const program = new Command();

program
  .name('folio-eval')
  .description('FOLIO Module Evaluator - Evaluate FOLIO modules against technical council criteria')
  .version('1.0.0');

program
  .command('evaluate')
  .description('Evaluate a FOLIO module repository')
  .argument('<repository-url>', 'GitHub URL of the repository to evaluate')
  .option('-c, --criteria <path>', 'Path to MODULE_ACCEPTANCE_CRITERIA.md file', '../MODULE_ACCEPTANCE_CRITERIA.md')
  .option('-o, --output <dir>', 'Output directory for reports', './reports')
  .option('--json-only', 'Generate only JSON report')
  .option('--html-only', 'Generate only HTML report')
  .option('--temp-dir <dir>', 'Temporary directory for cloning repositories')
  .action(async (repositoryUrl: string, options) => {
    try {
      console.log('🚀 Starting FOLIO Module Evaluation...\n');
      
      // Resolve criteria file path
      const criteriaPath = path.resolve(options.criteria);
      
      // Create evaluator configuration
      const config: EvaluationConfig = {
        criteriaFilePath: criteriaPath,
        tempDir: options.tempDir,
        outputDir: options.output
      };
      
      // Initialize evaluator
      const evaluator = new ModuleEvaluator(config);
      
      console.log(`📋 Using criteria file: ${criteriaPath}`);
      console.log(`📁 Output directory: ${options.output}`);
      console.log(`🔗 Repository URL: ${repositoryUrl}\n`);
      
      // Perform evaluation
      const result = await evaluator.evaluateModule(repositoryUrl);
      
      // Generate reports
      const reportGenerator = new ReportGenerator(options.output);
      const reportOptions = {
        outputHtml: !options.jsonOnly,
        outputJson: !options.htmlOnly,
        outputDir: options.output
      };
      
      const reportPaths = await reportGenerator.generateReports(result, reportOptions);
      
      console.log('\n✅ Evaluation completed successfully!');
      console.log('\n📊 Summary:');
      console.log(`   Module: ${result.moduleName}`);
      console.log(`   Language: ${result.language}`);
      console.log(`   Total Criteria: ${result.criteria.length}`);
      
      const stats = {
        pass: result.criteria.filter(c => c.status === 'pass').length,
        fail: result.criteria.filter(c => c.status === 'fail').length,
        manual: result.criteria.filter(c => c.status === 'manual').length
      };
      
      console.log(`   ✅ Passed: ${stats.pass}`);
      console.log(`   ❌ Failed: ${stats.fail}`);
      console.log(`   ⚠️  Manual Review: ${stats.manual}`);
      
      console.log('\n📄 Reports generated:');
      if (reportPaths.htmlPath) {
        console.log(`   📄 HTML: ${reportPaths.htmlPath}`);
      }
      if (reportPaths.jsonPath) {
        console.log(`   📄 JSON: ${reportPaths.jsonPath}`);
      }
      
      console.log('\n🎉 Done!');
      
    } catch (error) {
      console.error('❌ Error during evaluation:');
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('list-languages')
  .description('List supported programming languages')
  .action(() => {
    console.log('🔧 Supported Languages:');
    
    // Create a temporary evaluator to get supported languages
    const config: EvaluationConfig = {
      criteriaFilePath: '../MODULE_ACCEPTANCE_CRITERIA.md' // dummy path
    };
    const evaluator = new ModuleEvaluator(config);
    const languages = evaluator.getSupportedLanguages();
    
    languages.forEach(lang => {
      console.log(`   - ${lang}`);
    });
    
    console.log('\nTo add support for additional languages, implement the LanguageEvaluator interface.');
  });

program
  .command('info')
  .description('Show information about the evaluator')
  .action(() => {
    console.log('📋 FOLIO Module Evaluator');
    console.log('==========================');
    console.log('A TypeScript tool for evaluating FOLIO modules against technical council criteria.\n');
    
    console.log('🏗️  Framework Components:');
    console.log('   - Modular language evaluator system');
    console.log('   - Git repository cloning and analysis');
    console.log('   - Criteria loading from Markdown files');
    console.log('   - HTML and JSON report generation');
    console.log('   - Extensible architecture for new languages\n');
    
    console.log('📝 Usage Examples:');
    console.log('   # Evaluate a repository');
    console.log('   folio-eval evaluate https://github.com/folio-org/mod-users');
    console.log('');
    console.log('   # Use custom criteria file');
    console.log('   folio-eval evaluate <repo-url> --criteria ./my-criteria.md');
    console.log('');
    console.log('   # Generate only JSON report');
    console.log('   folio-eval evaluate <repo-url> --json-only');
    console.log('');
    console.log('   # Custom output directory');
    console.log('   folio-eval evaluate <repo-url> --output ./my-reports');
  });

// Handle case where no command is provided
if (process.argv.length === 2) {
  program.outputHelp();
}

program.parse();
