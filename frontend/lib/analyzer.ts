import { AnalysisData, HighlightSegment, HighlightClass } from '../data/mock-analysis';

// Helper to count syllables in a word (approximation)
function countSyllables(word: string): number {
  let w = word.toLowerCase();
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  w = w.replace(/^y/, '');
  const syllables = w.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

// Calculate standard deviation
function calculateStdDev(arr: number[]): number {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

const TRANSITION_WORDS = [
  'however', 'therefore', 'moreover', 'furthermore', 'thus', 'consequently',
  'additionally', 'nevertheless', 'similarly', 'meanwhile', 'subsequently',
  'in addition', 'on the other hand', 'for example', 'for instance', 'in conclusion'
];

const FIRST_PERSON_WORDS = ['i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours'];

export function analyzeText(text: string): AnalysisData {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return generateEmptyAnalysis();
  }

  // 1. Word count & 2. Character count
  const words = trimmedText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const charCount = trimmedText.length;

  // Split into sentences and paragraphs
  const sentences = trimmedText.match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(s => s.length > 0) || [trimmedText];
  const paragraphs = trimmedText.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);

  // 3. Sentence count & 4. Paragraph count
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;

  // 5. Average sentence length
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  // 6. Vocabulary diversity
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
  const vocabularyDiversity = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  // 7. Repeated-word frequency
  const wordFrequencies: Record<string, number> = {};
  words.forEach(w => {
    const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord) {
      wordFrequencies[cleanWord] = (wordFrequencies[cleanWord] || 0) + 1;
    }
  });
  const highlyRepeatedWords = Object.values(wordFrequencies).filter(count => count > 3).length;

  // 8. Readability (Flesch Reading Ease approximation)
  let totalSyllables = 0;
  words.forEach(w => totalSyllables += countSyllables(w.replace(/[^a-zA-Z]/g, '')));
  const fleschScore = 206.835 - 1.015 * (wordCount / (sentenceCount || 1)) - 84.6 * (totalSyllables / (wordCount || 1));
  const normalizedReadability = Math.max(0, Math.min(100, fleschScore));

  // 9. Sentence-length variation
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const sentenceLengthStdDev = calculateStdDev(sentenceLengths);

  // 10. Paragraph-length variation
  const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length);
  const paragraphLengthStdDev = calculateStdDev(paragraphLengths);

  // 11. Transition-word usage
  const lowerText = trimmedText.toLowerCase();
  const transitionWordCount = TRANSITION_WORDS.filter(tw => lowerText.includes(tw)).length;

  // 12. First-person usage
  let firstPersonCount = 0;
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (FIRST_PERSON_WORDS.includes(clean)) firstPersonCount++;
  });

  // Calculate high-level metrics for dashboard (0-100 scale)
  const vocabScore = Math.max(0, Math.min(100, Math.round(vocabularyDiversity * 100 * 1.5)));
  const complexityScore = Math.max(0, Math.min(100, Math.round((avgSentenceLength / 20) * 50 + (sentenceLengthStdDev / 5) * 50)));
  const originalityScore = Math.max(0, Math.min(100, Math.round(50 + (firstPersonCount / (wordCount || 1)) * 500)));
  const grammarScore = Math.max(0, Math.min(100, Math.round(100 - (highlyRepeatedWords * 2))));
  
  // Aggregate Score
  const overallScore = Math.round((normalizedReadability + vocabScore + complexityScore + grammarScore + originalityScore) / 5);

  let overallAssessment = "Balanced writing style";
  if (overallScore > 80) overallAssessment = "Highly distinctive and well-structured";
  if (overallScore < 50) overallAssessment = "Needs structural and vocabulary improvements";
  if (firstPersonCount === 0 && wordCount > 50) overallAssessment = "Lacks personal voice (highly objective)";

  const humanIndicators: string[] = [];
  const aiIndicators: string[] = [];

  if (firstPersonCount > 2) humanIndicators.push(`Strong personal voice with ${firstPersonCount} first-person pronouns used`);
  if (sentenceLengthStdDev > 5) humanIndicators.push(`Natural sentence length variation (std dev of ${sentenceLengthStdDev.toFixed(1)} words)`);
  if (vocabScore > 75) humanIndicators.push(`High lexical diversity (${uniqueWords.size} unique words out of ${wordCount})`);

  if (transitionWordCount > (wordCount / 50)) aiIndicators.push(`Heavy reliance on formulaic transition words (${transitionWordCount} detected)`);
  if (sentenceLengthStdDev < 2 && sentenceCount > 3) aiIndicators.push(`Extremely uniform sentence lengths (averaging ${Math.round(avgSentenceLength)} words)`);
  if (firstPersonCount === 0 && wordCount > 50) aiIndicators.push(`Lack of personal pronouns (0 detected in ${wordCount} words)`);

  if (humanIndicators.length === 0) humanIndicators.push("No strong human indicators detected.");
  if (aiIndicators.length === 0) aiIndicators.push("No strong AI indicators detected.");

  // Sentence level analysis
  const essaySegments: HighlightSegment[] = sentences.map((sentence, index) => {
    // preserve trailing whitespace if any (we used match to split)
    const sWords = sentence.split(/\s+/).filter(w => w.length > 0).length;
    const sFirstPerson = FIRST_PERSON_WORDS.some(fp => sentence.toLowerCase().match(new RegExp(`\\b${fp}\\b`)));
    const sTransition = TRANSITION_WORDS.some(tw => sentence.toLowerCase().includes(tw));

    let classification: HighlightClass = "Mixed";
    let confidence: "Low" | "Moderate" | "High" = "Moderate";
    const evidence: string[] = [];
    let explanation = "Sentence shows a mix of patterns.";

    if (sFirstPerson && sWords > 5) {
      classification = "Likely Human";
      confidence = "High";
      evidence.push("Personal perspective");
      explanation = "Use of first-person pronouns indicates personal narrative.";
    } else if (sTransition && sWords > 15) {
      classification = "Likely AI Assisted";
      confidence = "Moderate";
      evidence.push("Complex transition", "High length");
      explanation = "Combines formulaic transitions with extended length, common in AI writing.";
    } else if (sWords < 5) {
      classification = "Likely Human";
      evidence.push("Short burst");
      explanation = "Very short, punchy sentences are less common in standard AI generation.";
    } else if (sWords > 25) {
      classification = "Likely AI Assisted";
      evidence.push("High complexity");
      explanation = "Unusually long and complex sentences often appear in AI-generated text.";
    }

    if (evidence.length === 0) evidence.push("Standard syntax");

    return {
      id: `seg-${index}`,
      text: sentence + (index < sentences.length - 1 ? ' ' : ''), // Add space for formatting
      classification,
      confidence,
      evidence,
      explanation
    };
  });

  return {
    overallAssessment,
    confidence: "High",
    overallScore,
    metrics: {
      readability: Math.round(normalizedReadability),
      vocabulary: vocabScore,
      complexity: complexityScore,
      grammar: grammarScore,
      originality: originalityScore
    },
    humanIndicators,
    aiIndicators,
    essay: essaySegments
  };
}

function generateEmptyAnalysis(): AnalysisData {
  return {
    overallAssessment: "Insufficient text",
    confidence: "Low",
    overallScore: 0,
    metrics: { readability: 0, vocabulary: 0, complexity: 0, grammar: 0, originality: 0 },
    humanIndicators: [],
    aiIndicators: [],
    essay: []
  };
}
