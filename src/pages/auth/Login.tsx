import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../auth/AuthProvider';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Building2 } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post<any, { token: string }>('/api/v1/auth/login', { email, password });
      if (response && response.token) {
        await login(response.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your academic email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-14 w-full bg-canvas text-foreground transition-colors duration-150">
      <div className="w-full max-w-[420px] bg-card rounded-[10px] p-7 sm:p-9 shadow-none border border-rule flex flex-col">
        
        {/* Brand Monogram & Status Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-foreground text-canvas font-mono text-sm font-bold flex items-center justify-center">
              E
            </div>
            <span className="font-sans text-lg font-medium text-foreground tracking-tight">
              Edunet
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ember font-medium bg-wash px-2.5 py-0.5 rounded-none border border-rule">
            Secure Sign In
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1.5 mb-6 text-left">
          <h1 className="font-sans text-2xl font-medium text-foreground tracking-[-0.025em]">
            Sign In to Edunet
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
            Access your courses, quizzes, assignments, and learning materials.
          </p>
        </div>

        {/* Institutional Quick Access Button */}
        <button
          type="button"
          onClick={() => {
            setEmail('john@edtech.com');
            setPassword('password123');
          }}
          className="w-full py-2.5 px-3.5 mb-5 rounded-none border border-rule bg-wash hover:border-ember text-foreground font-mono text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-ember" />
          <span>Demo Credentials (Fill Student)</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center mb-5">
          <div className="flex-grow border-t border-rule"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-muted uppercase tracking-wider">
            Email Address
          </span>
          <div className="flex-grow border-t border-rule"></div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-5 p-3 rounded-none bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono break-words">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-medium text-foreground" htmlFor="login-email">
              Academic or Work Email
            </label>
            <input 
              id="login-email"
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="researcher@university.edu"
              required
              className="w-full h-10 px-3.5 bg-wash text-foreground font-sans text-xs sm:text-sm rounded-none border border-rule placeholder:text-muted focus:outline-none focus:border-ember transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground" htmlFor="login-password">
                Password
              </label>
              <button 
                type="button" 
                onClick={() => alert('Password reset links have been configured for institutional credentials. Please contact support@edunet.edu.')}
                className="text-[11px] font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full h-10 pl-3.5 pr-10 bg-wash text-foreground font-sans text-xs sm:text-sm rounded-none border border-rule placeholder:text-muted focus:outline-none focus:border-ember transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 p-1 text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded-none border-rule text-ember focus:ring-ember cursor-pointer"
            />
            <label htmlFor="remember-me" className="text-xs text-muted cursor-pointer select-none">
              Keep me authenticated for 30 days
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-superset-primary w-full mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Edunet'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-rule text-center text-xs text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-ember hover:underline transition-colors">
            Create an account →
          </Link>
        </div>

        {/* Security Seal */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-bit Encrypted Platform Security</span>
        </div>

      </div>
    </div>
  );
}
