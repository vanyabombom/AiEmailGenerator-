"use client";

import React, { useEffect, useRef, createContext, useContext, useCallback } from "react";
import Lenis from "lenis";

interface LenisContextType {
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextType>({
  stop: () => {},
  start: () => {},
});

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    lenisRef.current = lenisInstance;

    return () => {
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return (
    <LenisContext.Provider value={{ stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
