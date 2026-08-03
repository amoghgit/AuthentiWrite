"use client";

import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-outfit text-muted-foreground">Loading...</h2>
      </main>
    </div>
  );
}
