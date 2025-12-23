/**
 * Validate JSON files before applying changes
 */

const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const logger = require('./logger');

/**
 * Validate JSON syntax and parse
 */
function validateSyntax(content, filePath) {
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON syntax in ${filePath}: ${error.message}`);
  }
}

/**
 * Validate file structure
 */
function validateStructure(data, filePath) {
  const errors = [];

  // Determine if this is a page, program, or blog file
  const isBlogOrProgram = filePath.includes('/blog/') || filePath.includes('/programs/');

  if (isBlogOrProgram) {
    // Blog posts and programs have simpler structure
    if (!data.slug) errors.push('Missing required field: slug');
    if (!data.title && !data.name) {
      errors.push('Missing required field: title or name');
    }
  } else {
    // Regular pages should have meta and content structure
    if (!data.meta) errors.push('Missing required field: meta');
    if (!data.content) errors.push('Missing required field: content');

    if (data.meta) {
      if (!data.meta.slug) errors.push('Missing required field: meta.slug');
      if (!data.meta.permalink) errors.push('Missing required field: meta.permalink');
      if (!data.meta.seo) errors.push('Missing required field: meta.seo');

      if (data.meta.seo) {
        if (!data.meta.seo.title) errors.push('Missing required field: meta.seo.title');
        if (!data.meta.seo.description) {
          errors.push('Missing required field: meta.seo.description');
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Structure validation failed for ${filePath}:\\n${errors.join('\\n')}`);
  }
}

/**
 * Validate content safety (no dangerous patterns)
 */
function validateSafety(data, filePath) {
  const errors = [];
  const dataStr = JSON.stringify(data);

  for (const pattern of config.validation.disallowedPatterns) {
    if (pattern.test(dataStr)) {
      errors.push(`Dangerous pattern detected: ${pattern}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Safety validation failed for ${filePath}:\\n${errors.join('\\n')}`);
  }
}

/**
 * Validate file size
 */
function validateSize(content, filePath) {
  const size = Buffer.byteLength(content, 'utf-8');

  if (size > config.validation.maxFileSize) {
    throw new Error(
      `File size (${size} bytes) exceeds maximum (${config.validation.maxFileSize} bytes): ${filePath}`
    );
  }
}

/**
 * Validate single file
 */
async function validateFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Validate size
    validateSize(content, filePath);

    // Validate JSON syntax
    const data = validateSyntax(content, filePath);

    // Skip validation for _instructions field
    if (data._instructions) {
      delete data._instructions;
    }

    // Validate structure
    validateStructure(data, filePath);

    // Validate safety
    validateSafety(data, filePath);

    return { valid: true, warnings: [] };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Validate all files in a directory
 */
async function validateDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const results = {
    valid: true,
    files: {},
    errors: []
  };

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      const subResults = await validateDirectory(fullPath);
      Object.assign(results.files, subResults.files);
      if (!subResults.valid) results.valid = false;
      results.errors.push(...subResults.errors);
    } else if (file.name.endsWith('.json') && !file.name.endsWith('.meta')) {
      const result = await validateFile(fullPath);
      results.files[file.name] = result;

      if (!result.valid) {
        results.valid = false;
        results.errors.push(`${file.name}: ${result.error}`);
        logger.error('Validation failed', { file: file.name, error: result.error });
      } else {
        logger.debug('Validation passed', { file: file.name });
      }
    }
  }

  return results;
}

/**
 * Validate all downloaded files
 */
async function validate(dir = config.paths.temp) {
  logger.info('Starting validation', { dir });

  if (!await fs.pathExists(dir)) {
    logger.warn('Directory does not exist', { dir });
    return { valid: true, files: {}, errors: [] };
  }

  const results = await validateDirectory(dir);

  logger.info('Validation complete', {
    valid: results.valid,
    filesChecked: Object.keys(results.files).length,
    errors: results.errors.length
  });

  // Output for GitHub Actions
  console.log('::set-output name=valid::' + results.valid);

  if (!results.valid) {
    console.error('Validation errors:\\n' + results.errors.join('\\n'));
    process.exitCode = 1;
  }

  return results;
}

// Run if called directly
if (require.main === module) {
  const dir = process.argv[2] || config.paths.temp;

  validate(dir)
    .then(results => {
      if (results.valid) {
        logger.info('All validations passed');
        process.exit(0);
      } else {
        logger.error('Validation failed');
        process.exit(1);
      }
    })
    .catch(error => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { validate, validateFile };
