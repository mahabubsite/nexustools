import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Command, Sun, Moon, User, LogOut, Settings, ShieldCheck, Twitter, Github, Linkedin, Facebook, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SocialLink } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [footerText, setFooterText] = useState(`© ${new Date().getFullYear()} Nexus Tools Inc. All rights reserved.`);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch Settings
  useEffect(() => {
      const fetchSettings = async () => {
          try {
              const docRef = doc(db, 'config', 'general');
              const snap = await getDoc(docRef);
              if (snap.exists()) {
                  const data = snap.data();
                  if (data.footerText) setFooterText(data.footerText);
                  if (data.socials && Array.isArray(data.socials)) {
                      setSocials(data.socials);
                  }
              }
          } catch(e) {
              // fallback
          }
      };
      fetchSettings();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isActive = (path: string) => location.pathname === path;

  // Don't show standard layout for Admin Dashboard to give it a "full app" feel
  if (location.pathname.startsWith('/admin/dashboard')) {
      return <>{children}</>;
  }

  const getSocialIcon = (platform: string) => {
      switch (platform.toLowerCase()) {
          case 'twitter': return <Twitter className="h-5 w-5" />;
          case 'github': return <Github className="h-5 w-5" />;
          case 'linkedin': return <Linkedin className="h-5 w-5" />;
          case 'facebook': return <Facebook className="h-5 w-5" />;
          case 'discord': return <MessageCircle className="h-5 w-5" />;
          default: return <Command className="h-5 w-5" />;
      }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                <img src="/logo.png" alt="Nexus Tools" className="h-8 w-8 rounded-md object-contain shadow-lg" />
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Nexus Tools</span>
              </Link>
              
              {/* Desktop Nav */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Home</Link>
                <Link to="/tools" className={`text-sm font-medium transition-colors ${isActive('/tools') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>All Tools</Link>
                <Link to="/pricing" className={`text-sm font-medium transition-colors ${isActive('/pricing') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Pricing</Link>
                <Link to="/about" className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>About</Link>
                <Link to="/contact" className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Contact</Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {user ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden">
                             {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : <User className="h-5 w-5 m-1.5 text-slate-500 dark:text-slate-400" />}
                        </div>
                    </button>

                    {/* Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 z-50">
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                            </div>
                            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-white flex items-center gap-2">
                                <Settings className="h-4 w-4" /> Account Settings
                            </Link>
                            {isAdmin && (
                                <Link to="/admin/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-white flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> Admin Panel
                                </Link>
                            )}
                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 flex items-center gap-2">
                                <LogOut className="h-4 w-4" /> Sign out
                            </button>
                        </div>
                    )}
                    {/* Backdrop for closing dropdown */}
                    {isProfileOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                    )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                     <Link to="/auth?mode=login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium">Log in</Link>
                     <Link to="/auth?mode=signup" className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-500/20">
                        Get Started
                     </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center md:hidden gap-2">
               <button 
                onClick={toggleTheme}
                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none"
              >
                {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="pt-2 pb-3 space-y-1 px-2">
              <Link to="/" className="text-slate-900 dark:text-white block px-3 py-2 rounded-md text-base font-medium bg-slate-50 dark:bg-slate-800">Home</Link>
              <Link to="/tools" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium">All Tools</Link>
              <Link to="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium">Pricing</Link>
              <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium">About</Link>
            </div>
            <div className="pt-4 pb-4 border-t border-slate-200 dark:border-slate-800 px-4">
                {user ? (
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {user.avatar ? <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" /> : <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>}
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-slate-900 dark:text-white">{user.name}</div>
                                <div className="text-sm font-medium leading-none text-slate-500 dark:text-slate-400 mt-1">{user.email}</div>
                            </div>
                        </div>
                        <Link to="/profile" className="block w-full text-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg">Profile</Link>
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="block w-full text-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg">Admin Panel</Link>
                        )}
                        <button onClick={logout} className="block w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">Sign Out</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/auth?mode=login" className="flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Log in</Link>
                        <Link to="/auth?mode=signup" className="flex items-center justify-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500">Sign up</Link>
                    </div>
                )}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
               <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <img src="/logo.png" alt="Nexus Tools" className="h-8 w-8 rounded-md object-contain" />
                <span className="font-bold text-lg text-slate-900 dark:text-white">Nexus Tools</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                The ultimate suite of high-performance online tools for modern builders, developers, and creators.
              </p>
            </div>
            
            {/* Links Columns - Visible on Mobile now */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link to="/tools" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Browse Tools</Link></li>
                <li><Link to="/pricing" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Pricing</Link></li>
                <li><Link to="/blog" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
                <li><Link to="/report" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Report / Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">{footerText}</p>
            <div className="flex gap-6">
                {Array.isArray(socials) && socials.map((social, idx) => (
                    <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 dark:text-slate-500 dark:hover:text-white transition-colors">
                        {getSocialIcon(social.platform)}
                    </a>
                ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;