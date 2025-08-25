import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ConsentForm from "./pages/ConsentForm";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import NotFound from "./pages/NotFound";
import TrialInfo from "./pages/TrialInfo";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/patient-dashboard" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/trial-info" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <TrialInfo />
            </ProtectedRoute>
          } />
          <Route path="/consent-form" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ConsentForm />
            </ProtectedRoute>
          } />
          <Route path="/submission-success" element={<SubmissionSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


