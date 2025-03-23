import React, { useState, useEffect, useRef } from 'react';
import { Phone, Plus, Mic, UserPlus, Trash2, Save, Share2, Copy, Check } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'John Doe', phone: '(555) 123-4567', relation: 'Family' },
    { id: '2', name: 'Sarah Johnson', phone: '(555) 987-6543', relation: 'Friend' }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const contactsRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  // Mock speech recognition
  useEffect(() => {
    if (isRecording) {
      // Simulate speech recognition with a timeout
      const timer = setTimeout(() => {
        const mockRecognizedTexts = [
          "Add Jane Smith as emergency contact, phone number 555-222-3333, relation colleague",
          "Add Michael Brown, phone 555-444-5555, family member",
          "New emergency contact David Wilson 555-666-7777 neighbor"
        ];
        
        const randomText = mockRecognizedTexts[Math.floor(Math.random() * mockRecognizedTexts.length)];
        setRecordingText(randomText);
        setIsRecording(false);
        
        // Parse the text to extract contact info
        setTimeout(() => {
          parseVoiceCommand(randomText);
        }, 500);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isRecording]);
  
  // Animate elements when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (contactsRef.current) {
      observer.observe(contactsRef.current);
    }
    
    const elements = document.querySelectorAll('.contact-animate');
    elements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      elements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  const startRecording = () => {
    toast.info("Voice recognition activated", {
      description: "Listening for emergency contact details...",
      duration: 3000,
    });
    setIsRecording(true);
    setRecordingText('Listening...');
  };
  
  const parseVoiceCommand = (text: string) => {
    // Very basic parsing logic - in a real app, you'd use NLP or a more robust parsing method
    
    // Extract name (assume it's after "Add" and before "as" or "phone" or "," or other markers)
    let name = '';
    let phone = '';
    let relation = '';
    
    if (text.toLowerCase().includes('add')) {
      const afterAdd = text.substring(text.toLowerCase().indexOf('add') + 4);
      
      // Try to extract name
      let nameEndIndex = -1;
      if (afterAdd.includes(' as ')) nameEndIndex = afterAdd.indexOf(' as ');
      else if (afterAdd.includes(', phone')) nameEndIndex = afterAdd.indexOf(', phone');
      else if (afterAdd.includes(' phone ')) nameEndIndex = afterAdd.indexOf(' phone ');
      
      if (nameEndIndex > 0) {
        name = afterAdd.substring(0, nameEndIndex).trim();
      } else if (afterAdd.includes('emergency contact')) {
        name = afterAdd.substring(0, afterAdd.indexOf('emergency contact')).trim();
      }
      
      // Try to extract phone number using regex
      const phoneRegex = /(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})/g;
      const phoneMatches = text.match(phoneRegex);
      if (phoneMatches && phoneMatches.length > 0) {
        phone = phoneMatches[0];
      }
      
      // Try to extract relation
      const relationKeywords = ['family', 'friend', 'colleague', 'neighbor', 'relative', 'spouse', 'partner', 'doctor'];
      for (const keyword of relationKeywords) {
        if (text.toLowerCase().includes(keyword)) {
          relation = keyword.charAt(0).toUpperCase() + keyword.slice(1);
          break;
        }
      }
      
      // If we have at least a name and phone, add the contact
      if (name && phone) {
        addContactFromVoice(name, phone, relation || 'Other');
      } else {
        toast.error("Couldn't extract all contact details", {
          description: "Please try again or use the form",
          duration: 5000,
        });
      }
    }
  };
  
  const addContactFromVoice = (name: string, phone: string, relation: string) => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name,
      phone,
      relation
    };
    
    setContacts(prev => [...prev, newContact]);
    
    toast.success("Emergency contact added", {
      description: `Added ${name} as a ${relation.toLowerCase()}`,
      duration: 5000,
    });
  };
  
  const addContact = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const relation = formData.get('relation') as string;
    
    if (!name || !phone) {
      toast.error("Missing required fields", {
        description: "Name and phone number are required",
        duration: 5000,
      });
      return;
    }
    
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name,
      phone,
      relation: relation || 'Other'
    };
    
    setContacts(prev => [...prev, newContact]);
    
    toast.success("Emergency contact added", {
      description: `Added ${name} as a ${relation.toLowerCase() || 'contact'}`,
      duration: 5000,
    });
    
    // Reset form
    (event.target as HTMLFormElement).reset();
  };
  
  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    
    toast.success("Contact removed", {
      duration: 3000,
    });
  };
  
  const generateShareableLink = () => {
    // In a real app, this would generate a temporary link with a unique ID
    // For this demo, we'll create a fake URL with the selected contact IDs encoded
    const selectedContacts = contacts.filter(c => selectedContactIds.includes(c.id));
    const contactData = JSON.stringify(selectedContacts);
    const encodedData = btoa(contactData); // Base64 encode the contact data
    const link = `https://resq-ai.example.com/share/${encodedData}`;
    setShareableLink(link);
  };
  
  const toggleContactSelection = (id: string) => {
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds(prev => prev.filter(contactId => contactId !== id));
    } else {
      setSelectedContactIds(prev => [...prev, id]);
    }
  };
  
  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success("Link copied to clipboard");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error("Failed to copy link");
      });
  };
  
  const importContacts = () => {
    // In a real app, this would parse the incoming shared contacts
    // For this demo, we'll generate some mock imported contacts
    const mockImportedContacts: EmergencyContact[] = [
      { id: 'import-1', name: 'Robert Johnson', phone: '(555) 888-9999', relation: 'Family' },
      { id: 'import-2', name: 'Emma Thompson', phone: '(555) 777-6666', relation: 'Colleague' }
    ];
    
    setContacts(prev => [...prev, ...mockImportedContacts]);
    
    toast.success("Contacts imported successfully", {
      description: `Imported ${mockImportedContacts.length} emergency contacts`,
      duration: 5000,
    });
  };
  
  return (
    <div id="emergency-contacts" className="py-20 bg-secondary/50 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-16 contact-animate opacity-0">
          <h2 className="section-title">Emergency Contacts</h2>
          <p className="section-subtitle mx-auto">
            Add and manage your emergency contacts for fast response during emergencies.
          </p>
        </div>
        
        <div ref={contactsRef} className="glass-card rounded-xl shadow-xl overflow-hidden opacity-0">
          <div className="bg-primary/10 dark:bg-primary/5 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-emergency rounded-lg flex items-center justify-center">
                <Phone className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold">Your Emergency Contacts</h3>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center text-emergency"
                onClick={startRecording}
                disabled={isRecording}
              >
                <Mic size={16} className="mr-1" />
                {isRecording ? "Listening..." : "Add by Voice"}
              </Button>
              
              <Dialog open={isSharing} onOpenChange={setIsSharing}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => {
                      setSelectedContactIds([]);
                      setIsSharing(true);
                    }}
                  >
                    <Share2 size={16} className="mr-1" />
                    Share Contacts
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Emergency Contacts</DialogTitle>
                    <DialogDescription>
                      Select contacts to share with family members or emergency services.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {contacts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No contacts to share</p>
                      ) : (
                        contacts.map(contact => (
                          <div 
                            key={contact.id}
                            className={`p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-secondary/20 ${
                              selectedContactIds.includes(contact.id) ? 'bg-secondary/30' : ''
                            }`}
                            onClick={() => toggleContactSelection(contact.id)}
                          >
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            </div>
                            <div className={`h-5 w-5 rounded-full border ${
                              selectedContactIds.includes(contact.id) 
                                ? 'bg-primary border-primary' 
                                : 'border-input'
                            }`}>
                              {selectedContactIds.includes(contact.id) && (
                                <Check size={16} className="text-primary-foreground" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {shareableLink ? (
                      <div className="mt-4">
                        <label className="text-sm font-medium">Shareable Link</label>
                        <div className="flex mt-1.5">
                          <Input 
                            value={shareableLink} 
                            readOnly 
                            className="flex-1 bg-secondary/10"
                          />
                          <Button
                            className="ml-2 px-3"
                            onClick={copyShareableLink}
                            variant="outline"
                          >
                            {isCopied ? <Check size={16} /> : <Copy size={16} />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          This link will allow recipients to import these contacts.
                        </p>
                      </div>
                    ) : (
                      <Button
                        className="w-full mt-4"
                        onClick={generateShareableLink}
                        disabled={selectedContactIds.length === 0}
                      >
                        Generate Shareable Link
                      </Button>
                    )}
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsSharing(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Import Contacts
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Emergency Contacts</DialogTitle>
                    <DialogDescription>
                      Import contacts shared by others or from other services.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Paste Shareable Link</label>
                        <Input 
                          placeholder="https://resq-ai.example.com/share/..." 
                          className="mt-1.5"
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Or import demo contacts to see how it works:
                      </p>
                      
                      <Button 
                        className="w-full" 
                        onClick={importContacts}
                      >
                        Import Demo Contacts
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {isRecording && (
            <div className="p-4 bg-emergency/10 border-b border-border text-center">
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emergency animate-pulse mr-2"></div>
                <p className="text-emergency font-medium">{recordingText}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="p-6">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <UserPlus size={20} className="text-emergency mr-2" />
                Add New Contact
              </h4>
              
              <form onSubmit={addContact} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input id="name" name="name" placeholder="Full Name" required />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input id="phone" name="phone" placeholder="(555) 123-4567" required />
                </div>
                
                <div>
                  <label htmlFor="relation" className="block text-sm font-medium mb-1">Relationship</label>
                  <select 
                    id="relation" 
                    name="relation" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full bg-emergency hover:bg-emergency/90">
                  <Plus size={16} className="mr-1" />
                  Add Contact
                </Button>
              </form>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2">Use voice commands like:</p>
                <ul className="space-y-1 list-disc pl-5">
                  <li>"Add [name] as emergency contact, phone [number], relation [relationship]"</li>
                  <li>"Add [name], phone [number], [relationship]"</li>
                </ul>
              </div>
            </div>
            
            <div className="col-span-2 p-6">
              <h4 className="text-lg font-medium mb-4">Your Contacts</h4>
              
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No emergency contacts added yet</p>
                  <p className="text-sm mt-1">Add contacts using the form or voice command</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="glass-card rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <h5 className="font-medium">{contact.name}</h5>
                          <div className="flex flex-col mt-1">
                            <span className="text-sm text-muted-foreground">{contact.phone}</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {contact.relation || 'Other'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/30"
                            onClick={() => deleteContact(contact.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Save className="text-blue-500" size={18} />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium">Your contacts are saved locally</h5>
                    <p className="text-sm text-muted-foreground">
                      In a real application, these would be securely stored in a database
                      and accessible during emergencies.
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

export default EmergencyContacts;
