'use client'

import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut, Home } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import agentboxLogo from "@/assets/agentbox-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image 
              src={agentboxLogo} 
              alt="AgentBox Logo" 
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold hero-gradient-text">
              AgentBox
            </span>
          </Link>

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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{user?.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/home" className="flex items-center">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/home/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-hero-gradient hover:shadow-glow-md transition-all duration-300">
                  <Link href="/auth/register">Start for Free</Link>
                </Button>
              </>
            )}
            
            {/* Theme Toggle - Always visible */}
            <ThemeToggle />
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
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <Button variant="ghost" asChild className="w-full text-muted-foreground hover:text-foreground">
                      <Link href="/home">Home</Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full text-muted-foreground hover:text-foreground">
                      <Link href="/home/settings">Settings</Link>
                    </Button>
                    <Button onClick={logout} variant="ghost" className="w-full text-red-600 hover:text-red-700">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full mb-2 text-muted-foreground hover:text-foreground">
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-hero-gradient hover:shadow-glow-md transition-all duration-300">
                      <Link href="/auth/register">Start for Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;