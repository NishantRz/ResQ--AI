
import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Platforms', href: '#platforms' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <a href="#" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-emergency rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-foreground font-bold text-xl">ResQ-AI</span>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="text-foreground/80 hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center">
            <button 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors duration-200 mr-2"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <a 
              href="#contact" 
              className="hidden md:flex button-emergency"
            >
              Emergency Demo
            </a>
            
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="p-2 md:hidden rounded-md text-foreground hover:bg-secondary transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 bg-background z-50 transition-transform duration-300 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col items-center mt-8 space-y-8">
          {menuItems.map((item) => (
            <a 
              key={item.label}
              href={item.href} 
              className="text-foreground text-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          
          <a 
            href="#contact" 
            className="button-emergency mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            Emergency Demo
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
