import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Banknote,
  Facebook,
  Gauge,
  HandHeart,
  Heart,
  Home,
  Instagram,
  ListChecks,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Send,
  Settings,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaultSiteContent } from "@/lib/api/siteContent";

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { path: "/admin/causes", label: "Causes", icon: ListChecks },
  { path: "/admin/payment-settings", label: "Payments", icon: Banknote },
  { path: "/admin/site-settings", label: "Site Content", icon: Settings },
  { path: "/admin/users", label: "Users", icon: Users },
];

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { data: siteRecord } = useSiteContent();
  const content = siteRecord?.content || defaultSiteContent;
  const logoUrl = content.hero?.logoUrl;
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/causes", label: "Causes", icon: Heart },
    { to: "/impact", label: "Our Impact", icon: Gauge },
    { to: "/about", label: "About Us", icon: Users },
    { to: "/contact", label: "Contact", icon: Banknote },
  ];

  return (
    <header className='sticky top-0 z-40 border-b border-black/10 bg-white'>
      <nav className='mx-auto flex min-h-[58px] w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-2 md:px-6'>
        <Link to='/' className='flex min-w-0 items-center gap-2 overflow-hidden text-brand-primary'>
          {logoUrl ? (
            <img src={logoUrl} alt={content.organizationName} className='h-8 w-auto max-w-[150px] object-contain' />
          ) : (
            <>
              <span className='flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-primary text-white'>
                <HandHeart className='h-5 w-5' />
              </span>
              <span className='min-w-0 truncate text-xl font-extrabold leading-none'>
                {content.organizationName?.replace(" Foundation", "") || "Change Life"}
              </span>
            </>
          )}
        </Link>

        <div className='hidden items-center gap-6 lg:flex'>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${isActive(to) ? "text-brand-primary" : "text-brand-dark/70 hover:text-brand-primary"
                }`}
            >
              <Icon className='h-4 w-4' />
              {label}
            </Link>
          ))}
          <Link
            to='/causes'
            className='inline-flex items-center justify-center rounded-md bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_14px_rgba(238,102,147,0.22)] transition hover:bg-[#d9467a]'
          >
            Donate Now
          </Link>
        </div>

        <button
          type='button'
          onClick={() => setMobileMenuOpen((open) => !open)}
          className='flex-none rounded-full p-2 text-brand-dark lg:hidden'
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className='border-t border-black/10 bg-white px-4 py-3 shadow-lg lg:hidden'>
          <div className='space-y-1'>
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold ${isActive(to) ? "bg-brand-primary/8 text-brand-primary" : "text-brand-dark/75"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className='h-4 w-4' />
                {label}
              </Link>
            ))}
            <Link
              to='/causes'
              className='mt-2 inline-flex w-full items-center justify-center rounded-md bg-brand-primary px-4 py-3 text-sm font-bold text-white'
              onClick={() => setMobileMenuOpen(false)}
            >
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export const PublicFooter: React.FC = () => {
  const { data: siteRecord } = useSiteContent();
  const content = siteRecord?.content || defaultSiteContent;
  const socialLinks = [
    { label: "Instagram", href: content.socials?.instagram, icon: Instagram },
    { label: "Facebook", href: content.socials?.facebook, icon: Facebook },
    { label: "YouTube", href: content.socials?.youtube, icon: Youtube },
  ].filter((item) => item.href);

  return (
    <footer className='bg-brand-primary text-white'>
      <div className='mx-auto max-w-[1400px] px-4 py-8 pb-28 text-center md:px-6 md:pb-10'>
        <h2 className='text-xl font-semibold md:text-2xl'>Join Our Giving Circle</h2>
        <form
          onSubmit={(event) => event.preventDefault()}
          className='mx-auto mt-5 flex h-12 max-w-md overflow-hidden rounded-full border border-white/35 bg-white'
        >
          <label className='sr-only' htmlFor='newsletter-email'>
            Email
          </label>
          <input
            id='newsletter-email'
            type='email'
            placeholder='Email'
            className='min-w-0 flex-1 px-5 text-sm text-brand-dark outline-none placeholder:text-brand-dark/45'
          />
          <button
            type='submit'
            aria-label='Subscribe'
            className='grid w-14 place-items-center bg-brand-primary text-white transition hover:bg-[#d9467a]'
          >
            <Send className='h-4 w-4' />
          </button>
        </form>

        <div className='mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/80'>
          <Link to='/' className='hover:text-white'>Home</Link>
          <Link to='/causes' className='hover:text-white'>Causes</Link>
          <Link to='/impact' className='hover:text-white'>Our Impact</Link>
          <Link to='/about' className='hover:text-white'>About Us</Link>
          <Link to='/contact' className='hover:text-white'>Contact</Link>
        </div>

        {socialLinks.length > 0 && (
          <div className='mt-6 flex justify-center gap-2'>
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target='_blank'
                rel='noreferrer'
                className='inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/12'
                aria-label={label}
              >
                <Icon className='h-5 w-5' />
              </a>
            ))}
          </div>
        )}

        <div className='mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70'>
          {content.supportEmail && <span className='inline-flex items-center gap-1.5'><Mail className='h-3.5 w-3.5' /> {content.supportEmail}</span>}
          {content.address && <span className='inline-flex items-center gap-1.5'><MapPin className='h-3.5 w-3.5' /> {content.address}</span>}
        </div>

        <div className='mt-7 border-t border-white/15 pt-5 text-xs text-white/65'>
          <p>© {new Date().getFullYear()} {content.organizationName || "Change Life"}</p>
          <p className='mt-2'>
            <a href='#' className='hover:text-white'>Privacy policy</a>
            <span className='mx-2'>|</span>
            <a href='#' className='hover:text-white'>Terms of service</a>
            <span className='mx-2'>|</span>
            <a href='#' className='hover:text-white'>Contact information</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export const AdminHeader: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className='sticky top-0 z-30 border-b border-brand-dark/10 bg-white'>
      <div className='flex items-center justify-between px-6 py-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <button
            type='button'
            onClick={onMenuClick}
            className='rounded border border-brand-dark/10 p-2 text-pink-500 hover:bg-pink-50 md:hidden'
            aria-label='Open admin menu'
          >
            <Menu className='h-5 w-5' />
          </button>
          <Link to='/admin/dashboard' className='flex min-w-0 items-center gap-2 font-bold text-pink-500'>
            <span className='flex h-9 w-9 flex-none items-center justify-center rounded bg-pink-500 text-white'>
              <HandHeart className='h-5 w-5' />
            </span>
            <span className='truncate'>Change Life Admin</span>
          </Link>
        </div>

        <div className='flex items-center gap-3'>
          <span className='hidden text-sm text-brand-dark/65 sm:inline'>{user?.email}</span>
          <button
            type='button'
            onClick={() => {
              logout();
              window.location.href = "/admin/login";
            }}
            className='inline-flex items-center gap-2 rounded border border-brand-dark/10 px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-pink-50'
          >
            <LogOut className='h-4 w-4 text-pink-500' />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className='fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-brand-dark pt-20 text-white md:block'>
      <nav className='space-y-2 px-4 py-6'>
        {adminLinks.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-semibold ${isActive(path) ? "bg-pink-500 text-white" : "text-white/70 hover:bg-white/10"
              }`}
          >
            <Icon className='h-4 w-4' />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className='min-h-screen bg-brand-bg'>
      <AdminSidebar />
      <div className='md:ml-64'>
        <AdminHeader onMenuClick={() => setMobileMenuOpen((open) => !open)} />
        {mobileMenuOpen && (
          <div className='sticky top-[73px] z-20 border-b border-brand-dark/10 bg-white p-3 shadow-sm md:hidden'>
            <nav className='grid gap-2'>
              {adminLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-bold ${isActive(path)
                    ? "bg-pink-500 text-white"
                    : "bg-brand-bg text-brand-dark hover:bg-pink-50"
                    }`}
                >
                  <Icon className='h-4 w-4' />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
        <main className='p-4 sm:p-6 lg:p-8'>{children}</main>
      </div>
    </div>
  );
};
