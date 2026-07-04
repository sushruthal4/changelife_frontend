import { Cause } from "@/lib/api/causes";

export const getCauseImage = (cause: Pick<Cause, "images">) => {
  if (cause.images?.[0]) return cause.images[0];
  return null;
};

export const getCauseGallery = (cause: Cause) => {
  const uploaded = (cause.images || []).filter(Boolean);
  return Array.from(new Set(uploaded));
};
