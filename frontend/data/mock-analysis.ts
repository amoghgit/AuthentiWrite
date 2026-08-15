export type HighlightClass = "Likely Human" | "Mixed" | "Likely AI Assisted";

export interface HighlightSegment {
  id: string;
  text: string;
  classification: HighlightClass;
  confidence: "Low" | "Moderate" | "High";
  evidence: string[];
  explanation: string;
}

export interface Metrics {
  readability: number;
  vocabulary: number;
  complexity: number;
  grammar: number;
  originality: number;
}

export interface AnalysisData {
  overallAssessment: string;
  confidence: string;
  overallScore: number;
  metrics: Metrics;
  humanIndicators: string[];
  aiIndicators: string[];
  essay: HighlightSegment[];
  metricDescriptions?: {
    readability: string;
    vocabulary: string;
    complexity: string;
    grammar: string;
    originality: string;
  };
}

export const mockAnalysisData: AnalysisData = {
  overallAssessment: "Mixed indicators of AI assistance",
  confidence: "Moderate",
  overallScore: 79,
  metrics: {
    readability: 82,
    vocabulary: 74,
    complexity: 70,
    grammar: 95,
    originality: 68
  },
  metricDescriptions: {
    readability: "Flesch reading ease score of 82",
    vocabulary: "74% unique words",
    complexity: "Average sentence length of 15 words",
    grammar: "Few repeated words",
    originality: "Strong personal pronouns used"
  },
  humanIndicators: [
    "High lexical diversity in personal anecdotes",
    "Varied sentence structure suggesting natural drafting",
    "Nuanced emotional reflection"
  ],
  aiIndicators: [
    "Predictable transition phrases",
    "Extremely uniform paragraph lengths",
    "Absence of common typographical errors"
  ],
  essay: [
    {
      id: "1",
      text: "Leadership has always been important to me. From a young age, I found myself naturally stepping into roles where guidance and organization were needed.",
      classification: "Likely Human",
      confidence: "High",
      evidence: ["High burstiness", "Specific personal details", "Natural transitions"],
      explanation: "This section shows natural variation in sentence length and uses personal pronouns in a context-appropriate, grounded manner."
    },
    {
      id: "2",
      text: " However, the quintessential aspect of a transformative journey is often punctuated by unforeseen challenges that serve as catalysts for profound personal growth. In navigating the multifaceted complexities of modern society, one must invariably leverage their intrinsic resilience.",
      classification: "Likely AI Assisted",
      confidence: "High",
      evidence: ["Low perplexity", "Overused AI transition phrasing", "Unnaturally high vocabulary density"],
      explanation: "The phrasing here is extremely common in AI-generated text, using 'quintessential', 'catalysts for profound personal growth', and 'multifaceted complexities' in rapid succession."
    },
    {
      id: "3",
      text: " When my team lost the regional robotics competition, it wasn't just a failure—it was a necessary pivot. We spent the next three weeks redesigning the drivetrain.",
      classification: "Likely Human",
      confidence: "High",
      evidence: ["High perplexity", "Domain-specific tangible details", "Narrative specificity"],
      explanation: "The mention of 'drivetrain' and the specific timeframe ('three weeks') strongly indicate a human author recalling a genuine memory."
    },
    {
      id: "4",
      text: " Ultimately, these experiences have shaped me into a well-rounded individual, ready to contribute meaningfully to the academic community and embrace the boundless opportunities that lie ahead.",
      classification: "Mixed",
      confidence: "Moderate",
      evidence: ["Formulaic conclusion", "Generic academic phrasing", "Lack of specific reference to earlier text"],
      explanation: "While structurally sound, this conclusion relies heavily on cliches ('well-rounded individual', 'boundless opportunities') that are frequently utilized by both AI and students following rigid templates."
    }
  ]
};
