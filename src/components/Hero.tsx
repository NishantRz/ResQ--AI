
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Shield, Activity, Smartphone } from 'lucide-react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;
    
    const animateHero = () => {
      const elements = heroElement.querySelectorAll('.animate-on-load');
      elements.forEach((el, index) => {
        setTimeout(() => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'translateY(0)';
        }, 100 * index);
      });
    };
    
    animateHero();
  }, []);
  
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center" ref={heroRef}>
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-emergency/10 text-emergency animate-on-load opacity-0 transform translate-y-4 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
              <Activity size={16} className="mr-2" />
              <span className="text-sm font-medium">AI-Powered Emergency Response</span>
            </div>
            
            <h1 className="animate-on-load opacity-0 transform translate-y-4 transition-all duration-500 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ transitionDelay: '200ms' }}>
              Swift Response.<br />
              <span className="text-emergency">Saving Lives</span> With AI.
            </h1>
            
            <p className="animate-on-load opacity-0 transform translate-y-4 transition-all duration-500 text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl" style={{ transitionDelay: '300ms' }}>
              ResQ-AI combines cutting-edge artificial intelligence with emergency response systems to provide immediate assistance during critical situations.
            </p>
            
            <div className="animate-on-load opacity-0 transform translate-y-4 transition-all duration-500 flex flex-wrap gap-4" style={{ transitionDelay: '400ms' }}>
              <a href="#features" className="button-emergency">
                Explore Features
                <ArrowRight size={18} className="ml-2 inline" />
              </a>
              
              <a href="#dashboard" className="button-outline">
                View Dashboard Demo
              </a>
            </div>
            
            <div className="animate-on-load opacity-0 transform translate-y-4 transition-all duration-500 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ transitionDelay: '500ms' }}>
              <div className="flex items-center">
                <Shield className="text-emergency mr-2" size={20} />
                <span className="text-sm">Advanced Security</span>
              </div>
              
              <div className="flex items-center">
                <Activity className="text-emergency mr-2" size={20} />
                <span className="text-sm">Real-time Response</span>
              </div>
              
              <div className="flex items-center">
                <Smartphone className="text-emergency mr-2" size={20} />
                <span className="text-sm">Multi-platform</span>
              </div>
            </div>
          </div>
          
          <div className="animate-on-load opacity-0 transform translate-y-4 transition-all duration-500 relative" style={{ transitionDelay: '600ms' }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-emergency/5 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-emergency/10 rounded-full filter blur-3xl"></div>
              
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <div className="bg-emergency px-4 py-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium mx-auto">Emergency Response Console</div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">Active Emergency</h3>
                      <p className="text-sm text-muted-foreground">Response time: 3m 24s</p>
                    </div>
                    <div className="animate-pulse-emergency h-4 w-4 rounded-full bg-emergency"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-emergency mr-2"></div>
                        <div className="text-sm font-medium">Medical Assistance</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Priority: Critical</div>
                    </div>
                    
                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <div className="text-sm font-medium">Location Data</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Latitude: 37.7749, Longitude: -122.4194</div>
                    </div>
                    
                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm font-medium">Responders Status</div>
                      </div>
                      <div className="text-xs text-muted-foreground">2 units dispatched (ETA: 5 minutes)</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="text-sm font-medium mb-2">Voice Commands Active</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">Help</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">Emergency</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">SOS</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">+2 more</span>
                    </div>
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

export default Hero;
