"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Lightbulb, Code2, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4">About AuthentiWrite</h1>
            <p className="text-xl text-muted-foreground">Restoring trust in the college admissions process through transparent AI analysis.</p>
          </motion.div>

          <div className="space-y-12">
            {/* Mission Section */}
            <section>
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-3xl font-bold font-outfit">Our Mission</h2>
              </div>
              <Card className="glass-card border-border/50">
                <CardContent className="p-8">
                  <p className="text-lg leading-relaxed text-foreground/90">
                    With the rapid advancement of generative AI, the college admission essay—traditionally a window into a student's soul—is under threat of becoming a battleground of synthetic text. Our mission is to provide admissions officers and students with a transparent, highly accurate tool to differentiate human nuance from AI generation.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Problem & Solution Grid */}
            <section className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-border/50 bg-danger/5">
                <CardContent className="p-8">
                  <Lightbulb className="h-8 w-8 text-danger mb-4" />
                  <h3 className="text-2xl font-bold font-outfit mb-3">The Problem</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Current AI detectors often return binary "Human or AI" scores that lack explanation, leading to false positives and eroded trust. They fail to highlight exactly which parts of an essay are suspicious and why.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50 bg-accent/5">
                <CardContent className="p-8">
                  <Code2 className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-2xl font-bold font-outfit mb-3">The Solution</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    AuthentiWrite performs sentence-level analysis, highlighting text and providing specific evidence (like burstiness, perplexity, and vocabulary diversity) so users understand exactly how a conclusion was reached.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Roadmap Section */}
            <section>
              <div className="flex items-center mb-6">
                <Rocket className="h-8 w-8 text-warning mr-4" />
                <h2 className="text-3xl font-bold font-outfit">Phase 1 Roadmap</h2>
              </div>
              <Card className="glass-card border-border/50">
                <CardContent className="p-8">
                  <ul className="space-y-4">
                    <li className="flex items-center text-lg">
                      <span className="h-2 w-2 bg-accent rounded-full mr-4" />
                      <span className="font-semibold mr-2">Q3 2024:</span> MVP Launch with Mock Data Analysis
                    </li>
                    <li className="flex items-center text-lg text-muted-foreground">
                      <span className="h-2 w-2 bg-border rounded-full mr-4" />
                      <span className="font-semibold mr-2">Q4 2024:</span> Backend API Integration & Real AI Models
                    </li>
                    <li className="flex items-center text-lg text-muted-foreground">
                      <span className="h-2 w-2 bg-border rounded-full mr-4" />
                      <span className="font-semibold mr-2">Q1 2025:</span> User Authentication & Cloud History
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
