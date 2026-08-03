import mongoose, { Schema } from 'mongoose';
import { IHistory } from '../types';

const historySchema = new Schema<IHistory>(
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
      required: [true, 'Essay ID is required'],
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'AnalysisReport',
      required: [true, 'Report ID is required'],
    },
    action: {
      type: String,
      enum: ['upload', 'analyze', 'view', 'delete'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user history queries
historySchema.index({ userId: 1, timestamp: -1 });

export const History = mongoose.model<IHistory>('History', historySchema);
