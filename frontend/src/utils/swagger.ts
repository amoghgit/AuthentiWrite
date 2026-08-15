import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuthentiWrite API',
      version: '1.0.0',
      description:
        'Transparent AI Writing Analysis for College Admission Essays - REST API Documentation',
      contact: {
        name: 'AuthentiWrite Team',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['student', 'counselor', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['student', 'counselor', 'admin'] },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        AnalyzeInput: {
          type: 'object',
          required: ['title', 'text'],
          properties: {
            title: { type: 'string', maxLength: 200 },
            text: { type: 'string', minLength: 50, maxLength: 50000 },
          },
        },
        AnalysisReport: {
          type: 'object',
          properties: {
            overallAssessment: { type: 'string' },
            confidence: { type: 'string' },
            overallScore: { type: 'number' },
            metrics: {
              type: 'object',
              properties: {
                readability: { type: 'number' },
                vocabulary: { type: 'number' },
                complexity: { type: 'number' },
                grammar: { type: 'number' },
                originality: { type: 'number' },
              },
            },
            essay: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  classification: { type: 'string' },
                  confidence: { type: 'string' },
                  reason: { type: 'string' },
                  evidence: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            statusCode: { type: 'number' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
            statusCode: { type: 'number' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
