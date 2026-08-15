"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';

interface PreferencesContextType {
  animations: boolean;
  setAnimations: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [animations, setAnimationsState] = useState(true);
  const [largeText, setLargeTextState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAnimations = localStorage.getItem("authentiwrite_animations");
      if (storedAnimations !== null) setAnimationsState(storedAnimations === "true");
      
      const storedLargeText = localStorage.getItem("authentiwrite_largeText");
      if (storedLargeText !== null) setLargeTextState(storedLargeText === "true");
      
      setIsLoaded(true);
    }
  }, []);

  const setAnimations = (val: boolean) => {
    setAnimationsState(val);
    localStorage.setItem("authentiwrite_animations", val.toString());
  };

  const setLargeText = (val: boolean) => {
    setLargeTextState(val);
    localStorage.setItem("authentiwrite_largeText", val.toString());
  };

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <PreferencesContext.Provider value={{ animations, setAnimations, largeText, setLargeText }}>
      <MotionConfig reducedMotion={animations ? "never" : "always"}>
        {children}
      </MotionConfig>
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    // Return defaults during SSR or before hydration
    return { animations: true, setAnimations: () => {}, largeText: false, setLargeText: () => {} };
  }
  return context;
}
