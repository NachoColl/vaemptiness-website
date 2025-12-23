/**
 * Deep merge JSON objects
 * Drive properties override Git properties
 * Git-only properties are preserved
 */

const logger = require('./logger');

/**
 * Check if value is a plain object (not array, not null)
 */
function isPlainObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Deep merge two JSON objects
 *
 * Rules:
 * 1. Drive properties override Git properties (Drive is source of truth)
 * 2. Git-only properties are preserved (developer additions)
 * 3. Arrays: Drive array completely replaces Git array
 * 4. Nested objects: Recursive deep merge
 * 5. Property exists in Drive = use Drive value
 * 6. Property missing in Drive but exists in Git = preserve Git value
 *
 * @param {Object} gitJSON - Current JSON from GitHub
 * @param {Object} driveJSON - New JSON from Google Drive
 * @returns {Object} Merged result
 */
function deepMerge(gitJSON, driveJSON) {
  // If Drive is not an object, Drive wins completely
  if (!isPlainObject(driveJSON)) {
    return driveJSON;
  }

  // If Git is not an object, Drive wins completely
  if (!isPlainObject(gitJSON)) {
    return driveJSON;
  }

  const result = {};

  // Get all unique keys from both objects
  const allKeys = new Set([
    ...Object.keys(gitJSON),
    ...Object.keys(driveJSON)
  ]);

  for (const key of allKeys) {
    const gitValue = gitJSON[key];
    const driveValue = driveJSON[key];
    const hasInGit = key in gitJSON;
    const hasInDrive = key in driveJSON;

    if (hasInDrive) {
      // Property exists in Drive
      if (hasInGit && isPlainObject(gitValue) && isPlainObject(driveValue)) {
        // Both are objects - deep merge recursively
        result[key] = deepMerge(gitValue, driveValue);
      } else {
        // Drive value wins (includes arrays, primitives, type mismatches)
        result[key] = driveValue;
      }
    } else if (hasInGit) {
      // Property only exists in Git - preserve it
      result[key] = gitValue;
    }
  }

  return result;
}

/**
 * Compare two JSON objects and determine if they are different
 *
 * @param {Object} json1
 * @param {Object} json2
 * @returns {Boolean} True if objects are different
 */
function hasChanges(json1, json2) {
  return JSON.stringify(json1) !== JSON.stringify(json2);
}

/**
 * Merge JSON file from Drive with Git version
 *
 * @param {Object} gitContent - Current content from GitHub
 * @param {Object} driveContent - New content from Google Drive
 * @returns {Object} result
 */
function mergeJSON(gitContent, driveContent) {
  try {
    const merged = deepMerge(gitContent, driveContent);
    const changed = hasChanges(gitContent, merged);

    const result = {
      merged,
      changed,
      gitOnly: [],
      driveOverride: [],
      unchanged: []
    };

    // Analyze what happened (for PR description)
    if (changed) {
      // Find Git-only properties (properties in merged that match Git but not Drive)
      findGitOnlyProperties(gitContent, driveContent, merged, result.gitOnly, '');

      // Find Drive overrides (properties that exist in both but Drive value was used)
      findDriveOverrides(gitContent, driveContent, result.driveOverride, '');
    }

    return result;
  } catch (error) {
    logger.error('Merge failed', { error: error.message });
    throw error;
  }
}

/**
 * Find properties that exist in Git but not in Drive (and were preserved)
 */
function findGitOnlyProperties(gitObj, driveObj, mergedObj, gitOnlyList, path) {
  if (!isPlainObject(gitObj)) return;

  for (const key of Object.keys(gitObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    const hasInDrive = key in driveObj;

    if (!hasInDrive) {
      // This property was only in Git and was preserved
      gitOnlyList.push(currentPath);
    } else if (isPlainObject(gitObj[key]) && isPlainObject(driveObj[key])) {
      // Recurse into nested objects
      findGitOnlyProperties(gitObj[key], driveObj[key], mergedObj[key], gitOnlyList, currentPath);
    }
  }
}

/**
 * Find properties where Drive value overrode Git value
 */
function findDriveOverrides(gitObj, driveObj, overrideList, path) {
  if (!isPlainObject(gitObj) || !isPlainObject(driveObj)) return;

  for (const key of Object.keys(driveObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    const hasInGit = key in gitObj;

    if (hasInGit) {
      const gitValue = gitObj[key];
      const driveValue = driveObj[key];

      if (isPlainObject(gitValue) && isPlainObject(driveValue)) {
        // Recurse into nested objects
        findDriveOverrides(gitValue, driveValue, overrideList, currentPath);
      } else if (JSON.stringify(gitValue) !== JSON.stringify(driveValue)) {
        // Values are different - Drive overrode Git
        overrideList.push({
          path: currentPath,
          oldValue: gitValue,
          newValue: driveValue
        });
      }
    }
  }
}

module.exports = {
  deepMerge,
  hasChanges,
  mergeJSON
};
