import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Gauge, Heart, Home, Mail } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/contexts/AuthContext";
import { DonationActivityToast } from "@/components/DonationActivityToast";
import { ToastProvider } from "@/contexts/ToastContext";
import { mergeDonorActivity } from "@/data/donorActivity";
import { createApiClient } from "@/lib/api/client";
import { ORG } from "@/constants";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaultSiteContent } from "@/lib/api/siteContent";

// Initialize API client on app start
createApiClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-semibold text-brand-dark">404</h1>
        <h2 className="mt-4 text-xl font-medium text-brand-dark">Page not found</h2>
        <p className="mt-2 text-sm text-brand-dark/60">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-bg transition-colors hover:bg-brand-warm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-semibold text-brand-dark">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-brand-dark/60">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-brand-dark px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-bg hover:bg-brand-warm transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-brand-dark/15 bg-brand-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark hover:bg-brand-dark/5"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Change Life — Give with Heart" },
      {
        name: "description",
        content:
          "Change Life is a transparent donation platform for verified causes with photo and video proof of impact.",
      },
      { name: "theme-color", content: "#ee6693" },
      { property: "og:title", content: "Change Life — Give with Heart" },
      { property: "og:description", content: "Verified giving with transparent proof and direct donation details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Change Life — Give with Heart" },
      { name: "twitter:description", content: "Verified giving with transparent proof and direct donation details." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Outlet />
          <PublicQuickActions />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function PublicQuickActions() {
  const location = useLocation();
  const { data: siteRecord } = useSiteContent();
  const content = siteRecord?.content || defaultSiteContent;
  const supportEmail = content.supportEmail || ORG.supportEmail;
  const isAdmin = location.pathname.startsWith("/admin");
  const donorActivity = mergeDonorActivity(content.donationActivity);
  const mailtoHref = `mailto:${supportEmail}?subject=${encodeURIComponent("Hi, I want to contribute")}&body=${encodeURIComponent("Hey, I'm exploring your website and would love to understand how I can contribute.")}`;

  return (
    <>
      {!isAdmin && <DonationActivityToast activity={donorActivity} />}

      {supportEmail && (
        <a
          href={mailtoHref}
          aria-label="Email us"
          className="animate-wa-float fixed bottom-24 right-4 z-[9999] inline-flex items-center gap-2 rounded-full bg-brand-primary px-3 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.22)] transition hover:bg-[#d9467a] md:bottom-8 md:right-5 md:text-sm"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/18 md:h-8 md:w-8">
            <span className="animate-wa-ring absolute -inset-1.5 rounded-full border border-white/55" />
            <Mail className="relative h-4 w-4 md:h-5 md:w-5" />
          </span>
          <span className="hidden sm:inline">Email us</span>
        </a>
      )}

      {!isAdmin && <MobileBottomNav pathname={location.pathname} />}
    </>
  );
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/causes", label: "Causes", icon: Heart },
    { to: "/impact", label: "Impact", icon: Gauge },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[9998] border-t border-black/10 bg-white shadow-[0_-8px_22px_rgba(0,0,0,0.08)] md:hidden">
      <div className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex h-[62px] flex-col items-center justify-center gap-1 text-[10px] font-semibold ${isActive(to) ? "text-brand-primary" : "text-brand-dark/60"
              }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
