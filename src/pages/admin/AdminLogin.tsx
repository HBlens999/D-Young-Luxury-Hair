import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigateHome }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1310] flex flex-col justify-center items-center p-4">
      
      {/* Return to store link */}
      <button
        onClick={onNavigateHome}
        className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D6C2A7] hover:text-[#FDFCF7] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Customer Storefront</span>
      </button>

      <div className="w-full max-w-md bg-[#241A15] border border-[#3E2D24] p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#B89865]/10 border border-[#B89865]/30 flex items-center justify-center text-[#B89865] mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl text-[#FDFCF7] tracking-wider">
            D YOUNG LUXURY HAIRS
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#B89865]">
            Authorized Administrator Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D6C2A7] font-semibold mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C6A48] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dyoungluxuryhairs.com"
                className="w-full pl-9 pr-4 py-2.5 bg-[#1A1310] border border-[#3E2D24] text-xs text-[#FDFCF7] focus:outline-none focus:border-[#B89865]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D6C2A7] font-semibold mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C6A48] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-[#1A1310] border border-[#3E2D24] text-xs text-[#FDFCF7] focus:outline-none focus:border-[#B89865]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#B89865] hover:bg-[#D6C2A7] text-[#1A1310] text-xs uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Management'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
