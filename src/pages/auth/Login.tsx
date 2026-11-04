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
        navigate('/'); // Route guards will redirect if they hit a RoleRoute
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your academic email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-14 w-full">
      <div className="w-full max-w-[420px] bg-[#ffffff] rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#e7e6e1] flex flex-col">
        
        {/* Brand Monogram & Status Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#121212] text-[#f8f8f6] font-serif text-base font-bold flex items-center justify-center shadow-xs">
              L
            </div>
            <span className="font-heading text-lg font-semibold text-[#121212] tracking-tight">
              Lumina
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold bg-[#efeeeb] px-2 py-0.5 rounded border border-[#e7e6e1]">
            Secure Sign In
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1.5 mb-6 text-left">
          <h1 className="font-heading text-2xl font-semibold text-[#121212] tracking-tight">
            Sign In to Lumina
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#7b7974] leading-relaxed">
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
          className="w-full py-2.5 px-3.5 mb-5 rounded-xl border border-[#e7e6e1] bg-[#f8f8f6] hover:bg-[#efeeeb] text-[#373734] font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-[#d97757]" />
          <span>Demo Credentials (Fill Student)</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center mb-5">
          <div className="flex-grow border-t border-[#e7e6e1]"></div>
          <span className="flex-shrink mx-3 text-[11px] font-mono text-[#9c9a92] uppercase tracking-wider">
            Email Address
          </span>
          <div className="flex-grow border-t border-[#e7e6e1]"></div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-[#ffdad6]/60 border border-[#ffdad6] text-[#ba1a1a] text-xs break-words">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#121212]" htmlFor="login-email">
              Academic or Work Email
            </label>
            <input 
              id="login-email"
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="researcher@university.edu"
              required
              className="w-full h-10 px-3.5 bg-[#ffffff] text-[#121212] font-body text-xs sm:text-sm rounded-lg border border-[#e7e6e1] placeholder:text-[#9c9a92] focus:outline-none focus:ring-1 focus:ring-[#121212] focus:border-[#121212] transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#121212]" htmlFor="login-password">
                Password
              </label>
              <button 
                type="button" 
                onClick={() => alert('Password reset links have been configured for institutional credentials. Please contact your campus administrator or support@lumina.edu.')}
                className="text-[11px] text-[#7b7974] hover:text-[#121212] transition-colors cursor-pointer"
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
                className="w-full h-10 pl-3.5 pr-10 bg-[#ffffff] text-[#121212] font-body text-xs sm:text-sm rounded-lg border border-[#e7e6e1] placeholder:text-[#9c9a92] focus:outline-none focus:ring-1 focus:ring-[#121212] focus:border-[#121212] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 p-1 text-[#9c9a92] hover:text-[#121212] transition-colors cursor-pointer"
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
              className="w-3.5 h-3.5 rounded border-[#e7e6e1] text-[#121212] focus:ring-[#121212] cursor-pointer"
            />
            <label htmlFor="remember-me" className="text-xs text-[#7b7974] cursor-pointer select-none">
              Keep me authenticated for 30 days
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          >
            <Lock className="w-3.5 h-3.5 text-[#d97757]" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Lumina'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#e7e6e1] text-center text-xs text-[#7b7974]">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#121212] underline underline-offset-4 hover:text-[#d97757] transition-colors">
            Create an account →
          </Link>
        </div>

        {/* Security Seal */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#9c9a92]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3c8254]" />
          <span>256-bit Encrypted Platform Security</span>
        </div>

      </div>
    </div>
  );
}
