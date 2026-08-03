import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { AppError } from '../middleware/error.middleware';

export class FileExtractorService {
  /**
   * Extract text from a file based on its extension
   */
  static async extractText(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case '.pdf':
        return this.extractFromPDF(filePath);
      case '.docx':
        return this.extractFromDOCX(filePath);
      case '.txt':
        return this.extractFromTXT(filePath);
      default:
        throw new AppError(`Unsupported file type: ${ext}`, 400);
    }
  }

  /**
   * Extract text from PDF files
   */
  private static async extractFromPDF(filePath: string): Promise<string> {
    try {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);

      if (!data.text || data.text.trim().length === 0) {
        throw new AppError('The PDF file contains no extractable text.', 400);
      }

      return data.text.trim();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Failed to extract text from PDF: ${(error as Error).message}`,
        400
      );
    }
  }

  /**
   * Extract text from DOCX files
   */
  private static async extractFromDOCX(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });

      if (!result.value || result.value.trim().length === 0) {
        throw new AppError('The DOCX file contains no extractable text.', 400);
      }

      if (result.messages.length > 0) {
        console.warn(
          '⚠️  DOCX extraction warnings:',
          result.messages.map((m) => m.message)
        );
      }

      return result.value.trim();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Failed to extract text from DOCX: ${(error as Error).message}`,
        400
      );
    }
  }

  /**
   * Extract text from plain text files
   */
  private static async extractFromTXT(filePath: string): Promise<string> {
    try {
      const text = fs.readFileSync(filePath, 'utf-8');

      if (!text || text.trim().length === 0) {
        throw new AppError('The TXT file is empty.', 400);
      }

      return text.trim();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Failed to read TXT file: ${(error as Error).message}`,
        400
      );
    }
  }

  /**
   * Calculate text metrics
   */
  static calculateMetrics(text: string) {
    const wordCount = text
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = text.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 WPM

    return {
      wordCount,
      characterCount,
      readingTime,
    };
  }

  /**
   * Get file type from MIME type
   */
  static getFileType(mimeType: string): 'pdf' | 'docx' | 'txt' {
    const mapping: Record<string, 'pdf' | 'docx' | 'txt'> = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'text/plain': 'txt',
    };

    const fileType = mapping[mimeType];
    if (!fileType) {
      throw new AppError(`Unsupported MIME type: ${mimeType}`, 400);
    }

    return fileType;
  }
}
