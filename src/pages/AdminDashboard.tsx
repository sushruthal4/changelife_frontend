import React from "react";
import { useRouter } from "@tanstack/react-router";
import { Banknote, Heart, ListChecks, Settings, Users } from "lucide-react";
import { AdminShell } from "@/components/Layout";
import { LoadingCard } from "@/components/Loading";
import { StatCard } from "@/components/Stats";
import { useCauses } from "@/hooks/useCauses";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useUsers } from "@/hooks/useUsers";

export const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { data: causes = [], isLoading: causesLoading } = useCauses();
  const { data: paymentSettings = [], isLoading: paymentsLoading } = usePaymentSettings();
  const { data: siteContent, isLoading: contentLoading } = useSiteContent();
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const activeCauses = causes.filter((cause) => cause.is_active).length;
  const activePayments = paymentSettings.filter((payment) => payment.is_active).length;
  const isLoading = causesLoading || paymentsLoading || contentLoading || usersLoading;

  const quickActions = [
    {
      title: "Causes",
      description: "Create and edit donation causes",
      icon: ListChecks,
      path: "/admin/causes" as const,
      count: causes.length,
    },
    {
      title: "Payments",
      description: "Manage UPI and bank details",
      icon: Banknote,
      path: "/admin/payment-settings" as const,
      count: paymentSettings.length,
    },
    {
      title: "Site Content",
      description: "Update public website copy",
      icon: Settings,
      path: "/admin/site-settings" as const,
      count: siteContent ? 1 : 0,
    },
    {
      title: "Users",
      description: "Review admin users",
      icon: Users,
      path: "/admin/users" as const,
      count: users.length,
    },
  ];

  return (
    <AdminShell>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-brand-dark'>Dashboard</h1>
        <p className='mt-1 text-brand-dark/60'>Manage the Change Life API screens from one place.</p>
      </div>

      {isLoading ? (
        <div className='mb-8 grid grid-cols-1 gap-5 md:grid-cols-4'>
          {[1, 2, 3, 4].map((item) => (
            <LoadingCard key={item} />
          ))}
        </div>
      ) : (
        <div className='mb-8 grid grid-cols-1 gap-5 md:grid-cols-4'>
          <StatCard label='Total Causes' value={causes.length} icon={<Heart className='h-7 w-7' />} />
          <StatCard label='Active Causes' value={activeCauses} icon={<ListChecks className='h-7 w-7' />} />
          <StatCard label='Active Payments' value={activePayments} icon={<Settings className='h-7 w-7' />} />
        </div>
      )}

      <div className='mb-8 grid grid-cols-1 gap-5 lg:grid-cols-4'>
        {quickActions.map(({ title, description, icon: Icon, path, count }) => (
          <button
            key={path}
            type='button'
            onClick={() => router.navigate({ to: path })}
            className='rounded-lg border border-brand-dark/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg'
          >
            <div className='mb-4 flex items-center justify-between'>
              <span className='flex h-10 w-10 items-center justify-center rounded bg-brand-muted text-brand-primary'>
                <Icon className='h-5 w-5' />
              </span>
              <span className='text-xl font-bold text-brand-primary'>{count}</span>
            </div>
            <h2 className='font-bold text-brand-dark'>{title}</h2>
            <p className='mt-1 text-sm text-brand-dark/60'>{description}</p>
          </button>
        ))}
      </div>

      <section className='rounded-lg border border-brand-dark/10 bg-white shadow-sm'>
        <div className='flex items-center justify-between border-b border-brand-dark/10 p-5'>
          <h2 className='text-xl font-bold text-brand-dark'>Latest Causes</h2>
          <button
            type='button'
            onClick={() => router.navigate({ to: "/admin/causes" })}
            className='text-sm font-bold text-brand-primary hover:text-brand-dark'
          >
            Manage
          </button>
        </div>

        {causes.length === 0 ? (
          <div className='p-8 text-center text-brand-dark/60'>No causes yet.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-brand-muted text-brand-dark/60'>
                <tr>
                  <th className='px-5 py-3 font-semibold'>Title</th>
                  <th className='px-5 py-3 font-semibold'>Category</th>
                  <th className='px-5 py-3 font-semibold'>Amount</th>
                  <th className='px-5 py-3 font-semibold'>Status</th>
                </tr>
              </thead>
              <tbody>
                {causes.slice(0, 6).map((cause) => (
                  <tr key={cause.id} className='border-t border-brand-dark/10'>
                    <td className='px-5 py-4 font-semibold text-brand-dark'>{cause.title}</td>
                    <td className='px-5 py-4 text-brand-dark/65'>{cause.category || "General"}</td>
                    <td className='px-5 py-4 text-brand-dark/65'>
                      ₹{Number(cause.target_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className='px-5 py-4'>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${cause.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {cause.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
};
