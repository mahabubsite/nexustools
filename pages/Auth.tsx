import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Command, Github, Mail, AlertCircle, User as UserIcon, Check, X, Eye, EyeOff } from 'lucide-react';
import CustomCaptcha from '../components/CustomCaptcha';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, loginAnonymously, loginWithGoogle, loginWithGithub, user } = useAuth();
  
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Password Requirements State
  const [reqs, setReqs] = useState({
      uppercase: false,
      lowercase: false,
      special: false,
      length: false
  });

  useEffect(() => {
    if (user) navigate('/profile');
  }, [user, navigate]);

  useEffect(() => {
      // Live password validation
      setReqs({
          uppercase: /[A-Z]/.test(password),
          lowercase: /[a-z]/.test(password),
          special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
          length: password.length >= 6
      });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!captchaVerified) {
        setError('Please verify you are not a robot.');
        return;
    }

    setLoading(true);

    // Validate Password for Signup
    if (mode === 'signup') {
        if (!reqs.uppercase || !reqs.lowercase || !reqs.special || !reqs.length) {
            setError("Please meet all password requirements.");
            setLoading(false);
            return;
        }
    }

    try {
        if (mode === 'signup') {
             if (!name) throw new Error("Name is required");
             await signup(email, password, name);
        } else {
             await login(email, password);
        }
        navigate('/profile');
    } catch (err: any) {
        console.error(err);
        let msg = "Authentication failed.";
        if (err.code === 'auth/wrong-password') msg = "Invalid password.";
        if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
        if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
        if (err.code === 'auth/weak-password') msg = "Password is too weak.";
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'guest') => {
      setError('');
      if (!captchaVerified) {
          setError('Please verify you are not a robot.');
          return;
      }
      
      setLoading(true);
      try {
          if (provider === 'google') await loginWithGoogle();
          else if (provider === 'github') await loginWithGithub();
          else await loginAnonymously();
          
          navigate('/profile');
      } catch (err: any) {
          console.error(err);
          setError("Login failed. Please try again.");
      } finally {
          setLoading(false);
      }
  };

  // Google SVG Icon
  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
            <div className="bg-brand-600 p-3 rounded-xl shadow-lg shadow-brand-500/30">
                <Command className="h-8 w-8 text-white" />
            </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
            {mode === 'login' ? 'Sign up for free' : 'Sign in instead'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl">
          
          {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
              </div>
          )}

          {/* Social Logins */}
          <div className="grid grid-cols-1 gap-3 mb-6">
              <button onClick={() => handleSocialLogin('google')} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-sm">
                  <GoogleIcon />
                  <span className="truncate">Continue with Google</span>
              </button>
              <button onClick={() => handleSocialLogin('github')} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-sm">
                  <Github className="h-5 w-5" />
                  <span className="truncate">Continue with GitHub</span>
              </button>
          </div>

          <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or with email</span>
              </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-colors"
                    placeholder="John Doe"
                  />
                </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === 'login' ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
              </div>
              
              {/* Password Requirements Checklist (Only in Signup) */}
              {mode === 'signup' && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                      <RequirementItem label="6+ chars" met={reqs.length} />
                      <RequirementItem label="Uppercase" met={reqs.uppercase} />
                      <RequirementItem label="Lowercase" met={reqs.lowercase} />
                      <RequirementItem label="Special/Num" met={reqs.special} />
                  </div>
              )}
            </div>

            {/* Custom CAPTCHA */}
            <div className="py-2">
                <CustomCaptcha onVerify={setCaptchaVerified} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      Processing...
                  </div>
              ) : (mode === 'login' ? 'Sign in' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSocialLogin('guest')}
                disabled={loading}
                className="w-full inline-flex justify-center items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-2"
              >
                <span>Continue as Guest</span>
                <UserIcon className="h-4 w-4" />
              </button>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500 max-w-xs mx-auto">
            By continuing, you agree to our 
            <a href="/privacy" className="text-brand-600 hover:underline mx-1">Privacy Policy</a> and 
            <a href="/terms" className="text-brand-600 hover:underline mx-1">Terms of Service</a>.
        </p>
      </div>
    </div>
  );
};

const RequirementItem: React.FC<{ label: string; met: boolean }> = ({ label, met }) => (
    <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
        {met ? <Check className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1"></div>}
        {label}
    </div>
);

export default Auth;