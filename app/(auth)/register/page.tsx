"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, ShieldAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, isMockMode, fillDemoCredentials } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleFillDemo = () => {
    const { email: demoEmail, pass: demoPass } = fillDemoCredentials();
    setName("Alex Rivera");
    setEmail(demoEmail);
    setPassword(demoPass);
    setNameError("");
    setEmailError("");
    setPasswordError("");
    toast.info("Demo credentials filled!");
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      if (isMockMode) {
        toast.success("Signed up with Google (Demo)! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign up with Google";
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!name.trim()) {
      setNameError("Please enter your full name.");
      hasError = true;
    } else {
      setNameError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const result = await signUp(email, password, name);
      if (result.requiresConfirmation) {
        toast.info("Account created! Please check your email to confirm your registration before signing in.", {
          duration: 8000,
        });
        router.push("/login");
      } else {
        toast.success("Account created successfully! Redirecting to dashboard...");
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register account";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden py-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/15 blur-[120px] rounded-full pointer-events-none" />

        <Card className="w-full max-w-md glass-panel relative z-10">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-2">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Your Account</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Start generating high-converting emails in seconds
            </CardDescription>

            {isMockMode && (
              <div className="pt-2">
                <Badge variant="outline" className="text-xs py-1 px-3 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1.5 mx-auto">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Running in Local Demo Mode
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Sign In Button */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              variant="outline"
              size="lg"
              className="w-full gap-3 font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-card px-3 text-xs text-slate-500 uppercase tracking-wider relative z-10 shrink-0">
                Or with email
              </span>
            </div>

            {isMockMode && (
              <Button
                type="button"
                onClick={handleFillDemo}
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs font-semibold border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
              >
                <Zap className="h-4 w-4" />
                Auto-Fill Demo Credentials
              </Button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    className={`pl-10 ${nameError ? "border-red-500 dark:border-red-500" : ""}`}
                    required
                  />
                </div>
                {nameError && (
                  <p className="text-[11px] text-red-500 font-medium">{nameError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`pl-10 ${emailError ? "border-red-500 dark:border-red-500" : ""}`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-red-500 font-medium">{emailError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    className={`pl-10 ${passwordError ? "border-red-500 dark:border-red-500" : ""}`}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-[11px] text-red-500 font-medium">{passwordError}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full gap-2 mt-2 shadow-indigo-500/25"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : (
                  <>
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col text-center border-t border-slate-200 dark:border-slate-800 pt-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Sign in
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
