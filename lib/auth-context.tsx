"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isMockMode: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string, name: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  incrementQuota: () => boolean;
  upgradePlan: (plan: 'pro' | 'enterprise') => void;
  fillDemoCredentials: () => { email: string; pass: string };
}

const defaultDemoUser: UserProfile = {
  id: "usr_demo_123",
  email: "alex.engineer@example.com",
  name: "Alex Rivera",
  plan: "free",
  emailsGenerated: 4,
  maxQuota: 10,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function checkIsMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !url ||
    url.includes("your-supabase-project") ||
    url.includes("placeholder") ||
    !key ||
    key.includes("your_supabase_anon_key") ||
    key.includes("placeholder")
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMockMode = checkIsMockMode();

  useEffect(() => {
    if (isMockMode) {
      const storedUser = localStorage.getItem("mailcraft_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(defaultDemoUser);
          localStorage.setItem("mailcraft_user", JSON.stringify(defaultDemoUser));
        }
      } else {
        setUser(defaultDemoUser);
        localStorage.setItem("mailcraft_user", JSON.stringify(defaultDemoUser));
      }
      setIsLoading(false);
    } else {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // Try to restore quota/plan from localStorage for this user
          const storedUserData = localStorage.getItem(`mailcraft_user_${session.user.id}`);
          let storedPlan: UserProfile["plan"] = "free";
          let storedGenerated = 0;
          let storedMaxQuota = 10;

          if (storedUserData) {
            try {
              const parsed = JSON.parse(storedUserData);
              storedPlan = parsed.plan || "free";
              storedGenerated = parsed.emailsGenerated ?? 0;
              storedMaxQuota = parsed.maxQuota ?? 10;
            } catch {
              // use defaults
            }
          }

          setUser({
            id: session.user.id,
            email: session.user.email || "user@example.com",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            plan: storedPlan,
            emailsGenerated: storedGenerated,
            maxQuota: storedMaxQuota,
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const storedUserData = localStorage.getItem(`mailcraft_user_${session.user.id}`);
          let storedPlan: UserProfile["plan"] = "free";
          let storedGenerated = 0;
          let storedMaxQuota = 10;

          if (storedUserData) {
            try {
              const parsed = JSON.parse(storedUserData);
              storedPlan = parsed.plan || "free";
              storedGenerated = parsed.emailsGenerated ?? 0;
              storedMaxQuota = parsed.maxQuota ?? 10;
            } catch {
              // use defaults
            }
          }

          setUser({
            id: session.user.id,
            email: session.user.email || "user@example.com",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            plan: storedPlan,
            emailsGenerated: storedGenerated,
            maxQuota: storedMaxQuota,
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isMockMode]);

  const saveUser = useCallback((newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      // For mock mode, use generic key. For real mode, use user-specific key
      localStorage.setItem("mailcraft_user", JSON.stringify(newUser));
      if (!isMockMode && newUser.id) {
        localStorage.setItem(`mailcraft_user_${newUser.id}`, JSON.stringify({
          plan: newUser.plan,
          emailsGenerated: newUser.emailsGenerated,
          maxQuota: newUser.maxQuota,
        }));
      }
    } else {
      localStorage.removeItem("mailcraft_user");
    }
  }, [isMockMode]);

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 400));
      const storedUser = localStorage.getItem("mailcraft_user");
      let loggedUser: UserProfile;
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          loggedUser = {
            ...parsed,
            email: email || "alex.engineer@example.com",
            name: email ? email.split("@")[0] : "Demo User",
          };
        } catch {
          loggedUser = {
            ...defaultDemoUser,
            email: email || "alex.engineer@example.com",
            name: email ? email.split("@")[0] : "Demo User",
          };
        }
      } else {
        loggedUser = {
          ...defaultDemoUser,
          email: email || "alex.engineer@example.com",
          name: email ? email.split("@")[0] : "Demo User",
        };
      }
      saveUser(loggedUser);
      setIsLoading(false);
      return true;
    } else {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      setIsLoading(false);
      if (error) throw error;
      return !!data.user;
    }
  };

  const signUp = async (email: string, pass: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 400));
      const newUser: UserProfile = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        name: name || "New Member",
        plan: "free",
        emailsGenerated: 0,
        maxQuota: 10,
      };
      saveUser(newUser);
      setIsLoading(false);
      return true;
    } else {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      setIsLoading(false);
      if (error) throw error;
      return !!data.user;
    }
  };

  const signInWithGoogle = async () => {
    if (isMockMode) {
      const demoGoogleUser: UserProfile = {
        id: "usr_google_123",
        email: "google.user@gmail.com",
        name: "Google Member",
        plan: "free",
        emailsGenerated: 1,
        maxQuota: 10,
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      };
      saveUser(demoGoogleUser);
      return;
    }

    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!isMockMode) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Gracefully handle sign-out errors
      }
    }
    saveUser(null);
  };

  const incrementQuota = (): boolean => {
    if (!user) return false;
    if (user.emailsGenerated >= user.maxQuota) {
      return false;
    }
    const updated = {
      ...user,
      emailsGenerated: user.emailsGenerated + 1,
    };
    saveUser(updated);
    return true;
  };

  const upgradePlan = (plan: 'pro' | 'enterprise') => {
    if (!user) return;
    const maxQuota = plan === 'pro' ? 250 : 99999;
    const updated: UserProfile = {
      ...user,
      plan,
      maxQuota,
    };
    saveUser(updated);
  };

  const fillDemoCredentials = () => {
    return {
      email: "alex.engineer@example.com",
      pass: "demo123456",
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isMockMode,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        incrementQuota,
        upgradePlan,
        fillDemoCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
