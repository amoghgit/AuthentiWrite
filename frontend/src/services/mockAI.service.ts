import { IEssaySegment, IMetrics } from '../types';

/**
 * Mock AI Service
 *
 * Generates realistic mock analysis responses following the integration contract.
 * This will be replaced by the actual AI service in Phase 3.
 */
export class MockAIService {
  /**
   * Generate a mock analysis report for an essay
   */
  static generateMockAnalysis(essayText: string) {
    const sentences = this.splitIntoSentences(essayText);
    const metrics = this.generateMockMetrics();
    const overallScore = this.calculateOverallScore(metrics);
    const essaySegments = this.classifySentences(sentences);
    const overallAssessment = this.generateAssessment(overallScore);
    const confidence = this.determineConfidence(overallScore);

    return {
      overallAssessment,
      confidence,
      overallScore,
      metrics,
      essay: essaySegments,
    };
  }

  /**
   * Split text into sentences
   */
  private static splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0)
      .slice(0, 20); // Limit to 20 segments for mock
  }

  /**
   * Generate mock metrics with realistic variation
   */
  private static generateMockMetrics(): IMetrics {
    return {
      readability: this.randomInRange(65, 95),
      vocabulary: this.randomInRange(60, 90),
      complexity: this.randomInRange(55, 85),
      grammar: this.randomInRange(80, 98),
      originality: this.randomInRange(50, 90),
    };
  }

  /**
   * Calculate overall score from metrics
   */
  private static calculateOverallScore(metrics: IMetrics): number {
    const weights = {
      readability: 0.2,
      vocabulary: 0.15,
      complexity: 0.15,
      grammar: 0.2,
      originality: 0.3,
    };

    const score = Math.round(
      metrics.readability * weights.readability +
        metrics.vocabulary * weights.vocabulary +
        metrics.complexity * weights.complexity +
        metrics.grammar * weights.grammar +
        metrics.originality * weights.originality
    );

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Classify individual sentences
   */
  private static classifySentences(sentences: string[]): IEssaySegment[] {
    const classifications = [
      {
        classification: 'Likely Human',
        confidence: 'High',
        reasons: [
          'High lexical diversity and varied sentence structure',
          'Contains specific personal details and experiences',
          'Natural emotional expression and authentic voice',
          'Varied sentence length and complexity',
          'Contains colloquial expressions typical of student writing',
        ],
        evidenceOptions: [
          ['High burstiness', 'Specific personal details', 'Natural transitions'],
          ['Varied vocabulary', 'Authentic voice', 'Emotional depth'],
          ['Unique phrasing', 'Personal anecdotes', 'Informal tone'],
        ],
      },
      {
        classification: 'Possibly AI-Assisted',
        confidence: 'Moderate',
        reasons: [
          'Unusually consistent sentence structure',
          'Moderate perplexity with uniform distribution',
          'Vocabulary slightly above expected level',
          'Transitional phrases commonly found in AI output',
        ],
        evidenceOptions: [
          ['Low burstiness', 'Uniform sentence length', 'Generic transitions'],
          ['Moderate perplexity', 'Consistent complexity', 'Common phrasing'],
        ],
      },
      {
        classification: 'Likely AI-Generated',
        confidence: 'High',
        reasons: [
          'Low perplexity and burstiness scores',
          'Highly formulaic sentence structure',
          'Vocabulary and phrasing patterns typical of LLMs',
        ],
        evidenceOptions: [
          ['Very low burstiness', 'Formulaic structure', 'LLM phrasing patterns'],
          ['Low perplexity', 'Uniform complexity', 'Generic vocabulary'],
        ],
      },
    ];

    return sentences.map((text) => {
      // Weight toward "Likely Human" for realistic mock data
      const rand = Math.random();
      let classIndex: number;
      if (rand < 0.6) classIndex = 0;
      else if (rand < 0.85) classIndex = 1;
      else classIndex = 2;

      const cls = classifications[classIndex];
      const reason = cls.reasons[Math.floor(Math.random() * cls.reasons.length)];
      const evidence =
        cls.evidenceOptions[
          Math.floor(Math.random() * cls.evidenceOptions.length)
        ];

      return {
        text,
        classification: cls.classification,
        confidence: cls.confidence,
        reason,
        evidence,
      };
    });
  }

  /**
   * Generate an overall assessment string
   */
  private static generateAssessment(score: number): string {
    if (score >= 85) {
      return 'The essay appears to be predominantly human-written with high originality and authentic voice.';
    } else if (score >= 70) {
      return 'Mixed indicators of AI assistance. Some sections show authentic writing patterns while others suggest possible AI involvement.';
    } else if (score >= 50) {
      return 'Moderate indicators of AI assistance detected. Several passages exhibit patterns consistent with AI-generated text.';
    } else {
      return 'Strong indicators of AI-generated content. The essay exhibits multiple patterns commonly associated with AI language models.';
    }
  }

  /**
   * Determine confidence level from score
   */
  private static determineConfidence(score: number): string {
    if (score >= 85 || score <= 30) return 'High';
    if (score >= 70 || score <= 45) return 'Moderate';
    return 'Low';
  }

  /**
   * Generate a random integer in range [min, max]
   */
  private static randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
