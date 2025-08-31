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
    return JSON.stringify({
      title: "Phase ll Study of New Diabetes Treatment",
      condition: "Type 2 Diabetes",
      duration: "12-18 months, including regular visits, blood tests, and health monitoring",
      location: "Hyderabad, India",
      isVoluntary: true,
      isConfidential: true,
      risks: [
        "Tiredness",
        "Mild fever",
        "Nausea",
        "Injection site discomfort",
        "Serious effects are rare but monitored"
      ],
      benefits: [
        "May improve blood sugar control",
        "Contributes to advancing diabetes care"
      ],
      contact: {
        email: "trials@gmail.com",
        phone: "958765457209",
        address: "Hyderabad, India"
      },
      additionalInfo: "This is a clinical trial for a new diabetes medication. Participation is voluntary and you may withdraw at any point without affecting your medical care. All your medical records and personal details will remain private. Personal benefit is not guaranteed."
    });
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

  // Backend LLM API integration
  const generateLLMResponse = async (question, context, isFormFieldQuestion = false) => {
    try {
      let systemPrompt;
      
      if (isFormFieldQuestion) {
        // For form field questions, focus on guiding the user on what to enter
        systemPrompt = `You are a helpful medical AI assistant guiding a user through filling out a clinical trial consent form. 
        
When asked about form fields, provide clear, specific guidance on what information to enter. 
For medical fields like allergies, medications, or health conditions, explain what details to include and provide examples.

Be concise but thorough in your explanations. If the user asks about a field, explain:
1. What information is being requested
2. Why it's important for the clinical trial
3. Examples of how to format the information
4. Whether the field is required or optional

Current context: ${context || 'No additional context provided'}`;
      } else {
        // For general trial information questions
        try {
          // Try to parse the context as JSON first
          const trialInfo = JSON.parse(context);
          systemPrompt = `You are a helpful medical AI assistant for a clinical trial. Use the following trial information to answer questions:

TRIAL DETAILS:
- Title: ${trialInfo.title}
- Condition: ${trialInfo.condition}
- Duration: ${trialInfo.duration}
- Location: ${trialInfo.location}
- ${trialInfo.isVoluntary ? 'Participation is voluntary' : 'Participation is required'}
- ${trialInfo.isConfidential ? 'All information will be kept confidential' : 'Some information may be shared'}

RISKS:
${trialInfo.risks.map(r => `• ${r}`).join('\n')}

BENEFITS:
${trialInfo.benefits.map(b => `• ${b}`).join('\n')}

CONTACT:
- Email: ${trialInfo.contact.email}
- Phone: ${trialInfo.contact.phone}
- Address: ${trialInfo.contact.address}

Additional Information: ${trialInfo.additionalInfo}

When answering questions:
- Be concise and accurate
- Only use information from the provided context
- If you don't know the answer, say so and provide contact information`;
        } catch (e) {
          // Fallback to plain text if JSON parsing fails
          systemPrompt = `You are a helpful medical AI assistant for a clinical trial. Use the following trial information to answer questions:

Trial Information:
${context}

When answering questions:
- Be concise and accurate
- Only use information from the provided context
- If you don't know the answer, say so and provide contact information`;
        }
      }

      const response = await fetch('/api/chat/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          context: isFormFieldQuestion ? 'form' : 'trial',
          infoText: systemPrompt,
          fields: isFormFieldQuestion ? [] : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply || "I couldn't generate a response. Please try asking your question differently.";
      
    } catch (error) {
      console.error('Error calling LLM API:', error);
      return "I'm having trouble connecting to the assistant. Please try again later or contact the research team directly at trials@gmail.com or 9542757209.";
    }
  };

  // Consent form guidance function
  const getConsentFormGuidance = async (message, fields) => {
    const lowerMessage = message.toLowerCase();
    
    // Handle form field questions regardless of context
    const fieldMatch = Object.entries(consentFormHelp).find(([fieldKey, fieldInfo]) => {
      const fieldLower = fieldKey.toLowerCase();
      const fieldVariations = [
        fieldLower,
        fieldLower.replace(/([A-Z])/g, ' $1').toLowerCase().trim(),
        fieldLower.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(),
      ];
      
      // Add common variations for specific fields
      if (fieldKey === 'currentMedications') {
        fieldVariations.push('current medication', 'medications', 'medication', 'current meds', 'meds', 'drugs', 'prescriptions');
      } else if (fieldKey === 'healthConditions') {
        fieldVariations.push('health conditions', 'health condition', 'medical conditions', 'medical history', 'current health', 'existing conditions', 'medical issues', 'health issues');
      } else if (fieldKey === 'allergies') {
        fieldVariations.push('allergy', 'allergic', 'allergic reactions', 'allergic to', 'allergic reaction', 'sensitivities', 'intolerances');
      }
      
      return fieldVariations.some(variation => lowerMessage.includes(variation));
    });
    
    if (fieldMatch) {
      // For form field questions, use the LLM with form context
      const [fieldKey, fieldInfo] = fieldMatch;
      const fieldContext = `Field: ${fieldKey}\n\n${fieldInfo.guidance}\n\nExample: ${fieldInfo.example || 'N/A'}\n\n${fieldInfo.required ? 'This field is required.' : 'This field is optional.'}`;
      
      try {
        // Use the LLM to generate a helpful response about this field
        const llmResponse = await generateLLMResponse(
          `The user is asking about the form field: ${fieldKey}. Their exact question is: "${message}"`,
          fieldContext,
          true // Mark as form field question
        );
        return llmResponse;
      } catch (error) {
        console.error('Error getting LLM response for field guidance:', error);
        // Fallback to static guidance if LLM fails
        let response = fieldInfo.guidance;
        if (fieldInfo.example) {
          response += `\n\nExample: ${fieldInfo.example}`;
        }
        response += fieldInfo.required ? "\n\nThis field is required." : "\n\nThis field is optional.";
        return response;
      }
    }
    
    // Handle trial-specific questions if context is "trial" and not a form field question
    if (context === "trial") {
      return await getTrialInformation(lowerMessage);
    }
    
    // Check for consent form guidance requests
    if (lowerMessage.includes('consent form') && (lowerMessage.includes('fill') || lowerMessage.includes('complete') || lowerMessage.includes('what to put'))) {
      return `I can help you with the consent form! Here's what you'll need to provide:

1. **Personal Information**
   - Full Name (as on ID)
   - Date of Birth
   - Contact Information
   - Emergency Contact Details

2. **Medical Information**
   - Current Health Conditions
   - Allergies (medications, foods, environmental)
   - Current Medications & Supplements
   - Medical History

3. **Trial Details**
   - Understanding of the study
   - Acknowledgment of risks/benefits
   - Consent for participation
   - Signature and Date

For specific fields, you can ask me like:
- "How to fill in allergies?"
- "What to put in current medications?"
- "What health conditions should I list?"

You can also visit the Consent Form page to start filling it out directly.`;
    }

    // Check for quick responses
    for (const [question, answer] of Object.entries(quickResponses)) {
      if (lowerMessage.includes(question)) {
        return answer;
      }
    }
    
    // Direct field guidance for common questions
    const fieldGuidance = [
      {
        keywords: ['allerg', 'allergi', 'sensitivi', 'intoleran'],
        field: 'allergies',
        helpText: `Please list any known allergies you have, including:
        
• Medications (e.g., penicillin, ibuprofen)
• Foods (e.g., peanuts, shellfish)
• Environmental factors (e.g., pollen, dust mites, pet dander)
• Materials (e.g., latex, adhesive)

For each allergy, please include:
- The specific allergen
- Type of reaction (e.g., rash, swelling, difficulty breathing)
- Severity (mild, moderate, severe)
- When the reaction last occurred

Example: 
- Penicillin (severe reaction - anaphylaxis, last occurred 2015)
- Peanuts (moderate - hives and swelling, last occurred 2020)
- Latex (mild - skin irritation, last occurred 2022)

If you have no known allergies, please write: 'None' or 'No known allergies'`
      },
      {
        keywords: ['health', 'medical', 'condition', 'illness', 'diagnos', 'disease'],
        field: 'healthConditions',
        helpText: `Please list any current or past significant medical conditions. Be specific and include:
        
• The name of the condition
• When it was diagnosed
• Current status (active/controlled/resolved)
• Any relevant details about severity or management

Examples of what to include:
- Chronic conditions (diabetes, hypertension, asthma, etc.)
- Major illnesses or hospitalizations
- Surgeries or major procedures
- Mental health conditions
- Autoimmune disorders
- Cancer history

Example 1: 
- Type 2 diabetes (diagnosed 2018, well-controlled with medication and diet)
- Hypertension (mild, managed with medication since 2020)
- Asthma (mild, uses inhaler as needed)

Example 2:
- No significant medical conditions`
      },
      {
        keywords: ['medication', 'meds', 'prescription', 'drug', 'pill'],
        field: 'currentMedications',
        helpText: `Please list all medications and supplements you are currently taking, including:
        
• Prescription medications
• Over-the-counter drugs
• Vitamins and supplements
• Herbal remedies
• Birth control

For each medication, please include:
- Name of medication (brand or generic)
- Dosage (e.g., 50mg, 1 tablet)
- Frequency (e.g., once daily, twice a day)
- Reason for taking (if not obvious)
- When you started taking it (month/year)

Example 1:
- Metformin 500mg, twice daily for Type 2 diabetes (since 2020)
- Lisinopril 10mg, once daily for blood pressure (since 2021)
- Vitamin D3 1000IU, once daily (since 2022)
- Ibuprofen 200mg, as needed for headaches

Example 2:
- No current medications`
      }
    ];

    // Check for direct field guidance questions
    if (lowerMessage.includes('what to fill') || 
        lowerMessage.includes('what should i put') || 
        lowerMessage.includes('how to fill') ||
        lowerMessage.includes('what goes in') ||
        lowerMessage.includes('what do i put')) {
      
      for (const {keywords, helpText} of fieldGuidance) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          return helpText;
        }
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    await sendMessage(userMessage);
  };

  // Unified message sender used by text input, quick questions, and voice input
  const sendMessage = async (rawMessage) => {
    const message = (rawMessage || "").trim();
    if (!message) return;

    // Add user message
    setChatMessages((prev) => [...prev, { id: Date.now(), text: message, isBot: false }]);

    // Show typing indicator
    setChatMessages((prev) => [...prev, { id: Date.now() + 1, text: "...", isBot: true, isTyping: true }]);

    try {
      let response;
      if (context === "trial") {
        response = await getTrialInformation(message);
      } else {
        response = await generateLLMResponse(message, "");
      }

      // Remove typing indicator and add bot response
      setChatMessages((prev) =>
        prev
          .filter((msg) => !msg.isTyping)
          .concat([{ id: Date.now() + 2, text: response, isBot: true }])
      );

      if (speakReplies) {
        try { await playVoiceFromText(response); } catch (_) { /* noop fallback handled inside */ }
      }
    } catch (error) {
      console.error("Error getting response:", error);
      setChatMessages((prev) =>
        prev
          .filter((msg) => !msg.isTyping)
          .concat([
            {
              id: Date.now() + 2,
              text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
              isBot: true,
            },
          ])
      );
    }
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
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setChatInput(transcript);
          sendMessage(transcript);
        }
      };
      
      recognitionInstance.onend = () => {
        // Only restart if we're still in listening mode
        if (isListening) {
          try {
            recognitionInstance.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (isListening && event.error !== 'aborted') {
          // If there's an error, try to restart after a delay
          setTimeout(() => {
            try {
              recognitionInstance.start();
            } catch (e) {
              console.error('Error restarting after error:', e);
            }
          }, 1000);
        }
      };
      
      setRecognition(recognitionInstance);
      
      // Cleanup function
      return () => {
        if (recognitionInstance) {
          recognitionInstance.stop();
        }
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, [isListening]);

  const startVoiceInput = () => {
    if (!recognition) {
      console.error('Speech recognition not initialized');
      return;
    }
    
    try {
      if (!isListening) {
        setIsListening(true);
        setIsChatOpen(true);
        recognition.start();
        console.log('Voice recognition started');
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      } finally {
        setIsListening(false);
      }
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
                        handleSendMessage(e);
                      }
                    }}
                    className="flex-1 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  
                  <Button
                    onClick={handleSendMessage}
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
