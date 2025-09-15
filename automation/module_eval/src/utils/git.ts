import simpleGit from 'simple-git';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

/**
 * Git utilities for cloning and managing repositories
 */
export class GitUtils {
  private tempDir: string;

  constructor(tempDir?: string) {
    this.tempDir = tempDir || path.join(os.tmpdir(), 'folio-eval');
  }

  /**
   * Clone a repository to a temporary directory
   * @param repositoryUrl GitHub URL of the repository
   * @returns Promise<string> Path to the cloned repository
   */
  async cloneRepository(repositoryUrl: string): Promise<string> {
    const repoName = this.extractRepoName(repositoryUrl);
    const clonePath = path.join(this.tempDir, repoName, Date.now().toString());

    // Ensure temp directory exists
    await fs.ensureDir(clonePath);

    const git = simpleGit();
    await git.clone(repositoryUrl, clonePath);

    console.log(`Repository cloned to: ${clonePath}`);
    return clonePath;
  }

  /**
   * Clean up cloned repository
   * @param repoPath Path to the cloned repository
   */
  async cleanup(repoPath: string): Promise<void> {
    if (await fs.pathExists(repoPath)) {
      await fs.remove(repoPath);
      console.log(`Cleaned up: ${repoPath}`);
    }
  }

  /**
   * Extract repository name from GitHub URL
   * @param repositoryUrl GitHub URL
   * @returns Repository name
   */
  private extractRepoName(repositoryUrl: string): string {
    const match = repositoryUrl.match(/\/([^\/]+?)(?:\.git)?$/);
    return match ? match[1] : 'unknown-repo';
  }

  /**
   * Get basic repository information
   * @param repoPath Path to the cloned repository
   * @returns Basic repository info
   */
  async getRepoInfo(repoPath: string): Promise<{ name: string; hasPackageJson: boolean; hasPomXml: boolean; hasBuildGradle: boolean }> {
    const name = path.basename(repoPath);
    const hasPackageJson = await fs.pathExists(path.join(repoPath, 'package.json'));
    const hasPomXml = await fs.pathExists(path.join(repoPath, 'pom.xml'));
    const hasBuildGradle = await fs.pathExists(path.join(repoPath, 'build.gradle')) || 
                          await fs.pathExists(path.join(repoPath, 'build.gradle.kts'));

    return {
      name,
      hasPackageJson,
      hasPomXml,
      hasBuildGradle
    };
  }
}
