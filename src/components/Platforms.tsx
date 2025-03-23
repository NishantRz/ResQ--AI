
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const Platforms: React.FC = () => {
  const platformsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.platform-animate');
    elements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      elements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  const platforms = [
    {
      name: "WhatsApp",
      logo: "W",
      color: "#25D366",
      description: "Send emergency alerts and coordinate responses through WhatsApp.",
    },
    {
      name: "Telegram",
      logo: "T",
      color: "#0088cc",
      description: "Use Telegram bots for automated emergency notifications and updates.",
    },
    {
      name: "Discord",
      logo: "D",
      color: "#5865F2",
      description: "Coordinate emergency teams through dedicated Discord channels.",
    },
    {
      name: "Slack",
      logo: "S",
      color: "#4A154B",
      description: "Integrate with Slack for workplace emergency notifications.",
    },
    {
      name: "SMS",
      logo: "SMS",
      color: "#333333",
      description: "Send text message alerts to those without smartphone access.",
    },
    {
      name: "Signal",
      logo: "Si",
      color: "#3A76F0",
      description: "Secure, encrypted emergency communications via Signal.",
    },
  ];

  return (
    <div id="platforms" className="py-20" ref={platformsRef}>
      <div className="section-container">
        <div className="text-center mb-16 platform-animate opacity-0">
          <h2 className="section-title">Multi-Platform Integration</h2>
          <p className="section-subtitle mx-auto">
            ResQ-AI connects seamlessly with the platforms you already use, ensuring emergency response wherever you are.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <div 
              key={index} 
              className="platform-animate opacity-0 glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${100 * index}ms` }}
            >
              <div 
                className="h-2" 
                style={{ backgroundColor: platform.color }}
              ></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold mr-4"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.logo}
                  </div>
                  <h3 className="text-xl font-semibold">{platform.name}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{platform.description}</p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm font-medium hover:underline"
                  style={{ color: platform.color }}
                >
                  Learn more
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center platform-animate opacity-0">
          <h3 className="text-2xl font-semibold mb-6">API Integration Made Simple</h3>
          <div className="glass-card rounded-xl p-6 max-w-2xl mx-auto">
            <div className="p-4 bg-primary/5 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
              <pre>
{`// Simple API integration example
const sendEmergencyAlert = async (message, platforms) => {
  const response = await resqAI.alerts.send({
    message,
    platforms,  // ['whatsapp', 'telegram', 'sms']
    priority: 'high',
    coordinates: getCurrentLocation()
  });
  
  return response.status;
};`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              ResQ-AI provides a unified API for all platform integrations, making it simple to add emergency response capabilities to your applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platforms;
