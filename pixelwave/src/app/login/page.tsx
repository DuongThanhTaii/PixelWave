"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useUserStore } from "@/stores/userStore";
import { fetchApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const setLoginData = useUserStore(state => state.setLoginData);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Use a dummy client ID for now or from env
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com";

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await fetchApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }) // backend supports username as email
      });
      setLoginData(result.token, result.user);
      router.push('/');
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const result = await fetchApi<any>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      
      setLoginData(result.token, result.user);
      router.push('/');
    } catch (err: any) {
      console.error('Google Login failed', err);
      setError(err.message || 'Google Login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-hidden">
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 -left-1/4 w-[150%] h-[150%] bg-[linear-gradient(45deg,var(--pw-deep-purple),var(--pw-cyan-glow),var(--pw-hot-pink))] bg-[length:400%_400%] animate-[gradient_10s_ease_infinite] blur-3xl rounded-full" />
        </div>
        
        {/* Scanline overlay for that retro feel */}
        <div className="scanline z-10" />

        {/* Login Card */}
        <div className="relative z-20 w-full max-w-md bg-[var(--color-pw-surface-100)] border-4 border-black rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_0px_var(--color-pw-neon-lime)] flex flex-col items-center">
          
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-black border-4 border-[var(--color-pw-hot-pink)] rounded-xl flex items-center justify-center rotate-3 hover:-rotate-3 transition-transform shadow-[4px_4px_0px_0px_var(--color-pw-cyan-glow)]">
              <Activity className="w-8 h-8 text-[var(--color-pw-cyan-glow)] animate-pulse" />
            </div>
          </div>

          <h1 className="font-display font-black text-4xl md:text-5xl text-black uppercase tracking-tighter text-center leading-none mb-2">
            Pixel<span className="text-[var(--color-pw-hot-pink)]">wave</span>
          </h1>
          <p className="font-body text-center text-[var(--color-on-surface-variant)] mb-6 font-bold">
            Listen. Paint. Conquer.
          </p>

          {error && (
            <div className="w-full bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-xl font-bold mb-4 text-center">
              {error}
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleStandardLogin} className="w-full flex flex-col gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Username or Email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-black p-3 bg-white font-data rounded shadow-[4px_4px_0_0_#000] focus:outline-none focus:border-[var(--color-pw-hot-pink)]"
            />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-black p-3 bg-white font-data rounded shadow-[4px_4px_0_0_#000] focus:outline-none focus:border-[var(--color-pw-hot-pink)]"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--color-pw-vibrant-blue)] text-white border-2 border-black p-3 font-bold uppercase rounded shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex items-center w-full mb-6">
            <div className="flex-1 border-t-2 border-black"></div>
            <span className="px-4 font-data text-sm font-bold uppercase">OR</span>
            <div className="flex-1 border-t-2 border-black"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="w-full flex flex-col items-center gap-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError('Google Login Failed');
              }}
              size="large"
              theme="filled_black"
              shape="pill"
            />
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-300 w-full text-center">
            <p className="font-retro text-[8px] text-[var(--color-on-surface-variant)] uppercase tracking-widest leading-loose">
              By connecting, you agree to the <br/>
              <span className="text-black font-bold cursor-pointer hover:underline">Terms of War</span> & <span className="text-black font-bold cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
