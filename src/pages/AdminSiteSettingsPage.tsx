import React, { useEffect, useState } from "react";
import { Image, Plus, RotateCcw, Save, Sparkles, Video, X } from "lucide-react";
import { AdminShell } from "@/components/Layout";
import { LoadingSpinner } from "@/components/Loading";
import { StorageUploadField } from "@/components/StorageUploadField";
import { useToast } from "@/contexts/ToastContext";
import {
  useCreateSiteContent,
  useSiteContent,
  useUpdateSiteContent,
} from "@/hooks/useSiteContent";
import { getApiErrorMessage } from "@/lib/api";
import { defaultSiteContent, SiteContentData } from "@/lib/api/siteContent";
import { uploadFileToStorage } from "@/lib/storage/upload";

// ── FIX 1: Extend the impact card type to include iconUrl ────────────────────
// SiteContentData["homeImpact"] doesn't have iconUrl, so we define our own
// local type that adds it. All card manipulation uses this type.
type ImpactCard = {
  label: string;
  value: string;
  text: string;
  iconUrl: string;
};

type ImpactCardKey = keyof ImpactCard;

// ── Helpers ───────────────────────────────────────────────────────────────────
type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (record: JsonRecord, key: string, fallback = "") => {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
};

// ── FIX 1 continued: normalizeImpactCards returns ImpactCard[] ───────────────
const normalizeImpactCards = (value: unknown): ImpactCard[] => {
  if (!Array.isArray(value)) {
    return (defaultSiteContent.homeImpact || []).map((c) => ({
      label: c.label ?? "",
      value: c.value ?? "",
      text: c.text ?? "",
      iconUrl: (c as { iconUrl?: string }).iconUrl ?? "",
    }));
  }
  return value
    .filter(isRecord)
    .map((item) => ({
      label: readString(item, "label", "Impact"),
      value: readString(item, "value", ""),
      text: readString(item, "text", ""),
      iconUrl: readString(item, "iconUrl", ""),  // ← no TS error now
    }))
    .filter((item) => item.label || item.value || item.text);
};

// ── Local content shape that uses our extended ImpactCard type ────────────────
type LocalSiteContent = Omit<SiteContentData, "homeImpact"> & {
  homeImpact: ImpactCard[];
};

const normalizeSiteContent = (value: unknown): LocalSiteContent => {
  const raw = isRecord(value) ? value : {};
  const hero = isRecord(raw.hero) ? raw.hero : {};
  const about = isRecord(raw.about) ? raw.about : {};
  const impact = isRecord(raw.impact) ? raw.impact : {};
  const footer = isRecord(raw.footer) ? raw.footer : {};
  const socials = isRecord(raw.socials) ? raw.socials : {};
  const homeFeatured = isRecord(raw.homeFeatured) ? raw.homeFeatured : {};
  const homeCauses = isRecord(raw.homeCauses) ? raw.homeCauses : {};
  const causesPage = isRecord(raw.causesPage) ? raw.causesPage : {};
  const contactPage = isRecord(raw.contactPage) ? raw.contactPage : {};

  return {
    ...defaultSiteContent,
    ...raw,
    organizationName: readString(raw, "organizationName", defaultSiteContent.organizationName),
    tagline: readString(raw, "tagline", defaultSiteContent.tagline || ""),
    supportEmail: readString(raw, "supportEmail", ""),
    supportPhone: readString(raw, "supportPhone", ""),
    whatsappNumber: readString(raw, "whatsappNumber", ""),
    address: readString(raw, "address", ""),
    hero: {
      ...defaultSiteContent.hero,
      ...hero,
      title: readString(hero, "title", defaultSiteContent.hero.title),
      description: readString(hero, "description", defaultSiteContent.hero.description),
      image: readString(hero, "image", ""),
      video: readString(hero, "video", ""),
      eyebrow: readString(hero, "eyebrow", ""),
    },
    about: {
      ...defaultSiteContent.about,
      ...about,
      title: readString(about, "title", defaultSiteContent.about?.title || ""),
      description: readString(about, "description", defaultSiteContent.about?.description || ""),
      missionTitle: readString(about, "missionTitle", defaultSiteContent.about?.missionTitle || ""),
      mission: readString(about, "mission", defaultSiteContent.about?.mission || ""),
      visionTitle: readString(about, "visionTitle", defaultSiteContent.about?.visionTitle || ""),
      vision: readString(about, "vision", defaultSiteContent.about?.vision || ""),
      bannerImage: readString(about, "bannerImage", ""),
      primaryImage: readString(about, "primaryImage", ""),
      secondaryImage: readString(about, "secondaryImage", ""),
    },
    homeImpact: normalizeImpactCards(raw.homeImpact),  // ← typed as ImpactCard[]
    homeFeatured: {
      ...defaultSiteContent.homeFeatured,
      ...homeFeatured,
      eyebrow: readString(homeFeatured, "eyebrow", defaultSiteContent.homeFeatured?.eyebrow || ""),
      title: readString(homeFeatured, "title", defaultSiteContent.homeFeatured?.title || ""),
      subtitle: readString(homeFeatured, "subtitle", defaultSiteContent.homeFeatured?.subtitle || ""),
    },
    homeCauses: {
      ...defaultSiteContent.homeCauses,
      ...homeCauses,
      eyebrow: readString(homeCauses, "eyebrow", defaultSiteContent.homeCauses?.eyebrow || ""),
      title: readString(homeCauses, "title", defaultSiteContent.homeCauses?.title || ""),
      subtitle: readString(homeCauses, "subtitle", defaultSiteContent.homeCauses?.subtitle || ""),
      searchPlaceholder: readString(
        homeCauses,
        "searchPlaceholder",
        defaultSiteContent.homeCauses?.searchPlaceholder || "",
      ),
    },
    causesPage: {
      ...defaultSiteContent.causesPage,
      ...causesPage,
      eyebrow: readString(causesPage, "eyebrow", defaultSiteContent.causesPage?.eyebrow || ""),
      title: readString(causesPage, "title", defaultSiteContent.causesPage?.title || ""),
      subtitle: readString(causesPage, "subtitle", defaultSiteContent.causesPage?.subtitle || ""),
      searchPlaceholder: readString(
        causesPage,
        "searchPlaceholder",
        defaultSiteContent.causesPage?.searchPlaceholder || "",
      ),
      bannerImage: readString(causesPage, "bannerImage", ""),
    },
    contactPage: {
      ...defaultSiteContent.contactPage,
      ...contactPage,
      bannerImage: readString(contactPage, "bannerImage", ""),
    },
    impact: {
      ...defaultSiteContent.impact,
      ...impact,
      donors: readString(impact, "donors", ""),
      raised: readString(impact, "raised", ""),
      lives: readString(impact, "lives", ""),
      meals: readString(impact, "meals", ""),
      proof: readString(impact, "proof", defaultSiteContent.impact?.proof || ""),
      bannerImage: readString(impact, "bannerImage", ""),
    },
    footer: {
      ...defaultSiteContent.footer,
      ...footer,
      title: readString(footer, "title", defaultSiteContent.footer?.title || ""),
      note: readString(footer, "note", defaultSiteContent.footer?.note || ""),
      image: readString(footer, "image", ""),
      mapImage: readString(footer, "mapImage", ""),
    },
    socials: {
      ...defaultSiteContent.socials,
      ...socials,
      facebook: readString(socials, "facebook", ""),
      instagram: readString(socials, "instagram", ""),
      youtube: readString(socials, "youtube", ""),
      linkedin: readString(socials, "linkedin", ""),
    },
    donationActivity: Array.isArray(raw.donationActivity)
      ? (raw.donationActivity as SiteContentData["donationActivity"])
      : [],
  };
};

// ─────────────────────────────────────────────────────────────────────────────

export const AdminSiteSettingsPage: React.FC = () => {
  const { data: siteRecord, isLoading } = useSiteContent();
  const createMutation = useCreateSiteContent();
  const updateMutation = useUpdateSiteContent();
  const { addToast } = useToast();
  const [content, setContent] = useState<LocalSiteContent>(
    normalizeSiteContent(defaultSiteContent),
  );

  // FIX 4: Single useEffect — only runs when siteRecord loads/changes from the
  // server. We do NOT sync content → JSON on every keystroke (that was the
  // infinite-loop / overwrite bug). JSON is only produced at save time.
  useEffect(() => {
    const next = normalizeSiteContent(siteRecord?.content ?? defaultSiteContent);
    setContent(next);
  }, [siteRecord]);

  const updateContent = (next: Partial<LocalSiteContent>) =>
    setContent((c) => ({ ...c, ...next }));

  const updateNested = <K extends keyof LocalSiteContent>(
    section: K,
    value: Partial<NonNullable<LocalSiteContent[K]>>,
  ) =>
    setContent((c) => ({
      ...c,
      [section]: { ...(c[section] as Record<string, unknown>), ...value },
    }));

  // FIX 5: handleSubmit now serializes content directly — no separate jsonText
  // state needed. Removes the invisible JSON editor that was causing confusion.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Cast back to SiteContentData for the API (homeImpact shape is compatible)
      const contentToSave = content as unknown as SiteContentData;
      if (siteRecord) {
        await updateMutation.mutateAsync(contentToSave);
        addToast("Site content updated", "success");
      } else {
        await createMutation.mutateAsync(contentToSave);
        addToast("Site content created", "success");
      }
    } catch (err) {
      addToast(getApiErrorMessage(err, "Failed to save site content"), "error");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const resetForm = () => {
    setContent(normalizeSiteContent(defaultSiteContent));
  };

  // ── Upload helpers ──────────────────────────────────────────────────────────
  const [uploadingKey, setUploadingKey] = useState("");

  const uploadSiteImage = async (
    files: File[],
    target:
      | "hero.image"
      | "about.bannerImage"
      | "about.primaryImage"
      | "about.secondaryImage"
      | "causesPage.bannerImage"
      | "impact.bannerImage"
      | "contactPage.bannerImage"
      | "footer.image"
      | "footer.mapImage",
  ) => {
    const file = files[0];
    if (!file) return;
    try {
      setUploadingKey(target);
      const uploaded = await uploadFileToStorage(file, { bucket: "images", folder: "site-content" });
      if (target === "hero.image") updateNested("hero", { image: uploaded.url });
      else if (target === "about.bannerImage") updateNested("about", { bannerImage: uploaded.url });
      else if (target === "about.primaryImage") updateNested("about", { primaryImage: uploaded.url });
      else if (target === "about.secondaryImage") updateNested("about", { secondaryImage: uploaded.url });
      else if (target === "causesPage.bannerImage") updateNested("causesPage", { bannerImage: uploaded.url });
      else if (target === "impact.bannerImage") updateNested("impact", { bannerImage: uploaded.url });
      else if (target === "contactPage.bannerImage") updateNested("contactPage", { bannerImage: uploaded.url });
      else if (target === "footer.image") updateNested("footer", { image: uploaded.url });
      else updateNested("footer", { mapImage: uploaded.url });
      addToast("Image uploaded", "success");
    } catch (err) {
      addToast(getApiErrorMessage(err, "Image upload failed"), "error");
    } finally {
      setUploadingKey("");
    }
  };

  const uploadHeroVideo = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    try {
      setUploadingKey("hero.video");
      const uploaded = await uploadFileToStorage(file, { bucket: "videos", folder: "site-content" });
      updateNested("hero", { video: uploaded.url });
      addToast("Video uploaded", "success");
    } catch (err) {
      addToast(getApiErrorMessage(err, "Video upload failed"), "error");
    } finally {
      setUploadingKey("");
    }
  };

  const uploadImpactCardIcon = async (files: File[], index: number) => {
    const file = files[0];
    if (!file) return;
    const key = `impact-icon-${index}`;
    try {
      setUploadingKey(key);
      const uploaded = await uploadFileToStorage(file, { bucket: "images", folder: "impact-icons" });
      updateImpactCard(index, "iconUrl", uploaded.url);
      addToast("Icon uploaded", "success");
    } catch (err) {
      addToast(getApiErrorMessage(err, "Icon upload failed"), "error");
    } finally {
      setUploadingKey("");
    }
  };

  // ── Impact card CRUD ────────────────────────────────────────────────────────

  // FIX 2: cards[index] is now properly typed as ImpactCard — no unsafe spread needed
  const updateImpactCard = (index: number, key: ImpactCardKey, value: string) => {
    const cards: ImpactCard[] = [...(content.homeImpact ?? [])];
    const existing: ImpactCard = cards[index] ?? { label: "", value: "", text: "", iconUrl: "" };
    cards[index] = { ...existing, [key]: value };
    updateContent({ homeImpact: cards });
  };

  const addImpactCard = () =>
    updateContent({
      homeImpact: [
        ...(content.homeImpact ?? []),
        { label: "New Impact", value: "0+", text: "", iconUrl: "" },
      ],
    });

  const removeImpactCard = (index: number) =>
    updateContent({
      homeImpact: (content.homeImpact ?? []).filter((_, i) => i !== index),
    });

  if (isLoading) return <AdminShell><LoadingSpinner /></AdminShell>;

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Site Content</h1>
          <p className="mt-1 text-brand-dark/60">Edit public website content from one place.</p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded border border-brand-dark/15 px-4 py-3 text-sm font-bold text-brand-dark hover:bg-brand-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl space-y-6">

        {/* ── ORGANIZATION ─────────────────────────────────────── */}
        <Section title="Organization">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Organization Name">
              <input
                value={content.organizationName}
                onChange={(e) => updateContent({ organizationName: e.target.value })}
                className="input-admin"
                required
              />
            </Field>
            <Field label="Tagline">
              <input
                value={content.tagline || ""}
                onChange={(e) => updateContent({ tagline: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="Support Email">
              <input
                type="email"
                value={content.supportEmail || ""}
                onChange={(e) => updateContent({ supportEmail: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="Support Phone">
              <input
                value={content.supportPhone || ""}
                onChange={(e) => updateContent({ supportPhone: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="WhatsApp Number">
              <input
                value={content.whatsappNumber || ""}
                onChange={(e) => updateContent({ whatsappNumber: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="Address">
              <input
                value={content.address || ""}
                onChange={(e) => updateContent({ address: e.target.value })}
                className="input-admin"
              />
            </Field>
          </div>
        </Section>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <Section title="Hero">
          <div className="space-y-4">
            <Field label="Eyebrow">
              <input
                value={content.hero.eyebrow || ""}
                onChange={(e) => updateNested("hero", { eyebrow: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="Title">
              <input
                value={content.hero.title}
                onChange={(e) => updateNested("hero", { title: e.target.value })}
                className="input-admin"
                required
              />
            </Field>
            <Field label="Description">
              <textarea
                value={content.hero.description}
                onChange={(e) => updateNested("hero", { description: e.target.value })}
                className="input-admin min-h-24"
                required
              />
            </Field>

            <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-dark">
                <Video className="h-4 w-4 text-pink-500" />
                Hero Background Video
              </p>
              <p className="mb-3 text-xs text-brand-dark/55">
                If set, video plays automatically (muted, looped) behind hero text. Leave empty to use the image instead.
              </p>
              <VideoUploadControl
                label="Hero Background Video"
                value={content.hero.video || ""}
                loading={uploadingKey === "hero.video"}
                onFiles={uploadHeroVideo}
                onClear={() => updateNested("hero", { video: "" })}
              />
            </div>

            <ImageUploadControl
              label="Hero Background Image (fallback / poster)"
              value={content.hero.image || ""}
              loading={uploadingKey === "hero.image"}
              onFiles={(files) => uploadSiteImage(files, "hero.image")}
              onClear={() => updateNested("hero", { image: "" })}
            />
          </div>
        </Section>

        {/* ── PUBLIC PAGE BANNERS ─────────────────────────────── */}
        <Section title="Public Page Banner Images">
          <div className="mb-5 rounded-lg border border-pink-100 bg-pink-50/60 p-4">
            <p className="text-sm font-bold text-brand-dark">One banner image for each public page</p>
            <p className="mt-1 text-xs leading-5 text-brand-dark/60">
              These images appear directly below the header on Causes, Impact, Contact, and About.
              The Home page continues to use the Hero video above.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <ImageUploadControl
              label="Causes Page Banner"
              value={content.causesPage?.bannerImage || ""}
              loading={uploadingKey === "causesPage.bannerImage"}
              onFiles={(files) => uploadSiteImage(files, "causesPage.bannerImage")}
              onClear={() => updateNested("causesPage", { bannerImage: "" })}
            />
            <ImageUploadControl
              label="Impact Page Banner"
              value={content.impact?.bannerImage || ""}
              loading={uploadingKey === "impact.bannerImage"}
              onFiles={(files) => uploadSiteImage(files, "impact.bannerImage")}
              onClear={() => updateNested("impact", { bannerImage: "" })}
            />
            <ImageUploadControl
              label="Contact Page Banner"
              value={content.contactPage?.bannerImage || ""}
              loading={uploadingKey === "contactPage.bannerImage"}
              onFiles={(files) => uploadSiteImage(files, "contactPage.bannerImage")}
              onClear={() => updateNested("contactPage", { bannerImage: "" })}
            />
            <ImageUploadControl
              label="About Page Banner"
              value={content.about?.bannerImage || ""}
              loading={uploadingKey === "about.bannerImage"}
              onFiles={(files) => uploadSiteImage(files, "about.bannerImage")}
              onClear={() => updateNested("about", { bannerImage: "" })}
            />
          </div>
        </Section>

        {/* ── ABOUT ────────────────────────────────────────────── */}
        <Section title="About">
          <div className="space-y-4">
            <Field label="Title">
              <input
                value={content.about?.title || ""}
                onChange={(e) => updateNested("about", { title: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={content.about?.description || ""}
                onChange={(e) => updateNested("about", { description: e.target.value })}
                className="input-admin min-h-28"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mission Title">
                <input
                  value={content.about?.missionTitle || ""}
                  onChange={(e) => updateNested("about", { missionTitle: e.target.value })}
                  className="input-admin"
                />
              </Field>
              <Field label="Vision Title">
                <input
                  value={content.about?.visionTitle || ""}
                  onChange={(e) => updateNested("about", { visionTitle: e.target.value })}
                  className="input-admin"
                />
              </Field>
            </div>
            <Field label="Mission">
              <textarea
                value={content.about?.mission || ""}
                onChange={(e) => updateNested("about", { mission: e.target.value })}
                className="input-admin min-h-24"
              />
            </Field>
            <Field label="Vision">
              <textarea
                value={content.about?.vision || ""}
                onChange={(e) => updateNested("about", { vision: e.target.value })}
                className="input-admin min-h-24"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <ImageUploadControl
                label="About Story Primary Image"
                value={content.about?.primaryImage || ""}
                loading={uploadingKey === "about.primaryImage"}
                onFiles={(files) => uploadSiteImage(files, "about.primaryImage")}
                onClear={() => updateNested("about", { primaryImage: "" })}
              />
              <ImageUploadControl
                label="About Story Secondary Image"
                value={content.about?.secondaryImage || ""}
                loading={uploadingKey === "about.secondaryImage"}
                onFiles={(files) => uploadSiteImage(files, "about.secondaryImage")}
                onClear={() => updateNested("about", { secondaryImage: "" })}
              />
            </div>
          </div>
        </Section>

        {/* ── PUBLIC CAUSE SECTION TEXT ─────────────────────────── */}
        <Section title="Homepage and Causes Text">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-xl border border-pink-100 bg-[#fafafa] p-4">
              <p className="mb-4 text-sm font-extrabold text-brand-dark">Homepage Featured Causes</p>
              <div className="space-y-4">
                <Field label="Small Label">
                  <input
                    value={content.homeFeatured?.eyebrow || ""}
                    onChange={(e) => updateNested("homeFeatured", { eyebrow: e.target.value })}
                    className="input-admin"
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={content.homeFeatured?.title || ""}
                    onChange={(e) => updateNested("homeFeatured", { title: e.target.value })}
                    className="input-admin"
                  />
                </Field>
                <Field label="Subtitle">
                  <textarea
                    value={content.homeFeatured?.subtitle || ""}
                    onChange={(e) => updateNested("homeFeatured", { subtitle: e.target.value })}
                    className="input-admin min-h-20"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-pink-100 bg-[#fafafa] p-4">
              <p className="mb-4 text-sm font-extrabold text-brand-dark">Homepage Causes Grid</p>
              <div className="space-y-4">
                <Field label="Small Label">
                  <input
                    value={content.homeCauses?.eyebrow || ""}
                    onChange={(e) => updateNested("homeCauses", { eyebrow: e.target.value })}
                    className="input-admin"
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={content.homeCauses?.title || ""}
                    onChange={(e) => updateNested("homeCauses", { title: e.target.value })}
                    className="input-admin"
                  />
                </Field>
                <Field label="Subtitle">
                  <textarea
                    value={content.homeCauses?.subtitle || ""}
                    onChange={(e) => updateNested("homeCauses", { subtitle: e.target.value })}
                    className="input-admin min-h-20"
                  />
                </Field>
                <Field label="Search Placeholder">
                  <input
                    value={content.homeCauses?.searchPlaceholder || ""}
                    onChange={(e) => updateNested("homeCauses", { searchPlaceholder: e.target.value })}
                    className="input-admin"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-pink-100 bg-[#fafafa] p-4">
              <p className="mb-4 text-sm font-extrabold text-brand-dark">Public Causes Page</p>
              <div className="space-y-4">
                <Field label="Small Label">
                  <input
                    value={content.causesPage?.eyebrow || ""}
                    onChange={(e) => updateNested("causesPage", { eyebrow: e.target.value })}
                    className="input-admin"
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={content.causesPage?.title || ""}
                    onChange={(e) => updateNested("causesPage", { title: e.target.value })}
                    className="input-admin"
                  />
                </Field>
                <Field label="Subtitle">
                  <textarea
                    value={content.causesPage?.subtitle || ""}
                    onChange={(e) => updateNested("causesPage", { subtitle: e.target.value })}
                    className="input-admin min-h-20"
                  />
                </Field>
                <Field label="Search Placeholder">
                  <input
                    value={content.causesPage?.searchPlaceholder || ""}
                    onChange={(e) => updateNested("causesPage", { searchPlaceholder: e.target.value })}
                    className="input-admin"
                  />
                </Field>
              </div>
            </div>
          </div>
        </Section>

        {/* ── HOMEPAGE IMPACT CARDS ─────────────────────────────── */}
        <Section title="Homepage Impact Cards">
          <p className="mb-4 text-sm text-brand-dark/55">
            These appear as stat cards right below the hero video. You can upload a custom icon image per card,
            or leave it blank to use the default pink icon.
          </p>
          <div className="space-y-4">
            {(content.homeImpact ?? []).map((card, index) => (
              <div key={index} className="rounded-xl border border-pink-100 bg-[#fafafa] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-extrabold text-brand-dark">Impact Card {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeImpactCard(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"
                    aria-label="Remove card"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Value (e.g. 2500+)">
                    <input
                      value={card.value}
                      onChange={(e) => updateImpactCard(index, "value", e.target.value)}
                      className="input-admin"
                      placeholder="2500+"
                    />
                  </Field>
                  <Field label="Label (e.g. Families)">
                    <input
                      value={card.label}
                      onChange={(e) => updateImpactCard(index, "label", e.target.value)}
                      className="input-admin"
                      placeholder="Families Reached"
                    />
                  </Field>
                  <Field label="Short Text">
                    <input
                      value={card.text || ""}
                      onChange={(e) => updateImpactCard(index, "text", e.target.value)}
                      className="input-admin"
                      placeholder="Shown below label"
                    />
                  </Field>
                </div>

                {/* ── Icon image upload per card ──────────────── */}
                <div className="mt-4 rounded-xl border border-pink-100 bg-white p-4">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-brand-dark/50">
                    Card Icon Image (optional)
                  </p>
                  <div className="flex items-start gap-4">
                    {/* FIX 3: card is typed as ImpactCard — no cast needed */}
                    <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-xl border border-pink-100 bg-pink-50">
                      {card.iconUrl ? (
                        <img
                          src={card.iconUrl}
                          alt="icon"
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <Sparkles className="h-7 w-7 text-pink-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <StorageUploadField
                        accept="image/*"
                        label={`Icon for Card ${index + 1}`}
                        helperText="PNG/SVG icon — shows above the number (max 200×200)"
                        loading={uploadingKey === `impact-icon-${index}`}
                        onFiles={(files) => uploadImpactCardIcon(files, index)}
                      />
                      {card.iconUrl && (
                        <button
                          type="button"
                          onClick={() => updateImpactCard(index, "iconUrl", "")}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600"
                        >
                          <X className="h-3.5 w-3.5" />
                          Remove icon
                        </button>
                      )}
                      {card.iconUrl && (
                        <p className="truncate text-[0.7rem] text-brand-dark/40">
                          {card.iconUrl}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addImpactCard}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-pink-300 bg-pink-50 px-5 py-3 text-sm font-bold text-pink-500 hover:bg-pink-100"
            >
              <Plus className="h-4 w-4" />
              Add Impact Card
            </button>
          </div>
        </Section>

        {/* ── IMPACT PAGE NUMBERS ───────────────────────────────── */}
        <Section title="Impact Page Numbers">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Donors">
              <input value={content.impact?.donors || ""} onChange={(e) => updateNested("impact", { donors: e.target.value })} className="input-admin" />
            </Field>
            <Field label="Raised">
              <input value={content.impact?.raised || ""} onChange={(e) => updateNested("impact", { raised: e.target.value })} className="input-admin" />
            </Field>
            <Field label="Lives">
              <input value={content.impact?.lives || ""} onChange={(e) => updateNested("impact", { lives: e.target.value })} className="input-admin" />
            </Field>
            <Field label="Meals">
              <input value={content.impact?.meals || ""} onChange={(e) => updateNested("impact", { meals: e.target.value })} className="input-admin" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Proof Message">
              <textarea
                value={content.impact?.proof || ""}
                onChange={(e) => updateNested("impact", { proof: e.target.value })}
                className="input-admin min-h-20"
              />
            </Field>
          </div>
        </Section>

        {/* ── FOOTER & SOCIALS ─────────────────────────────────── */}
        <Section title="Footer and Socials">
          <div className="space-y-4">
            <Field label="Footer Title">
              <input
                value={content.footer?.title || ""}
                onChange={(e) => updateNested("footer", { title: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="Footer Note">
              <textarea
                value={content.footer?.note || ""}
                onChange={(e) => updateNested("footer", { note: e.target.value })}
                className="input-admin min-h-20"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <ImageUploadControl
                label="Footer Image"
                value={content.footer?.image || ""}
                loading={uploadingKey === "footer.image"}
                onFiles={(f) => uploadSiteImage(f, "footer.image")}
                onClear={() => updateNested("footer", { image: "" })}
              />
              <ImageUploadControl
                label="Footer Map / Location Image"
                value={content.footer?.mapImage || ""}
                loading={uploadingKey === "footer.mapImage"}
                onFiles={(f) => uploadSiteImage(f, "footer.mapImage")}
                onClear={() => updateNested("footer", { mapImage: "" })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Facebook">
                <input value={content.socials?.facebook || ""} onChange={(e) => updateNested("socials", { facebook: e.target.value })} className="input-admin" />
              </Field>
              <Field label="Instagram">
                <input value={content.socials?.instagram || ""} onChange={(e) => updateNested("socials", { instagram: e.target.value })} className="input-admin" />
              </Field>
              <Field label="YouTube">
                <input value={content.socials?.youtube || ""} onChange={(e) => updateNested("socials", { youtube: e.target.value })} className="input-admin" />
              </Field>
              <Field label="LinkedIn">
                <input value={content.socials?.linkedin || ""} onChange={(e) => updateNested("socials", { linkedin: e.target.value })} className="input-admin" />
              </Field>
            </div>
          </div>
        </Section>

        {/* ── SAVE ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-6 py-3 text-sm font-bold text-white hover:bg-pink-600 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving…" : siteRecord ? "Save Changes" : "Create Site Content"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
};

// ── Reusable sub-components ───────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-xl border border-brand-dark/10 bg-white p-6 shadow-sm">
    <h2 className="mb-5 text-xl font-bold text-brand-dark">{title}</h2>
    {children}
  </section>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-brand-dark/70">{label}</span>
    {children}
  </label>
);

const ImageUploadControl: React.FC<{
  label: string;
  value?: string;
  loading?: boolean;
  onFiles: (files: File[]) => void;
  onClear: () => void;
}> = ({ label, value, loading, onFiles, onClear }) => (
  <div className="space-y-3">
    <StorageUploadField
      accept="image/*"
      label={label}
      helperText="Uploads to Supabase images bucket"
      loading={loading}
      onFiles={onFiles}
    />
    {value ? (
      <div className="relative overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-bg">
        <img src={value} alt={label} className="h-40 w-full object-cover" />
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-400 shadow hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ) : (
      <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-brand-dark/15 bg-white text-center text-sm font-semibold text-brand-dark/45">
        <span>
          <Image className="mx-auto mb-2 h-5 w-5 text-pink-400" />
          No image selected
        </span>
      </div>
    )}
  </div>
);

const VideoUploadControl: React.FC<{
  label: string;
  value?: string;
  loading?: boolean;
  onFiles: (files: File[]) => void;
  onClear: () => void;
}> = ({ label, value, loading, onFiles, onClear }) => (
  <div className="space-y-3">
    <StorageUploadField
      accept="video/*"
      label={label}
      helperText="Uploads to Supabase videos bucket (MP4 recommended)"
      loading={loading}
      onFiles={onFiles}
    />
    {value ? (
      <div className="relative overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-bg">
        <video src={value} className="h-40 w-full object-cover" muted loop autoPlay playsInline />
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-400 shadow hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ) : (
      <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-brand-dark/15 bg-white text-center text-sm font-semibold text-brand-dark/45">
        <span>
          <Video className="mx-auto mb-2 h-5 w-5 text-pink-400" />
          No video selected
        </span>
      </div>
    )}
  </div>
);
