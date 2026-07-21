import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Camera, CheckCircle2, Heart, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import causeEducation from "@/assets/cause-education.jpg";
import { CauseCard } from "@/components/Cards";
import { PublicFooter, PublicHeader } from "@/components/Layout";
import { LoadingGrid } from "@/components/Loading";
import { PageBanner } from "@/components/PageBanner";
import { useCauses } from "@/hooks/useCauses";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaultSiteContent } from "@/lib/api/siteContent";
import { getCauseImage } from "@/lib/fallbackMedia";

const steps = [
  {
    title: "Pick a cause",
    text: "Choose a verified campaign from the active causes list.",
    icon: Heart,
  },
  {
    title: "Donate directly",
    text: "Use UPI, QR, or bank transfer details from the cause page.",
    icon: CheckCircle2,
  },
  {
    title: "Ground execution",
    text: "The team completes the drive with local partners and volunteers.",
    icon: ShieldCheck,
  },

];

export const ImpactPage: React.FC = () => {
  const { data: siteRecord } = useSiteContent();
  const { data: causes = [], isLoading } = useCauses({ active: true });
  const content = siteRecord?.content || defaultSiteContent;
  const recentCauses = causes.slice(0, 3);
  const uploadedImages = causes.map((cause) => getCauseImage(cause)).filter(Boolean) as string[];

  // Same homeImpactCards as used on the Home page hero bar
  const homeImpactCards = content.homeImpact?.length ? content.homeImpact : defaultSiteContent.homeImpact || [];

  return (
    <div className='min-h-screen bg-brand-bg'>
      <PublicHeader />

      {/* Banner with hero text overlaid on top of the image */}
      <div className='relative'>
        <PageBanner
          image={content.impact?.bannerImage || causeEducation}
          alt="Change Life impact"
        />

        {/* Dark gradient scrim so white text stays readable over any image */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60' />

        <div className='absolute inset-0 flex items-center'>
          <div className='mx-auto w-full max-w-7xl px-4'>
            <p className='text-xs font-bold uppercase text-brand-warm md:text-sm'>Our Impact</p>
            <h1 className='mt-2 text-2xl font-bold text-white drop-shadow-md md:text-4xl'>
              You do not just give. You see your impact.
            </h1>
          </div>
        </div>
      </div>

      <section className='bg-brand-dark py-8 text-white'>
        <div className='mx-auto max-w-7xl px-4'>
          <p className='max-w-3xl text-white/75'>
            Every contribution becomes action on the ground, supported by transparent campaign progress and uploaded
            photo/video proof.
          </p>
        </div>
      </section>

      {/* Same cards as Home page hero bar */}
      <section className='mx-auto max-w-7xl px-4 py-12'>
        <div className='grid gap-3 rounded-lg border border-pink-200/70 bg-white/95 p-3 shadow-xl md:grid-cols-4'>
          {homeImpactCards.slice(0, 4).map((stat, index) => (
            <div key={`${stat.label}-${index}`} className='rounded bg-pink-50/80 p-5'>
              <span className='mb-4 flex h-11 w-11 items-center justify-center rounded bg-brand-warm text-white'>
                <Sparkles className='h-5 w-5' />
              </span>
              <p className='text-3xl font-bold text-brand-primary'>{stat.value}</p>
              <p className='mt-1 text-sm font-bold text-brand-dark'>{stat.label}</p>
              {stat.text && <p className='mt-2 text-xs leading-5 text-brand-dark/60'>{stat.text}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className='bg-white py-14'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-8 max-w-3xl'>
            <p className='text-sm font-bold uppercase text-brand-warm'>How Proof Works</p>
            <h2 className='mt-2 text-3xl font-bold text-brand-dark'>Simple steps from donation to visible proof</h2>
          </div>
          <div className='grid gap-4 md:grid-cols-4'>
            {steps.map(({ title, text, icon: Icon }, index) => (
              <div key={title} className='rounded-lg border border-brand-dark/10 bg-brand-bg p-5'>
                <div className='mb-4 flex items-center justify-between'>
                  <span className='flex h-11 w-11 items-center justify-center rounded bg-brand-primary text-white'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <span className='text-sm font-bold text-brand-dark/35'>0{index + 1}</span>
                </div>
                <h3 className='font-bold text-brand-dark'>{title}</h3>
                <p className='mt-2 text-sm leading-6 text-brand-dark/60'>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
        <div>
          {/* <p className='text-sm font-bold uppercase text-brand-warm'>Photo And Video Updates</p>
          <h2 className='mt-2 text-3xl font-bold text-brand-dark'>Impact proof belongs on every cause</h2>
          <p className='mt-4 leading-7 text-brand-dark/70'>
            Upload cause gallery images and videos from the admin panel. The public detail page will automatically show
            them as proof for donors.
          </p> */}
          <Link
            to='/causes'
            className='mt-7 inline-flex items-center gap-2 rounded bg-brand-accent px-5 py-3 text-sm font-bold text-white hover:bg-brand-accent-light'
          >
            Donate To A Cause
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
        {uploadedImages.length > 0 ? (
          <div className='grid grid-cols-2 gap-3'>
            {uploadedImages.slice(0, 4).map((image, index) => (
              <div key={`${image}-${index}`} className='relative overflow-hidden rounded-lg'>
                <img src={image} alt={`Uploaded impact proof ${index + 1}`} className='h-48 w-full object-cover sm:h-56' />
                <span className='absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-primary'>
                  <Camera className='mr-1 inline h-3 w-3' />
                  Uploaded
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex min-h-72 items-center justify-center rounded-lg border border-dashed border-brand-primary/25 bg-white p-8 text-center'>
            <div>
              <Camera className='mx-auto mb-3 h-10 w-10 text-brand-primary' />
              <p className='font-bold text-brand-dark'>No proof media uploaded yet</p>
              <p className='mt-1 text-sm text-brand-dark/55'>Upload gallery images or videos from admin causes.</p>
            </div>
          </div>
        )}
      </section>

      <section className='bg-white py-14'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
            <div>
              <p className='text-sm font-bold uppercase text-brand-warm'>Recent Causes</p>
              <h2 className='mt-2 text-3xl font-bold text-brand-dark'>Open a campaign and donate</h2>
            </div>
            <Link to='/causes' className='inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-warm'>
              View all
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          {isLoading ? (
            <LoadingGrid count={3} />
          ) : recentCauses.length > 0 ? (
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6'>
              {recentCauses.map((cause) => (
                <CauseCard key={cause.id} cause={cause} />
              ))}
            </div>
          ) : (
            <div className='rounded-lg border border-dashed border-brand-primary/25 bg-brand-bg p-10 text-center'>
              <p className='font-semibold text-brand-dark'>Create active causes to show campaign impact here.</p>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
