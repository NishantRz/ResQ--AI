
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, AlertCircle } from 'lucide-react';

const EmergencyTrigger: React.FC = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }
    
    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    let timer: number | undefined;
    
    if (isActivated && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setTimeout(() => {
        setIsActivated(false);
        setCountdown(5);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActivated, countdown]);
  
  const handleTrigger = () => {
    setIsActivated(true);
  };
  
  const handleCancel = () => {
    setIsActivated(false);
    setCountdown(5);
  };
  
  return (
    <div id="contact" className="py-20 bg-gradient-to-b from-background to-secondary/30 dark:to-secondary/10">
      <div className="section-container">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="section-title">Experience the Emergency Trigger</h2>
          <p className="section-subtitle mx-auto">
            Try our demo emergency trigger interface to see how ResQ-AI works in action.
          </p>
        </div>
        
        <div 
          ref={triggerRef}
          className="max-w-md mx-auto glass-card rounded-2xl p-8 opacity-0"
        >
          {!isActivated ? (
            <div className="text-center">
              <div className="mb-8">
                <div className="h-24 w-24 mx-auto rounded-full bg-emergency/10 flex items-center justify-center mb-4">
                  <Mic className="text-emergency" size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Voice Trigger</h3>
                <p className="text-sm text-muted-foreground">
                  Press and hold the button below and say "Help" or "Emergency" to activate.
                </p>
              </div>
              
              <button 
                className="h-20 w-20 mx-auto rounded-full bg-emergency flex items-center justify-center shadow-lg hover:bg-emergency-dark transition-colors active:scale-95 active:shadow-xl"
                onMouseDown={handleTrigger}
              >
                <span className="text-white font-medium">HOLD</span>
              </button>
              
              <div className="mt-8 text-sm text-muted-foreground">
                <p>Other voice commands:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-secondary">SOS</span>
                  <span className="px-3 py-1 rounded-full bg-secondary">Medical</span>
                  <span className="px-3 py-1 rounded-full bg-secondary">Alert</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="h-24 w-24 mx-auto rounded-full bg-emergency flex items-center justify-center mb-4 animate-pulse-emergency">
                  <AlertCircle className="text-white" size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Activated</h3>
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sending alert in <span className="text-emergency font-bold">{countdown}</span> seconds. Tap cancel to stop.
                  </p>
                ) : (
                  <p className="text-sm text-emergency font-medium">
                    Alert sent! Emergency services have been notified.
                  </p>
                )}
              </div>
              
              {countdown > 0 && (
                <button 
                  className="px-6 py-3 rounded-full border border-emergency text-emergency hover:bg-emergency/10 transition-colors"
                  onClick={handleCancel}
                >
                  <X size={18} className="inline mr-2" />
                  Cancel Emergency
                </button>
              )}
              
              <div className="mt-8 space-y-3">
                <div className="glass-card p-3 rounded-lg flex items-center justify-between">
                  <span className="text-sm">Location</span>
                  <span className="text-xs text-muted-foreground">37.7749° N, 122.4194° W</span>
                </div>
                <div className="glass-card p-3 rounded-lg flex items-center justify-between">
                  <span className="text-sm">Responders</span>
                  <span className="text-xs text-muted-foreground">Dispatching nearest unit</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyTrigger;
