'use client'

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { CompanyLogos } from "@/components/ui/company-logos";

const HeroSection = () => {
  const agentTypes = [
    "AUTOMATION AGENTS",
    "RESEARCH AGENTS", 
    "CODE AGENTS",
    "DATA AGENTS",
    "WORKFLOW AGENTS"
  ];
  
  const [currentAgentType, setCurrentAgentType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAgentType((prev) => (prev + 1) % agentTypes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-gradient-subtle"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center">
          {/* Announcement Banner */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="text-sm font-medium bg-hero-gradient px-2 py-1 rounded text-primary-foreground mr-3">
              NEW
            </span>
            <span className="text-sm text-muted-foreground">
              AgentBox raised $21M Series A led by Insight Ventures
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block">AI SANDBOXES FOR</span>
            <span className="block hero-gradient-text animate-fade-in" key={currentAgentType}>
              {agentTypes[currentAgentType]}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Open-source, secure environment with real-world tools for enterprise-grade agents.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-hero-gradient hover:shadow-glow-lg text-lg px-8 py-4 h-auto font-semibold transition-all duration-300"
            >
              START FOR FREE
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 h-auto border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              VIEW DOCS
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider">
              TRUSTED BY
            </p>
            <CompanyLogos />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;