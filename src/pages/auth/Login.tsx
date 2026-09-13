import React, { useState } from 'react';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { api } from '../../lib/api';
import { useAuth } from '../../auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 w-full">
      <div className="w-full max-w-md flex flex-col gap-8 px-4 sm:px-0">
        <SectionHeading className="text-center">Welcome back</SectionHeading>
        
        {error && (
          <div className="bg-ember-red text-cream-paper p-4 font-bold text-center break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-sm">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-2 border-midnight-ink p-3 bg-white font-usual text-base focus:ring-2 focus:ring-signal-blue focus:outline-none"
                required
              />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <PasswordInput
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <PillButton type="submit" disabled={loading} className="mt-4 w-full justify-center">
            {loading ? 'Logging in...' : 'Log in'}
          </PillButton>
        </form>

        <BodyText className="text-center text-sm">
          Don't have an account? <Link to="/register" className="font-bold hover:text-signal-blue underline">Register here</Link>
        </BodyText>
      </div>
    </div>
  );
}
