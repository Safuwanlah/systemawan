'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, Menu, X, ArrowRight } from 'lucide-react';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Fitur', path: '#fitur' },
    { name: 'Keunggulan', path: '#keunggulan' },
    { name: 'Cara Kerja', path: '#cara-kerja' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-muted/90 backdrop-blur-md border-b border-[#25292D] py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded bg-card border border-[#25292D] flex items-center justify-center group-hover:border-[#E53935]/50 transition-colors">
            <Wrench className="w-5 h-5 text-[#E53935]" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">GARASI INVENTORY</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path}
              className="text-muted-foreground hover:text-white font-medium text-sm transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-sm font-bold text-white hover:text-[#E53935] transition-colors">
            Login
          </Link>
          <Link href="/" className="inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold text-sm rounded transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)]">
            Mulai Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-muted border-b border-[#25292D] py-4 px-4 flex flex-col gap-4 md:hidden shadow-2xl">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path}
              className="text-muted-foreground hover:text-white font-medium p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-[1px] bg-accent my-2"></div>
          <Link href="/" className="text-white font-medium p-2 text-center border border-[#25292D] rounded">
            Login
          </Link>
          <Link href="/" className="bg-[#E53935] text-white font-bold p-2 text-center rounded">
            Mulai Gratis
          </Link>
        </div>
      )}
    </nav>
  );
}
