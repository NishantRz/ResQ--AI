
import React, { useEffect, useRef } from 'react';
import { Mic, MapPin, Bell, Shield, Zap, Users, MessageSquare, Smartphone, Braces, Wifi } from 'lucide-react';

const Features: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const featureElements = document.querySelectorAll('.feature-card');
    featureElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      featureElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  const features = [
    {
      icon: <Mic className="text-emergency" size={24} />,
      title: "Voice Recognition",
      description: "Trigger emergency responses using customizable voice commands.",
    },
    {
      icon: <MapPin className="text-emergency" size={24} />,
      title: "Live GPS Tracking",
      description: "Real-time location tracking for immediate emergency response.",
    },
    {
      icon: <Bell className="text-emergency" size={24} />,
      title: "Alert Notifications",
      description: "Instant alerts through multiple platforms for immediate attention.",
    },
    {
      icon: <Shield className="text-emergency" size={24} />,
      title: "Biometric Authentication",
      description: "Secure access with fingerprint and facial recognition technology.",
    },
    {
      icon: <Zap className="text-emergency" size={24} />,
      title: "Rapid Response",
      description: "AI-powered response system for quick emergency handling.",
    },
    {
      icon: <Users className="text-emergency" size={24} />,
      title: "Crisis Coordination",
      description: "Collaborative dashboard for emergency management teams.",
    },
    {
      icon: <MessageSquare className="text-emergency" size={24} />,
      title: "Custom Commands",
      description: "Define personalized keywords to trigger specific actions.",
    },
    {
      icon: <Smartphone className="text-emergency" size={24} />,
      title: "Multi-Platform",
      description: "Seamless integration with messaging apps and emergency services.",
    },
    {
      icon: <Braces className="text-emergency" size={24} />,
      title: "API Integration",
      description: "Connect with Twilio, WhatsApp, and Telegram for broad reach.",
    },
    {
      icon: <Wifi className="text-emergency" size={24} />,
      title: "Offline Mode",
      description: "Core functionality available even without internet connection.",
    },
  ];

  return (
    <div id="features" className="py-20" ref={featuresRef}>
      <div className="section-container">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="section-title">Advanced Emergency Response Features</h2>
          <p className="section-subtitle mx-auto">
            ResQ-AI combines cutting-edge technology with intuitive design to provide a comprehensive emergency response solution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card glass-card p-6 rounded-xl opacity-0"
              style={{ animationDelay: `${100 * index}ms` }}
            >
              <div className="h-12 w-12 rounded-lg bg-emergency/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
