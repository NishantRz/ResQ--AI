
import React, { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, AlertTriangle, Check, Clock, MapPin, Wifi, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.dashboard-animate');
    elements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      elements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  const responseData = [
    { time: '1:00', responseTime: 2.5 },
    { time: '2:00', responseTime: 3.1 },
    { time: '3:00', responseTime: 2.3 },
    { time: '4:00', responseTime: 4.2 },
    { time: '5:00', responseTime: 3.8 },
    { time: '6:00', responseTime: 2.9 },
    { time: '7:00', responseTime: 2.2 },
    { time: '8:00', responseTime: 1.9 },
  ];
  
  const emergencyTypes = [
    { type: 'Medical', count: 32, status: 'critical', icon: <AlertCircle size={16} /> },
    { type: 'Fire', count: 18, status: 'high', icon: <AlertTriangle size={16} /> },
    { type: 'Security', count: 24, status: 'medium', icon: <AlertTriangle size={16} /> },
    { type: 'Natural Disaster', count: 8, status: 'low', icon: <AlertTriangle size={16} /> },
  ];
  
  const activeResponders = [
    { name: 'Medical Team A', location: 'Downtown', status: 'active', response: '2 min' },
    { name: 'Fire Unit C', location: 'Westside', status: 'active', response: '4 min' },
    { name: 'Police Squad B', location: 'Northside', status: 'standby', response: '3 min' },
  ];

  return (
    <div id="dashboard" className="py-20 bg-secondary/50 dark:bg-secondary/10" ref={dashboardRef}>
      <div className="section-container">
        <div className="text-center mb-16 dashboard-animate opacity-0">
          <h2 className="section-title">Real-time Emergency Dashboard</h2>
          <p className="section-subtitle mx-auto">
            Monitor and coordinate emergency responses with our intuitive crisis management dashboard.
          </p>
        </div>
        
        <div className="glass-card rounded-xl shadow-xl overflow-hidden dashboard-animate opacity-0">
          <div className="bg-primary/10 dark:bg-primary/5 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-emergency rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h3 className="text-xl font-semibold">ResQ-AI Dashboard</h3>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
                <Wifi size={14} className="mr-1" />
                <span>Online</span>
              </div>
              <button className="text-sm px-3 py-1 rounded-full border border-input hover:bg-secondary transition-colors">Settings</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="p-6">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <AlertTriangle size={20} className="text-emergency mr-2" />
                Active Emergencies
              </h4>
              
              <div className="space-y-4">
                {emergencyTypes.map((emergency, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {emergency.icon}
                      <span className="ml-2 text-sm">{emergency.type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">{emergency.count}</span>
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          emergency.status === 'critical' ? 'bg-emergency animate-pulse' :
                          emergency.status === 'high' ? 'bg-orange-500' :
                          emergency.status === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <Clock size={20} className="text-emergency mr-2" />
                  Response Times
                </h4>
                
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.1} />
                      <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
                      <Line type="monotone" dataKey="responseTime" stroke="#FF3B30" strokeWidth={2} dot={{ fill: '#FF3B30', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <Users size={20} className="text-emergency mr-2" />
                Active Responders
              </h4>
              
              <div className="space-y-4">
                {activeResponders.map((responder, index) => (
                  <div key={index} className="glass-card rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{responder.name}</span>
                      <div 
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          responder.status === 'active' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}
                      >
                        {responder.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {responder.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        ETA: {responder.response}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-medium mb-4">Quick Actions</h4>
                
                <button className="w-full py-2 flex items-center justify-between px-4 rounded-lg bg-emergency/10 hover:bg-emergency/20 transition-colors">
                  <span className="text-emergency font-medium">Dispatch Medical Team</span>
                  <ArrowRight size={16} className="text-emergency" />
                </button>
                
                <button className="w-full py-2 flex items-center justify-between px-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                  <span className="text-blue-500 font-medium">Send Alert Notifications</span>
                  <ArrowRight size={16} className="text-blue-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <MapPin size={20} className="text-emergency mr-2" />
                Emergency Locations
              </h4>
              
              <div className="glass-card rounded-lg aspect-square overflow-hidden relative mb-6">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground">
                  Map View
                </div>
                
                <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                  12 Active Locations
                </div>
                
                <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-emergency animate-pulse"></div>
                <div className="absolute top-2/3 left-2/3 w-4 h-4 rounded-full bg-emergency animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
              </div>
              
              <h4 className="text-lg font-medium mb-4">System Status</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Voice Recognition</span>
                  <div className="flex items-center text-green-500">
                    <Check size={16} className="mr-1" />
                    <span>Operational</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>GPS Tracking</span>
                  <div className="flex items-center text-green-500">
                    <Check size={16} className="mr-1" />
                    <span>Operational</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Alert System</span>
                  <div className="flex items-center text-green-500">
                    <Check size={16} className="mr-1" />
                    <span>Operational</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>API Connections</span>
                  <div className="flex items-center text-yellow-500">
                    <AlertTriangle size={16} className="mr-1" />
                    <span>Partial</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center dashboard-animate opacity-0">
          <a href="#platforms" className="button-primary inline-flex items-center">
            See Platform Integrations
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
