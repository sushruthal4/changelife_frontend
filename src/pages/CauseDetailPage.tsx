import React from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  Loader2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { ImageGallery, VideoGallery } from "@/components/Cards";
import { ErrorMessage } from "@/components/Error";
import { PublicFooter, PublicHeader } from "@/components/Layout";
import { LoadingSpinner } from "@/components/Loading";
import { Badge } from "@/components/Stats";
import { useToast } from "@/contexts/ToastContext";
import { useCauseById } from "@/hooks/useCauses";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { getCauseGallery } from "@/lib/fallbackMedia";
import { openUpiDeepLink } from "@/lib/upi";
import { ORG } from "@/constants";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const normalizeAmount = (amount: number) => {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100) / 100;
};

const quickAmounts = [50, 100, 200, 500, 1000, 2000];
const multipliers = [1, 5, 10, 50, 100];

export const CauseDetailPage: React.FC = () => {
  const params = useParams({ strict: false }) as { id?: string };
  const [selectedAmount, setSelectedAmount] = React.useState("");
  const [multiplier, setMultiplier] = React.useState<number | null>(null);
  const [donorForm, setDonorForm] = React.useState({
    donor_name: "",
    donor_phone: "",
  });
  const [opening, setOpening] = React.useState(false);
  const { data: cause, isLoading: causeLoading, error: causeError } = useCauseById(params.id);
  const { data: paymentSettings = [] } = usePaymentSettings();
  const activePayment = paymentSettings.find((p) => p.is_active) || paymentSettings[0];
  const { addToast } = useToast();

  const updateDonorForm = (key: keyof typeof donorForm, value: string) => {
    setDonorForm((current) => ({ ...current, [key]: value }));
  };

  if (causeLoading) {
    return (
      <div className='min-h-screen bg-brand-bg'>
        <PublicHeader />
        <div className='mx-auto max-w-7xl px-4 py-12'>
          <LoadingSpinner />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!cause) {
    return (
      <div className='min-h-screen bg-brand-bg'>
        <PublicHeader />
        <div className='mx-auto max-w-7xl px-4 py-12'>
          <ErrorMessage error={causeError || new Error("Cause not found")} />
        </div>
        <PublicFooter />
      </div>
    );
  }

  const mediaImages = getCauseGallery(cause);
  const amount = Number(cause.target_amount || 0);
  const raisedAmount = Number(cause.raised_amount || 0);
  const unitAmount = Number(cause.unit_amount || 0);
  const progressPct = amount > 0 ? Math.min(100, Math.round((raisedAmount / amount) * 100)) : 0;
  const unitPrice = unitAmount > 0 ? unitAmount : 0;
  const unitLabel = cause.unit_label?.trim() || "Unit";
  const payableAmount = normalizeAmount(
    selectedAmount ? Number(selectedAmount) : 0,
  );
  const upiId = activePayment?.upi_id?.trim() || ORG.upiId;
  const upiPayeeName = activePayment?.upi_payee_name?.trim() || ORG.payeeName;
  const hasBackupPayment = Boolean(activePayment?.qr_image || activePayment?.bank_name);

  const handleDonate = (event: React.FormEvent) => {
    event.preventDefault();

    if (payableAmount < 1) {
      addToast("Please enter a donation amount", "warning");
      return;
    }
    if (payableAmount > 100000) {
      addToast("A single payment cannot exceed ₹1,00,000. Please split it into multiple payments.", "warning");
      return;
    }
    if (!upiId) {
      addToast("Payment is not configured", "warning");
      return;
    }

    setOpening(true);
    openUpiDeepLink({
      upiId,
      payeeName: upiPayeeName,
      amount: payableAmount,
      transactionRef: `HF-${Date.now()}`,
      note: `Change Life donation for ${cause.title}`,
    });
    addToast("Opening your payment app. Complete the payment there.", "info");
    window.setTimeout(() => setOpening(false), 1500);
  };

  return (
    <div className='min-h-screen overflow-x-hidden bg-brand-bg'>
      <PublicHeader />

      <main className='mx-auto box-border w-full max-w-[100vw] overflow-x-hidden px-4 py-8 lg:max-w-7xl'>
        <Link to='/causes' className='mb-5 inline-flex items-center gap-2 text-sm font-bold text-pink-500 hover:text-pink-600'>
          <ArrowLeft className='h-4 w-4 text-pink-500' />
          Back to causes
        </Link>

        <div className='grid min-w-0 max-w-[calc(100vw-2rem)] gap-8 lg:max-w-full lg:grid-cols-[minmax(0,1fr)_380px]'>
          <div className='min-w-0 max-w-[calc(100vw-2rem)] space-y-6 overflow-hidden lg:max-w-full'>
            <div className='overflow-hidden rounded-lg bg-brand-muted [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_video]:h-full [&_video]:w-full [&_video]:object-contain'>
              <ImageGallery images={mediaImages} alt={cause.title} />
            </div>

            <section className='min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-brand-dark/10 bg-white p-5 shadow-sm sm:p-6 lg:max-w-full'>
              <div className='mb-5 flex flex-wrap items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <div className='mb-3 flex flex-wrap gap-2'>
                    {cause.category && <Badge>{cause.category}</Badge>}
                    {cause.is_featured && <Badge variant='warning'>Featured</Badge>}
                    <Badge variant='success'>Verified</Badge>
                  </div>
                  <h1 className='max-w-full break-all text-2xl font-bold leading-tight text-brand-dark [overflow-wrap:anywhere] sm:break-words sm:text-3xl'>
                    {cause.title}
                  </h1>
                  {cause.full_description && (
                    <p className='mt-3 whitespace-pre-line break-words leading-7 text-brand-dark/70 [overflow-wrap:anywhere]'>
                      {cause.full_description}
                    </p>
                  )}
                </div>
              </div>



              {cause.videos?.length > 0 && (
                <div className='mt-8'>
                  <h2 className='mb-4 text-xl font-bold text-brand-dark'>Impact Videos</h2>
                  <VideoGallery videos={cause.videos} />
                </div>
              )}
            </section>
          </div>

          <aside className='h-max min-w-0 max-w-[calc(100vw-2rem)] rounded-lg border border-brand-dark/10 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:max-w-full'>
            <form onSubmit={handleDonate} className='space-y-4'>
              {unitPrice > 0 && (
                <div>
                  <span className='mb-2 block text-xs font-bold uppercase text-brand-dark/55'>
                    Choose in multiples of
                  </span>
                  <div className='mb-2 grid grid-cols-5 gap-1.5'>
                    {multipliers.map((m) => (
                      <button
                        key={m}
                        type='button'
                        onClick={() => {
                          setMultiplier(m);
                          setSelectedAmount(String(unitPrice * m));
                        }}
                        className={`rounded border px-2 py-2.5 text-center font-bold ${multiplier === m
                          ? "border-brand-warm bg-brand-warm text-white"
                          : "border-brand-dark/10 bg-white text-brand-dark hover:border-brand-warm hover:text-brand-warm"
                          }`}
                      >
                        <span className='block text-sm font-extrabold leading-tight'>{m}</span>
                        <span className='block text-[10px] font-semibold leading-tight opacity-80'>{unitLabel}</span>
                      </button>
                    ))}
                  </div>
                  <p className='rounded bg-brand-bg px-3 py-2 text-xs font-bold text-brand-dark'>
                    {multiplier || 1} {unitLabel} × {formatINR(unitPrice)} = <span className='text-brand-primary'>{formatINR(unitPrice * (multiplier || 1))}</span>
                  </p>
                </div>
              )}

              <div>
                <span className='mb-2 block text-xs font-bold uppercase text-brand-dark/55'>
                  Select amount
                </span>
                <div className='mb-3 grid grid-cols-3 gap-2'>
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type='button'
                      onClick={() => {
                        setMultiplier(null);
                        setSelectedAmount(String(amt));
                      }}
                      className={`rounded border px-3 py-2 text-sm font-bold ${selectedAmount === String(amt) && multiplier === null
                        ? "border-brand-warm bg-brand-warm text-white"
                        : "border-brand-dark/10 bg-white text-brand-dark hover:border-brand-warm hover:text-brand-warm"
                        }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type='number'
                  min='1'
                  inputMode='decimal'
                  value={selectedAmount}
                  onChange={(e) => {
                    setMultiplier(null);
                    setSelectedAmount(e.target.value);
                  }}
                  className='w-full rounded border border-brand-dark/15 bg-white px-3 py-3 text-base font-bold text-brand-dark outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15'
                  placeholder='Custom amount'
                />
              </div>

              {payableAmount > 0 && (
                <div className='rounded bg-brand-primary/8 px-4 py-3 text-center'>
                  <p className='text-xs font-semibold text-brand-dark/60'>You are paying</p>
                  <p className='text-2xl font-extrabold text-brand-primary'>{formatINR(payableAmount)}</p>
                </div>
              )}

              <div className='space-y-3 rounded border border-brand-dark/10 bg-brand-bg p-4'>
                <h3 className='flex items-center gap-2 font-bold text-brand-dark'>
                  <ShieldCheck className='h-4 w-4 text-pink-500' />
                  Donor Details (optional)
                </h3>
                <input
                  value={donorForm.donor_name}
                  onChange={(e) => updateDonorForm("donor_name", e.target.value)}
                  className='w-full rounded border border-brand-dark/15 bg-white px-3 py-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15'
                  placeholder='Full name (optional)'
                  autoComplete='name'
                />
                <input
                  type='tel'
                  value={donorForm.donor_phone}
                  onChange={(e) => updateDonorForm("donor_phone", e.target.value)}
                  className='w-full rounded border border-brand-dark/15 bg-white px-3 py-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15'
                  placeholder='Phone number (optional)'
                  autoComplete='tel'
                />
              </div>
              <p>or</p>
              <p> Pay as unknow person</p>

              <button
                type='submit'
                disabled={opening}
                className='flex w-full items-center justify-center h-12 rounded-xl bg-brand-accent text-white font-bold hover:bg-brand-accent-light transition animate-btn-float disabled:cursor-not-allowed disabled:opacity-70'
              >
                {opening ? (
                  <Loader2 className='h-5 w-5 mr-2 animate-spin' />
                ) : (
                  <QrCode className='h-5 w-5 mr-2' />
                )}
                {opening ? "Opening payment app..." : "Donate Now"}
              </button>
            </form>

            {hasBackupPayment && (
              <div className='mt-5 space-y-4 border-t border-brand-dark/10 pt-5'>
                <h3 className='flex items-center gap-2 font-bold text-brand-dark'>
                  <Banknote className='h-4 w-4 text-pink-500' />
                  Donation Methods
                </h3>

                {activePayment?.qr_image && (
                  <div className='rounded bg-brand-muted p-4 text-sm'>
                    <div className='mb-3 flex items-center justify-between gap-3'>
                      <p className='font-semibold text-brand-dark'>QR Image</p>
                      <QrCode className='h-5 w-5 text-pink-500' />
                    </div>
                    <img
                      src={activePayment.qr_image}
                      alt='Donation QR code'
                      className='mx-auto h-44 w-44 rounded bg-white object-contain p-2'
                    />
                  </div>
                )}

                {activePayment?.bank_name && (
                  <div className='rounded border border-brand-dark/10 p-4 text-sm text-brand-dark/70'>
                    <p className='font-semibold text-brand-dark'>Bank Transfer</p>
                    <PaymentRow label='Bank' value={activePayment.bank_name} />
                    <PaymentRow label='Account Name' value={activePayment.account_name} />
                    <PaymentRow label='Account Number' value={activePayment.account_number} />
                    <PaymentRow label='IFSC' value={activePayment.ifsc_code} />
                    <PaymentRow label='Branch' value={activePayment.branch_name} />
                  </div>
                )}

              </div>
            )}
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

const PaymentRow: React.FC<{
  label: string;
  value?: string | null;
}> = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className='mt-2 flex w-full items-center justify-between gap-3 rounded bg-brand-bg px-3 py-2 text-left'>
      <span>
        <span className='block text-xs font-semibold text-brand-dark/45'>{label}</span>
        <span className='break-all font-semibold text-brand-dark'>{value}</span>
      </span>
    </div>
  );
};
