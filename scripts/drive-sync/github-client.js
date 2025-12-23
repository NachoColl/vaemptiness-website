/**
 * GitHub API client
 */

const { Octokit } = require('@octokit/rest');
const config = require('./config');
const logger = require('./logger');

class GitHubClient {
  constructor() {
    this.octokit = null;
    this.initialized = false;
  }

  /**
   * Initialize GitHub API client
   */
  initialize() {
    if (this.initialized) return;

    if (!config.github.token) {
      throw new Error('GitHub token not configured. Set GITHUB_TOKEN environment variable.');
    }

    this.octokit = new Octokit({
      auth: config.github.token
    });

    this.initialized = true;
    logger.info('GitHub client initialized');
  }

  /**
   * Get file content from repository
   */
  async getFileContent(path, branch = config.github.branch) {
    this.initialize();

    try {
      const response = await this.octokit.repos.getContent({
        owner: config.github.owner,
        repo: config.github.repo,
        path,
        ref: branch
      });

      if (response.data.type !== 'file') {
        throw new Error(`Path ${path} is not a file`);
      }

      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');

      return {
        content,
        sha: response.data.sha,
        path: response.data.path
      };
    } catch (error) {
      if (error.status === 404) {
        logger.debug('File not found in GitHub', { path, branch });
        return null;
      }
      logger.error('Failed to get file content', { path, branch, error: error.message });
      throw error;
    }
  }

  /**
   * Get commit information for a file
   */
  async getFileCommit(path, branch = config.github.branch) {
    this.initialize();

    try {
      const response = await this.octokit.repos.listCommits({
        owner: config.github.owner,
        repo: config.github.repo,
        path,
        sha: branch,
        per_page: 1
      });

      if (response.data.length === 0) {
        return null;
      }

      const commit = response.data[0];
      return {
        sha: commit.sha,
        date: commit.commit.author.date,
        author: commit.commit.author.name,
        message: commit.commit.message
      };
    } catch (error) {
      logger.error('Failed to get file commit', { path, error: error.message });
      throw error;
    }
  }

  /**
   * Create or update a pull request
   */
  async createOrUpdatePR(branch, title, body, labels = []) {
    this.initialize();

    try {
      // Check if PR already exists
      const existingPRs = await this.octokit.pulls.list({
        owner: config.github.owner,
        repo: config.github.repo,
        head: `${config.github.owner}:${branch}`,
        state: 'open'
      });

      if (existingPRs.data.length > 0) {
        // Update existing PR
        const pr = existingPRs.data[0];
        const response = await this.octokit.pulls.update({
          owner: config.github.owner,
          repo: config.github.repo,
          pull_number: pr.number,
          title,
          body
        });

        logger.info('Updated existing PR', { prNumber: pr.number, branch });
        return response.data;
      } else {
        // Create new PR
        const response = await this.octokit.pulls.create({
          owner: config.github.owner,
          repo: config.github.repo,
          title,
          head: branch,
          base: config.github.branch,
          body
        });

        // Add labels if provided
        if (labels.length > 0) {
          await this.octokit.issues.addLabels({
            owner: config.github.owner,
            repo: config.github.repo,
            issue_number: response.data.number,
            labels
          });
        }

        logger.info('Created new PR', { prNumber: response.data.number, branch });
        return response.data;
      }
    } catch (error) {
      logger.error('Failed to create/update PR', { branch, error: error.message });
      throw error;
    }
  }

  /**
   * Create an issue
   */
  async createIssue(title, body, labels = []) {
    this.initialize();

    try {
      const response = await this.octokit.issues.create({
        owner: config.github.owner,
        repo: config.github.repo,
        title,
        body,
        labels
      });

      logger.info('Created issue', { issueNumber: response.data.number });
      return response.data;
    } catch (error) {
      logger.error('Failed to create issue', { error: error.message });
      throw error;
    }
  }

  /**
   * Check if branch exists
   */
  async branchExists(branch) {
    this.initialize();

    try {
      await this.octokit.repos.getBranch({
        owner: config.github.owner,
        repo: config.github.repo,
        branch
      });
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }
}

module.exports = new GitHubClient();
