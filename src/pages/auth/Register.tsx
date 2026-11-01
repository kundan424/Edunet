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
      setError('Please agree to the Lumina Academic Honor Code to proceed.');
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
    <div className="flex flex-col items-center justify-center py-8 md:py-14 w-full">
      <div className="w-full max-w-[440px] bg-[#ffffff] rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#e7e6e1] flex flex-col">
        
        {/* Brand Monogram & Badge */}
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
            Admissions
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1.5 mb-6 text-left">
          <h1 className="font-heading text-2xl font-semibold text-[#121212] tracking-tight">
            Create Academic Account
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#7b7974] leading-relaxed">
            Join 140,000+ researchers and students earning accredited university credits and certificates.
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-[#ffdad6]/60 border border-[#ffdad6] text-[#ba1a1a] text-xs break-words">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          
          {/* Account Role Selection */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#121212]">
              Select Academic Track
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Student Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  formData.role === 'STUDENT'
                    ? 'border-[#121212] bg-[#efeeeb] ring-1 ring-[#121212]'
                    : 'border-[#e7e6e1] bg-[#ffffff] hover:bg-[#efeeeb]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <GraduationCap className={`w-4 h-4 ${formData.role === 'STUDENT' ? 'text-[#d97757]' : 'text-[#7b7974]'}`} />
                  {formData.role === 'STUDENT' && <Check className="w-3.5 h-3.5 text-[#121212]" />}
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#121212]">Student / Learner</div>
                  <div className="text-[10px] text-[#7b7974] leading-tight mt-0.5">Audit labs &amp; earn ECTS</div>
                </div>
              </button>

              {/* Instructor Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'INSTRUCTOR' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  formData.role === 'INSTRUCTOR'
                    ? 'border-[#121212] bg-[#efeeeb] ring-1 ring-[#121212]'
                    : 'border-[#e7e6e1] bg-[#ffffff] hover:bg-[#efeeeb]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <BookOpen className={`w-4 h-4 ${formData.role === 'INSTRUCTOR' ? 'text-[#d97757]' : 'text-[#7b7974]'}`} />
                  {formData.role === 'INSTRUCTOR' && <Check className="w-3.5 h-3.5 text-[#121212]" />}
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#121212]">Faculty / Instructor</div>
                  <div className="text-[10px] text-[#7b7974] leading-tight mt-0.5">Publish &amp; grade defenses</div>
                </div>
              </button>

            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#121212]" htmlFor="reg-name">
              Full Legal Name
            </label>
            <input 
              id="reg-name"
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. Elena Rostova"
              required
              className="w-full h-10 px-3.5 bg-[#ffffff] text-[#121212] font-body text-xs sm:text-sm rounded-lg border border-[#e7e6e1] placeholder:text-[#9c9a92] focus:outline-none focus:ring-1 focus:ring-[#121212] focus:border-[#121212] transition-all"
            />
          </div>

          {/* Academic Email */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#121212]" htmlFor="reg-email">
              Academic or Work Email
            </label>
            <input 
              id="reg-email"
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@institution.edu"
              required
              className="w-full h-10 px-3.5 bg-[#ffffff] text-[#121212] font-body text-xs sm:text-sm rounded-lg border border-[#e7e6e1] placeholder:text-[#9c9a92] focus:outline-none focus:ring-1 focus:ring-[#121212] focus:border-[#121212] transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#121212]" htmlFor="reg-password">
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

          {/* Honor Code Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="honor-code"
              type="checkbox"
              checked={agreeHonorCode}
              onChange={e => setAgreeHonorCode(e.target.checked)}
              className="w-3.5 h-3.5 mt-0.5 rounded border-[#e7e6e1] text-[#121212] focus:ring-[#121212] cursor-pointer"
            />
            <label htmlFor="honor-code" className="text-xs text-[#7b7974] cursor-pointer select-none leading-relaxed">
              I agree to uphold the <span className="text-[#121212] font-medium">Lumina Academic Honor Code</span> and verify my lab submissions are authentic.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Creating Account...' : 'Create Academic Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#e7e6e1] text-center text-xs text-[#7b7974]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#121212] underline underline-offset-4 hover:text-[#d97757] transition-colors">
            Sign In →
          </Link>
        </div>

        {/* Security Seal */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#9c9a92]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3c8254]" />
          <span>Verifiable Digital Academic Credentials</span>
        </div>

      </div>
    </div>
  );
}
