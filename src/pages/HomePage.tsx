import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  ChevronDown,
  Gift,
  HandHeart,
  Heart,
  HeartHandshake,
  IndianRupee,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Utensils,
} from "lucide-react";

import causeAnimals from "@/assets/cause-animals.jpg";
import causeEducation from "@/assets/cause-education.jpg";
import heroChild from "@/assets/hero-child.jpg";
import { CauseCard } from "@/components/Cards";
import { PublicFooter, PublicHeader } from "@/components/Layout";
import { LoadingGrid } from "@/components/Loading";
import { ORG } from "@/constants";
import { useCauses } from "@/hooks/useCauses";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import type { Cause } from "@/lib/api/causes";
import { CAUSE_CATEGORIES, getCategoryLabel } from "@/lib/api/causeCategories";
import { defaultSiteContent } from "@/lib/api/siteContent";

const GIVEA_HERO_VIDEO = "https://cdn.shopify.com/videos/c/o/v/10407d63bd0843698022b246a900db2b.mp4";

const GIVEA_IMPACT_CARDS = [
  { value: "₹10 Cr+", label: "Donations Raised", icon: IndianRupee },
  { value: "1 Lakh+", label: "Active Donors", icon: Users },
  { value: "7 Lakh+", label: "Birthday Giving", icon: Gift },
  { value: "20 Lakh+", label: "Lives Impacted", icon: HeartHandshake },
  { value: "35 Lakh+", label: "Meals Served", icon: Utensils },
];

const CORE_VALUES = [
  {
    title: "Radical Transparency",
    lead: "See exactly where your giving goes.",
    text: "Every contribution is backed by real photos, videos, and clear updates.",
    icon: ShieldCheck,
  },
  {
    title: "Dignity First",
    lead: "Help with respect, not pity.",
    text: "Every drive is handled with care for the people receiving support.",
    icon: HandHeart,
  },
  {
    title: "Verified Impact",
    lead: "Proof beats promises.",
    text: "From food distribution to celebrations, outcomes are documented and shared.",
    icon: BadgeCheck,
  },
  {
    title: "Purpose-Driven Giving",
    lead: "Every rupee has a reason.",
    text: "Donation options are designed for clear, meaningful, on-ground action.",
    icon: Award,
  },
  {
    title: "People Over Process",
    lead: "Compassion before complexity.",
    text: "Donors, beneficiaries, and volunteers stay at the center of every decision.",
    icon: Users,
  },
  {
    title: "Celebrate Humanity",
    lead: "Giving can be joyful.",
    text: "Birthdays, anniversaries, and milestones can become moments of care.",
    icon: Sparkles,
  },
];

const TREE_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpfKqNrXOUV2msWPXsi02WCCU2i3Xact_-b00kXdt9A&s=10";
const TREE_BLOG_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBhXtL4jroEzOeC3GNmQ6wjEdhJaJHgjRKYwEUXEp5wg&s=10";

const STORY_BLOCKS = [
  {
    title: "Shaping Futures Through Education",
    text: "Education creates opportunity where it is needed most. Your support helps children access learning material, confidence, and a better future.",
    cta: "Donate Now",
    image: causeEducation,
    to: "/causes",
    dark: true,
  },
];

const MeaningfulBirthdaySection: React.FC = () => (
  <section className="bg-[#8f174d] px-4 py-12 text-white md:px-6 md:py-20">
    <div className="mx-auto max-w-[1400px] space-y-16">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div className="overflow-hidden rounded-lg">
          <img src={TREE_IMAGE} alt="" className="aspect-[4/2] h-full w-full object-cover" loading="lazy" />
        </div>
        <div>
          <h2 className="text-[30px] font-bold leading-tight text-[#ffd1e3] md:text-[40px]">
            Be Part of Something Meaningful
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78">
            Join a community of people who turn compassion into action through verified drives, volunteer support, and clear donor updates.
          </p>
          <Link
            to="/causes"
            className="mt-7 inline-flex items-center justify-center rounded-full border-2 border-[#ffd1e3] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#ffd1e3] hover:text-[#8f174d]"
          >
            Donate Now
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15" />

      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div className="overflow-hidden rounded-lg md:order-2">
          <img src={heroChild} alt="" className="aspect-[4/3] h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="md:order-1">
          <h2 className="text-[30px] font-bold leading-tight text-[#ffd1e3] md:text-[40px]">
            A Birthday They Will Always Remember
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78">
            Celebrate your special day by feeding children, supporting families, and receiving genuine photos and videos that show the difference you created.
          </p>
          <Link
            to="/causes"
            className="mt-7 inline-flex items-center justify-center rounded-full border-2 border-[#ffd1e3] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#ffd1e3] hover:text-[#8f174d]"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const BLOG_POSTS = [
  {
    title: "Why Celebrating Your Birthday by Giving Is More Powerful Than Any Party",
    excerpt: "Birthdays do not have to end with cake and decorations. They can create care that lasts.",
    date: "January 2, 2026",
    image: heroChild,
  },
  {
    title: "Why Feeding Strays Is Responsibility, Not Just Charity",
    excerpt: "A small, consistent meal can become safety, trust, and survival for a street animal.",
    date: "January 2, 2026",
    image: causeAnimals,
  },
  {
    title: "Why Planting a Tree in Someone's Name Is a Thoughtful Gift",
    excerpt: "A living tribute can carry memory, shade, and hope into the years ahead.",
    date: "January 2, 2026",
    image: TREE_BLOG_IMAGE,
  },
];


const FEATURED_IN = ["Impact Daily", "Giving Times", "Hope Journal", "Kindness Wire"];

const FAQS = [
  {
    question: "Where will my donation be executed?",
    answer:
      "Donations are executed at verified on-ground locations by trusted field teams and local partners.",
  },
];

const getSupportEmail = (content: typeof defaultSiteContent) =>
  content.supportEmail || ORG.supportEmail;

const SectionHeader: React.FC<{ title: string; subtitle?: string; eyebrow?: string }> = ({
  title,
  subtitle,
  eyebrow,
}) => (
  <div className="mx-auto mb-10 max-w-3xl text-center">
    {eyebrow && (
      <p className="mb-2 text-xs font-bold uppercase text-brand-primary md:text-sm">{eyebrow}</p>
    )}
    <h2 className="text-[28px] font-bold leading-tight text-brand-dark md:text-[36px]">{title}</h2>
    {subtitle && <p className="mt-3 text-sm leading-6 text-brand-dark/60 md:text-base">{subtitle}</p>}
  </div>
);

const ImpactStats: React.FC<{
  items: Array<{
    value: string;
    label: string;
    text?: string;
    icon?: React.ElementType;
    iconUrl?: string;
  }>;
}> = ({ items }) => (
  <section
    className="w-full max-w-[100vw] overflow-hidden bg-[#6c63ff] px-2 py-4 sm:px-4 sm:py-5"
    aria-label="Impact highlights"
  >
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid w-full grid-cols-5 gap-1.5 sm:gap-3">
        {items.slice(0, 5).map((item, index) => {
          const Icon = item.icon || GIVEA_IMPACT_CARDS[index]?.icon || Heart;
          return (
            <div
              key={`${item.label}-${index}`}
              className="flex min-h-[108px] min-w-0 flex-col items-center justify-center rounded-lg border border-white/15 bg-white/14 px-1.5 py-3 text-center text-white shadow-[0_6px_18px_rgba(5,54,105,0.2)] sm:min-h-[124px] sm:px-3 sm:py-4"
            >
              <span
                className={`mb-2 grid h-7 w-7 place-items-center text-white sm:h-9 sm:w-9 ${item.iconUrl ? "rounded bg-white p-1" : ""
                  }`}
              >
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
                )}
              </span>
              <strong className="w-full break-words text-[11px] font-extrabold leading-tight sm:text-base">
                {item.value}
              </strong>
              <span className="mt-1 w-full break-words text-[9px] font-medium leading-[1.25] text-white/90 sm:text-xs">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const FeaturedCauseScroller: React.FC<{
  causes: Cause[];
  supportEmail: string;
}> = ({ causes = [], supportEmail }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const scroll = React.useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "right" ? 320 : -320, behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || causes.length === 0) return;
    intervalRef.current = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 12) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 2400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [causes.length]);

  const pauseAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="relative md:px-12">
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white text-brand-dark shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition hover:bg-brand-dark hover:text-white md:grid"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div
        ref={scrollRef}
        onMouseEnter={pauseAuto}
        onTouchStart={pauseAuto}
        className="flex snap-x gap-2 overflow-x-auto scroll-smooth pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {causes.map((cause) => (
          <div
            key={cause.id}
            className="featured-cause-slide min-w-0 flex-none snap-start"
          >
            <CauseCard cause={cause} supportEmail={supportEmail} />
          </div>
        ))}
      </div>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white text-brand-dark shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition hover:bg-brand-dark hover:text-white md:grid"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

const ValueGrid: React.FC = () => (
  <section className="bg-white px-4 py-12 md:px-6 md:py-16">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeader title="Our core values" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_VALUES.map(({ title, lead, text, icon: Icon }) => (
          <article
            key={title}
            className="rounded-lg bg-white p-6 text-center shadow-[0_3px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(233,30,99,0.14)]"
          >
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-primary/10 text-brand-primary">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
            <p className="mt-2 text-sm font-bold text-brand-primary">{lead}</p>
            <p className="mt-2 text-sm leading-6 text-brand-dark/65">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const StoryBand: React.FC<{
  title: string;
  text: string;
  image: string;
  cta: string;
  to: string;
  dark?: boolean;
  reverse?: boolean;
}> = ({ title, text, image, cta, to, dark, reverse }) => (
  <section className={`${dark ? "bg-[#8f174d] text-white" : "bg-white text-brand-dark"} px-4 py-12 md:px-6 md:py-20`}>
    <div
      className={`mx-auto grid max-w-[1400px] items-center gap-8 md:grid-cols-2 md:gap-14 ${reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
    >
      <div className="overflow-hidden rounded-lg">
        <img src={image} alt="" className="aspect-[4/3] h-full w-full object-cover" loading="lazy" />
      </div>
      <div className={dark ? "text-white" : "text-brand-dark"}>
        <h2 className={`text-[30px] font-bold leading-tight md:text-[40px] ${dark ? "text-[#ffd1e3]" : "text-brand-primary"}`}>
          {title}
        </h2>
        <p className={`mt-5 max-w-2xl text-base leading-7 ${dark ? "text-white/78" : "text-brand-dark/68"}`}>
          {text}
        </p>
        <Link
          to={to}
          className={`mt-7 inline-flex items-center justify-center rounded-full border-2 px-8 py-3 text-sm font-bold transition ${dark
            ? "border-[#ffd1e3] text-white hover:bg-[#ffd1e3] hover:text-[#8f174d]"
            : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            }`}
        >
          {cta}
        </Link>
      </div>
    </div>
  </section>
);

const BlogPreview: React.FC = () => (
  <section className="bg-white px-4 py-12 md:px-6 md:py-16">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeader title="Our Blog" />
      <div className="grid gap-5 md:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.title}
            className="overflow-hidden rounded-lg bg-white shadow-[0_3px_18px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(233,30,99,0.16)]"
          >
            <img src={post.image} alt="" className="aspect-[16/10] w-full object-cover" loading="lazy" />
            <div className="p-5">
              <p className="text-xs font-semibold text-brand-dark/45">{post.date}</p>
              <h3 className="mt-2 text-lg font-bold leading-tight text-brand-dark">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-brand-dark/60">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/about"
          className="inline-flex items-center justify-center rounded-full border-2 border-brand-primary px-8 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-primary hover:text-white"
        >
          View More
        </Link>
      </div>
    </div>
  </section>
);

const TrustSection: React.FC = () => (
  <section className="bg-white px-4 py-12 md:px-6 md:py-20">
    <div className="mx-auto grid max-w-[1400px] items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className="overflow-hidden rounded-lg bg-[#fff5f9] p-6">
        <div className="grid aspect-square place-items-center rounded-lg bg-white text-brand-primary shadow-inner">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-20 w-20" />
            <p className="mt-5 text-xl font-bold text-brand-dark">Verified proof after every drive</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-[30px] font-bold leading-tight text-brand-primary md:text-[40px]">
          Why People Trust Us
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-brand-dark/68">
          Trust is built through transparency. From verified impact to real photo and video updates,
          every action is tracked, honest, and accountable.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {["Verified teams", "Clear updates"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-brand-primary/12 bg-[#fff5f9] p-4">
              <BadgeCheck className="h-5 w-5 flex-none text-brand-primary" />
              <span className="text-sm font-bold text-brand-dark">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FeaturedInRibbon: React.FC = () => (
  <section className="bg-white px-4 py-10 md:px-6">
    <div className="mx-auto max-w-[1400px]">
      <h2 className="mb-6 text-center text-2xl font-bold text-brand-dark">As Featured In</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_IN.map((name) => (
          <div
            key={name}
            className="flex min-h-24 items-center justify-center gap-3 rounded-lg border border-brand-primary/12 bg-white px-5 text-center shadow-[0_3px_14px_rgba(0,0,0,0.08)]"
          >
            <Star className="h-5 w-5 fill-brand-primary text-brand-primary" />
            <span className="text-sm font-bold uppercase text-brand-dark/70">{name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FaqSection: React.FC = () => (
  <section className="bg-white px-4 py-12 md:px-6 md:py-16">
    <div className="mx-auto max-w-3xl">
      <SectionHeader
        title="Frequently asked questions"
        subtitle="Find answers to common questions about donations, proof, and updates."
      />
      <div className="space-y-3">
        {FAQS.map((item) => (
          <details
            key={item.question}
            className="group rounded-lg border border-brand-dark/10 bg-white p-0 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-brand-dark marker:hidden">
              {item.question}
              <ChevronDown className="h-5 w-5 flex-none text-brand-primary transition group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 text-sm leading-6 text-brand-dark/65">{item.answer}</div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export const HomePage: React.FC = () => {
  const { data: siteRecord } = useSiteContent();
  const { data: causes = [], isLoading: causesLoading } = useCauses({ active: true });
  const { data: paymentSettings = [] } = usePaymentSettings();
  const activePayment = paymentSettings.find((p) => p.is_active) || paymentSettings[0];
  const content = siteRecord?.content || defaultSiteContent;
  const supportEmail = getSupportEmail(content);
  const heroVideo = content.hero.video || GIVEA_HERO_VIDEO;
  const heroImage = content.hero.image || heroChild;
  const [activeCategory, setActiveCategory] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const featuredCauses = causes.filter((cause) => cause.is_featured).slice(0, 14);
  const scrollCauses = featuredCauses.length > 0 ? featuredCauses : causes.slice(0, 14);
  const configuredImpactCards = siteRecord?.content.homeImpact;
  const homeImpactCards = GIVEA_IMPACT_CARDS.map((fallback, index) => ({
    ...fallback,
    ...(configuredImpactCards?.[index] || {}),
  }));
  const homeFeaturedText = { ...defaultSiteContent.homeFeatured, ...content.homeFeatured };
  const homeCausesText = { ...defaultSiteContent.homeCauses, ...content.homeCauses };

  const filteredCauses = React.useMemo(() => {
    return causes.filter((cause) => {
      const categoryLabel = cause.category ? getCategoryLabel(cause.category) : "";
      const searchable = `${cause.title} ${cause.category || ""} ${categoryLabel}`.toLowerCase();
      const matchesSearch = !searchTerm || searchable.includes(searchTerm.toLowerCase());
      const matchesCategory = !activeCategory || cause.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, causes, searchTerm]);

  return (
    <div className="min-h-screen bg-white text-brand-dark">
      <PublicHeader />

      <section className="relative overflow-hidden bg-[#f4f4f4]">
        {heroVideo ? (
          <video
            key={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={typeof heroImage === "string" ? heroImage : undefined}
            className="h-[30vh] min-h-[240px] w-full object-cover md:h-[70vh]"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img src={heroImage} alt="" className="h-[30vh] min-h-[240px] w-full object-cover md:h-[70vh]" />
        )}
      </section>

      <ImpactStats items={homeImpactCards} />

      <section className="bg-white px-3 py-7 md:px-6">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader
            title={homeFeaturedText.title || "Featured Causes"}
            subtitle={homeFeaturedText.subtitle || "Support a child and make a difference today"}
          />
          {causesLoading ? (
            <LoadingGrid count={4} />
          ) : scrollCauses.length === 0 ? (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-black/15 bg-white p-10 text-center">
              <Heart className="mx-auto mb-3 h-8 w-8 text-brand-primary" />
              <p className="font-bold">No featured causes yet</p>
            </div>
          ) : (
            <FeaturedCauseScroller causes={scrollCauses} supportEmail={supportEmail} />
          )}
        </div>
      </section>

      {activePayment?.qr_image && (
        <section className="bg-white px-4 py-10 md:px-6">
          <div className="mx-auto max-w-[1400px]">
            <SectionHeader
              title="Scan & Donate"
              subtitle="Use any UPI app to scan and donate instantly"
            />
            <div className="mx-auto flex max-w-xs flex-col items-center gap-4 rounded-2xl border border-brand-dark/10 bg-brand-bg p-6 shadow-sm">
              <img
                src={activePayment.qr_image}
                alt="Donation QR code"
                className="h-56 w-56 rounded-xl bg-white object-contain p-2 shadow"
              />
              {activePayment.upi_id && (
                <p className="text-center text-sm font-semibold text-brand-dark/60">
                  UPI: <span className="font-bold text-brand-dark">{activePayment.upi_id}</span>
                </p>
              )}
              <p className="text-center text-xs text-brand-dark/45">Scan with PhonePe, GPay, Paytm or any UPI app</p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-4 py-12 md:px-6">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader
            title={homeCausesText.eyebrow || "Causes That Matter"}
            subtitle={homeCausesText.title || "Choose a cause and make a difference today"}
          />

          <label className="relative mx-auto mb-8 block max-w-[600px]">
            <span className="sr-only">Search causes</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={homeCausesText.searchPlaceholder || "Search for a cause or product..."}
              className="h-[52px] w-full rounded-full border-2 border-[#e0e0e0] bg-white px-5 pr-12 text-sm outline-none transition focus:border-brand-primary md:text-base"
            />
            <Search className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-dark/45" />
          </label>

          <div className="mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
            <div className="flex min-w-max gap-3">
              <button
                type="button"
                onClick={() => setActiveCategory("")}
                className={`flex-none rounded-full border-2 px-6 py-2.5 text-sm font-medium transition ${!activeCategory
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-brand-primary bg-white text-brand-primary hover:bg-[#fff5f9]"
                  }`}
              >
                All Causes
              </button>
              {CAUSE_CATEGORIES.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActiveCategory(category.slug)}
                  className={`flex-none rounded-full border-2 px-6 py-2.5 text-sm font-medium transition ${activeCategory === category.slug
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-brand-primary bg-white text-brand-primary hover:bg-[#fff5f9]"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {causesLoading ? (
            <LoadingGrid count={8} />
          ) : filteredCauses.length === 0 ? (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-black/15 bg-white p-10 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-brand-primary" />
              <p className="font-semibold text-brand-dark">No causes found</p>
              <p className="mt-2 text-sm text-brand-dark/55">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="flex snap-x gap-4 overflow-x-auto scroll-smooth pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-4 xl:gap-6" style={{ scrollbarWidth: "none" }}>
              {filteredCauses.map((cause) => (
                <div key={cause.id} className="w-full flex-none snap-start sm:w-auto">
                  <CauseCard cause={cause} supportEmail={supportEmail} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/causes"
              className="inline-flex items-center justify-center rounded-md bg-brand-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              Explore causes
            </Link>
          </div>
        </div>
      </section>

      <ValueGrid />

      <MeaningfulBirthdaySection />

      {STORY_BLOCKS.map((block, index) => (
        <StoryBand key={block.title} {...block} reverse={index % 2 === 1} />
      ))}

      <BlogPreview />

      <TrustSection />

      <FeaturedInRibbon />

      <FaqSection />

      <PublicFooter />
    </div>
  );
};
