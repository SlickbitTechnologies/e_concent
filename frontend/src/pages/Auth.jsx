import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase config from Vite env (define these in frontend/.env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("participant");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem('token', idToken);
      localStorage.setItem('userEmail', result.user.email || '');
      localStorage.setItem('userName', result.user.displayName || (result.user.email ? result.user.email.split('@')[0] : ''));
      
      // Set role based on currently active tab
      const role = activeTab === 'admin' ? 'admin' : 'participant';
      localStorage.setItem('userRole', role);
      
      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      alert('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">MedConsent</h1>
          <p className="text-muted-foreground">Secure Clinical Trial Platform</p>
        </div>

        <Card className="border-border shadow-elevated">
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your clinical trial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs defaultValue="participant" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="participant">Participant</TabsTrigger>
                  <TabsTrigger value="admin">Admin/CRO</TabsTrigger>
                </TabsList>

                <TabsContent value="participant" className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Participant Access</h3>
                    <p className="text-sm text-muted-foreground">Sign in to access your clinical trial dashboard and consent forms</p>
                  </div>
                  <Button type="button" variant="medical" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Continue with Google"}
                  </Button>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Admin/CRO Access</h3>
                    <p className="text-sm text-muted-foreground">Clinical Research Organization access to review participant applications</p>
                    <div className="text-xs text-muted-foreground bg-primary-light p-3 rounded-lg">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Secure admin access for authorized personnel only
                    </div>
                  </div>
                  <Button type="button" variant="medical" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Continue with Google (Admin)"}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-6 p-4 bg-primary-light rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-primary">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Secure Login</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Your data is protected with enterprise-grade security and HIPAA compliance.</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;


