import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../auth/AuthProvider';
import type { User } from '../../features/auth/types';
import { Eye, EyeOff, ArrowRight, ShieldCheck, GraduationCap, BookOpen, Check } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' as 'STUDENT' | 'INSTRUCTOR' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeHonorCode, setAgreeHonorCode] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeHonorCode) {
      setError('Please agree to the Terms of Service to proceed.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { name, email, password, role } = formData;
      const response = await api.post<any, User>('/api/v1/auth/register', { name, email, password, role });
      if (response && response.id) {
        // Automatically sign in upon registration
        const loginResponse = await api.post<any, { token: string }>('/api/v1/auth/login', { email, password });
        if (loginResponse && loginResponse.token) {
          await login(loginResponse.token);
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-14 w-full bg-canvas text-foreground transition-colors duration-150">
      <div className="w-full max-w-[440px] bg-card rounded-[10px] p-7 sm:p-9 shadow-none border border-rule flex flex-col">
        
        {/* Brand Monogram & Badge */}
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
            Sign Up
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1.5 mb-6 text-left">
          <h1 className="font-sans text-2xl font-medium text-foreground tracking-[-0.025em]">
            Create an Account
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
            Join over 140,000 learners mastering in-demand skills and earning certificates.
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-5 p-3 rounded-none bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono break-words">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          
          {/* Account Role Selection */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-medium text-foreground font-mono uppercase">
              Join as
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Student Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                className={`p-3 rounded-none border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  formData.role === 'STUDENT'
                    ? 'border-ember bg-wash'
                    : 'border-rule bg-card hover:bg-wash'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <GraduationCap className={`w-4 h-4 ${formData.role === 'STUDENT' ? 'text-ember' : 'text-muted'}`} />
                  {formData.role === 'STUDENT' && <Check className="w-3.5 h-3.5 text-ember" />}
                </div>
                <div>
                  <div className="font-medium text-xs text-foreground">Student</div>
                  <div className="text-[10px] text-muted font-mono mt-0.5">Take courses &amp; learn</div>
                </div>
              </button>

              {/* Instructor Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'INSTRUCTOR' })}
                className={`p-3 rounded-none border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  formData.role === 'INSTRUCTOR'
                    ? 'border-ember bg-wash'
                    : 'border-rule bg-card hover:bg-wash'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <BookOpen className={`w-4 h-4 ${formData.role === 'INSTRUCTOR' ? 'text-ember' : 'text-muted'}`} />
                  {formData.role === 'INSTRUCTOR' && <Check className="w-3.5 h-3.5 text-ember" />}
                </div>
                <div>
                  <div className="font-medium text-xs text-foreground">Instructor</div>
                  <div className="text-[10px] text-muted font-mono mt-0.5">Create courses &amp; teach</div>
                </div>
              </button>

            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-medium text-foreground" htmlFor="reg-name">
              Full Name
            </label>
            <input 
              id="reg-name"
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. Elena Rostova"
              required
              className="w-full h-10 px-3.5 bg-wash text-foreground font-sans text-xs sm:text-sm rounded-none border border-rule placeholder:text-muted focus:outline-none focus:border-ember transition-colors"
            />
          </div>

          {/* Academic Email */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-medium text-foreground" htmlFor="reg-email">
              Academic or Work Email
            </label>
            <input 
              id="reg-email"
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@institution.edu"
              required
              className="w-full h-10 px-3.5 bg-wash text-foreground font-sans text-xs sm:text-sm rounded-none border border-rule placeholder:text-muted focus:outline-none focus:border-ember transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-medium text-foreground" htmlFor="reg-password">
              Password (Minimum 8 characters)
            </label>
            <div className="relative flex items-center">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                required
                minLength={6}
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

          {/* Terms & Honor Code Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="honor-code"
              type="checkbox"
              checked={agreeHonorCode}
              onChange={e => setAgreeHonorCode(e.target.checked)}
              className="w-3.5 h-3.5 mt-0.5 rounded-none border-rule text-ember focus:ring-ember cursor-pointer"
            />
            <label htmlFor="honor-code" className="text-xs text-muted cursor-pointer select-none leading-relaxed">
              I agree to the <span className="text-foreground font-medium">Terms of Service</span> and <span className="text-foreground font-medium">Privacy Policy</span>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-superset-primary w-full mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-rule text-center text-xs text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ember hover:underline transition-colors">
            Sign In →
          </Link>
        </div>

        {/* Security Seal */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure Account &amp; Privacy Protected</span>
        </div>

      </div>
    </div>
  );
}
