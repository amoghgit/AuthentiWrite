import mongoose, { Schema } from 'mongoose';
import { IAnalysisReport } from '../types';

const metricsSchema = new Schema(
  {
    readability: { type: Number, required: true, min: 0, max: 100 },
    vocabulary: { type: Number, required: true, min: 0, max: 100 },
    complexity: { type: Number, required: true, min: 0, max: 100 },
    grammar: { type: Number, required: true, min: 0, max: 100 },
    originality: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const essaySegmentSchema = new Schema(
  {
    text: { type: String, required: true },
    classification: { type: String, required: true },
    confidence: { type: String, required: true },
    reason: { type: String, required: true },
    evidence: { type: [String], default: [] },
  },
  { _id: false }
);

const analysisReportSchema = new Schema<IAnalysisReport>(
  {
    essayId: {
      type: Schema.Types.ObjectId,
      ref: 'Essay',
      required: [true, 'Essay ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    overallAssessment: {
      type: String,
      required: true,
    },
    confidence: {
      type: String,
      required: true,
      enum: ['Low', 'Moderate', 'High', 'Very High'],
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    metrics: {
      type: metricsSchema,
      required: true,
    },
    essay: {
      type: [essaySegmentSchema],
      required: true,
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const AnalysisReport = mongoose.model<IAnalysisReport>(
  'AnalysisReport',
  analysisReportSchema
);
