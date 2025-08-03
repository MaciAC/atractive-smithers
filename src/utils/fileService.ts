import path from 'path';
import fs from 'fs/promises';

export class LocalFileService {
  private static readonly MEDIA_DIR = path.join(process.cwd(), 'public', 'media');
  private static readonly BASE_URL = '/media';

  /**
   * Get the local file URL for a given file key
   * @param key - The file key/path (same as what was stored in S3)
   * @returns The local URL path
   */
  static getFileUrl(key: string): string {
    // Remove any leading slashes and normalize the path
    const normalizedKey = key.replace(/^\/+/, '');
    return `${this.BASE_URL}/${normalizedKey}`;
  }

  /**
   * Get the full file system path for a given file key
   * @param key - The file key/path
   * @returns The full file system path
   */
  static getFilePath(key: string): string {
    const normalizedKey = key.replace(/^\/+/, '');
    return path.join(this.MEDIA_DIR, normalizedKey);
  }

  /**
   * Check if a file exists locally
   * @param key - The file key/path
   * @returns Promise<boolean>
   */
  static async fileExists(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure directory exists for a given file key
   * @param key - The file key/path
   */
  static async ensureDirectory(key: string): Promise<void> {
    const filePath = this.getFilePath(key);
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
  }

  /**
   * Get file stats
   * @param key - The file key/path
   * @returns File stats or null if file doesn't exist
   */
  static async getFileStats(key: string) {
    try {
      const filePath = this.getFilePath(key);
      return await fs.stat(filePath);
    } catch {
      return null;
    }
  }
}

// For backward compatibility, create a simple URL cache replacement
// Since we're serving static files, we don't need complex caching
export class LocalUrlCache {
  static get(key: string): string | null {
    // For local files, we can always return the URL immediately
    return LocalFileService.getFileUrl(key);
  }


  static clear(): void {
    // No-op for local files
  }
}

export const localUrlCache = new LocalUrlCache();