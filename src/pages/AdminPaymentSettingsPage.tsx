import React, { useState } from "react";
import { Banknote, Edit, Plus, QrCode, Save, Trash2, X } from "lucide-react";
import { ConfirmDialog, Modal } from "@/components/Forms";
import { AdminShell } from "@/components/Layout";
import { LoadingSpinner } from "@/components/Loading";
import { StorageUploadField } from "@/components/StorageUploadField";
import { useToast } from "@/contexts/ToastContext";
import {
  useCreatePaymentSetting,
  useDeletePaymentSetting,
  usePaymentSettings,
  useUpdatePaymentSetting,
} from "@/hooks/usePaymentSettings";
import { getApiErrorMessage } from "@/lib/api";
import { PaymentSetting, PaymentSettingPayload } from "@/lib/api/paymentSettings";
import { uploadFileToStorage } from "@/lib/storage/upload";

type PaymentFormState = {
  payment_name: string;
  upi_id: string;
  upi_payee_name: string;
  qr_image: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  is_active: boolean;
};

const emptyForm: PaymentFormState = {
  payment_name: "",
  upi_id: "",
  upi_payee_name: "",
  qr_image: "",
  bank_name: "",
  account_name: "",
  account_number: "",
  ifsc_code: "",
  branch_name: "",
  is_active: true,
};

function formFromSetting(setting: PaymentSetting): PaymentFormState {
  return {
    payment_name: setting.payment_name || "",
    upi_id: setting.upi_id || "",
    upi_payee_name: setting.upi_payee_name || "",
    qr_image: setting.qr_image || "",
    bank_name: setting.bank_name || "",
    account_name: setting.account_name || "",
    account_number: setting.account_number || "",
    ifsc_code: setting.ifsc_code || "",
    branch_name: setting.branch_name || "",
    is_active: Boolean(setting.is_active),
  };
}

function toPayload(form: PaymentFormState): PaymentSettingPayload {
  return {
    payment_name: form.payment_name.trim(),
    upi_id: form.upi_id.trim(),
    upi_payee_name: form.upi_payee_name.trim(),
    qr_image: form.qr_image.trim(),
    bank_name: form.bank_name.trim(),
    account_name: form.account_name.trim(),
    account_number: form.account_number.trim(),
    ifsc_code: form.ifsc_code.trim(),
    branch_name: form.branch_name.trim(),
    is_active: form.is_active,
  };
}

export const AdminPaymentSettingsPage: React.FC = () => {
  const { data: paymentSettings = [], isLoading } = usePaymentSettings();
  const createMutation = useCreatePaymentSetting();
  const updateMutation = useUpdatePaymentSetting();
  const deleteMutation = useDeletePaymentSetting();
  const { addToast } = useToast();
  const [form, setForm] = useState<PaymentFormState>(emptyForm);
  const [editingSetting, setEditingSetting] = useState<PaymentSetting | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  const updateForm = <K extends keyof PaymentFormState>(key: K, value: PaymentFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreate = () => {
    setEditingSetting(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (setting: PaymentSetting) => {
    setEditingSetting(setting);
    setForm(formFromSetting(setting));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingSetting(null);
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  const handleQrUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setUploadingQr(true);
      const uploaded = await uploadFileToStorage(file, {
        bucket: "images",
        folder: "payment-settings/qr",
      });
      updateForm("qr_image", uploaded.url);
      addToast("QR image uploaded", "success");
    } catch (err) {
      addToast(getApiErrorMessage(err, "QR upload failed"), "error");
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const payload = toPayload(form);
      if (!payload.payment_name) {
        addToast("Payment name is required", "warning");
        return;
      }

      if (editingSetting) {
        await updateMutation.mutateAsync({ id: editingSetting.id, data: payload });
        addToast("Payment setting updated", "success");
      } else {
        await createMutation.mutateAsync(payload);
        addToast("Payment setting created", "success");
      }
      closeModal();
    } catch (err) {
      addToast(getApiErrorMessage(err, "Failed to save payment setting"), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      addToast("Payment setting deleted", "success");
      setDeleteId(null);
    } catch (err) {
      addToast(getApiErrorMessage(err, "Failed to delete payment setting"), "error");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <AdminShell>
        <LoadingSpinner />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-3xl font-bold text-brand-dark'>Payment Settings</h1>
          <p className='mt-1 text-brand-dark/60'>Manage UPI, QR, and bank transfer details.</p>
        </div>
        <button
          type='button'
          onClick={openCreate}
          className='inline-flex items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark'
        >
          <Plus className='h-4 w-4' />
          Add Payment
        </button>
      </div>

      {paymentSettings.length === 0 ? (
        <div className='rounded-lg border border-dashed border-brand-dark/20 bg-white p-10 text-center'>
          <Banknote className='mx-auto mb-3 h-8 w-8 text-brand-primary' />
          <p className='font-semibold text-brand-dark'>No payment methods configured</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3'>
          {paymentSettings.map((setting) => (
            <article key={setting.id} className='rounded-lg border border-brand-dark/10 bg-white p-5 shadow-sm'>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                  <h2 className='font-bold text-brand-dark'>{setting.payment_name}</h2>
                  <p className='mt-1 text-sm text-brand-dark/60'>
                    {setting.upi_id || setting.bank_name || (setting.qr_image ? "QR image configured" : "Details not set")}
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${setting.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {setting.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {setting.qr_image ? (
                <img
                  src={setting.qr_image}
                  alt={`${setting.payment_name} QR`}
                  className='mb-4 h-28 w-28 rounded border border-brand-dark/10 object-contain p-2'
                />
              ) : (
                <div className='mb-4 flex h-28 w-28 items-center justify-center rounded bg-brand-muted text-brand-primary'>
                  <QrCode className='h-8 w-8' />
                </div>
              )}

              <div className='mb-4 space-y-1 text-sm text-brand-dark/65'>
                {setting.upi_id && <p>UPI: {setting.upi_id}</p>}
                {setting.account_name && <p>Account: {setting.account_name}</p>}
                {setting.account_number && <p>Number: {setting.account_number}</p>}
                {setting.ifsc_code && <p>IFSC: {setting.ifsc_code}</p>}
              </div>

              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => openEdit(setting)}
                  className='inline-flex flex-1 items-center justify-center gap-2 rounded bg-brand-primary px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark'
                >
                  <Edit className='h-4 w-4' />
                  Edit
                </button>
                <button
                  type='button'
                  onClick={() => setDeleteId(setting.id)}
                  className='inline-flex flex-1 items-center justify-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700'
                >
                  <Trash2 className='h-4 w-4' />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSetting ? "Edit Payment Method" : "Add Payment Method"}
        size='full'
      >
        <form onSubmit={handleSubmit} className='space-y-5'>
          <section className='rounded-lg border border-brand-primary/15 bg-brand-muted p-4'>
            <p className='text-sm font-bold text-brand-dark'>
              UPI deep links are used for the primary donation action. QR and bank details are shown as additional options.
            </p>
          </section>

          <section className='rounded-lg border border-brand-dark/10 bg-white p-5'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-bold text-brand-dark'>
              <Banknote className='h-5 w-5 text-brand-warm' />
              Payment Identity
            </h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <Field label='Payment Name'>
                <input
                  value={form.payment_name}
                  onChange={(event) => updateForm("payment_name", event.target.value)}
                  className='input-admin'
                  required
                />
              </Field>
              <Field label='UPI ID'>
                <input
                  value={form.upi_id}
                  onChange={(event) => updateForm("upi_id", event.target.value)}
                  className='input-admin'
                  placeholder='example@upi'
                />
              </Field>
              <Field label='UPI Payee Name'>
                <input
                  value={form.upi_payee_name}
                  onChange={(event) => updateForm("upi_payee_name", event.target.value)}
                  className='input-admin'
                  placeholder='Change Life Foundation'
                />
              </Field>
            </div>
          </section>

          <section className='grid gap-5 lg:grid-cols-[0.8fr_1.2fr]'>
            <div className='rounded-lg border border-brand-dark/10 bg-white p-5'>
              <h3 className='mb-4 flex items-center gap-2 text-lg font-bold text-brand-dark'>
                <QrCode className='h-5 w-5 text-brand-warm' />
                QR Image
              </h3>
              <StorageUploadField
                accept='image/*'
                label='Upload QR Image'
                helperText='Uploads to Supabase images bucket'
                loading={uploadingQr}
                onFiles={handleQrUpload}
              />
              {form.qr_image ? (
                <div className='relative mt-4 inline-block rounded border border-brand-dark/10 bg-brand-bg p-3'>
                  <img
                    src={form.qr_image}
                    alt='QR preview'
                    className='h-44 w-44 rounded bg-white object-contain p-2'
                  />
                  <button
                    type='button'
                    onClick={() => updateForm("qr_image", "")}
                    className='absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded bg-white text-brand-warm shadow hover:bg-pink-50'
                    aria-label='Remove QR image'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ) : (
                <div className='mt-4 flex h-44 w-44 items-center justify-center rounded border border-dashed border-brand-dark/15 bg-brand-bg text-brand-warm'>
                  <QrCode className='h-10 w-10' />
                </div>
              )}
            </div>

            <div className='rounded-lg border border-brand-dark/10 bg-white p-5'>
              <h3 className='mb-4 text-lg font-bold text-brand-dark'>Bank Transfer</h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field label='Bank Name'>
                  <input
                    value={form.bank_name}
                    onChange={(event) => updateForm("bank_name", event.target.value)}
                    className='input-admin'
                  />
                </Field>
                <Field label='Account Name'>
                  <input
                    value={form.account_name}
                    onChange={(event) => updateForm("account_name", event.target.value)}
                    className='input-admin'
                  />
                </Field>
                <Field label='Account Number'>
                  <input
                    value={form.account_number}
                    onChange={(event) => updateForm("account_number", event.target.value)}
                    className='input-admin'
                  />
                </Field>
                <Field label='IFSC Code'>
                  <input
                    value={form.ifsc_code}
                    onChange={(event) => updateForm("ifsc_code", event.target.value)}
                    className='input-admin'
                  />
                </Field>
              </div>
              <div className='mt-4'>
                <Field label='Branch Name'>
                  <input
                    value={form.branch_name}
                    onChange={(event) => updateForm("branch_name", event.target.value)}
                    className='input-admin'
                  />
                </Field>
              </div>
            </div>
          </section>

          <label className='inline-flex items-center gap-2 rounded border border-brand-dark/10 bg-brand-muted p-4 text-sm font-semibold text-brand-dark'>
            <input
              type='checkbox'
              checked={form.is_active}
              onChange={(event) => updateForm("is_active", event.target.checked)}
              className='h-4 w-4 accent-brand-primary'
            />
            Active
          </label>

          <div className='flex gap-3 border-t border-brand-dark/10 pt-5'>
            <button
              type='button'
              onClick={closeModal}
              className='flex-1 rounded border border-brand-dark/15 px-4 py-3 text-sm font-bold text-brand-dark hover:bg-brand-muted'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='inline-flex flex-1 items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60'
            >
              <Save className='h-4 w-4' />
              {isSaving ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title='Delete Payment Method'
        message='Are you sure you want to delete this payment method?'
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </AdminShell>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className='block'>
    <span className='mb-2 block text-sm font-semibold text-brand-dark/70'>{label}</span>
    {children}
  </label>
);
