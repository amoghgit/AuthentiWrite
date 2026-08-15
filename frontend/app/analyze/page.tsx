"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, FileText, Eraser, Copy, Download, CheckCircle, ShieldAlert } from "lucide-react";
import { AnalysisData } from "@/data/mock-analysis";
import { analyzeText } from "@/lib/analyzer";
import { toast } from "sonner";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const { addAnalysis } = useAnalysisHistory();

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const readTime = Math.ceil(wordCount / 200);

  const handleAnalyze = () => {
    if (wordCount < 10) {
      toast.error("Please enter at least 10 words to analyze.");
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);

    // Dynamic analysis based on actual essay content
    setTimeout(() => {
      setIsAnalyzing(false);
      const computedResult = analyzeText(text);
      setResult(computedResult);
      addAnalysis(text, computedResult);
      toast.success("Analysis complete!");
    }, 1500); // reduced simulated delay slightly for better UX
  };

  const handleExport = () => {
    if (!result) return;

    const reportContent = `# AuthentiWrite Analysis Report
Date: ${new Date().toLocaleString()}

## Overall Assessment
**Score:** ${result.overallScore}/100
**Assessment:** ${result.overallAssessment}
**Confidence:** ${result.confidence}

## Detailed Metrics
- Readability: ${result.metrics.readability}% (${result.metricDescriptions?.readability || ""})
- Vocabulary Diversity: ${result.metrics.vocabulary}% (${result.metricDescriptions?.vocabulary || ""})
- Sentence Complexity: ${result.metrics.complexity}% (${result.metricDescriptions?.complexity || ""})
- Grammar Quality: ${result.metrics.grammar}% (${result.metricDescriptions?.grammar || ""})
- Originality Estimate: ${result.metrics.originality}% (${result.metricDescriptions?.originality || ""})

## Key Indicators
### Human Characteristics
${result.humanIndicators.length > 0 ? result.humanIndicators.map(i => `- ${i}`).join('\n') : "None detected"}

### AI Characteristics
${result.aiIndicators.length > 0 ? result.aiIndicators.map(i => `- ${i}`).join('\n') : "None detected"}

## Detailed Essay Breakdown
${result.essay.map(seg => `[${seg.classification}] ${seg.text}`).join('\n')}
`;

    const blob = new Blob([reportContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `authentiwrite-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully");
  };

  const handleReset = () => {
    setText("");
    setResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <Card className="glass-card border-border/50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="font-outfit text-2xl flex items-center">
                    <FileText className="mr-2 h-6 w-6 text-primary" />
                    New Analysis
                  </CardTitle>
                  <CardDescription>
                    Paste your college admission essay below or upload a document.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Textarea
                      placeholder="Start typing or paste your essay here..."
                      className="min-h-[400px] resize-none bg-background/50 border-border/50 text-base leading-relaxed p-6 rounded-xl focus-visible:ring-primary/50"
                      value={text}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                    />
                    
                    {/* Toolbar */}
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger 
                            onClick={handleCopy}
                            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary"
                          >
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent><p>Copy text</p></TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger 
                            onClick={handleReset}
                            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary"
                          >
                            <Eraser className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent><p>Clear text</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-md">
                        <span className="font-semibold text-foreground mr-1">{wordCount}</span> words
                      </div>
                      <div className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-md">
                        <span className="font-semibold text-foreground mr-1">{charCount}</span> characters
                      </div>
                      <div className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-md">
                        <span className="font-semibold text-foreground mr-1">~{readTime}</span> min read
                      </div>
                    </div>

                    <div className="flex space-x-3 w-full sm:w-auto">
                      <Button variant="outline" className="flex-1 sm:flex-none border-border">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </Button>
                      <Button onClick={handleAnalyze} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Essay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
              </div>
              <h2 className="text-2xl font-outfit font-bold mb-2">Analyzing your essay...</h2>
              <p className="text-muted-foreground max-w-md text-center">
                Our AI models are performing a deep sentence-level inspection for authenticity indicators.
              </p>
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <Dashboard result={result} onReset={() => setResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Inline Dashboard Component for simplicity in Phase 1
function Dashboard({ result, onReset }: { result: AnalysisData; onReset: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Analysis Report</h1>
          <p className="text-muted-foreground mt-1">Generated based on state-of-the-art NLP models</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onReset} className="border-border">
            <Eraser className="mr-2 h-4 w-4" /> Start New
          </Button>
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-white" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className="glass-card col-span-1 border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-secondary/50 stroke-[10] fill-none" />
                <motion.circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  className="stroke-primary stroke-[10] fill-none"
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * result.overallScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-bold font-outfit">{result.overallScore}</span>
                <span className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold">{result.overallAssessment}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center">
                Confidence: <span className="text-foreground font-medium ml-1 bg-secondary/50 px-2 py-0.5 rounded text-xs">{result.confidence}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Indicators */}
        <Card className="glass-card col-span-1 md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Key Indicators</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="flex items-center text-sm font-semibold text-accent mb-4">
                <CheckCircle className="mr-2 h-4 w-4" /> Human Characteristics
              </h4>
              <ul className="space-y-3">
                {result.humanIndicators.map((ind, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start text-sm text-foreground/80 bg-accent/5 p-3 rounded-lg border border-accent/10"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2.5 shrink-0" />
                    <span>{ind}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold text-danger mb-4">
                <ShieldAlert className="mr-2 h-4 w-4" /> AI Characteristics
              </h4>
              <ul className="space-y-3">
                {result.aiIndicators.map((ind, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start text-sm text-foreground/80 bg-danger/5 p-3 rounded-lg border border-danger/10"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-danger mt-1.5 mr-2.5 shrink-0" />
                    <span>{ind}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Highlighted Text */}
        <Card className="glass-card col-span-1 border-border/50">
          <CardHeader>
            <CardTitle>Sentence Analysis</CardTitle>
            <CardDescription>Hover over highlighted segments to see detailed classification reasoning.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-background/50 rounded-xl p-6 text-base leading-loose border border-border/50 font-inter">
              <TooltipProvider delay={200}>
                {result.essay.map((segment) => {
                  let bgClass = "bg-accent/20 hover:bg-accent/30 text-accent-foreground";
                  if (segment.classification === "Likely AI Assisted") bgClass = "bg-danger/20 hover:bg-danger/30 text-danger-foreground";
                  if (segment.classification === "Mixed") bgClass = "bg-warning/20 hover:bg-warning/30 text-warning-foreground";

                  return (
                    <Tooltip key={segment.id}>
                      <TooltipTrigger className="cursor-help">
                        <span className={`inline rounded-sm px-1 py-0.5 mx-0.5 cursor-help transition-colors ${bgClass}`}>
                          {segment.text}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-4 bg-popover/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-xl z-50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide
                              ${segment.classification === 'Likely Human' ? 'bg-accent/20 text-accent' : 
                                segment.classification === 'Likely AI Assisted' ? 'bg-danger/20 text-danger' : 
                                'bg-warning/20 text-warning'}`}>
                              {segment.classification}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Conf: <span className="text-foreground">{segment.confidence}</span>
                            </span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">{segment.explanation}</p>
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-1.5 uppercase font-semibold">Evidence</p>
                            <div className="flex flex-wrap gap-1.5">
                              {segment.evidence.map((ev, i) => (
                                <span key={i} className="text-[10px] bg-secondary/50 text-secondary-foreground px-1.5 py-0.5 rounded border border-border/50">
                                  {ev}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <Card className="glass-card col-span-1 border-border/50">
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MetricBar label="Readability" value={result.metrics.readability} description={result.metricDescriptions?.readability} />
            <MetricBar label="Vocabulary Diversity" value={result.metrics.vocabulary} description={result.metricDescriptions?.vocabulary} />
            <MetricBar label="Sentence Complexity" value={result.metrics.complexity} description={result.metricDescriptions?.complexity} />
            <MetricBar label="Grammar Quality" value={result.metrics.grammar} description={result.metricDescriptions?.grammar} />
            <MetricBar label="Originality Estimate" value={result.metrics.originality} description={result.metricDescriptions?.originality} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricBar({ label, value, description }: { label: string, value: number, description?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm items-center">
        <span className="font-medium text-foreground/90">{label}</span>
        <span className="text-muted-foreground font-semibold">{value}%</span>
      </div>
      <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground/80 mt-1">{description}</p>
      )}
    </div>
  );
}

// Ensure Sparkles component is available
function Sparkles(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
