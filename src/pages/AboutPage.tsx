import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, HeartHandshake, LockKeyhole, ShieldCheck, Users } from "lucide-react";
import heroChild from "@/assets/hero-child.jpg";
import { PublicFooter, PublicHeader } from "@/components/Layout";
import { LoadingCard } from "@/components/Loading";
import { PageBanner } from "@/components/PageBanner";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaultSiteContent } from "@/lib/api/siteContent";

export const AboutPage: React.FC = () => {
  const { data: siteRecord, isLoading } = useSiteContent();
  const content = siteRecord?.content || defaultSiteContent;
  const aboutImages = [content.about?.primaryImage, content.about?.secondaryImage].filter(Boolean) as string[];

  if (isLoading) {
    return (
      <div className='min-h-screen bg-brand-bg'>
        <PublicHeader />
        <div className='mx-auto max-w-7xl px-4 py-12'>
          <LoadingCard />
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-brand-bg'>
      <PublicHeader />
      <PageBanner
        image={content.about?.bannerImage || heroChild}
        alt="About Change Life"
      />

      <section className='bg-brand-dark py-12 text-white md:py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <p className='text-sm font-bold uppercase text-brand-warm'>About Change Life</p>
          <h1 className='mt-2 text-4xl font-bold'>{content.organizationName}</h1>
          <p className='mt-3 max-w-3xl text-white/75'>{content.tagline}</p>
        </div>
      </section>

      <section className='mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
        <div>
          <p className='text-sm font-bold uppercase text-brand-warm'>Our Story</p>
          <h2 className='mt-2 text-3xl font-bold text-brand-dark'>{content.about?.title}</h2>
          <p className='mt-4 leading-7 text-brand-dark/70'>{content.about?.description}</p>
          <div className='mt-6 grid gap-4 sm:grid-cols-3'>
            {[
              { title: "Transparency", icon: ShieldCheck },
              { title: "Verified Impact", icon: BadgeCheck },
              { title: "People First", icon: Users },
            ].map(({ title, icon: Icon }) => (
              <div key={title} className='rounded-lg border border-brand-dark/10 bg-white p-4'>
                <Icon className='mb-3 h-5 w-5 text-brand-primary' />
                <p className='font-bold text-brand-dark'>{title}</p>
              </div>
            ))}
          </div>
        </div>
        {aboutImages.length > 0 ? (
          <div className='grid grid-cols-2 gap-3'>
            {aboutImages.slice(0, 2).map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`Change Life about ${index + 1}`}
                className={`${index === 1 ? "mt-8" : ""} h-64 w-full rounded-lg object-cover`}
              />
            ))}
          </div>
        ) : (
          <div className='flex min-h-72 items-center justify-center rounded-lg border border-dashed border-brand-primary/25 bg-white p-8 text-center'>
            <div>
              <ShieldCheck className='mx-auto mb-3 h-9 w-9 text-brand-primary' />
              <p className='font-bold text-brand-dark'>No about images uploaded yet</p>
              <p className='mt-1 text-sm text-brand-dark/55'>Add about images from admin Site Content.</p>
            </div>
          </div>
        )}
      </section>

      <section className='bg-white py-14'>
        <div className='mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2'>
          <div className='rounded-lg border border-brand-dark/10 bg-brand-bg p-6'>
            <HeartHandshake className='mb-4 h-8 w-8 text-brand-warm' />
            <h2 className='text-2xl font-bold text-brand-dark'>{content.about?.missionTitle || "Our Mission"}</h2>
            <p className='mt-3 leading-7 text-brand-dark/70'>{content.about?.mission}</p>
          </div>
          <div className='rounded-lg border border-brand-dark/10 bg-brand-bg p-6'>
            <ShieldCheck className='mb-4 h-8 w-8 text-brand-primary' />
            <h2 className='text-2xl font-bold text-brand-dark'>{content.about?.visionTitle || "Our Vision"}</h2>
            <p className='mt-3 leading-7 text-brand-dark/70'>{content.about?.vision}</p>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-2'>
        <div className='flex items-center gap-3 rounded-lg border border-brand-accent/20 bg-brand-accent/8 px-5 py-4'>
          <span className='flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-accent text-white'>
            <LockKeyhole className='h-5 w-5' />
          </span>
          <h2 className='text-lg font-bold text-brand-dark'>Secure Donations</h2>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 py-14'>
        <div className='rounded-lg bg-brand-dark p-8 text-white md:p-10'>
          <div className='grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center'>
            <div>
              <p className='text-sm font-bold uppercase text-brand-warm'>Your Kindness Can Change Lives</p>
              <h2 className='mt-2 text-3xl font-bold'>Discover causes where your support makes a real difference</h2>
              <p className='mt-3 max-w-3xl text-white/70'>
                Each campaign is executed on the ground and shared with donors through clear progress.
              </p>
            </div>
            <Link
              to='/causes'
              className='inline-flex items-center justify-center gap-2 rounded bg-brand-accent px-5 py-3 text-sm font-bold text-white hover:bg-brand-accent-light'
            >
              Donate Now
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
