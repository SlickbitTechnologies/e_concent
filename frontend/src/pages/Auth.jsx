import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Dummy auth: read form values but do not call any backend
      const form = new FormData(e.target);
      let payload;
      
      if (type === 'participant') {
        payload = { email: form.get('email'), password: form.get('password') };
      } else if (type === 'admin') {
        payload = { email: form.get('adminEmail'), password: form.get('adminPassword') };
      } else if (type === 'register') {
        payload = { firstName: form.get('firstName'), lastName: form.get('lastName'), email: form.get('registerEmail'), password: form.get('registerPassword') };
      }

      await new Promise((r) => setTimeout(r, 400));

      // Dummy success: set localStorage and navigate
      const derivedName = payload.firstName ? `${payload.firstName} ${payload.lastName}` : (payload.email ? payload.email.split('@')[0] : 'User');
      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('userEmail', payload.email || 'user@example.com');
      localStorage.setItem('userName', derivedName);
      localStorage.setItem('userRole', type === 'admin' ? 'admin' : 'participant');

      // Navigate based on user role
      if (type === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
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
            <div className="space-y-3 mb-4">
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                Continue with Google {activeTab === 'admin' ? '(Admin/CRO)' : '(Participant)'}
              </Button>
            </div>

            <Tabs defaultValue="participant" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="participant">Participant</TabsTrigger>
                <TabsTrigger value="admin">Admin/CRO</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="participant">
                <form onSubmit={(e) => handleSubmit(e, 'participant')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" required />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" variant="medical" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Participant"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={(e) => handleSubmit(e, 'admin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input id="adminEmail" name="adminEmail" type="email" placeholder="Enter admin email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <div className="relative">
                      <Input id="adminPassword" name="adminPassword" type={showPassword ? "text" : "password"} placeholder="Enter admin password" required />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground bg-primary-light p-3 rounded-lg">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Admin access for Clinical Research Organizations (CRO) to review participant applications
                  </div>

                  <Button type="submit" variant="medical" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Admin/CRO"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input id="registerEmail" name="registerEmail" type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <Input id="registerPassword" name="registerPassword" type={showPassword ? "text" : "password"} placeholder="Create a password" required />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" variant="medical" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

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


