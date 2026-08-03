import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ============================================
// User Types
// ============================================
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'counselor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ============================================
// Essay Types
// ============================================
export type EssayStatus = 'uploaded' | 'analyzing' | 'completed' | 'failed';

export interface IEssay extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  originalText: string;
  wordCount: number;
  characterCount: number;
  readingTime: number;
  uploadDate: Date;
  status: EssayStatus;
  reportId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Analysis Report Types
// ============================================
export interface IMetrics {
  readability: number;
  vocabulary: number;
  complexity: number;
  grammar: number;
  originality: number;
}

export interface IEssaySegment {
  text: string;
  classification: string;
  confidence: string;
  reason: string;
  evidence?: string[];
}

export interface IAnalysisReport extends Document {
  _id: Types.ObjectId;
  essayId: Types.ObjectId;
  userId: Types.ObjectId;
  overallAssessment: string;
  confidence: string;
  overallScore: number;
  metrics: IMetrics;
  essay: IEssaySegment[];
  analyzedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// History Types
// ============================================
export interface IHistory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  essayId: Types.ObjectId;
  reportId: Types.ObjectId;
  action: 'upload' | 'analyze' | 'view' | 'delete';
  timestamp: Date;
}

// ============================================
// Uploaded File Types
// ============================================
export type FileType = 'pdf' | 'docx' | 'txt';

export interface IUploadedFile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  essayId?: Types.ObjectId;
  originalName: string;
  storedName: string;
  mimeType: string;
  fileType: FileType;
  fileSizeBytes: number;
  filePath: string;
  uploadedAt: Date;
}

// ============================================
// Request Types
// ============================================
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}
