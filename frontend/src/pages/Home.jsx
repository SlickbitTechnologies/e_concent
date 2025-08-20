import { Shield, FileText, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to NeuroSAFE PROOF</h2>
            <p className="text-lg text-muted-foreground mb-6">
              You're now part of an important clinical trial. Let's get you started with the essential information and consent process.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Secure • HIPAA Compliant • Research-Based</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Your Trial Dashboard</h3>
          <p className="text-muted-foreground">Complete these steps to participate in the NeuroSAFE PROOF clinical trial</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Step 1: Trial Information */}
          <Card className="hover:shadow-lg transition-all duration-200 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Trial Information</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review important information about the NeuroSAFE PROOF clinical trial, including purpose, risks, benefits, and procedures.
              </p>
              <Button 
                onClick={() => navigate('/trial-info')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Here
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Consent Form */}
          <Card className="hover:shadow-lg transition-all duration-200 border-2 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Consent Form</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Complete the electronic consent form to officially participate in the clinical trial.
              </p>
              <Button 
                onClick={() => navigate('/consent-form')} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled
              >
                Complete Step 1 First
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: Study Schedule */}
          <Card className="hover:shadow-lg transition-all duration-200 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Study Schedule</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View upcoming appointments, study visits, and important dates for your participation.
              </p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled
              >
                Complete Previous Steps
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trial Information</span>
                  <span className="text-sm text-muted-foreground">Not Started</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Consent Form</span>
                  <span className="text-sm text-muted-foreground">Locked</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Study Schedule</span>
                  <span className="text-sm text-muted-foreground">Locked</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/trial-info')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Review Trial Information
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Back to Main Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
