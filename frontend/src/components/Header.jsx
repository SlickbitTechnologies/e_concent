import { Shield, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MedConsent</h1>
              <p className="text-xs text-muted-foreground">Clinical Trial Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {/* <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">Security</a>
            <a href="#compliance" className="text-muted-foreground hover:text-foreground transition-colors">Compliance</a>
            <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">Support</a> */}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate('/auth')}>
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button variant="medical" size="sm" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors py-2">Features</a>
              <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors py-2">Security</a>
              <a href="#compliance" className="text-muted-foreground hover:text-foreground transition-colors py-2">Compliance</a>
              <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors py-2">Support</a>
              <div className="pt-2 flex flex-col space-y-2">
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/auth')}>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


