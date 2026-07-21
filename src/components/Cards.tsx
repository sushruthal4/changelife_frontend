import React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ImageOff, Mail } from "lucide-react";
import { Cause } from "@/lib/api/causes";
import { getCauseImage } from "@/lib/fallbackMedia";
import { ORG } from "@/constants";

interface CauseCardProps {
  cause: Cause;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  supportEmail?: string;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const buildEmailCauseUrl = (email: string, causeTitle: string) => {
  const subject = encodeURIComponent(`Donation enquiry: ${causeTitle}`);
  const body = encodeURIComponent(`Hi, I want to know more about donating for "${causeTitle}".`);
  return `mailto:${email}?subject=${subject}&body=${body}`;
};

export const CauseCard: React.FC<CauseCardProps> = ({
  cause,
  isAdmin,
  onEdit,
  onDelete,
  supportEmail,
}) => {
  const image = getCauseImage(cause);
  const email = supportEmail || ORG.supportEmail;
  const targetAmount = Number(cause.target_amount || 0);
  const raisedAmount = Number(cause.raised_amount || 0);
  const progressPct = targetAmount > 0 ? Math.min(100, Math.round((raisedAmount / targetAmount) * 100)) : 0;

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]'>
      <div className='relative aspect-square overflow-hidden bg-brand-muted'>
        <Link to='/causes/$id' params={{ id: cause.id }} className='absolute inset-0 block'>
          {image ? (
            <img
              src={image}
              alt={cause.title}
              className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-brand-muted text-brand-primary'>
              <div className='text-center'>
                <ImageOff className='mx-auto h-7 w-7 sm:h-10 sm:w-10' />
                <p className='mt-2 hidden text-xs font-bold text-brand-dark/55 sm:block'>No image uploaded</p>
              </div>
            </div>
          )}
        </Link>

        {!isAdmin && email && (
          <a
            href={buildEmailCauseUrl(email, cause.title)}
            target='_blank'
            rel='noreferrer'
            aria-label={`Email about ${cause.title}`}
            className='absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition hover:scale-105'
          >
            <Mail className='h-5 w-5' />
          </a>
        )}
      </div>

      <div className='flex min-w-0 flex-1 flex-col p-3 sm:p-4'>
        <Link to='/causes/$id' params={{ id: cause.id }} className='block min-w-0'>
          <h3 className='line-clamp-2 break-all text-[13px] font-extrabold leading-[1.3] text-brand-dark group-hover:text-brand-primary sm:text-base'>
            {cause.title}
          </h3>
        </Link>

        {cause.full_description && (
          <p className='mt-1.5 line-clamp-3 break-words text-[11px] leading-[1.5] text-brand-dark/60 [overflow-wrap:anywhere] sm:text-xs'>
            {cause.full_description}
          </p>
        )}

        {targetAmount > 0 && (
          <div className='mt-2'>
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-brand-dark/10'>
              <div
                className='h-full rounded-full bg-brand-primary transition-all duration-700'
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className='mt-1 flex items-center justify-between text-[13px] font-extrabold text-brand-dark sm:text-base'>
              <span className='text-brand-primary'>{formatINR(raisedAmount)} raised</span>
              <span className='text-brand-dark/70'>Goal: {formatINR(targetAmount)}</span>
            </div>
          </div>
        )}

        <div className='mt-2'>
          {!isAdmin && (
            <Link
              to='/causes/$id'
              params={{ id: cause.id }}
              className='mt-3 flex w-full items-center justify-center h-12 rounded-xl bg-brand-accent text-white font-bold hover:bg-brand-accent-light transition animate-btn-float'
            >
              <Heart className='h-5 w-5 mr-2' />
              Donate Now
            </Link>
          )}
        </div>

        {isAdmin && (
          <div className='mt-4 flex gap-2'>
            <button
              type='button'
              onClick={onEdit}
              className='flex-1 rounded bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark'
            >
              Edit
            </button>
            <button
              type='button'
              onClick={onDelete}
              className='flex-1 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700'
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt = "Gallery" }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [images.join("|")]);

  if (!images.length) {
    return (
      <div className='flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-brand-muted text-brand-dark/50'>
        <div className='text-center'>
          <Heart className='mx-auto mb-2 h-8 w-8 text-brand-primary' />
          <p className='text-sm font-semibold'>Images will be added soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-[calc(100vw-2rem)] space-y-3 overflow-hidden lg:max-w-full'>
      <div className='relative flex aspect-[4/3] max-h-[540px] w-full max-w-full items-center justify-center overflow-hidden rounded-lg border border-brand-dark/10 bg-brand-dark md:aspect-[16/9] md:max-h-[640px]'>
        <img
          src={images[selectedIndex]}
          alt={`${alt} ${selectedIndex + 1}`}
          className='h-full w-full object-contain'
        />
      </div>

      {images.length > 1 && (
        <div className='grid max-w-full grid-cols-4 gap-2 overflow-hidden sm:grid-cols-6'>
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type='button'
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-square overflow-hidden rounded border ${selectedIndex === idx ? "border-brand-primary ring-2 ring-brand-primary/30" : "border-brand-dark/10"
                }`}
              aria-label={`Show image ${idx + 1}`}
            >
              <img src={img} alt={`${alt} ${idx + 1}`} className='h-full w-full bg-white object-contain' />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface VideoGalleryProps {
  videos: string[];
}

const getVideoEmbedUrl = (url: string) => {
  if (url.includes("youtube.com/watch?v=")) {
    const id = new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  if (url.includes("youtu.be/")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]?.split("?")[0]}`;
  }

  return url;
};

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  if (!videos.length) return null;
  const gridClass = videos.length > 1 ? "grid grid-cols-1 gap-4 md:grid-cols-2" : "grid grid-cols-1 gap-4";

  return (
    <div className={gridClass}>
      {videos.map((video, idx) => (
        <div key={`${video}-${idx}`} className='aspect-video overflow-hidden rounded-lg bg-brand-dark'>
          {/\.(mp4|webm|ogg)(\?|$)/i.test(video) ? (
            <video src={video} controls className='h-full w-full object-contain' />
          ) : (
            <iframe
              src={getVideoEmbedUrl(video)}
              title={`Impact video ${idx + 1}`}
              className='h-full w-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          )}
        </div>
      ))}
    </div>
  );
};
