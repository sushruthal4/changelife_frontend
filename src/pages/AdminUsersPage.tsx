import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Edit, KeyRound, Plus, Save, Users } from "lucide-react";
import { Modal } from "@/components/Forms";
import { AdminShell } from "@/components/Layout";
import { LoadingSpinner } from "@/components/Loading";
import { useToast } from "@/contexts/ToastContext";
import { useCreateUser, useUpdateUser, useUsers } from "@/hooks/useUsers";
import { getApiErrorMessage } from "@/lib/api";
import { User, UserPayload } from "@/lib/api/users";

type UserFormState = {
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  role: string;
  is_active: boolean;
  twoFactorEnabled: boolean;
};

const emptyForm: UserFormState = {
  email: "",
  first_name: "",
  last_name: "",
  mobile: "",
  role: "admin",
  is_active: true,
  twoFactorEnabled: false,
};

function formFromUser(user: User): UserFormState {
  return {
    email: user.email || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    mobile: user.mobile || "",
    role: user.role || "admin",
    is_active: user.is_active !== false,
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
  };
}

function toPayload(form: UserFormState): UserPayload {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    mobile: form.mobile.trim(),
    role: form.role,
    is_active: form.is_active,
    twoFactorEnabled: form.twoFactorEnabled,
  };
}

export const AdminUsersPage: React.FC = () => {
  const { data: users = [], isLoading } = useUsers();
  const updateMutation = useUpdateUser();
  const createMutation = useCreateUser();
  const { addToast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<UserFormState>(emptyForm);
  const [form, setForm] = useState<UserFormState>({
    email: "",
    first_name: "",
    last_name: "",
    mobile: "",
    role: "admin",
    is_active: true,
    twoFactorEnabled: false,
  });

  const updateForm = <K extends keyof UserFormState>(key: K, value: UserFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateAddForm = <K extends keyof UserFormState>(key: K, value: UserFormState[K]) => {
    setAddForm((current) => ({ ...current, [key]: value }));
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm(formFromUser(user));
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const openAddModal = () => {
    setAddForm(emptyForm);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingUser) return;

    try {
      await updateMutation.mutateAsync({ id: editingUser.id, data: toPayload(form) });
      addToast("User updated", "success");
      closeEditModal();
    } catch (err) {
      addToast(getApiErrorMessage(err, "Failed to update user"), "error");
    }
  };

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = addForm.email.trim().toLowerCase();
    if (!email) {
      addToast("Email is required", "warning");
      return;
    }

    // Check if email already exists
    const exists = users.some((u) => u.email.toLowerCase() === email);
    if (exists) {
      addToast("A user with this email already exists", "error");
      return;
    }

    try {
      await createMutation.mutateAsync({
        email,
        ...toPayload(addForm),
      });
      addToast("User added successfully", "success");
      closeAddModal();
    } catch (err) {
      addToast(getApiErrorMessage(err, "Failed to add user"), "error");
    }
  };

  return (
    <AdminShell>
      <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-3xl font-bold text-brand-dark'>Users</h1>
          <p className='mt-1 text-brand-dark/60'>View and manage admin users, roles, and 2FA status.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={openAddModal}
            className='inline-flex items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark'
          >
            <Plus className='h-4 w-4' />
            Add User
          </button>
          <Link
            to='/admin/setup-2fa'
            className='inline-flex items-center justify-center gap-2 rounded border border-brand-dark/15 px-4 py-3 text-sm font-bold text-brand-dark hover:bg-brand-muted'
          >
            <KeyRound className='h-4 w-4' />
            Setup 2FA
          </Link>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <div className='rounded-lg border border-dashed border-brand-dark/20 bg-white p-10 text-center'>
          <Users className='mx-auto mb-3 h-8 w-8 text-brand-primary' />
          <p className='font-semibold text-brand-dark'>No users found</p>
          <button
            type='button'
            onClick={openAddModal}
            className='mt-4 inline-flex items-center gap-2 rounded bg-brand-primary px-4 py-2 text-sm font-bold text-white'
          >
            <Plus className='h-4 w-4' />
            Add First User
          </button>
        </div>
      ) : (
        <div className='overflow-hidden rounded-lg border border-brand-dark/10 bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-brand-muted text-brand-dark/60'>
                <tr>
                  <th className='px-5 py-3 font-semibold'>Name</th>
                  <th className='px-5 py-3 font-semibold'>Email</th>
                  <th className='px-5 py-3 font-semibold'>Role</th>
                  <th className='px-5 py-3 font-semibold'>2FA</th>
                  <th className='px-5 py-3 font-semibold'>Status</th>
                  <th className='px-5 py-3 text-right font-semibold'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='border-t border-brand-dark/10'>
                    <td className='px-5 py-4 font-semibold text-brand-dark'>
                      {[user.first_name, user.last_name].filter(Boolean).join(" ") || "Unnamed"}
                    </td>
                    <td className='px-5 py-4 text-brand-dark/65'>{user.email}</td>
                    <td className='px-5 py-4 text-brand-dark/65'>{user.role || "admin"}</td>
                    <td className='px-5 py-4'>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${user.twoFactorEnabled ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {user.twoFactorEnabled ? "Enabled" : "Pending"}
                      </span>
                    </td>
                    <td className='px-5 py-4'>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${user.is_active !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {user.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-right'>
                      <button
                        type='button'
                        onClick={() => openEdit(user)}
                        className='inline-flex items-center gap-2 rounded bg-brand-primary px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark'
                      >
                        <Edit className='h-3.5 w-3.5' />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal isOpen={!!editingUser} onClose={closeEditModal} title='Edit User' size='lg'>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Field label='First Name'>
              <input
                value={form.first_name}
                onChange={(event) => updateForm("first_name", event.target.value)}
                className='input-admin'
              />
            </Field>
            <Field label='Last Name'>
              <input
                value={form.last_name}
                onChange={(event) => updateForm("last_name", event.target.value)}
                className='input-admin'
              />
            </Field>
          </div>
          <Field label='Mobile'>
            <input
              value={form.mobile}
              onChange={(event) => updateForm("mobile", event.target.value)}
              className='input-admin'
            />
          </Field>
          <Field label='Role'>
            <select
              value={form.role}
              onChange={(event) => updateForm("role", event.target.value)}
              className='input-admin'
            >
              <option value='admin'>admin</option>
              <option value='super_admin'>super_admin</option>
            </select>
          </Field>

          <div className='flex flex-wrap gap-5 rounded border border-brand-dark/10 bg-brand-muted p-4'>
            <label className='inline-flex items-center gap-2 text-sm font-semibold text-brand-dark'>
              <input
                type='checkbox'
                checked={form.is_active}
                onChange={(event) => updateForm("is_active", event.target.checked)}
                className='h-4 w-4 accent-brand-primary'
              />
              Active
            </label>
            <label className='inline-flex items-center gap-2 text-sm font-semibold text-brand-dark'>
              <input
                type='checkbox'
                checked={form.twoFactorEnabled}
                onChange={(event) => updateForm("twoFactorEnabled", event.target.checked)}
                className='h-4 w-4 accent-brand-primary'
              />
              2FA Enabled
            </label>
          </div>

          <div className='flex gap-3 border-t border-brand-dark/10 pt-5'>
            <button
              type='button'
              onClick={closeEditModal}
              className='flex-1 rounded border border-brand-dark/15 px-4 py-3 text-sm font-bold text-brand-dark hover:bg-brand-muted'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={updateMutation.isPending}
              className='inline-flex flex-1 items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60'
            >
              <Save className='h-4 w-4' />
              {updateMutation.isPending ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title='Add New Admin User' size='lg'>
        <form onSubmit={handleAddUser} className='space-y-5'>
          <div className='rounded border border-brand-primary/15 bg-brand-muted p-4 text-sm text-brand-dark/70'>
            The new user will need to complete 2FA setup before they can log in. Share the Setup 2FA link with them.
          </div>

          <Field label='Email'>
            <input
              type='email'
              value={addForm.email}
              onChange={(event) => updateAddForm("email", event.target.value)}
              className='input-admin'
              placeholder='admin@example.com'
              required
            />
          </Field>

          <div className='grid gap-4 md:grid-cols-2'>
            <Field label='First Name'>
              <input
                value={addForm.first_name}
                onChange={(event) => updateAddForm("first_name", event.target.value)}
                className='input-admin'
              />
            </Field>
            <Field label='Last Name'>
              <input
                value={addForm.last_name}
                onChange={(event) => updateAddForm("last_name", event.target.value)}
                className='input-admin'
              />
            </Field>
          </div>

          <Field label='Mobile'>
            <input
              value={addForm.mobile}
              onChange={(event) => updateAddForm("mobile", event.target.value)}
              className='input-admin'
              placeholder='+91...'
            />
          </Field>

          <Field label='Role'>
            <select
              value={addForm.role}
              onChange={(event) => updateAddForm("role", event.target.value)}
              className='input-admin'
            >
              <option value='admin'>admin</option>
              <option value='super_admin'>super_admin</option>
            </select>
          </Field>

          <div className='flex flex-wrap gap-5 rounded border border-brand-dark/10 bg-brand-muted p-4'>
            <label className='inline-flex items-center gap-2 text-sm font-semibold text-brand-dark'>
              <input
                type='checkbox'
                checked={addForm.is_active}
                onChange={(event) => updateAddForm("is_active", event.target.checked)}
                className='h-4 w-4 accent-brand-primary'
              />
              Active
            </label>
          </div>

          <div className='flex gap-3 border-t border-brand-dark/10 pt-5'>
            <button
              type='button'
              onClick={closeAddModal}
              className='flex-1 rounded border border-brand-dark/15 px-4 py-3 text-sm font-bold text-brand-dark hover:bg-brand-muted'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={createMutation.isPending}
              className='inline-flex flex-1 items-center justify-center gap-2 rounded bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60'
            >
              <Plus className='h-4 w-4' />
              {createMutation.isPending ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className='block'>
    <span className='mb-2 block text-sm font-semibold text-brand-dark/70'>{label}</span>
    {children}
  </label>
);