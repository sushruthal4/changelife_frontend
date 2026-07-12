import { useEffect, useRef, useState } from "react";
import { Heart, X } from "lucide-react";

import { DONOR_ACTIVITY, type DonorActivityItem } from "@/data/donorActivity";

const ROTATION_INTERVAL_MS = 8_000;
const DISPLAY_DURATION_MS = 3_500;
const FIRST_POPUP_DELAY_MS = 1_000;
const STORAGE_KEY = "heart-fuel-donor-activity-index";

interface DonationActivityToastProps {
  activity?: DonorActivityItem[];
}

export function DonationActivityToast({ activity = DONOR_ACTIVITY }: DonationActivityToastProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activity.length === 0) return;

    const savedIndex = Number(window.sessionStorage.getItem(STORAGE_KEY));
    if (Number.isInteger(savedIndex) && savedIndex >= 0) {
      setCurrentIndex(savedIndex % activity.length);
    }

    const hidePopup = () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => setIsVisible(false), DISPLAY_DURATION_MS);
    };

    const showPopup = () => {
      setIsVisible(true);
      hidePopup();
    };

    const firstPopupTimeout = setTimeout(showPopup, FIRST_POPUP_DELAY_MS);
    const rotationInterval = setInterval(() => {
      setCurrentIndex((index) => {
        const nextIndex = (index + 1) % activity.length;
        window.sessionStorage.setItem(STORAGE_KEY, String(nextIndex));
        return nextIndex;
      });
      showPopup();
    }, ROTATION_INTERVAL_MS);

    return () => {
      clearTimeout(firstPopupTimeout);
      clearInterval(rotationInterval);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [activity.length]);

  if (!isVisible || activity.length === 0) return null;

  const donation = activity[currentIndex % activity.length];

  return (
    <aside
      className="animate-donation-pop fixed inset-x-3 top-[66px] z-[9997] mx-auto max-w-[360px]"
      aria-live="polite"
      aria-label="Recent donation"
    >
      <div className="flex min-h-[56px] items-center gap-2.5 rounded-lg border border-brand-primary/20 bg-white/95 px-3 py-2 shadow-[0_9px_24px_rgba(25,12,32,0.18)] backdrop-blur-md">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand-primary/10 text-brand-primary">
          <Heart className="h-4 w-4 fill-current" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold leading-4 text-brand-dark">
            {donation.donorName} donated{" "}
            <span className="text-brand-primary">₹{donation.amount.toLocaleString("en-IN")}</span>
          </p>
          <p className="truncate text-[10px] font-medium leading-4 text-brand-dark/55">
            {donation.donatedAt} · {donation.cause}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="grid h-7 w-7 flex-none place-items-center rounded-full text-brand-dark/45 transition hover:bg-brand-muted hover:text-brand-dark"
          aria-label="Close donation notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
