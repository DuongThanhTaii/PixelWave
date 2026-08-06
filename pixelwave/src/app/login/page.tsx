"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useUserStore } from "@/stores/userStore";
import { fetchApi } from "@/lib/api";

function LoginForm({ 
  email, setEmail, password, setPassword, loading, error, handleStandardLogin, handleGoogleSuccess, setError 
}: any) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleSuccess({ credential: tokenResponse.access_token });
    },
    onError: () => {
      setError('Google Login Failed');
    },
  });

  return (
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
          className="w-full bg-[#8ed1fc] text-black border-2 border-black p-3 font-bold uppercase rounded shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
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
        <button
          type="button"
          className="w-full bg-white text-black border-2 border-black p-3 font-bold rounded shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex items-center justify-center gap-2"
          onClick={() => login()}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Đăng nhập bằng Google
        </button>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-gray-300 w-full text-center">
        <p className="font-retro text-[8px] text-[var(--color-on-surface-variant)] uppercase tracking-widest leading-loose">
          By connecting, you agree to the <br/>
          <span className="text-black font-bold cursor-pointer hover:underline">Terms of War</span> & <span className="text-black font-bold cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 -left-1/4 w-[150%] h-[150%] bg-[linear-gradient(45deg,var(--pw-deep-purple),var(--pw-cyan-glow),var(--pw-hot-pink))] bg-[length:400%_400%] animate-[gradient_10s_ease_infinite] blur-3xl rounded-full" />
      </div>
      
      {/* Scanline overlay for that retro feel */}
      <div className="scanline z-10" />

      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error}
          setError={setError}
          handleStandardLogin={handleStandardLogin}
          handleGoogleSuccess={handleGoogleSuccess}
        />
      </GoogleOAuthProvider>
    </div>
  );
}
