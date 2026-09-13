import React, { useState } from 'react';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { api } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../../features/auth/types';
import { useAuth } from '../../auth/AuthProvider';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { name, email, password, role } = formData;
      const response = await api.post<any, User>('/api/v1/auth/register', { name, email, password, role });
      if (response && response.id) {
        // Now automatically log them in
        const loginResponse = await api.post<any, { token: string }>('/api/v1/auth/login', { email, password });
        if (loginResponse && loginResponse.token) {
          await login(loginResponse.token);
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 w-full">
      <div className="w-full max-w-md flex flex-col gap-8 px-4 sm:px-0">
        <SectionHeading className="text-center">Create an account</SectionHeading>
        
        {error && (
          <div className="bg-ember-red text-cream-paper p-4 font-bold text-center break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-sm">Full name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border-2 border-midnight-ink p-3 bg-white font-usual text-base focus:ring-2 focus:ring-signal-blue focus:outline-none"
                required
              />
            </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-sm">Email address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border-2 border-midnight-ink p-3 bg-white font-usual text-base focus:ring-2 focus:ring-signal-blue focus:outline-none"
                required
              />
          </div>
            <div className="flex flex-col gap-2 w-full">
              <PasswordInput
                label="Password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          <div className="flex flex-col gap-3 mt-2 w-full">
            <label className="font-bold text-sm">I want to:</label>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-midnight-ink w-full sm:w-1/2">
                <input type="radio" name="role" value="STUDENT" checked={formData.role === 'STUDENT'} onChange={e => setFormData({...formData, role: e.target.value})} className="accent-signal-blue" />
                <span className="font-bold">Learn</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-midnight-ink w-full sm:w-1/2">
                <input type="radio" name="role" value="INSTRUCTOR" checked={formData.role === 'INSTRUCTOR'} onChange={e => setFormData({...formData, role: e.target.value})} className="accent-signal-blue" />
                <span className="font-bold">Teach</span>
              </label>
            </div>
          </div>
          <PillButton type="submit" disabled={loading} className="mt-4 w-full justify-center">
            {loading ? 'Registering...' : 'Create Account'}
          </PillButton>
        </form>

        <BodyText className="text-center text-sm">
          Already have an account? <Link to="/login" className="font-bold hover:text-signal-blue underline">Log in</Link>
        </BodyText>
      </div>
    </div>
  );
}
