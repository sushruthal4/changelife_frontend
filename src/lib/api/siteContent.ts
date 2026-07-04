import getApiClient, { ApiResponse } from "./client";

export interface SiteContentData {
  [key: string]: unknown;
  organizationName: string;
  tagline?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
  address?: string;
  navigation?: {
    [key: string]: unknown;
    homeLabel?: string;
    causesLabel?: string;
    impactLabel?: string;
    aboutLabel?: string;
    contactLabel?: string;
    donateLabel?: string;
  };
  hero: {
    [key: string]: unknown;
    title: string;
    description: string;
    image?: string;
    eyebrow?: string;
    video?: string;
    logoUrl?: string;
  };
  about?: {
    [key: string]: unknown;
    title?: string;
    description?: string;
    missionTitle?: string;
    mission?: string;
    visionTitle?: string;
    vision?: string;
    bannerImage?: string;
    primaryImage?: string;
    secondaryImage?: string;
  };
  homeVideoCta?: {
    [key: string]: unknown;
    label?: string;
    videoUrl?: string;
  };
  homeImpact?: Array<{
    label: string;
    value: string;
    text?: string;
    iconUrl?: string;
  }>;
  homeFeatured?: {
    [key: string]: unknown;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
  homeCauses?: {
    [key: string]: unknown;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    searchPlaceholder?: string;
  };
  causesPage?: {
    [key: string]: unknown;
    heading?: string;
    headingAccent?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    searchPlaceholder?: string;
    allFilterLabel?: string;
    featuredFilterLabel?: string;
    bannerImage?: string;
  };
  contactPage?: {
    [key: string]: unknown;
    heading?: string;
    headingAccent?: string;
    detailsTitle?: string;
    formTitle?: string;
    formSubtitle?: string;
    whatsappLabel?: string;
    phoneLabel?: string;
    emailLabel?: string;
    nameLabel?: string;
    emailInputLabel?: string;
    phoneInputLabel?: string;
    teamLabel?: string;
    teamPlaceholder?: string;
    messageLabel?: string;
    submitLabel?: string;
    openingLabel?: string;
    teamOptions?: string[];
    bannerImage?: string;
  };
  impact?: {
    [key: string]: unknown;
    donors?: string;
    raised?: string;
    lives?: string;
    meals?: string;
    proof?: string;
    bannerImage?: string;
  };
  footer?: {
    [key: string]: unknown;
    note?: string;
    title?: string;
    image?: string;
    mapImage?: string;
    newsletterTitle?: string;
    emailPlaceholder?: string;
    privacyLabel?: string;
    privacyUrl?: string;
    termsLabel?: string;
    termsUrl?: string;
    contactInfoLabel?: string;
    contactInfoUrl?: string;
  };
  socials?: {
    [key: string]: unknown;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  donationActivity?: Array<{
    donorName: string;
    amount: number;
    donatedAt: string;
    cause?: string;
  }>;
}

export interface SiteContentRecord {
  id: string;
  key: "main" | string;
  content: SiteContentData;
  created_at?: string;
  updated_at?: string;
}

export const defaultSiteContent: SiteContentData = {
  organizationName: "Heart Fuel Foundation",
  tagline: "Give with heart. See real impact.",
  supportEmail: "",
  supportPhone: "",
  whatsappNumber: "",
  address: "",
  navigation: {
    homeLabel: "Home",
    causesLabel: "Causes",
    impactLabel: "Our Impact",
    aboutLabel: "About Us",
    contactLabel: "Contact",
    donateLabel: "Donate Now",
  },
  hero: {
    eyebrow: "Transparent donations with photo and video proof",
    title: "Heart Fuel Foundation",
    description:
      "Support verified causes, donate directly, and see the real people your kindness reaches.",
  },
  about: {
    title: "Giving with proof, care, and accountability",
    description:
      "Heart Fuel is a purpose-driven impact platform built to make giving simple, transparent, and meaningful. Every contribution is executed on the ground and documented with real photos, videos, and clear updates.",
    missionTitle: "Our Mission",
    mission:
      "To turn every donation into verified action, handled responsibly and shared back with the donor through visible proof.",
    visionTitle: "Our Vision",
    vision:
      "A world where giving is rooted in empathy, transparency, and human connection.",
    bannerImage: "",
    primaryImage: "",
    secondaryImage: "",
  },
  homeVideoCta: {
    label: "How to Donate? Watch Now!",
    videoUrl: "https://www.youtube.com/embed/0T6A2PWObHw",
  },
  homeImpact: [
    {
      label: "Families Reached",
      value: "100+",
      text: "Help delivered through verified campaigns.",
    },
    {
      label: "Proof Updates",
      value: "Photo + Video",
      text: "Impact media uploaded by the team.",
    },
    {
      label: "Direct Giving",
      value: "UPI + Bank",
      text: "Donors pay through configured payment settings.",
    },
    {
      label: "Local Drives",
      value: "On Ground",
      text: "Causes tracked with real progress.",
    },
  ],
  homeFeatured: {
    eyebrow: "",
    title: "Featured Causes",
    subtitle: "Support a child and make a difference today",
  },
  homeCauses: {
    eyebrow: "Causes That Matter",
    title: "Choose a cause and make a difference today",
    subtitle: "Search, filter, and donate to verified active causes.",
    searchPlaceholder: "Search food, education, city, cause...",
  },
  causesPage: {
    heading: "Causes",
    headingAccent: "We Care",
    eyebrow: "Causes We Care",
    title: "Causes That Matter",
    subtitle: "Choose a cause and make a difference today",
    searchPlaceholder: "Search for a cause or product...",
    allFilterLabel: "All Causes",
    featuredFilterLabel: "Featured Cause",
    bannerImage: "",
  },
  contactPage: {
    heading: "Contact",
    headingAccent: "US",
    detailsTitle: "Contact Our Team",
    formTitle: "Request a call back",
    formSubtitle: "We would love to hear from you!",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Phone",
    emailLabel: "Email",
    nameLabel: "Name",
    emailInputLabel: "Email",
    phoneInputLabel: "Phone",
    teamLabel: "Select Team",
    teamPlaceholder: "Choose a team",
    messageLabel: "Message",
    submitLabel: "Submit",
    openingLabel: "Opening WhatsApp...",
    teamOptions: ["New Donation", "Support", "Technical", "General Inquiry"],
    bannerImage: "",
  },
  impact: {
    donors: "",
    raised: "",
    lives: "",
    meals: "",
    proof: "Photos and videos shared after every verified drive.",
    bannerImage: "",
  },
  footer: {
    title: "Give with trust. See every step.",
    note: "Every contribution helps create visible, verifiable impact.",
    image: "",
    mapImage: "",
    newsletterTitle: "Join Our Giving Circle",
    emailPlaceholder: "Email",
    privacyLabel: "Privacy policy",
    privacyUrl: "#",
    termsLabel: "Terms of service",
    termsUrl: "#",
    contactInfoLabel: "Contact information",
    contactInfoUrl: "#",
  },
  socials: {},
  donationActivity: [],
};

export type SiteContentPayload = {
  content: SiteContentData;
  updated_at?: string;
};

const siteContentApi = {
  getMain: async (): Promise<ApiResponse<SiteContentRecord[]>> => {
    const api = getApiClient();
    const response = await api.get<ApiResponse<SiteContentRecord[]>>("/site-content");
    return response.data;
  },

  create: async (content: SiteContentData): Promise<ApiResponse<SiteContentRecord[]>> => {
    const api = getApiClient();
    const response = await api.post<ApiResponse<SiteContentRecord[]>>("/site-content", {
      content,
    });
    return response.data;
  },

  update: async (content: SiteContentData): Promise<ApiResponse<SiteContentRecord[]>> => {
    const api = getApiClient();
    const response = await api.patch<ApiResponse<SiteContentRecord[]>>("/site-content", {
      content,
      updated_at: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (): Promise<ApiResponse<SiteContentRecord[] | null>> => {
    const api = getApiClient();
    const response = await api.delete<ApiResponse<SiteContentRecord[] | null>>("/site-content");
    return response.data;
  },
};

export default siteContentApi;
