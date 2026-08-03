"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
        <div className="bg-danger/10 p-6 rounded-full mb-6">
          <AlertCircle className="h-16 w-16 text-danger" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-4 text-foreground">404 - Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="px-8 rounded-full">
            Return Home
          </Button>
        </Link>
      </main>
    </div>
  );
}
