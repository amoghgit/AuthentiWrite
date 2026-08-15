import mongoose, { Schema } from 'mongoose';
import { IUploadedFile } from '../types';

const uploadedFileSchema = new Schema<IUploadedFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    essayId: {
      type: Schema.Types.ObjectId,
      ref: 'Essay',
      default: null,
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    storedName: {
      type: String,
      required: [true, 'Stored file name is required'],
      unique: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx', 'txt'],
      required: [true, 'File type is required'],
    },
    fileSizeBytes: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be at least 1 byte'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const UploadedFile = mongoose.model<IUploadedFile>(
  'UploadedFile',
  uploadedFileSchema
);
