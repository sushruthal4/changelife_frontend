import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import causeMedical from "@/assets/cause-medical.jpg";
import { PublicFooter, PublicHeader } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { ORG } from "@/constants";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaultSiteContent } from "@/lib/api/siteContent";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone is required"),
  team: z.string().min(1, "Select a team"),
  message: z.string().min(5, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

const getWhatsAppPhone = (content: typeof defaultSiteContent) =>
  WHATSAPP_NUMBER || content.whatsappNumber || content.supportPhone || ORG.whatsapp;

const buildWhatsAppUrl = (phone: string, data: ContactFormData) => {
  const digits = phone.replace(/\D/g, "");
  const text = [
    "*New message from Heart Fuel contact form*",
    "",
    `*Name:* ${data.name}`,
    `*Email:* ${data.email}`,
    `*Phone:* ${data.phone}`,
    `*Team:* ${data.team}`,
    "",
    "*Message:*",
    data.message,
  ].join("\n");

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const ContactPage: React.FC = () => {
  const { data: siteRecord } = useSiteContent();
  const content = siteRecord?.content || defaultSiteContent;
  const whatsappPhone = getWhatsAppPhone(content);
  const supportPhone = content.supportPhone || whatsappPhone;
  const supportEmail = content.supportEmail || ORG.supportEmail;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { team: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    window.open(buildWhatsAppUrl(whatsappPhone, data), "_blank", "noopener,noreferrer");
    reset({ team: "" });
  };

  return (
    <div className="min-h-screen bg-white text-brand-dark">
      <PublicHeader />
      <PageBanner
        image={content.contactPage?.bannerImage || causeMedical}
        alt="Contact Heart Fuel"
      />

      <section className="bg-white px-4 py-9 text-center md:px-6">
        <h1 className="text-[28px] font-semibold leading-tight text-brand-dark md:text-[40px]">
          Contact <strong className="font-bold text-brand-primary">US</strong>
        </h1>
      </section>

      <section className="bg-white px-4 py-10 md:px-6 md:py-[60px]">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[40%_1fr] lg:gap-[60px]">
          <div>
            <h2 className="text-[28px] font-semibold text-brand-primary md:text-[32px]">Contact Our Team</h2>

            <div className="mt-6 space-y-5">
              <ContactInfoCard
                icon={<MessageCircle className="h-6 w-6" />}
                title="WhatsApp"
                value={whatsappPhone}
                href={`https://wa.me/${whatsappPhone.replace(/\D/g, "")}`}
              />
              <ContactInfoCard
                icon={<Phone className="h-6 w-6" />}
                title="Phone"
                value={supportPhone}
                href={`tel:${supportPhone}`}
              />
              <ContactInfoCard
                icon={<Mail className="h-6 w-6" />}
                title="Email"
                value={supportEmail}
                href={`mailto:${supportEmail}`}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl bg-[#f9f9f9] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.10)] md:p-10"
          >
            <div className="mb-6">
              <h2 className="text-[28px] font-semibold text-brand-primary md:text-[32px]">Request a call back</h2>
              <p className="mt-2 text-sm text-brand-primary/80">We would love to hear from you!</p>
            </div>

            <div className="space-y-4">
              <Field label="Name" required error={errors.name?.message}>
                <input {...register("name")} className="contact-input" placeholder="Your name" autoComplete="name" />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email" required error={errors.email?.message}>
                  <input
                    type="email"
                    {...register("email")}
                    className="contact-input"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone" required error={errors.phone?.message}>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="contact-input"
                    placeholder="Your phone number"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <Field label="Select Team" required error={errors.team?.message}>
                <select {...register("team")} className="contact-input appearance-none">
                  <option value="">Choose a team</option>
                  <option value="New Donation">New Donation</option>
                  <option value="Support">Support</option>
                  <option value="Technical">Technical</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </Field>

              <Field label="Message" required error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  className="contact-input min-h-[120px] resize-y"
                  placeholder="Your message"
                />
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#d9467a] disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Opening WhatsApp..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

function ContactInfoCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-center gap-4 rounded-xl bg-white p-5 text-brand-primary shadow-[0_8px_20px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)]"
    >
      <span className="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-full bg-white text-brand-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-base font-semibold">{title}</span>
        <span className="mt-1 block break-words text-sm text-brand-primary/80">{value}</span>
      </span>
    </a>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-brand-primary">
        {label} {required && <span className="text-[#d82c0d]">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-[#d82c0d]">{error}</span>}
    </label>
  );
}
