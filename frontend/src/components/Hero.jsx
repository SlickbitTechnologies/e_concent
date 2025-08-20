import { Shield, CheckCircle, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-light via-background to-accent-light py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary-light border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <Shield className="w-4 h-4 mr-2" />
              HIPAA & 21 CFR Part 11 Compliant
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Smart e-Consent for
              <span className="block text-primary">Clinical Trials</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline patient consent with AI-powered summaries, multilingual support, 
              and comprehensive audit trails. Built for healthcare professionals and patients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="medical" size="xl" onClick={() => (window.location.href = '/auth')}>
                <Users className="w-5 h-5 mr-2" />
                Get Started
               </Button>
              {/*<Button variant="medical-outline" size="xl" onClick={() => (window.location.href = '/patient-dashboard')}>
                <FileText className="w-5 h-5 mr-2" />
                View Demo
              </Button> */}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure & Compliant</h3>
                <p className="text-sm text-muted-foreground">WCAG 2.1, HIPAA, and 21 CFR Part 11 compliant with end-to-end encryption</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">Intelligent consent summaries with audio support and comprehension quizzes</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-medical-green-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-medical-green" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Patient-Focused</h3>
                <p className="text-sm text-muted-foreground">Multilingual support with intuitive interfaces for all technical levels</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


