import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, HelpCircle } from "lucide-react";
import { consentFormHelp, sectionDescriptions, quickResponses } from "../data/consentFormHelp";

const Chatbot = ({ 
  initialMessages = [], 
  getBotResponse, 
  infoText, 
  className = "",
  context = "trial",
  onFieldsPatch,
  fields = [], // Add fields parameter
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [speakReplies, setSpeakReplies] = useState(false);

  // Trial information context
  const getTrialContext = () => {
    return infoText || `
      Phase II clinical trial studying Glucora, a new GLP-1 receptor agonist for diabetes treatment.
      
      Drug Information:
      - Investigational Drug: "Glucora" (a new GLP-1 receptor agonist)
      - How it works: Helps regulate blood sugar by increasing insulin release and reducing glucose production in the liver
      - Form: Subcutaneous injection, once weekly
      - Status: Approved for testing in earlier Phase I trials with promising safety results
      
      Trial Details:
      - Purpose: To evaluate the safety, tolerability, and effectiveness of Glucora compared to a placebo
      - Duration: 12-18 months, including regular visits, blood tests, and health monitoring
      - Location: Hyderabad, India
      - Voluntary: You may withdraw at any point without affecting your medical care
      - Confidential: All your medical records and personal details will remain private
      - Risks: Possible side effects may include tiredness, mild fever, nausea, or injection site discomfort (serious effects are rare but monitored)
      - Benefits: This treatment may improve blood sugar control and contribute to advancing diabetes care, though personal benefit is not guaranteed
      - Contact: Email: trials@gmail.com, Phone: 9542757209, Address: Hyderabad, India
    `;
  };

  // LLM-based response generation
  const getTrialInformation = async (userQuestion) => {
    try {
      const trialContext = getTrialContext();
      const response = await generateLLMResponse(userQuestion, trialContext);
      return response;
    } catch (error) {
      console.error('LLM response error:', error);
      return "I'm having trouble processing your question right now. Please contact the research team directly at trials@gmail.com or 9542757209 for assistance.";
    }
  };

  // LLM API integration
  const generateLLMResponse = async (question, context) => {
    try {
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const prompt = `You are a helpful medical AI assistant explaining a clinical trial to potential participants. 

Context about the trial:
${context}

User question: "${question}"

Instructions:
- Provide clear, accurate responses based ONLY on the trial information above
- Keep responses concise (2-3 sentences) and friendly
- If the question cannot be answered from the trial information, politely say so and direct to contact the research team
- Do not make up information not provided in the context
- For location questions, mention that the trial is in Hyderabad, India but you can't calculate distances
- For eligibility questions, recommend contacting the research team for assessment
- For cost/payment questions, direct to the research team for financial details

Please provide a helpful response to the user's question:`;

      // In a real implementation, you would call an actual LLM API here
      // For now, we'll use a simple simulation
      return await simulateLLMResponse(prompt);
      
    } catch (error) {
      console.error('LLM API error:', error);
      throw error; // Rethrow to be handled by the caller
    }
  };

  // Simple LLM simulation for development
  const simulateLLMResponse = async (prompt) => {
    // Extract the user's question from the prompt
    const questionMatch = prompt.match(/User question: \"([^\"]+)\"/i);
    const question = questionMatch ? questionMatch[1].toLowerCase() : '';
    
    // Extract trial context from the prompt
    const contextMatch = prompt.match(/Context about the trial:([\s\S]*?)(?=User question:|$)/i);
    const context = contextMatch ? contextMatch[1] : '';
    
    // Simple keyword-based response generation
    if (question.includes('what') && question.includes('drug')) {
      return "This clinical trial is studying Glucora, a new GLP-1 receptor agonist for diabetes treatment. It's an investigational drug that helps regulate blood sugar by increasing insulin release and reducing glucose production in the liver.";
    }
    
    if (question.includes('purpose') || question.includes('why') || question.includes('objective')) {
      return "The purpose of this trial is to evaluate the safety, tolerability, and effectiveness of Glucora compared to a placebo in treating diabetes. The study aims to determine if Glucora could become a new treatment option for diabetes patients.";
    }
    
    if (question.includes('duration') || question.includes('how long')) {
      return "The trial duration is 12-18 months, which includes regular visits, blood tests, and health monitoring. Participants will receive weekly injections during this period.";
    }
    
    if (question.includes('location') || question.includes('where')) {
      return "The clinical trial is conducted in Hyderabad, India. For specific location details and directions, please contact the research team.";
    }
    
    if (question.includes('contact') || question.includes('email') || question.includes('phone')) {
      return "You can reach the research team at trials@gmail.com or call 9542757209. They're available to answer any questions about the trial.";
    }
    
    if (question.includes('benefit') || question.includes('advantage')) {
      return "The potential benefits of participating in this trial may include improved blood sugar control and contributing to medical research that could help future diabetes patients. However, personal benefit is not guaranteed.";
    }
    
    if (question.includes('risk') || question.includes('side effect') || question.includes('danger')) {
      return "Possible side effects may include tiredness, mild fever, nausea, or injection site discomfort. All potential risks will be fully explained during the informed consent process.";
    }
    
    // Default response for unhandled questions
    return "I can help you with information about the Glucora clinical trial. You can ask about the drug being tested, trial duration, location, risks, benefits, or how to participate. For specific personal questions, please contact the research team at trials@gmail.com or call 9542757209.";
  };

  // Consent form guidance function
  const getConsentFormGuidance = (message, fields) => {
    const lowerMessage = message.toLowerCase();
    
    // Handle trial-specific questions if context is "trial"
    if (context === "trial") {
      return getTrialInformation(lowerMessage);
    }
    
    // Check for quick responses first
    for (const [question, answer] of Object.entries(quickResponses)) {
      if (lowerMessage.includes(question)) {
        return answer;
      }
    }
    
    // Check for field-specific guidance first (more specific)
    for (const [fieldKey, fieldInfo] of Object.entries(consentFormHelp)) {
      const fieldLower = fieldKey.toLowerCase();
      
      // Check multiple variations of field matching
      const fieldVariations = [
        fieldLower,
        fieldLower.replace(/([A-Z])/g, ' $1').toLowerCase().trim(), // camelCase to space separated
        fieldLower.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(), // another camelCase variation
      ];
      
      // Also check for common field name patterns
      if (fieldKey === 'currentMedications') {
        fieldVariations.push('current medication', 'medications', 'medication', 'current meds', 'meds');
      }
      if (fieldKey === 'firstName') {
        fieldVariations.push('first name', 'firstname');
      }
      if (fieldKey === 'lastName') {
        fieldVariations.push('last name', 'lastname');
      }
      if (fieldKey === 'phoneNumber') {
        fieldVariations.push('phone number', 'phone');
      }
      if (fieldKey === 'dateOfBirth') {
        fieldVariations.push('date of birth', 'birth date', 'dob');
      }
      if (fieldKey === 'emergencyContactName') {
        fieldVariations.push('emergency contact name', 'emergency contact');
      }
      if (fieldKey === 'emergencyContactPhone') {
        fieldVariations.push('emergency contact phone', 'emergency phone');
      }
      if (fieldKey === 'healthConditions') {
        fieldVariations.push('health conditions', 'health condition', 'medical conditions');
      }
      
      // Check if any variation matches
      for (const variation of fieldVariations) {
        if (lowerMessage.includes(variation)) {
          let response = `${fieldKey} field: ${fieldInfo.guidance}`;
          if (fieldInfo.example) {
            response += ` ${fieldInfo.example}`;
          }
          if (fieldInfo.required !== undefined) {
            response += fieldInfo.required ? " This field is required." : " This field is optional.";
          }
          return response;
        }
      }
    }
    
    // Check for section-specific requests
    for (const [sectionName, description] of Object.entries(sectionDescriptions)) {
      const sectionLower = sectionName.toLowerCase();
      if (lowerMessage.includes(sectionLower) || lowerMessage.includes(sectionLower.replace(' ', ''))) {
        return `${sectionName} Section: ${description} You can ask me about specific fields in this section for detailed guidance.`;
      }
    }
    
    // General help responses
    if (lowerMessage.includes("help") || lowerMessage.includes("what") || lowerMessage.includes("how")) {
      return "I can help you with: Field guidance - Ask about any specific form field like firstName, email, allergies, etc. Section information - Ask about Personal Information, Medical History, Emergency Contact, Healthcare Providers, Insurance Information, Legal Authorization, or Final Consent. General questions - Ask about security, time needed, or saving progress. What would you like to know more about?";
    }
    
    if (lowerMessage.includes("section") || lowerMessage.includes("fill")) {
      return "The consent form has these main sections: Personal Information - Your contact details. Medical History - Health conditions, medications, allergies. Emergency Contact - Someone to contact if needed. Healthcare Providers - Your doctors and preferred hospital. Insurance Information - Your health insurance details. Legal Authorization - Medical procedure permissions. Final Consent - Study agreements and signature. Which section would you like help with?";
    }
    
    // Default response
    return "I'm here to help you complete the consent form! You can ask me about: Any specific field like firstName, lastName, email, allergies, currentMedications, emergencyContactName, etc. Any section like Medical History or Personal Information. General questions about the form. What would you like to know?";
  };

  const speak = (text) => {
    try {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text || "");
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const sendMessage = async (messageText = chatInput) => {
    if (!messageText.trim()) return;

    const userMessage = { id: Date.now(), text: messageText, isBot: false };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      let botResponse;
      
      if (context === "trial") {
        // For trial context, use async LLM-based response
        botResponse = await getTrialInformation(messageText);
      } else {
        // For consent form context, use synchronous response
        botResponse = getConsentFormGuidance(messageText, fields);
      }
      
      const botMessage = { id: Date.now() + 1, text: botResponse, isBot: true };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      if (speakReplies) {
        speak(botResponse);
      }
    } catch (error) {
      console.error('Message processing error:', error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: "I'm having trouble processing your question right now. Please try again or contact support if the issue persists.", 
        isBot: true 
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
    
    if (!voiceInput) setChatInput("");
    if (voiceInput) setIsChatOpen(true);
  };

  const playVoiceFromText = async (text) => {
    try {
      setIsPlaying(true);
      const response = await fetch('/functions/v1/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) {
        // fallback to browser TTS
        setIsPlaying(false);
        speak(text);
        return;
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch (error) {
      // fallback to browser TTS on error
      setIsPlaying(false);
      speak(text);
    }
  };

  // Removed dedicated "play explanation" button to avoid duplicate speaker icons.

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        sendMessage(transcript);
        if (isListening) setTimeout(() => recognitionInstance.start(), 1000);
      };
      
      recognitionInstance.onend = () => {
        if (isListening) setTimeout(() => recognitionInstance.start(), 500);
      };
      
      recognitionInstance.onerror = (event) => {
        if (isListening && event.error !== 'aborted') {
          setTimeout(() => recognitionInstance.start(), 1000);
        }
      };
      
      setRecognition(recognitionInstance);
    }
  }, [isListening]);

  const startVoiceInput = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      setIsChatOpen(true);
      recognition.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognition && isListening) {
      setIsListening(false);
      recognition.stop();
    }
  };

  const handleClose = () => {
    setIsChatOpen(false);
    if (isListening) stopVoiceInput();
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="relative">
        {!isChatOpen ? (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <MessageCircle className="w-8 h-8 text-white relative z-10 drop-shadow-lg animate-bounce" />

          <div className="absolute -top-1 -right-1 flex flex-col items-center space-y-1">
            <div className="w-10 h-10 bg-white/100 rounded-full animate-ping"></div>
            <div className="w-10 h-10 bg-white/100 rounded-full animate-ping" ></div>
            <div className="w-10 h-10 bg-white/100 rounded-full animate-ping absolute right-10 top-2" 
            ></div>
          </div>

          {isListening ? (
            <div className="absolute inset-0 bg-red-500/30 animate-pulse rounded-full ring-4 ring-red-400/50" />
          ) : (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
          )}

          </Button>
        ) : (
          <Card className="w-96 h-[700px] shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm" style={{marginBottom: '50px'}}>
            <CardHeader className="bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 text-white p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center backdrop-blur-sm animate-pulse">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base leading-tight text-white font-semibold">Medical AI Assistant</CardTitle>
                    <div className="flex items-center gap-2 text-xs opacity-90">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Online
                      </span>
                      {isListening && (
                        <span className="inline-flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                          Listening
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <div className="flex flex-col h-[calc(750px-120px)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom duration-500 delay-${index * 100}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`flex items-end gap-2 ${message.isBot ? '' : 'flex-row-reverse'}`}>
                        <div className={`h-8 w-8 rounded-full grid place-items-center transition-all duration-300 hover:scale-110 ${
                          message.isBot 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' 
                            : 'bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg'
                        }`}>
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-lg transition-all duration-300 hover:shadow-xl ${
                          message.isBot 
                            ? 'bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 text-slate-800 dark:text-slate-200 border border-blue-100 dark:border-blue-800' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-500'
                        }`}>
                          {message.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-end gap-2">
                        <div className="h-8 w-8 rounded-full grid place-items-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg animate-pulse">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl px-4 py-3 shadow-lg border border-blue-100 dark:border-blue-800">
                          <span className="inline-flex gap-1">
                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200 hover:scale-105">
                        <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-56 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                      <div className="font-medium mb-2 text-slate-800 dark:text-slate-200">Quick questions</div>
                      <div className="grid gap-1">
                        {['Give me a summary','What are the risks?','How do I withdraw?','Explain consent'].map(q => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="text-left px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-200 text-slate-700 dark:text-slate-300"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Button
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                    variant={isListening ? "destructive" : "secondary"}
                    size="icon"
                    className="shrink-0 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={() => setSpeakReplies((v) => !v)}
                    variant={speakReplies ? "secondary" : "outline"}
                    size="icon"
                    title={speakReplies ? "Disable speaking replies" : "Enable speaking replies"}
                    className="shrink-0 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    {speakReplies ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message…"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  
                  <Button
                    onClick={() => sendMessage()}
                    size="icon"
                    className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
