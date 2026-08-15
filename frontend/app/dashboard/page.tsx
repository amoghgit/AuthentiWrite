"use client";

import { useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

export default function DashboardPage() {
  const { history } = useAnalysisHistory();

  const {
    averageScore,
    totalAnalyzed,
    primaryFlag,
    radarData,
    pieData,
    barData
  } = useMemo(() => {
    const total = history.length;
    if (total === 0) {
      return {
        averageScore: 0,
        totalAnalyzed: 0,
        primaryFlag: "No Data",
        radarData: [
          { subject: 'Readability', A: 0, fullMark: 100 },
          { subject: 'Vocabulary', A: 0, fullMark: 100 },
          { subject: 'Complexity', A: 0, fullMark: 100 },
          { subject: 'Grammar', A: 0, fullMark: 100 },
          { subject: 'Originality', A: 0, fullMark: 100 },
        ],
        pieData: [
          { name: 'Likely Human', value: 0, color: '#22C55E' },
          { name: 'Likely AI', value: 0, color: '#EF4444' },
          { name: 'Mixed', value: 0, color: '#F59E0B' },
        ],
        barData: [
          { name: 'Mon', essays: 0 },
          { name: 'Tue', essays: 0 },
          { name: 'Wed', essays: 0 },
          { name: 'Thu', essays: 0 },
          { name: 'Fri', essays: 0 },
          { name: 'Sat', essays: 0 },
          { name: 'Sun', essays: 0 },
        ]
      };
    }

    let sumScore = 0;
    let counts = { human: 0, ai: 0, mixed: 0 };
    let aiFlags: Record<string, number> = {};
    let sumMetrics = { readability: 0, vocabulary: 0, complexity: 0, grammar: 0, originality: 0 };

    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const barDataMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      barDataMap.set(d.toDateString(), { name: days[d.getDay()], essays: 0 });
    }

    history.forEach(entry => {
      sumScore += entry.result.overallScore;

      if (entry.result.overallScore > 80) counts.human++;
      else if (entry.result.overallScore < 50) counts.ai++;
      else counts.mixed++;

      entry.result.aiIndicators.forEach(flag => {
        if (flag !== "No strong AI indicators detected.") {
          aiFlags[flag] = (aiFlags[flag] || 0) + 1;
        }
      });

      sumMetrics.readability += entry.result.metrics.readability;
      sumMetrics.vocabulary += entry.result.metrics.vocabulary;
      sumMetrics.complexity += entry.result.metrics.complexity;
      sumMetrics.grammar += entry.result.metrics.grammar;
      sumMetrics.originality += entry.result.metrics.originality;

      const dateStr = new Date(entry.date).toDateString();
      if (barDataMap.has(dateStr)) {
        const item = barDataMap.get(dateStr);
        item.essays++;
      }
    });

    let topFlag = "None Detected";
    let maxFlagCount = 0;
    for (const [flag, count] of Object.entries(aiFlags)) {
      if (count > maxFlagCount) {
        topFlag = flag;
        maxFlagCount = count;
      }
    }

    return {
      averageScore: Math.round((sumScore / total) * 10) / 10,
      totalAnalyzed: total,
      primaryFlag: topFlag,
      radarData: [
        { subject: 'Readability', A: Math.round(sumMetrics.readability / total), fullMark: 100 },
        { subject: 'Vocabulary', A: Math.round(sumMetrics.vocabulary / total), fullMark: 100 },
        { subject: 'Complexity', A: Math.round(sumMetrics.complexity / total), fullMark: 100 },
        { subject: 'Grammar', A: Math.round(sumMetrics.grammar / total), fullMark: 100 },
        { subject: 'Originality', A: Math.round(sumMetrics.originality / total), fullMark: 100 },
      ],
      pieData: [
        { name: 'Likely Human', value: counts.human, color: '#22C55E' },
        { name: 'Likely AI', value: counts.ai, color: '#EF4444' },
        { name: 'Mixed', value: counts.mixed, color: '#F59E0B' },
      ],
      barData: Array.from(barDataMap.values())
    };
  }, [history]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-outfit">Aggregate Metrics</h1>
            <p className="text-muted-foreground mt-1">Overview of all your essay analyses over time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Average Authenticity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary font-outfit">{averageScore.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground mt-2">Based on {totalAnalyzed} analyses</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Essays Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground font-outfit">{totalAnalyzed}</div>
                <p className="text-sm text-muted-foreground mt-2">Total history</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Primary Flag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-warning font-outfit truncate" title={primaryFlag}>{primaryFlag}</div>
                <p className="text-sm text-muted-foreground mt-2">Most common AI indicator</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Average Text Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <Radar name="Metrics" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Content Composition</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {totalAnalyzed > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No analyses yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle>Analysis Activity (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: 'var(--secondary)' }}
                      contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                    />
                    <Bar dataKey="essays" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
