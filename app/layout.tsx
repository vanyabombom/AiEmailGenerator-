import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { LenisProvider } from "@/components/lenis-provider";
import { ThemedToaster } from "@/components/themed-toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MailCraft AI | Intelligent AI Email Generator",
  description: "Craft high-converting, professional emails in seconds using Google Gemini AI and real-time streaming technology.",
  keywords: ["AI Email Generator", "Email Assistant", "Gemini AI", "Copywriting", "Sales Email"],
  authors: [{ name: "MailCraft AI Team" }],
  openGraph: {
    title: "MailCraft AI | Intelligent AI Email Generator",
    description: "Craft high-converting, professional emails in seconds using real-time streaming AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Inline script to apply saved theme immediately and prevent flash */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ai-email-gen-theme")||"dark";if(t==="system"){t=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}document.documentElement.classList.add(t)}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground flex flex-col antialiased transition-colors duration-200`}>
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>
            <LenisProvider>
              {children}
              <ThemedToaster />
            </LenisProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
