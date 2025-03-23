
// This service would normally interact with a speech recognition API
// For this demo, we're simulating the functionality

interface KeywordDetectionOptions {
  onKeywordDetected?: (keyword: string, language: string) => void;
  onListening?: () => void;
  onError?: (error: string) => void;
}

interface Keyword {
  text: string;
  language: string;
}

class KeywordService {
  private keywords: Keyword[] = [];
  private isListening: boolean = false;
  private simulatedRecognitionTimer: number | null = null;
  
  constructor() {
    // Initialize with default keywords
    this.addDefaultKeywords();
  }
  
  private addDefaultKeywords() {
    const defaultKeywords: Record<string, string[]> = {
      en: ['help', 'emergency', 'sos', 'danger'],
      es: ['ayuda', 'emergencia', 'socorro', 'peligro'],
      fr: ['aide', 'urgence', 'secours', 'danger'],
      // Add more languages as needed
    };
    
    Object.entries(defaultKeywords).forEach(([language, words]) => {
      words.forEach(text => {
        this.keywords.push({ text, language });
      });
    });
  }
  
  public addKeyword(text: string, language: string): void {
    // Check if the keyword already exists
    const exists = this.keywords.some(
      k => k.language === language && k.text.toLowerCase() === text.toLowerCase()
    );
    
    if (!exists) {
      this.keywords.push({ text, language });
      console.log(`Added keyword: ${text} (${language})`);
    }
  }
  
  public removeKeyword(text: string, language: string): void {
    this.keywords = this.keywords.filter(
      k => !(k.language === language && k.text.toLowerCase() === text.toLowerCase())
    );
  }
  
  public getAllKeywords(): Keyword[] {
    return [...this.keywords];
  }
  
  public getKeywordsByLanguage(language: string): Keyword[] {
    return this.keywords.filter(k => k.language === language);
  }
  
  public startListening(options: KeywordDetectionOptions = {}): void {
    if (this.isListening) {
      return;
    }
    
    this.isListening = true;
    
    if (options.onListening) {
      options.onListening();
    }
    
    console.log("Started listening for emergency keywords");
    
    // Simulate speech recognition (in a real app, this would use the Web Speech API or a cloud service)
    this.simulatedRecognitionTimer = window.setTimeout(() => {
      // Randomly select a keyword to simulate detection
      if (this.keywords.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.keywords.length);
        const detectedKeyword = this.keywords[randomIndex];
        
        if (options.onKeywordDetected) {
          options.onKeywordDetected(detectedKeyword.text, detectedKeyword.language);
        }
        
        console.log(`Detected keyword: ${detectedKeyword.text} (${detectedKeyword.language})`);
      }
      
      this.isListening = false;
    }, 3000);
  }
  
  public stopListening(): void {
    if (!this.isListening) {
      return;
    }
    
    if (this.simulatedRecognitionTimer !== null) {
      clearTimeout(this.simulatedRecognitionTimer);
      this.simulatedRecognitionTimer = null;
    }
    
    this.isListening = false;
    console.log("Stopped listening for emergency keywords");
  }
  
  public isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

// Export as singleton instance
export const keywordService = new KeywordService();
export default keywordService;
