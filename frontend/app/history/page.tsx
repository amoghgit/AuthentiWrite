"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, MoreHorizontal, Trash2, ExternalLink } from "lucide-react";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { history, deleteAnalysis } = useAnalysisHistory();

  const filteredHistory = history.filter((entry) => 
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-outfit">Analysis History</h1>
              <p className="text-muted-foreground mt-1">View and manage your previous essay analyses.</p>
            </div>
          </div>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <CardTitle className="text-xl">Recent Documents</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search essays..."
                    className="pl-9 bg-background/50 border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
                    <tr>
                      <th className="px-6 py-4 font-medium flex items-center cursor-pointer hover:text-foreground transition-colors">
                        Document Title <ArrowUpDown className="ml-1 h-3 w-3" />
                      </th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Result</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((entry, idx) => (
                      <motion.tr 
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/10 transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">
                          <Link href={`/analyze?id=${entry.id}`} className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                            {entry.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                            ${entry.result.overallScore > 80 ? 'bg-accent/10 text-accent' : 
                              entry.result.overallScore < 50 ? 'bg-danger/10 text-danger' : 
                              'bg-warning/10 text-warning'}`}>
                            {entry.result.overallScore > 80 ? 'Likely Human' : entry.result.overallScore < 50 ? 'Likely AI Assisted' : 'Mixed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-danger" onClick={() => deleteAnalysis(entry.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No essays found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
