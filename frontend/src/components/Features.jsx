import { 
  Shield, 
  Users, 
  FileText, 
  MessageSquare, 
  PenTool, 
  Smartphone,
  Lock,
  Globe,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    { icon: FileText, title: "Digital Consent Forms", description: "Interactive consent forms with AI-powered summaries in text and audio format for enhanced comprehension.", color: "primary" },
    { icon: MessageSquare, title: "Multilingual AI Chatbot", description: "24/7 AI assistance in multiple languages to help patients understand consent processes and requirements.", color: "accent" },
    { icon: PenTool, title: "Digital Signatures", description: "Secure digital signing with comprehensive audit trails and timestamp verification for legal compliance.", color: "success" },
    { icon: Users, title: "Role-Based Dashboards", description: "Specialized interfaces for patients and administrators with tailored workflows and access controls.", color: "primary" },
    { icon: Shield, title: "Security & Compliance", description: "HIPAA, 21 CFR Part 11 compliant with 2FA, encryption, and comprehensive audit logging.", color: "medical" },
    { icon: Smartphone, title: "Mobile-First Design", description: "Responsive design optimized for mobile devices with offline capability and touch-friendly interfaces.", color: "accent" }
  ];

  const getIconBg = (color) => ({
    primary: "bg-primary-light",
    accent: "bg-accent-light",
    success: "bg-success-light",
    medical: "bg-medical-blue-light",
  }[color] || "bg-primary-light");

  const getIconColor = (color) => ({
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    medical: "text-medical-blue",
  }[color] || "text-primary");

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comprehensive Platform Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need for secure, compliant, and user-friendly clinical trial consent management</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 ${getIconBg(feature.color)} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${getIconColor(feature.color)}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">End-to-End Encryption</h3>
            <p className="text-muted-foreground">All data is encrypted in transit and at rest with military-grade security protocols.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Global Accessibility</h3>
            <p className="text-muted-foreground">WCAG 2.1 compliant with screen reader support and multiple language options.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Real-Time Monitoring</h3>
            <p className="text-muted-foreground">Live consent status tracking with automated notifications and progress updates.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;


