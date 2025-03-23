
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { Compass, MapPin, Lock, Map, Fingerprint, ChevronDown, Check } from 'lucide-react';
import locationService, { LocationService } from '../services/LocationService';
import biometricService from '../services/BiometricService';

const LocationTracker: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const mapRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    const locationListener = (newLocation: { latitude: number; longitude: number }) => {
      setLocation(newLocation);
      updateMapLocation(newLocation);
    };
    
    if (isTracking) {
      locationService.addLocationListener(locationListener);
      
      // Start tracking
      locationService.startTracking().catch(error => {
        console.error("Failed to get location:", error);
        toast.error("Failed to access your location. Please check your permissions.");
        setIsTracking(false);
      });
      
      // For demo purposes, simulate movement
      if (import.meta.env.DEV) {
        locationService.simulateMovement();
      }
    }
    
    return () => {
      locationService.removeLocationListener(locationListener);
      if (isTracking) {
        locationService.stopTracking();
      }
    };
  }, [isTracking]);
  
  const toggleTracking = async () => {
    if (!authenticated) {
      setShowBiometricAuth(true);
      return;
    }
    
    if (!isTracking) {
      setIsTracking(true);
      toast.success("Location tracking started");
    } else {
      locationService.stopTracking();
      setIsTracking(false);
      toast.info("Location tracking stopped");
    }
  };
  
  const handleBiometricAuth = async () => {
    try {
      const result = await biometricService.authenticate({
        promptTitle: "Authenticate for Location Access",
        promptSubtitle: "For your security, please verify your identity to enable location tracking.",
        onError: (error) => {
          console.error("Biometric error:", error);
          toast.error("Authentication failed. Please try again.");
        }
      });
      
      if (result.success) {
        setAuthenticated(true);
        setShowBiometricAuth(false);
        toast.success(`Authentication successful using ${result.authenticatedWith}`);
        
        // Auto-start tracking after successful authentication
        setIsTracking(true);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setShowBiometricAuth(false);
      toast.error("Authentication failed or was cancelled");
    }
  };
  
  const updateMapLocation = (newLocation: { latitude: number; longitude: number }) => {
    if (!mapRef.current) return;
    
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804!2d${newLocation.longitude}!3d${newLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sin!4v1742718512508!5m2!1sen!2sin`;
    mapRef.current.src = mapUrl;
  };
  
  // Generate a static map URL based on Birla Institute location (or current location if available)
  const getDefaultMapUrl = () => {
    const birlaLat = 17.5467004;
    const birlaLng = 78.5761233;
    
    if (location) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804!2d${location.longitude}!3d${location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sin!4v1742718512508!5m2!1sen!2sin`;
    }
    
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60866.85123438291!2d78.5761233!3d17.5467004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb83594a86132d%3A0xc3e06e9e76cebf3d!2sBirla%20Institute%20of%20Technology%20%26%20Science%20Pilani%2C%20Hyderabad%20Campus!5e0!3m2!1sen!2sin!4v1742718512508!5m2!1sen!2sin";
  };
  
  return (
    <div id="location-tracker" className="py-10">
      <div className="section-container">
        <div className="text-center mb-12 opacity-0 animate-fade-in">
          <h2 className="section-title">Real-Time Location Tracking</h2>
          <p className="section-subtitle mx-auto">
            Secure biometric authentication and precise GPS tracking for emergency response.
          </p>
        </div>
        
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isTracking ? 'bg-emergency animate-pulse' : 'bg-muted'}`}>
                  <Compass className={isTracking ? 'text-white' : 'text-muted-foreground'} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Location Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {isTracking 
                      ? 'Actively tracking your location' 
                      : authenticated 
                        ? 'Ready to track - Authenticated'
                        : 'Authentication required'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={toggleTracking}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  isTracking 
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                    : 'bg-emergency text-white hover:bg-emergency-dark'
                }`}
              >
                {authenticated ? (
                  <>
                    {isTracking ? (
                      <>Stop Tracking</>
                    ) : (
                      <>Start Tracking</>
                    )}
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Authenticate
                  </>
                )}
              </button>
            </div>
          </div>
          
          {location && (
            <div className="p-6 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-emergency" size={18} />
                  <span className="font-mono text-sm">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Updated {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
          
          <div className={`relative overflow-hidden transition-all ${mapExpanded ? 'h-[450px]' : 'h-[250px]'}`}>
            <iframe
              ref={mapRef}
              src={getDefaultMapUrl()}
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <button 
              onClick={() => setMapExpanded(!mapExpanded)}
              className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 z-10"
            >
              <ChevronDown className={`transition-transform ${mapExpanded ? 'rotate-180' : ''}`} size={18} />
            </button>
          </div>
          
          <div className="p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isTracking ? 'Live tracking enabled' : 'Static map view'}
                </span>
              </div>
              
              {authenticated && (
                <div className="flex items-center gap-2">
                  <Fingerprint size={16} className="text-emerald-500" />
                  <span className="text-sm text-emerald-500">Biometrically verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="glass-card p-4 rounded-xl">
            <h4 className="font-semibold mb-2">Privacy Focused</h4>
            <p className="text-sm text-muted-foreground">
              Your location data is only shared during emergencies and requires biometric authentication.
            </p>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <h4 className="font-semibold mb-2">High Precision</h4>
            <p className="text-sm text-muted-foreground">
              GPS tracking with up to 5-meter accuracy for precise emergency response coordination.
            </p>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <h4 className="font-semibold mb-2">Emergency Ready</h4>
            <p className="text-sm text-muted-foreground">
              Location data is instantly available to emergency services when an alert is triggered.
            </p>
          </div>
        </div>
        
        {/* Biometric Authentication Dialog */}
        {showBiometricAuth && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-2">Authenticate for Location Access</h2>
              <p className="text-muted-foreground mb-6">For your security, verify your identity to enable location tracking.</p>
              
              <div className="flex flex-col gap-3 mb-6">
                {biometricService.getSupportedMethods().map((method, index) => (
                  <button 
                    key={index}
                    className="px-4 py-3 border rounded-lg hover:bg-primary/10 flex items-center gap-3"
                    onClick={handleBiometricAuth}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {method === 'fingerprint' && <Fingerprint size={20} />}
                      {method === 'face' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="9" cy="9" r="1"/>
                          <circle cx="15" cy="9" r="1"/>
                          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        </svg>
                      )}
                      {method === 'iris' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="4"/>
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{method.charAt(0).toUpperCase() + method.slice(1)} Recognition</span>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 border rounded-md hover:bg-muted"
                  onClick={() => setShowBiometricAuth(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTracker;
