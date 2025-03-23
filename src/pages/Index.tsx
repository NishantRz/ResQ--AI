
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Dashboard from '../components/Dashboard';
import Platforms from '../components/Platforms';
import LocationTracker from '../components/LocationTracker';
import EmergencyTrigger from '../components/EmergencyTrigger';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Dashboard />
        <Platforms />
        <LocationTracker />
        <EmergencyTrigger />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
