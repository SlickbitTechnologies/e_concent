// JSX equivalent of TrialInfo.tsx with AI Assistant and overview cards
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, CalendarDays, FlaskConical, Building2, UserCircle2, MapPin, ArrowLeft } from "lucide-react";
import Chatbot from "@/components/Chatbot";

const TrialInfo = () => {
  const navigate = useNavigate();
  const [acknowledged, setAcknowledged] = useState(false);

  const infoText = `
  You are invited to participate in a Phase II clinical trial 
  studying an innovative treatment for diabetes.

  Drug Information:
  - Investigational Drug: "Glucora" (a new GLP-1 receptor agonist)
  - How it works: Helps regulate blood sugar by increasing insulin release 
    and reducing glucose production in the liver
  - Form: Subcutaneous injection, once weekly
  - Status: Approved for testing in earlier Phase I trials with promising safety results

  Trial Details:
  - Purpose: To evaluate the safety, tolerability, and effectiveness of Glucora 
    compared to a placebo
  - Duration: (12-18) months, including regular visits, blood tests, and health monitoring
  - Voluntary: You may withdraw at any point without affecting your medical care
  - Confidential: All your medical records and personal details will remain private
  - Risks: Possible side effects may include tiredness, mild fever, nausea, or 
    injection site discomfort (serious effects are rare but monitored)
  - Benefits: This treatment may improve blood sugar control and contribute to 
    advancing diabetes care, though personal benefit is not guaranteed
  - Contact: The research team is available anytime to answer your questions
  - Contact details for the trial's conducting members:
    - email: (trials@gmail.com)
    - phone: (9542757209)
    - address: (Hyderabad, India  )

  All trial activities follow strict safety protocols, and doctors will 
  closely monitor your health throughout participation.
`;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20 text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">NeuroSAFE PROOF Clinical Trial</h1>
              <p className="text-primary-foreground/80 text-sm">Trial Information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/home')} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
            <h1 className="text-2xl font-bold tracking-tight">Trial Information</h1>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Trial Overview</h2>
            <p className="mt-2 text-muted-foreground">Phase II Efficacy Study of Novel Cardioprotective Agent</p>
            <p className="mt-2 text-muted-foreground">A randomized, double-blind, placebo-controlled study evaluating the efficacy and safety of XYZ-123 in patients with chronic heart failure.</p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="bg-blue-50/70 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
              <CardContent className="flex items-start gap-3 p-3">
                <div className="mt-1 text-blue-600 dark:text-blue-300"><CalendarDays className="h-5 w-5" /></div>
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-muted-foreground">(12-18) months</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50/70 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900">
              <CardContent className="flex items-start gap-3 p-3">
                <div className="mt-1 text-emerald-600 dark:text-emerald-300"><FlaskConical className="h-5 w-5" /></div>
                <div>
                  <div className="font-semibold">Phase</div>
                  <div className="text-muted-foreground">Phase II</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50/70 dark:bg-green-900/10 border-green-100 dark:border-green-900">
              <CardContent className="flex items-start gap-3 p-3">
                <div className="mt-1 text-green-600 dark:text-green-300"><Building2 className="h-5 w-5" /></div>
                <div>
                  <div className="font-semibold">Sponsor</div>
                  <div className="text-muted-foreground">(sponsor name)</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-violet-50/70 dark:bg-violet-900/10 border-violet-100 dark:border-violet-900">
              <CardContent className="flex items-start gap-3 p-3">
                <div className="mt-1 text-violet-600 dark:text-violet-300"><UserCircle2 className="h-5 w-5" /></div>
                <div>
                  <div className="font-semibold">Principal Investigator</div>
                  <div className="text-muted-foreground">(principal investigator name)</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4 bg-slate-50/70 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800">
            <CardContent className="flex items-start gap-3 p-3">
              <div className="mt-1 text-slate-600 dark:text-slate-300"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold">Location</div>
                <div className="text-muted-foreground">( location to be added)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border shadow-elevated">
          <CardHeader><CardTitle>Pre‑Form Instructions (Read Before Filling the Form)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc space-y-2 pl-6">
              <li><span className="font-medium">Purpose of the Trial:</span> This clinical trial is designed to test a new treatment to check if it is safe and effective.</li>
              <li><span className="font-medium">Voluntary Participation:</span> Joining this trial is your choice. You may leave at any time.</li>
              <li><span className="font-medium">What to Expect:</span> You will be told about procedures, benefits, and risks. You may ask questions at any time.</li>
              <li><span className="font-medium">Confidentiality:</span> Your personal and medical information will remain private.</li>
              <li><span className="font-medium">Your Rights:</span> You have the right to fully understand everything before giving consent.</li>
              <li><span className="font-medium">Next Steps:</span> After reading, you will provide consent electronically.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="my-8"><Separator /></div>

        <Card className="border-border shadow-elevated">
          <CardHeader><CardTitle>Part I: Information Sheet</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[360px] p-6">
              <div className="space-y-6">
                <section><h3 className="font-semibold">1. Introduction</h3><p className="text-sm text-muted-foreground mt-2">We are inviting you to take part in a clinical trial...</p></section>
                <section><h3 className="font-semibold">2. Purpose of the Trial</h3><p className="text-sm text-muted-foreground mt-2">The purpose of this trial is to test a new treatment for your condition.</p></section>
                <section><h3 className="font-semibold">3. Why You Have Been Invited</h3><p className="text-sm text-muted-foreground mt-2">You are being invited because you meet the conditions needed for this trial.</p></section>
                <section><h3 className="font-semibold">4. What Participation Involves</h3><p className="text-sm text-muted-foreground mt-2">Visits, tests, and possible trial medicine or placebo.</p></section>
                <section><h3 className="font-semibold">5. Risks and Side Effects</h3><p className="text-sm text-muted-foreground mt-2">Tiredness, mild fever, pain at injection site; serious effects are rare.</p></section>
                <section><h3 className="font-semibold">6. Benefits</h3><p className="text-sm text-muted-foreground mt-2">You may or may not personally benefit; your participation helps future patients.</p></section>
                <section><h3 className="font-semibold">7. Confidentiality</h3><p className="text-sm text-muted-foreground mt-2">Data will be stored securely and only authorized staff will have access.</p></section>
                <section><h3 className="font-semibold">8. Right to Withdraw</h3><p className="text-sm text-muted-foreground mt-2">You can stop at any time without affecting your care.</p></section>
                <section><h3 className="font-semibold">9. Who to Contact</h3><p className="text-sm text-muted-foreground mt-2">Contact the research team if you have questions.</p></section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-start gap-3">
          <Checkbox id="ack" checked={acknowledged} onCheckedChange={(v) => setAcknowledged(Boolean(v))} />
          <label htmlFor="ack" className="text-sm leading-relaxed text-foreground">I have read and understood the information above...</label>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/home')}>Back to Dashboard</Button>
          <Button variant="medical" disabled={!acknowledged} onClick={() => navigate('/consent-form')}>Proceed to Consent Form</Button>
        </div>
      </div>

      {/* AI Assistant */}
      <Chatbot
        initialMessages={[
          { id: 1, text: "Hello! I can explain the trial details and answer your questions. Ask me about risks, benefits, confidentiality, or how to proceed.", isBot: true }
        ]}
        infoText={infoText}
        context="trial"
      />
    </div>
  );
};

export default TrialInfo;


