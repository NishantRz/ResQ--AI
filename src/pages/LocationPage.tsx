
import React, { useState } from 'react';
import { toast } from "sonner";
import { Shield, MapPin, Share2, Users, Fingerprint } from 'lucide-react';
import Header from '../components/Header';
import LocationTracker from '../components/LocationTracker';
import Footer from '../components/Footer';

const LocationPage: React.FC = () => {
  const [contactsToShare, setContactsToShare] = useState<string[]>([]);
  const [locationSharingActive, setLocationSharingActive] = useState(false);
  
  const emergencyContacts = [
    { id: '1', name: 'John Smith', relation: 'Family', phone: '+1-555-123-4567' },
    { id: '2', name: 'Sarah Johnson', relation: 'Friend', phone: '+1-555-234-5678' },
    { id: '3', name: 'Emergency Services', relation: 'Service', phone: '911' },
  ];
  
  const toggleContactShare = (id: string) => {
    if (contactsToShare.includes(id)) {
      setContactsToShare(contactsToShare.filter(contactId => contactId !== id));
    } else {
      setContactsToShare([...contactsToShare, id]);
    }
  };
  
  const startLocationSharing = () => {
    if (contactsToShare.length === 0) {
      toast.error("Please select at least one contact to share your location with");
      return;
    }
    
    const selectedContacts = emergencyContacts.filter(contact => 
      contactsToShare.includes(contact.id)
    );
    
    const contactNames = selectedContacts.map(contact => contact.name).join(', ');
    
    toast.success(`Location sharing started with ${contactNames}`);
    setLocationSharingActive(true);
  };
  
  const stopLocationSharing = () => {
    toast.info("Location sharing stopped");
    setLocationSharingActive(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-10 bg-gradient-to-b from-background to-secondary/10">
          <div className="section-container">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Location Tracking & Sharing</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Securely track your location and share it with trusted contacts during emergencies.
              </p>
            </div>
          </div>
        </div>
        
        <LocationTracker />
        
        <div className="py-12 bg-muted/30">
          <div className="section-container">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Location Sharing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Share your real-time location with emergency contacts when needed.
              </p>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${locationSharingActive ? 'bg-emergency animate-pulse' : 'bg-muted'}`}>
                      <Share2 className={locationSharingActive ? 'text-white' : 'text-muted-foreground'} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Location Sharing</h3>
                      <p className="text-sm text-muted-foreground">
                        {locationSharingActive 
                          ? `Sharing with ${contactsToShare.length} contacts` 
                          : 'Select contacts to share your location'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={locationSharingActive ? stopLocationSharing : startLocationSharing}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                      locationSharingActive 
                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                        : 'bg-emergency text-white hover:bg-emergency-dark'
                    }`}
                    disabled={!locationSharingActive && contactsToShare.length === 0}
                  >
                    {locationSharingActive ? 'Stop Sharing' : 'Start Sharing'}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Users size={16} />
                  Select Emergency Contacts
                </h4>
                
                <div className="space-y-3">
                  {emergencyContacts.map(contact => (
                    <div 
                      key={contact.id}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                        contactsToShare.includes(contact.id) ? 'bg-primary/10 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-medium">{contact.name}</h5>
                          <p className="text-xs text-muted-foreground">{contact.relation} • {contact.phone}</p>
                        </div>
                      </div>
                      
                      <button 
                        className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                          contactsToShare.includes(contact.id) 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-muted-foreground'
                        }`}
                        onClick={() => toggleContactShare(contact.id)}
                      >
                        {contactsToShare.includes(contact.id) && <Check size={12} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 border-t">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Fingerprint size={14} />
                    <span>Biometrically secured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>Real-time updates</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    <span>End-to-end encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
