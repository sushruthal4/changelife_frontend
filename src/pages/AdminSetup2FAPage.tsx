import React, { useMemo, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Check, KeyRound, QrCode, ShieldCheck } from "lucide-react";
import * as QRCode from "qrcode";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import authApi from "@/lib/api/auth";
import usersApi, { User } from "@/lib/api/users";
import { getApiErrorMessage } from "@/lib/api";

type Step = "email" | "scan" | "verify";

export const AdminSetup2FAPage: React.FC = () => {
  const router = useRouter();
  const { saveSession } = useAuth();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [manualSecret, setManualSecret] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepNumber = useMemo(() => (step === "email" ? 1 : step === "scan" ? 2 : 3), [step]);

  const startSetup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authApi.setup2FA({ email });
      setManualSecret(response.data.secret);
      setQrImage(await QRCode.toDataURL(response.data.otpauth_url, { width: 220, margin: 2 }));
      setStep("scan");
      addToast("2FA setup started", "success");
    } catch (err) {
      addToast(getApiErrorMessage(err, "Failed to start 2FA setup"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifySetup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authApi.verify2FASetup({ email, token });
      const usersResponse = await usersApi.getAll();
      const user =
        usersResponse.data.find((item) => item.email.toLowerCase() === email.toLowerCase()) ||
        ({
          id: "verified-admin",
          email,
          role: "admin",
          is_active: true,
          twoFactorEnabled: true,
        } as User);

      saveSession(response.data.token, user);
      addToast("2FA verified", "success");
      router.navigate({ to: "/admin/dashboard" });
    } catch (err) {
      addToast(getApiErrorMessage(err, "Failed to verify token"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-brand-dark px-4 py-10'>
      <div className='w-full max-w-md rounded-lg border border-white/10 bg-white p-6 shadow-2xl'>
        <div className='mb-5 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded bg-brand-primary text-white'>
              <ShieldCheck className='h-5 w-5' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-brand-dark'>Admin 2FA Setup</h1>
              <p className='text-xs font-semibold uppercase text-brand-dark/45'>Step {stepNumber} of 3</p>
            </div>
          </div>
          <Link to='/admin/login' className='text-sm font-semibold text-brand-primary hover:text-brand-dark'>
            Login
          </Link>
        </div>

        <div className='mb-6 grid grid-cols-3 gap-2'>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1 rounded ${item <= stepNumber ? "bg-brand-primary" : "bg-brand-dark/10"}`}
            />
          ))}
        </div>

        {step === "email" && (
          <form onSubmit={startSetup} className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-semibold text-brand-dark/70'>Admin Email</label>
              <input
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className='w-full rounded border border-brand-dark/15 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15'
                placeholder='admin@charity.com'
              />
            </div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex w-full items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60'
            >
              <KeyRound className='h-4 w-4' />
              {isSubmitting ? "Starting..." : "Start Setup"}
            </button>
          </form>
        )}

        {step === "scan" && (
          <div className='space-y-5 text-center'>
            <div className='mx-auto inline-flex rounded border border-brand-dark/10 bg-brand-muted p-3'>
              {qrImage ? (
                <img src={qrImage} alt='2FA QR code' className='h-52 w-52' />
              ) : (
                <QrCode className='h-20 w-20 text-brand-primary' />
              )}
            </div>
            <div className='rounded border border-brand-dark/10 bg-white p-3 text-left'>
              <p className='mb-1 text-xs font-semibold uppercase text-brand-dark/45'>Manual Key</p>
              <p className='break-all font-mono text-xs text-brand-dark'>{manualSecret}</p>
            </div>
            <button
              type='button'
              onClick={() => setStep("verify")}
              className='inline-flex w-full items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark'
            >
              Continue
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        )}

        {step === "verify" && (
          <form onSubmit={verifySetup} className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-semibold text-brand-dark/70'>6-digit Token</label>
              <input
                type='text'
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
                inputMode='numeric'
                maxLength={6}
                className='w-full rounded border border-brand-dark/15 px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15'
                placeholder='123456'
              />
            </div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex w-full items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60'
            >
              <Check className='h-4 w-4' />
              {isSubmitting ? "Verifying..." : "Verify and Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
