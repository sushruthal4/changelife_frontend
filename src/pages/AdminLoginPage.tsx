import React, { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Heart, KeyRound, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/api";

export const AdminLoginPage: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await login({ email, token });
      addToast("Login successful", "success");
      router.navigate({ to: "/admin/dashboard" });
    } catch (err) {
      addToast(getApiErrorMessage(err, "Login failed"), "error");
    }
  };

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.22),transparent_36%),linear-gradient(135deg,#241033,#3b0764_58%,#6d28d9)] px-4 py-6'>
      <div className='mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center'>
        <div className='grid w-full overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]'>
          <section className='hidden bg-brand-dark p-10 text-white lg:flex lg:flex-col lg:justify-between'>
            <Link to='/' className='inline-flex w-max items-center gap-2 text-sm font-bold text-white/75 hover:text-white'>
              <ArrowLeft className='h-4 w-4' />
              Back to website
            </Link>
            <div>
              <span className='mb-5 flex h-14 w-14 items-center justify-center rounded bg-brand-primary text-white'>
                <Heart className='h-7 w-7' />
              </span>
              <h1 className='text-4xl font-bold'>Heart Fuel Admin</h1>
              <p className='mt-4 max-w-sm leading-7 text-white/70'>
                Manage causes, uploaded media, payment settings, site content, and admin users from one secure place.
              </p>
            </div>
            <div className='rounded border border-white/10 bg-white/5 p-4 text-sm text-white/70'>
              Use the 6-digit code from Google Authenticator after setting up 2FA.
            </div>
          </section>

          <section className='p-6 sm:p-10'>
            <Link to='/' className='mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-primary lg:hidden'>
              <ArrowLeft className='h-4 w-4' />
              Back to website
            </Link>

            <div className='mb-8'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded bg-brand-muted text-brand-primary'>
                <ShieldCheck className='h-6 w-6' />
              </div>
              <h2 className='text-3xl font-bold text-brand-dark'>Admin Login</h2>
              <p className='mt-2 text-sm text-brand-dark/60'>Enter admin email and authenticator token.</p>
            </div>

            <form onSubmit={onSubmit} className='space-y-5'>
              <label className='block'>
                <span className='mb-2 block text-sm font-semibold text-brand-dark/70'>Email</span>
                <input
                  type='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className='input-admin'
                  placeholder='admin@charity.com'
                />
              </label>

              <label className='block'>
                <span className='mb-2 block text-sm font-semibold text-brand-dark/70'>Authenticator Token</span>
                <div className='relative'>
                  <KeyRound className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark/35' />
                  <input
                    type='text'
                    value={token}
                    onChange={(event) => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    inputMode='numeric'
                    maxLength={6}
                    className='input-admin pl-10 tracking-[0.35em]'
                    placeholder='000000'
                  />
                </div>
              </label>

              <button
                type='submit'
                disabled={isLoading}
                className='inline-flex w-full items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-warm disabled:opacity-60'
              >
                <LogIn className='h-4 w-4' />
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className='mt-6 rounded border border-brand-dark/10 bg-brand-bg p-4 text-sm text-brand-dark/65'>
              New admin device?
              <Link to='/admin/setup-2fa' className='ml-1 font-bold text-brand-primary hover:text-brand-warm'>
                Setup 2FA
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
