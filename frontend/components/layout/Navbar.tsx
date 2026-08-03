"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, LayoutDashboard, History, Info, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Analyze", href: "/analyze", icon: FileText },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
  { name: "About", href: "/about", icon: Info },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-8 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight">AuthentiWrite</span>
        </Link>
        <div className="hidden md:flex items-center space-x-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative px-3 py-2">
                <span className={`relative z-10 text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-secondary rounded-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/analyze">
            <Button variant="default" className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-medium">
              Start Analysis
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
