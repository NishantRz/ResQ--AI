
import React, { useState, useEffect, useRef } from 'react';
import { Languages, Settings, Plus, Save, Trash2, Globe2 } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

// Supported languages with their codes
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
];

// Default emergency keywords for each language
const DEFAULT_KEYWORDS: Record<string, string[]> = {
  en: ['help', 'emergency', 'sos', 'danger'],
  es: ['ayuda', 'emergencia', 'socorro', 'peligro'],
  fr: ['aide', 'urgence', 'secours', 'danger'],
  de: ['hilfe', 'notfall', 'gefahr', 'rettung'],
  zh: ['救命', '紧急情况', '危险', '帮助'],
  ar: ['مساعدة', 'طوارئ', 'خطر', 'نجدة'],
  ru: ['помощь', 'экстренная', 'опасность', 'спасите'],
  ja: ['助けて', '緊急', '危険', 'SOS'],
  hi: ['मदद', 'आपात', 'खतरा', 'बचाओ'],
  pt: ['ajuda', 'emergência', 'socorro', 'perigo'],
};

interface Keyword {
  id: string;
  text: string;
  language: string;
  isDefault?: boolean;
}

const CustomKeywords: React.FC = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [newKeyword, setNewKeyword] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const [recognizedKeyword, setRecognizedKeyword] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const keywordsRef = useRef<HTMLDivElement>(null);
  
  // Initialize with default keywords
  useEffect(() => {
    const initialKeywords: Keyword[] = [];
    
    Object.entries(DEFAULT_KEYWORDS).forEach(([lang, words]) => {
      words.forEach((word, index) => {
        initialKeywords.push({
          id: `${lang}-${index}`,
          text: word,
          language: lang,
          isDefault: true
        });
      });
    });
    
    setKeywords(initialKeywords);
  }, []);
  
  // Animation for elements when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (keywordsRef.current) {
      observer.observe(keywordsRef.current);
    }
    
    return () => {
      if (keywordsRef.current) {
        observer.unobserve(keywordsRef.current);
      }
    };
  }, []);
  
  const addKeyword = () => {
    if (!newKeyword.trim()) {
      toast.error("Keyword cannot be empty");
      return;
    }
    
    // Check if keyword already exists in this language
    const exists = keywords.some(k => 
      k.language === selectedLanguage && 
      k.text.toLowerCase() === newKeyword.toLowerCase()
    );
    
    if (exists) {
      toast.error("This keyword already exists for the selected language");
      return;
    }
    
    const newKeywordObj: Keyword = {
      id: `custom-${Date.now()}`,
      text: newKeyword.trim(),
      language: selectedLanguage
    };
    
    setKeywords([...keywords, newKeywordObj]);
    setNewKeyword('');
    
    toast.success(`Added keyword "${newKeyword}" for ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}`);
  };
  
  const deleteKeyword = (id: string) => {
    const keywordToDelete = keywords.find(k => k.id === id);
    
    if (keywordToDelete?.isDefault) {
      toast.error("Cannot delete default keywords", {
        description: "You can add custom keywords but default ones cannot be removed"
      });
      return;
    }
    
    setKeywords(keywords.filter(k => k.id !== id));
    toast.success("Keyword removed");
  };
  
  const startTestMode = () => {
    setIsTestMode(true);
    setIsRecognizing(true);
    setRecognizedKeyword('');
    
    toast.info("Listening for emergency keywords", {
      description: "Speak a keyword in any supported language",
      duration: 5000
    });
    
    // Simulate voice recognition after a delay
    setTimeout(() => {
      const allPossibleKeywords = keywords.map(k => k.text);
      const randomKeyword = allPossibleKeywords[Math.floor(Math.random() * allPossibleKeywords.length)];
      
      setRecognizedKeyword(randomKeyword);
      setIsRecognizing(false);
      
      // Get language of the recognized keyword
      const keywordLang = keywords.find(k => k.text === randomKeyword)?.language || 'unknown';
      const langName = SUPPORTED_LANGUAGES.find(l => l.code === keywordLang)?.name || 'Unknown';
      
      toast.success(`Emergency keyword detected: "${randomKeyword}"`, {
        description: `Language: ${langName}`,
        duration: 5000
      });
    }, 3000);
  };
  
  const stopTestMode = () => {
    setIsTestMode(false);
    setIsRecognizing(false);
    setRecognizedKeyword('');
  };
  
  const filteredKeywords = keywords.filter(k => k.language === selectedLanguage);
  
  return (
    <div id="custom-keywords" className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="section-title">Emergency Keywords</h2>
          <p className="section-subtitle mx-auto">
            Customize emergency keywords in multiple languages for voice recognition.
          </p>
        </div>
        
        <div 
          ref={keywordsRef}
          className="max-w-4xl mx-auto glass-card rounded-xl shadow-xl overflow-hidden opacity-0"
        >
          <div className="bg-primary/10 dark:bg-primary/5 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Languages className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold">Multilingual Keywords</h3>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isTestMode && (
            <div className="p-4 bg-blue-500/10 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isRecognizing ? (
                    <>
                      <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                      <p className="text-blue-500 font-medium">Listening for emergency keywords...</p>
                    </>
                  ) : (
                    <>
                      {recognizedKeyword && (
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 mr-2">
                            Detected
                          </Badge>
                          <p className="font-medium">{recognizedKeyword}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={stopTestMode}>
                  Exit Test Mode
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="p-6">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <Plus size={20} className="text-blue-500 mr-2" />
                Add Custom Keyword
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyword">Keyword</Label>
                  <div className="flex mt-1.5">
                    <Input 
                      id="keyword" 
                      value={newKeyword} 
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter emergency keyword"
                      className="flex-1 mr-2"
                    />
                    <Button 
                      onClick={addKeyword}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500"
                    onClick={startTestMode}
                    disabled={isTestMode}
                  >
                    Test Voice Recognition
                  </Button>
                </div>
                
                <div className="bg-secondary/20 rounded-lg p-3 mt-4">
                  <div className="flex items-center mb-2">
                    <Globe2 size={16} className="mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Language Support</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keywords in all supported languages are constantly monitored during an emergency session.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-span-2 p-6">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <Settings size={20} className="text-blue-500 mr-2" />
                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name} Keywords
              </h4>
              
              {filteredKeywords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No keywords for this language</p>
                  <p className="text-sm mt-1">Add keywords using the form</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredKeywords.map((keyword) => (
                    <Card key={keyword.id} className="group hover:bg-secondary/10 transition-colors">
                      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base font-medium">{keyword.text}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteKeyword(keyword.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </CardHeader>
                      <CardFooter className="py-2 px-4 text-xs text-muted-foreground border-t">
                        {keyword.isDefault ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Default</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Custom</Badge>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-amber-500/10 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Save className="text-amber-500" size={18} />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium">Your keywords are stored locally</h5>
                    <p className="text-sm text-muted-foreground">
                      In a production environment, these would be stored in a database and processed by a 
                      multilingual speech recognition service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomKeywords;
