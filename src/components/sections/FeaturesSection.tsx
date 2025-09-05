import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Code, Globe, Lock, Workflow } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with isolated sandboxes for safe agent execution."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second agent initialization with optimized runtime performance."
    },
    {
      icon: Code,
      title: "Real-World Tools", 
      description: "Full access to development tools, APIs, and computing resources."
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Deploy agents worldwide with automatic scaling and load balancing."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data never leaves your environment. Complete control and compliance."
    },
    {
      icon: Workflow,
      title: "Easy Integration",
      description: "Simple APIs and SDKs for seamless integration with existing workflows."
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for <span className="hero-gradient-text">Enterprise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to deploy, manage, and scale AI agents in production environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-glow-md hover:border-primary/30 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-hero-gradient-subtle flex items-center justify-center mb-4 group-hover:shadow-glow-sm transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;