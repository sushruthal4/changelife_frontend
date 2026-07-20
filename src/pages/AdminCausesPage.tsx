import React, { useState } from "react";
import { Edit, Image, Plus, Save, Trash2, X } from "lucide-react";
import { ConfirmDialog, Modal } from "@/components/Forms";
import { AdminShell } from "@/components/Layout";
import { LoadingGrid } from "@/components/Loading";
import { StorageUploadField } from "@/components/StorageUploadField";
import { useToast } from "@/contexts/ToastContext";
import { useCauses, useCreateCause, useDeleteCause, useUpdateCause } from "@/hooks/useCauses";
import { Cause, CausePayload } from "@/lib/api/causes";
import { getApiErrorMessage } from "@/lib/api";
import { uploadFilesToStorage } from "@/lib/storage/upload";
import { CAUSE_CATEGORIES, getCategoryLabel } from "@/lib/api/causeCategories";

// ── Types ──────────────────────────────────────────────────────────────────────
type CauseFormState = {
  title: string;
  full_description: string;
  target_amount: string;
  raised_amount: string;
  unit_amount: string;
  unit_label: string;
  category: string;
  images: string;
  videos: string;
  is_featured: boolean;
  is_active: boolean;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function parseLines(value: string) {
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}
function appendLines(value: string, urls: string[]) {
  return [...parseLines(value), ...urls].join("\n");
}
function toPayload(form: CauseFormState): CausePayload {
  return {
    title: form.title.trim(),
    full_description: form.full_description.trim(),
    target_amount: Number(form.target_amount) || 0,
    raised_amount: Number(form.raised_amount) || 0,
    unit_amount: Number(form.unit_amount) || 0,
    unit_label: form.unit_label.trim() || null,
    category: form.category.trim(),
    images: parseLines(form.images),
    videos: parseLines(form.videos),
    is_featured: form.is_featured,
    is_active: form.is_active,
  };
}
function formFromCause(cause: Cause): CauseFormState {
  return {
    title: cause.title || "",
    full_description: cause.full_description || "",
    target_amount: String(cause.target_amount || 0),
    raised_amount: String(cause.raised_amount || 0),
    unit_amount: String(cause.unit_amount || 0),
    unit_label: cause.unit_label || "",
    category: cause.category || "",
    images: (cause.images || []).join("\n"),
    videos: (cause.videos || []).join("\n"),
    is_featured: Boolean(cause.is_featured),
    is_active: Boolean(cause.is_active),
  };
}

const emptyCauseForm: CauseFormState = {
  title: "", full_description: "",
  target_amount: "0", raised_amount: "0", unit_amount: "0", unit_label: "", category: "",
  images: "", videos: "",
  is_featured: false, is_active: true,
};

// ══════════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════════
export const AdminCausesPage: React.FC = () => {
  const { data: causes = [], isLoading } = useCauses();
  const createMutation = useCreateCause();
  const updateMutation = useUpdateCause();
  const deleteMutation = useDeleteCause();
  const { addToast } = useToast();

  const [form, setForm] = useState<CauseFormState>(emptyCauseForm);
  const [editingCause, setEditingCause] = useState<Cause | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const updateForm = <K extends keyof CauseFormState>(key: K, value: CauseFormState[K]) =>
    setForm((c) => ({ ...c, [key]: value }));

  const openCreate = () => { setEditingCause(null); setForm(emptyCauseForm); setIsModalOpen(true); };
  const openEdit = (cause: Cause) => { setEditingCause(cause); setForm(formFromCause(cause)); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingCause(null); setForm(emptyCauseForm); };

  const handleGalleryUpload = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) { addToast("Select image files only", "warning"); return; }
    try {
      setUploadingImages(true);
      const uploaded = await uploadFilesToStorage(imageFiles, { bucket: "images", folder: "causes/gallery" });
      const urls = uploaded.map((u) => u.url);
      updateForm("images", appendLines(form.images, urls));
      addToast(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`, "success");
    } catch (err) { addToast(getApiErrorMessage(err, "Image upload failed"), "error"); }
    finally { setUploadingImages(false); }
  };

  const handleVideoUpload = async (files: File[]) => {
    const videoFiles = files.filter((f) => f.type.startsWith("video/"));
    if (!videoFiles.length) { addToast("Select video files only", "warning"); return; }
    try {
      setUploadingVideos(true);
      const uploaded = await uploadFilesToStorage(videoFiles, { bucket: "videos", folder: "causes/videos" });
      updateForm("videos", appendLines(form.videos, uploaded.map((u) => u.url)));
      addToast(`${uploaded.length} video${uploaded.length > 1 ? "s" : ""} uploaded`, "success");
    } catch (err) { addToast(getApiErrorMessage(err, "Video upload failed"), "error"); }
    finally { setUploadingVideos(false); }
  };

  const removeImage = (index: number) => {
    const imgs = parseLines(form.images);
    const next = imgs.filter((_, i) => i !== index);
    updateForm("images", next.join("\n"));
  };
  const removeVideo = (index: number) =>
    updateForm("videos", parseLines(form.videos).filter((_, i) => i !== index).join("\n"));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = toPayload(form);
      if (!payload.title) { addToast("Title is required", "warning"); return; }
      if (editingCause) {
        await updateMutation.mutateAsync({ id: editingCause.id, data: payload });
        addToast("Cause updated", "success");
      } else {
        await createMutation.mutateAsync(payload);
        addToast("Cause created", "success");
      }
      closeModal();
    } catch (err) { addToast(getApiErrorMessage(err, "Failed to save cause"), "error"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      addToast("Cause deleted", "success");
      setDeleteId(null);
    } catch (err) { addToast(getApiErrorMessage(err, "Failed to delete"), "error"); }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Causes</h1>
          <p className="mt-1 text-brand-dark/60">Create, update, and delete donation causes.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white hover:bg-pink-600"
        >
          <Plus className="h-4 w-4" />
          Create Cause
        </button>
      </div>

      {isLoading ? (
        <LoadingGrid count={6} />
      ) : causes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-dark/20 bg-white p-10 text-center">
          <p className="font-semibold text-brand-dark">No causes found</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            Add First Cause
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {causes.map((cause) => (
            <article
              key={cause.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-sm"
            >
              <div className="relative h-44 w-full bg-brand-muted">
                {cause.images?.[0] ? (
                  <img
                    src={cause.images[0]}
                    alt={cause.title}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-brand-primary/40">
                    <Image className="h-10 w-10" />
                  </div>
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${cause.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {cause.is_active ? "Active" : "Inactive"}
                </span>
                {cause.is_featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-pink-500 px-2.5 py-1 text-xs font-bold text-white">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                  <h2 className="font-bold text-brand-dark">{cause.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-brand-dark/60">
                    ₹{Number(cause.target_amount || 0).toLocaleString("en-IN")}
                    {cause.unit_label ? ` / ${cause.unit_label}` : ""}
                  </p>
                  {Number(cause.target_amount) > 0 && (() => {
                    const pct = Math.min(100, Math.round((Number(cause.raised_amount || 0) / Number(cause.target_amount)) * 100));
                    return (
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-xs font-semibold text-brand-dark/60">
                          <span>₹{Number(cause.raised_amount || 0).toLocaleString("en-IN")} raised</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-brand-dark/10">
                          <div className="h-full rounded-full bg-pink-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cause.category && (
                      <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-bold text-pink-500">
                        {getCategoryLabel(cause.category)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex gap-2 border-t border-brand-dark/10 pt-4">
                  <button
                    type="button"
                    onClick={() => openEdit(cause)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 px-3 py-2 text-sm font-bold text-white hover:bg-pink-600"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(cause.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-bold text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Cause modal ─────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCause ? "Edit Cause" : "Create Cause"}
        size="full"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-pink-100 bg-pink-50 p-4 text-sm text-brand-dark/70">
            Fill only the cause details shown on the public website. Gallery images and videos appear on the cause pages.
          </div>

          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              className="input-admin"
              required
            />
          </Field>
          <Field label="Full Description">
            <textarea
              value={form.full_description}
              onChange={(e) => updateForm("full_description", e.target.value)}
              className="input-admin min-h-28"
            />
          </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Goal Amount (₹)">
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={form.target_amount}
                  onChange={(e) => updateForm("target_amount", e.target.value)}
                  className="input-admin"
                />
              </Field>
              <Field label="Raised Amount (₹)">
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={form.raised_amount}
                  onChange={(e) => updateForm("raised_amount", e.target.value)}
                  className="input-admin"
                />
              </Field>
              <Field label="Amount (₹)">
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={form.unit_amount}
                  onChange={(e) => updateForm("unit_amount", e.target.value)}
                  className="input-admin"
                />
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className="input-admin"
                >
                  <option value="">Select category</option>
                  {CAUSE_CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

          <Field label="Unit Label (e.g. Plate, Paw, Kit, Packet — shown on donation page multiplier)">
            <input
              value={form.unit_label}
              onChange={(e) => updateForm("unit_label", e.target.value)}
              className="input-admin"
              placeholder="e.g. Plate"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <StorageUploadField
                accept="image/*"
                label="Upload Gallery Images"
                helperText="Select one or more images"
                multiple
                loading={uploadingImages}
                onFiles={handleGalleryUpload}
              />
              <MediaPreview
                type="image"
                items={parseLines(form.images)}
                onRemove={removeImage}
              />
            </div>
            <div className="space-y-3">
              <StorageUploadField
                accept="video/*"
                label="Upload Videos"
                helperText="Select one or more videos"
                multiple
                loading={uploadingVideos}
                onFiles={handleVideoUpload}
              />
              <MediaPreview
                type="video"
                items={parseLines(form.videos)}
                onRemove={removeVideo}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 rounded-xl border border-pink-100 bg-pink-50 p-4">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => updateForm("is_featured", e.target.checked)}
                className="h-4 w-4 accent-pink-500"
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateForm("is_active", e.target.checked)}
                className="h-4 w-4 accent-pink-500"
              />
              Active
            </label>
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 flex gap-3 border-t border-brand-dark/10 bg-white px-4 py-4 sm:-mx-6 sm:px-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-xl border border-brand-dark/15 px-4 py-3 text-sm font-bold text-brand-dark hover:bg-brand-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white hover:bg-pink-600 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving…" : "Save Cause"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Cause"
        message="Are you sure you want to delete this cause?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </AdminShell>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-brand-dark/70">{label}</span>
    {children}
  </label>
);

const MediaPreview: React.FC<{
  type: "image" | "video";
  items: string[];
  onRemove: (index: number) => void;
}> = ({ type, items, onRemove }) => {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-brand-dark/15 bg-white p-5 text-center text-sm font-semibold text-brand-dark/45">
        No {type === "image" ? "images" : "videos"} uploaded yet
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="relative overflow-hidden rounded-xl border border-brand-dark/10 bg-white"
        >
          {type === "image" ? (
            <img src={url} alt={`Cause image ${index + 1}`} className="h-32 w-full object-contain" />
          ) : (
            <video src={url} className="h-32 w-full bg-brand-dark object-contain" controls />
          )}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-red-400 shadow hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
