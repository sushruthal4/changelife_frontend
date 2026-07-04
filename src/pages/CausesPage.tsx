import React, { useState } from "react";
import { Heart, Search, Sparkles } from "lucide-react";

import causeMeal from "@/assets/cause-meal.jpg";
import { CauseCard } from "@/components/Cards";
import { EmptyState } from "@/components/Error";
import { PublicFooter, PublicHeader } from "@/components/Layout";
import { LoadingGrid } from "@/components/Loading";
import { PageBanner } from "@/components/PageBanner";
import { ORG } from "@/constants";
import { useCauses } from "@/hooks/useCauses";
import { useSiteContent } from "@/hooks/useSiteContent";
import { CAUSE_CATEGORIES, getCategoryLabel } from "@/lib/api/causeCategories";
import { defaultSiteContent } from "@/lib/api/siteContent";

const FEATURED_FILTER = "__featured";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

const getWhatsAppPhone = (content: typeof defaultSiteContent) =>
  WHATSAPP_NUMBER || content.whatsappNumber || content.supportPhone || ORG.whatsapp;

export const CausesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const { data: causes = [], isLoading } = useCauses({ active: true });
  const { data: siteRecord } = useSiteContent();
  const content = siteRecord?.content || defaultSiteContent;
  const causesPageText = { ...defaultSiteContent.causesPage, ...content.causesPage };
  const whatsappPhone = getWhatsAppPhone(content);

  const filteredCauses = causes.filter((cause) => {
    const categoryLabel = cause.category ? getCategoryLabel(cause.category) : "";
    const searchable = `${cause.title} ${cause.category || ""} ${categoryLabel}`.toLowerCase();
    const matchesSearch = !searchTerm || searchable.includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedSlug ||
      (selectedSlug === FEATURED_FILTER ? cause.is_featured : cause.category === selectedSlug);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white text-brand-dark">
      <PublicHeader />

      {/* Banner with heading text overlaid on top of the image */}
      <div className="relative">
        <PageBanner
          image={causesPageText.bannerImage || causeMeal}
          alt="Heart Fuel causes"
        />

        {/* Dark gradient scrim so white text stays readable over any image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-[28px] font-semibold leading-tight text-white drop-shadow-md md:text-[40px]">
            Causes <strong className="font-bold text-brand-primary">We Care</strong>
          </h1>
          <h2 className="mt-3 text-[22px] font-bold leading-tight text-white drop-shadow-md md:mt-4 md:text-[32px]">
            {causesPageText.title || "Causes That Matter"}
          </h2>
          <p className="mt-2 text-sm text-white/85 drop-shadow-sm md:text-base">
            {causesPageText.subtitle || "Choose a cause and make a difference today"}
          </p>
        </div>
      </div>

      <section className="bg-white px-4 py-6 md:px-6">
        <div className="mx-auto max-w-[1400px]">
          <label className="relative mx-auto mb-8 block max-w-[600px]">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={causesPageText.searchPlaceholder || "Search for a cause or product..."}
              className="h-[52px] w-full rounded-full border-2 border-[#e0e0e0] bg-white px-5 pr-12 text-sm outline-none transition focus:border-brand-primary md:text-base"
            />
            <Search className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-dark/45" />
          </label>

          <div className="mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
            <div className="flex min-w-max gap-3">
              <FilterPill active={!selectedSlug} onClick={() => setSelectedSlug("")}>
                All Causes
              </FilterPill>
              {CAUSE_CATEGORIES.map((category) => (
                <FilterPill
                  key={category.slug}
                  active={selectedSlug === category.slug}
                  onClick={() => setSelectedSlug(category.slug)}
                >
                  {category.label}
                </FilterPill>
              ))}
              <FilterPill
                active={selectedSlug === FEATURED_FILTER}
                onClick={() => setSelectedSlug(FEATURED_FILTER)}
              >
                Featured Cause
              </FilterPill>
            </div>
          </div>

          {isLoading ? (
            <LoadingGrid count={8} />
          ) : filteredCauses.length === 0 ? (
            <EmptyState
              title="No causes found"
              description="Try another search or filter, or create active causes from the admin panel."
            />
          ) : (
            <>
              <p className="mb-5 text-sm font-semibold text-brand-dark/50">
                Showing <span className="font-bold text-brand-primary">{filteredCauses.length}</span> of {causes.length} causes
              </p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                {filteredCauses.map((cause) => (
                  <CauseCard key={cause.id} cause={cause} whatsappPhone={whatsappPhone} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex flex-none items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-medium transition ${active
        ? "border-brand-primary bg-brand-primary text-white"
        : "border-brand-primary bg-white text-brand-primary hover:bg-[#fff5f9]"
        }`}
    >
      {active && <Sparkles className="h-3.5 w-3.5" />}
      {!active && children === "All Causes" && <Heart className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
