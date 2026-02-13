import React, { useState } from 'react';
import { AlertCircle, Check, Lock, Mail } from 'lucide-react';
import { signInWithGoogle } from '../firebaseMap';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);

    try {
      const nextUser = await signInWithGoogle();
      setUser(nextUser);
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found' || err.message?.includes('api-key-not-valid')) {
        setError('Firebase configuration is missing or invalid. Please update firebaseMap.ts.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    }
  };

  return (
    <section id="login" className="section-shell section-gap">
      <div className="mx-auto max-w-md rounded-[34px] border border-black/10 bg-white p-7 shadow-[0_18px_34px_rgba(15,23,42,0.12)]">
        {user ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Welcome, {user.displayName || 'there'}</h3>
            <p className="mt-2 text-sm text-slate-600">Signed in as {user.email}</p>
            <button onClick={() => setUser(null)} className="mt-5 text-sm font-bold text-slate-900 underline">
              Sign out
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-bold text-slate-900">{isLogin ? 'Log in to Costli' : 'Create your account'}</h3>
            <p className="mt-2 text-sm text-slate-600">Secure access for your cloud optimization workspace.</p>

            <div className="mt-5 flex rounded-full border border-black/10 bg-slate-100 p-1">
              <button onClick={() => setIsLogin(true)} className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${isLogin ? 'bg-[#111318] text-white' : 'text-slate-600'}`}>
                Login
              </button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${!isLogin ? 'bg-[#111318] text-white' : 'text-slate-600'}`}>
                Sign up
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
                  <input type="text" placeholder="Jane Doe" className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="email" placeholder="you@company.com" className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-400" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="Enter password" className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-400" />
                </div>
              </div>

              <button className="w-full rounded-full bg-[#111318] px-4 py-3 text-sm font-bold text-white">{isLogin ? 'Sign in' : 'Create account'}</button>
            </form>

            <div className="mt-5 border-t border-black/10 pt-5">
              <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-bold text-slate-900">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
                Continue with Google
              </button>
            </div>
          </>
        )}
      </div>
      <div id="signup" className="absolute opacity-0" />
    </section>
  );
};

export default Auth;
