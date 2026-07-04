/**
 * causeCategories.ts
 *
 * Single source of truth for cause categories.
 * Used by:
 *   - AdminCausesPage  → <select> dropdown when creating/editing a cause
 *   - CausesPage       → filter pills on the public causes listing
 *
 * To add/rename/remove a category, just edit this list.
 * No DB table, no hook, no cross-file imports needed.
 */

export type CauseCategory = {
  slug: string;   // stored in cause.category column
  label: string;  // shown in UI
  icon: string;   // emoji shown on filter pills (empty string = no icon)
};

export type CauseCategoryPayload = CauseCategory;

export const CAUSE_CATEGORIES: CauseCategory[] = [
  { slug: "birthday-giving", label: "Birthday Giving", icon: "🎂" },
  { slug: "anniversary-giving", label: "Anniversary Giving", icon: "💍" },
  { slug: "animal", label: "Animal", icon: "🐾" },
  { slug: "giving-to-the-needy", label: "Giving To The Needy", icon: "🤝" },
  { slug: "nature", label: "Nature", icon: "🌿" },
  { slug: "memorial-giving", label: "Memorial Giving", icon: "🕯️" },
  { slug: "women-care", label: "Women Care", icon: "💜" },
  { slug: "education", label: "Education", icon: "📚" },
];

/** Given a slug stored on a cause, return the display label. Falls back to the raw slug. */
export function getCategoryLabel(slug: string): string {
  return CAUSE_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

const readOnlyCategoryError = () =>
  new Error("Cause categories are configured in src/lib/api/causeCategories.ts.");

const causeCategoriesApi = {
  getAll: async () => ({
    success: true,
    data: CAUSE_CATEGORIES,
    message: "Cause categories loaded",
  }),
  create: async (_data: CauseCategoryPayload) => {
    throw readOnlyCategoryError();
  },
  update: async (_id: string, _data: CauseCategoryPayload) => {
    throw readOnlyCategoryError();
  },
  delete: async (_id: string) => {
    throw readOnlyCategoryError();
  },
};

export default causeCategoriesApi;
