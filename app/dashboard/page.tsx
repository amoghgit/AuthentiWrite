"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const radarData = [
  { subject: 'Readability', A: 82, fullMark: 100 },
  { subject: 'Vocabulary', A: 74, fullMark: 100 },
  { subject: 'Complexity', A: 70, fullMark: 100 },
  { subject: 'Grammar', A: 95, fullMark: 100 },
  { subject: 'Originality', A: 68, fullMark: 100 },
];

const pieData = [
  { name: 'Likely Human', value: 65, color: '#22C55E' },
  { name: 'Likely AI', value: 20, color: '#EF4444' },
  { name: 'Mixed', value: 15, color: '#F59E0B' },
];

const barData = [
  { name: 'Mon', essays: 4 },
  { name: 'Tue', essays: 7 },
  { name: 'Wed', essays: 5 },
  { name: 'Thu', essays: 12 },
  { name: 'Fri', essays: 9 },
  { name: 'Sat', essays: 3 },
  { name: 'Sun', essays: 2 },
];

export default function DashboardPage() {
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
                <div className="text-4xl font-bold text-primary font-outfit">84.2</div>
                <p className="text-sm text-accent mt-2">↑ 5.4% from last week</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Essays Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground font-outfit">42</div>
                <p className="text-sm text-muted-foreground mt-2">12 this week</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Primary Flag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning font-outfit">Formulaic Structure</div>
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
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
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
