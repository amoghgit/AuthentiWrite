import mongoose, { Schema } from 'mongoose';
import { IEssay } from '../types';

const essaySchema = new Schema<IEssay>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    originalText: {
      type: String,
      required: [true, 'Essay text is required'],
      minlength: [50, 'Essay must be at least 50 characters'],
    },
    wordCount: {
      type: Number,
      required: true,
      min: [1, 'Word count must be at least 1'],
    },
    characterCount: {
      type: Number,
      required: true,
      min: [1, 'Character count must be at least 1'],
    },
    readingTime: {
      type: Number,
      required: true,
      min: [0, 'Reading time cannot be negative'],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['uploaded', 'analyzing', 'completed', 'failed'],
      default: 'uploaded',
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'AnalysisReport',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Essay = mongoose.model<IEssay>('Essay', essaySchema);
