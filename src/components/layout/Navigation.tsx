import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import agentboxLogo from "@/assets/agentbox-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={agentboxLogo} 
              alt="AgentBox Logo" 
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold hero-gradient-text">
              AgentBox
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button className="bg-hero-gradient hover:shadow-glow-md transition-all duration-300">
              Start for Free
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Product
              </a>
              <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </a>
              <div className="pt-4 border-t border-border">
                <Button variant="ghost" className="w-full mb-2 text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
                <Button className="w-full bg-hero-gradient hover:shadow-glow-md transition-all duration-300">
                  Start for Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;