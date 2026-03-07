import { SarvamAIClient } from 'sarvamai';
import * as fs from 'fs/promises';
import { createWriteStream } from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Service for interacting with Sarvam AI APIs.
 * Uses the official 'sarvamai' SDK for Document Intelligence.
 */
export class SarvamAIService {
  /**
   * Extracts text and data from a base64 encoded image using Sarvam's Document Intelligence API.
   * 
   * @param base64Image The image string (can include the data URI scheme or just the raw base64)
   * @param apiKey The Sarvam API subscription key
   * @returns The parsed textual data from the document in Markdown format
   */
  static async extractDocumentText(base64Image: string, apiKey: string): Promise<string> {
    const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });
    const timestamp = Date.now();
    
    const tempDir = '/tmp';
    const imagePath = path.join(tempDir, `vision_${timestamp}.jpg`);
    const uploadZipPath = path.join(tempDir, `vision_in_${timestamp}.zip`);
    const zipPath = path.join(tempDir, `vision_out_${timestamp}.zip`);
    const extractDir = path.join(tempDir, `vision_ext_${timestamp}`);

    try {
      // 1. Save Base64 to a temporary file
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      await fs.writeFile(imagePath, Buffer.from(base64Data, 'base64'));

      // 1.5. Zip the file (Sarvam Document Intelligence requires .pdf or .zip)
      await execAsync(`zip -j ${uploadZipPath} ${imagePath}`);

      // 2. Create the Document Intelligence Job
      console.log('Creating Document Intelligence Job...');
      const job = await client.documentIntelligence.createJob({
        language: 'en-IN',
        outputFormat: 'md'
      });
      console.log(`Job Created: ${job.jobId}`);

      // 3. Upload File
      console.log('Uploading file...');
      await job.uploadFile(uploadZipPath);

      // 4. Start Processing
      console.log('Starting job...');
      await job.start();

      // 5. Wait for completion
      console.log('Waiting for completion...');
      const status = await job.waitUntilComplete();
      
      if (status.job_state === 'Failed') {
        throw new Error(`Job failed. Check Sarvam dashboard.`);
      }

      // 6. Download the output ZIP
      console.log('Downloading output...');
      await job.downloadOutput(zipPath);

      // 7. Unzip the file
      await fs.mkdir(extractDir, { recursive: true });
      await execAsync(`unzip -o ${zipPath} -d ${extractDir}`);

      // 8. Find and read the markdown file
      const files = await fs.readdir(extractDir);
      const mdFile = files.find(f => f.endsWith('.md'));
      
      if (!mdFile) {
        throw new Error('No markdown file found in the output zip.');
      }

      const mdContent = await fs.readFile(path.join(extractDir, mdFile), 'utf-8');
      return mdContent;

    } catch (error: any) {
      console.error('Sarvam AI Extraction Error:', error);
      throw new Error(`Vision extraction failed: ${error.message}`);
    } finally {
      // 9. Cleanup Temporary Files
      console.log('Cleaning up temporary files...');
      await fs.unlink(imagePath).catch(() => {});
      await fs.unlink(uploadZipPath).catch(() => {});
      await fs.unlink(zipPath).catch(() => {});
      await fs.rm(extractDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
