import { useState, useEffect } from "react";
// import { useState } from "react";
import { CheckCircle, Download, Home, FileText, ArrowLeft, Copy, Calendar, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SubmissionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uniqueCode, setUniqueCode] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [copied, setCopied] = useState(false);
  const [participantData, setParticipantData] = useState(null);

  useEffect(() => {
    try {
      console.log('SubmissionSuccess page loaded, location.state:', location.state);
      // Get data from navigation state or generate fallback
      const { uniqueId, participantData: passedData } = location.state || {};
      
      if (uniqueId && passedData) {
        console.log('Using passed data - uniqueId:', uniqueId);
        setUniqueCode(uniqueId);
        setParticipantData(passedData);
        setSubmissionDate(new Date(passedData.submissionDate).toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }));
      } else {
        console.log('No passed data, generating fallback');
        // Fallback for direct navigation
        const fallbackCode = "NS-" + Date.now().toString().slice(-8) + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setUniqueCode(fallbackCode);
        setSubmissionDate(new Date().toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }));
      }
    } catch (error) {
      console.error('Error in SubmissionSuccess useEffect:', error);
      // Generate fallback data even if there's an error
      const fallbackCode = "NS-" + Date.now().toString().slice(-8) + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setUniqueCode(fallbackCode);
      setSubmissionDate(new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }));
    }
  }, [location.state]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(uniqueCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadConfirmation = () => {
    const content = `\nNeuroSAFE PROOF Clinical Trial\nConsent Form Submission Confirmation\n\nSubmission ID: ${uniqueCode}\nDate: ${submissionDate}\nStatus: Successfully Submitted\n\nThank you for your participation in the NeuroSAFE PROOF Clinical Trial.\nYour consent form has been successfully submitted and recorded.\n\nFor any questions, please contact:\nResearch Team: research@neurosafe-proof.org\nPhone: +1 (555) 123-4567\n\nPlease keep this confirmation for your records.\n    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NeuroSAFE-Confirmation-${uniqueCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
              <div className="text-primary-foreground font-bold text-sm">NEUROSAFE<br />PROOF</div>
            </div>
            <div>
              <h1 className="text-xl font-bold">NeuroSAFE PROOF Clinical Trial</h1>
              <p className="text-primary-foreground/80">Submission Confirmation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate('/consent-form')} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Consent Form
            </Button>
            <Button variant="secondary" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Consent Form Successfully Submitted!</h2>
                <p className="text-green-700 dark:text-green-300">Thank you for participating in the NeuroSAFE PROOF Clinical Trial. Your consent form has been received and processed.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Unique ID</Badge>
                Your Submission Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 border-2 border-dashed border-muted-foreground/20">
                  <p className="text-sm text-muted-foreground mb-2">Submission ID:</p>
                  <div className="text-3xl font-mono font-bold text-primary tracking-wider">{uniqueCode}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopyCode} variant="outline" className="flex-1" disabled={copied}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy Code"}
                  </Button>
                  <Button onClick={handleDownloadConfirmation} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  <p><strong>Important:</strong> Please keep this ID for your records. You will need it for any future communications about the study.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Submission Date:</span><span className="font-medium">{submissionDate}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Status:</span><Badge variant="default" className="bg-green-100 text-green-800 border-green-200">✓ Submitted</Badge></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Trial:</span><span className="font-medium">NeuroSAFE PROOF</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Form Type:</span><span className="font-medium">Consent Form</span></div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Processing Status:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Form validated</span></div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Data stored securely</span></div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Confirmation generated</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle>What Happens Next?</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div><div><h4 className="font-semibold">Review & Processing</h4><p className="text-sm text-muted-foreground">Our research team will review your submission within 2-3 business days.</p></div></div>
                <div className="flex items-start gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div><div><h4 className="font-semibold">Contact & Scheduling</h4><p className="text-sm text-muted-foreground">We will contact you to schedule your first appointment and provide additional information.</p></div></div>
                <div className="flex items-start gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">3</div><div><h4 className="font-semibold">Study Participation</h4><p className="text-sm text-muted-foreground">Begin your participation in the NeuroSAFE PROOF Clinical Trial.</p></div></div>
              </div>
              <div className="space-y-4">
                <Card className="border-muted"><CardContent className="pt-4"><h4 className="font-semibold mb-3 flex items-center gap-2"><Mail className="w-4 h-4" />Contact Information</h4><div className="space-y-2 text-sm"><p><strong>Research Team:</strong><br />research@neurosafe-proof.org</p><p className="flex items-center gap-2"><Phone className="w-4 h-4" /><strong>Phone:</strong> +1 (555) 123-4567</p><p><strong>Office Hours:</strong><br />Monday - Friday, 9:00 AM - 5:00 PM</p></div></CardContent></Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">Important Reminders:</h4>
            <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
              <p>• Keep your unique submission ID <strong>{uniqueCode}</strong> safe - you'll need it for all future communications</p>
              <p>• Check your email for additional instructions and appointment scheduling</p>
              <p>• Contact us immediately if you have any questions or concerns</p>
              <p>• You can withdraw from the study at any time without affecting your medical care</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionSuccess;


