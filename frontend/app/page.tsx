"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles, FileSearch, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-brand/30 selection:text-brand">
      {/* Premium subtle grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Animated glowing orbs in the background */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden z-0 opacity-40 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] w-[50%] h-[50%] rounded-full bg-brand/30 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-success/20 blur-[120px] mix-blend-screen" />
      </div>

      <div className="z-10 relative">
        <Navbar />
      </div>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center pt-20 pb-32">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center rounded-full border border-brand/20 bg-brand/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-brand mb-8 shadow-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Phase 1 MVP Now Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-outfit font-bold tracking-tighter max-w-5xl leading-[1.1] mb-8"
          >
            Transparent AI Analysis for <span className="text-gradient">College Admissions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-inter leading-relaxed"
          >
            Detect AI assistance, verify human authenticity, and get deep sentence-level insights into your application essays with our state-of-the-art analysis engine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link href="/analyze">
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-medium shadow-lg shadow-brand/25 bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95">
                Analyze an Essay <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-medium border-border/60 bg-background/50 backdrop-blur-md hover:bg-secondary transition-all">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 mt-32 w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<FileSearch className="h-6 w-6 text-brand" />}
              title="Sentence-Level Analysis"
              description="Get a color-coded breakdown of your essay, highlighting exactly which sentences appear AI-generated versus human-written."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldAlert className="h-6 w-6 text-success" />}
              title="Authenticity Scoring"
              description="Receive an overall confidence score and detailed metrics on vocabulary diversity, readability, and structural complexity."
              delay={0.2}
            />
            <FeatureCard 
              icon={<History className="h-6 w-6 text-warning" />}
              title="Version Tracking"
              description="Keep a complete history of all your essay drafts and their respective analysis reports to monitor improvements."
              delay={0.3}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-3xl p-8 hover:bg-card/40 transition-all duration-300 group hover:border-brand/30"
    >
      <div className="bg-background/80 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-outfit mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
