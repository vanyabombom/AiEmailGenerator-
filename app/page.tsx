import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Workflow } from "@/components/landing/workflow";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Workflow />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
