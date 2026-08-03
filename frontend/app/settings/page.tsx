"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Type, Languages, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-outfit">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and application behavior.</p>
          </div>

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Monitor className="mr-2 h-5 w-5 text-primary" /> Appearance
              </CardTitle>
              <CardDescription>Customize how AuthentiWrite looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme Preference</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setTheme("light")}
                    className={theme === 'light' ? 'bg-primary text-white' : ''}
                  >
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setTheme("dark")}
                    className={theme === 'dark' ? 'bg-primary text-white' : ''}
                  >
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Zap className="mr-2 h-5 w-5 text-accent" /> Preferences
              </CardTitle>
              <CardDescription>Configure analysis defaults and interactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center"><Zap className="mr-2 h-4 w-4 text-muted-foreground" /> Interface Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions and hover effects.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center"><Type className="mr-2 h-4 w-4 text-muted-foreground" /> Large Text</Label>
                  <p className="text-sm text-muted-foreground">Increase font size in the analysis editor.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center"><Languages className="mr-2 h-4 w-4 text-muted-foreground" /> Default Language</Label>
                  <p className="text-sm text-muted-foreground">Select the primary language for analysis.</p>
                </div>
                <Button variant="outline" size="sm" className="w-[120px] justify-between">
                  English <span className="text-xs text-muted-foreground">US</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
