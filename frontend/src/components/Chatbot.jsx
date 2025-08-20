import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, HelpCircle } from "lucide-react";

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

  const sendMessage = async (voiceInput) => {
    const messageText = voiceInput || chatInput;
    if (!messageText.trim()) return;
    
    const newMessage = { id: Date.now(), text: messageText, isBot: false };
    setChatMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
    
    try {
      // If getBotResponse is provided, use it (for backward compatibility)
      if (getBotResponse) {
        const response = getBotResponse(messageText);
        const botResponse = { id: Date.now() + 1, text: response, isBot: true };
        setChatMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        if (voiceInput || speakReplies) {
          await playVoiceFromText(botResponse.text);
        }
      } else {
        // Use backend API
        const res = await fetch('/api/chat/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: messageText, 
            context, 
            infoText,
            fields // Include fields metadata
          }),
        });
        const data = await res.json();
        if (data?.fieldsPatch && typeof onFieldsPatch === 'function') {
          onFieldsPatch(data.fieldsPatch);
        }
        const botResponse = { id: Date.now() + 1, text: data?.reply || '...', isBot: true };
        setChatMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        if (voiceInput || speakReplies) {
          await playVoiceFromText(botResponse.text);
        }
      }
    } catch (e) {
      console.error('Chat error:', e);
      const botResponse = { id: Date.now() + 1, text: 'Sorry, I had trouble responding.', isBot: true };
      setChatMessages((prev) => [...prev, botResponse]);
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
            <MessageCircle className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
            {isListening && (
              <div className="absolute inset-0 bg-red-500/30 animate-pulse rounded-full ring-4 ring-red-400/50" />
            )}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
          </Button>
        ) : (
          <Card className="w-96 h-[500px] shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm">
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
            
            <div className="flex flex-col h-[calc(550px-120px)]">
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
