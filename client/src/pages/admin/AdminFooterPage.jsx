import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  fetchFooterContent,
  fetchNewsletterSubscribers,
  updateFooterContent,
} from "@/features/footer/footerSlice";

const stringifyLinks = (links = []) => links.map((item) => `${item.label}|${item.path}`).join("\n");
const parseLinks = (value) =>
  String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, ...rest] = item.split("|");
      return { label: label?.trim(), path: rest.join("|").trim() };
    })
    .filter((item) => item.label && item.path);

export default function AdminFooterPage() {
  const dispatch = useDispatch();
  const { content, subscribers, saving } = useSelector((state) => state.footer);
  const [form, setForm] = useState(null);

  useEffect(() => {
    dispatch(fetchFooterContent());
    dispatch(fetchNewsletterSubscribers());
  }, [dispatch]);

  useEffect(() => {
    if (content) {
      setForm({
        brandName: content.brandName || "",
        description: content.description || "",
        tagline: content.tagline || "",
        quickLinks: stringifyLinks(content.quickLinks),
        featureLinks: stringifyLinks(content.featureLinks),
        supportLinks: stringifyLinks(content.supportLinks),
        email: content.contact?.email || "",
        phone: content.contact?.phone || "",
        location: content.contact?.location || "",
        instagram: content.socialLinks?.instagram || "",
        facebook: content.socialLinks?.facebook || "",
        twitter: content.socialLinks?.twitter || "",
        linkedin: content.socialLinks?.linkedin || "",
        newsletterTitle: content.newsletter?.title || "",
        newsletterSubtitle: content.newsletter?.subtitle || "",
        newsletterPlaceholder: content.newsletter?.placeholder || "",
        newsletterButtonText: content.newsletter?.buttonText || "",
        offerTitle: content.offerHighlight?.title || "",
        offerDescription: content.offerHighlight?.description || "",
        copyright: content.bottomBar?.copyright || "",
        developerCredit: content.bottomBar?.developerCredit || "",
        bottomLinks: stringifyLinks(content.bottomBar?.smallLinks),
        paymentMethods: (content.paymentMethods || []).join(", "),
        languageOptions: (content.languageOptions || []).join(", "),
      });
    }
  }, [content]);

  if (!form) {
    return null;
  }

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    await dispatch(
      updateFooterContent({
        brandName: form.brandName,
        description: form.description,
        tagline: form.tagline,
        quickLinks: parseLinks(form.quickLinks),
        featureLinks: parseLinks(form.featureLinks),
        supportLinks: parseLinks(form.supportLinks),
        contact: {
          email: form.email,
          phone: form.phone,
          location: form.location,
        },
        socialLinks: {
          instagram: form.instagram,
          facebook: form.facebook,
          twitter: form.twitter,
          linkedin: form.linkedin,
        },
        newsletter: {
          title: form.newsletterTitle,
          subtitle: form.newsletterSubtitle,
          placeholder: form.newsletterPlaceholder,
          buttonText: form.newsletterButtonText,
        },
        offerHighlight: {
          title: form.offerTitle,
          description: form.offerDescription,
        },
        paymentMethods: form.paymentMethods
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        languageOptions: form.languageOptions
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        bottomBar: {
          copyright: form.copyright,
          developerCredit: form.developerCredit,
          smallLinks: parseLinks(form.bottomLinks),
        },
      })
    ).unwrap();

    toast.success("Footer updated successfully");
  };

  return (
    <AdminShell title="Footer Settings" description="Control public footer links, social profiles, offers, and newsletter content from one place.">
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Admin footer settings</p>
          <h1 className="text-3xl font-black">Edit dynamic footer content</h1>
        </div>
        <Card className="px-5 py-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Newsletter subscribers</p>
          <p className="text-2xl font-black">{content?.newsletterSubscriberCount || 0}</p>
        </Card>
      </div>

      <form className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormCard title="Brand">
            <Field label="Brand name">
              <Input value={form.brandName} onChange={(event) => updateField("brandName", event.target.value)} />
            </Field>
            <Field label="Description">
              <textarea
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </Field>
            <Field label="Tagline">
              <Input value={form.tagline} onChange={(event) => updateField("tagline", event.target.value)} />
            </Field>
          </FormCard>

          <FormCard title="Footer Links">
            <Field label="Quick links (label|path per line)">
              <textarea
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                value={form.quickLinks}
                onChange={(event) => updateField("quickLinks", event.target.value)}
              />
            </Field>
            <Field label="Popular medicine sections">
              <textarea
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                value={form.featureLinks}
                onChange={(event) => updateField("featureLinks", event.target.value)}
              />
            </Field>
            <Field label="Support links">
              <textarea
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                value={form.supportLinks}
                onChange={(event) => updateField("supportLinks", event.target.value)}
              />
            </Field>
          </FormCard>

          <FormCard title="Newsletter & Offer">
            <Field label="Newsletter title">
              <Input
                value={form.newsletterTitle}
                onChange={(event) => updateField("newsletterTitle", event.target.value)}
              />
            </Field>
            <Field label="Newsletter subtitle">
              <textarea
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                value={form.newsletterSubtitle}
                onChange={(event) => updateField("newsletterSubtitle", event.target.value)}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Newsletter placeholder">
                <Input
                  value={form.newsletterPlaceholder}
                  onChange={(event) => updateField("newsletterPlaceholder", event.target.value)}
                />
              </Field>
              <Field label="Button text">
                <Input
                  value={form.newsletterButtonText}
                  onChange={(event) => updateField("newsletterButtonText", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Offer title">
              <Input value={form.offerTitle} onChange={(event) => updateField("offerTitle", event.target.value)} />
            </Field>
            <Field label="Offer description">
              <Input
                value={form.offerDescription}
                onChange={(event) => updateField("offerDescription", event.target.value)}
              />
            </Field>
          </FormCard>
        </div>

        <div className="space-y-6">
          <FormCard title="Contact & Social">
            <Field label="Email">
              <Input value={form.email} onChange={(event) => updateField("email", event.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(event) => updateField("location", event.target.value)} />
            </Field>
            {["instagram", "facebook", "twitter", "linkedin"].map((key) => (
              <Field key={key} label={`${key} URL`}>
                <Input value={form[key]} onChange={(event) => updateField(key, event.target.value)} />
              </Field>
            ))}
          </FormCard>

          <FormCard title="Bottom Bar">
            <Field label="Copyright">
              <Input value={form.copyright} onChange={(event) => updateField("copyright", event.target.value)} />
            </Field>
            <Field label="Developer credit">
              <Input
                value={form.developerCredit}
                onChange={(event) => updateField("developerCredit", event.target.value)}
              />
            </Field>
            <Field label="Bottom links (label|path per line)">
              <textarea
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                value={form.bottomLinks}
                onChange={(event) => updateField("bottomLinks", event.target.value)}
              />
            </Field>
          </FormCard>

          <FormCard title="Payments & Language">
            <Field label="Payment methods (comma separated)">
              <Input
                value={form.paymentMethods}
                onChange={(event) => updateField("paymentMethods", event.target.value)}
              />
            </Field>
            <Field label="Languages (comma separated)">
              <Input
                value={form.languageOptions}
                onChange={(event) => updateField("languageOptions", event.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save footer"}
            </Button>
          </FormCard>

          <FormCard title="Recent Subscribers">
            <div className="space-y-3">
              {subscribers.length ? (
                subscribers.slice(0, 8).map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
                  >
                    <p className="font-semibold">{item.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No subscribers yet.</p>
              )}
            </div>
          </FormCard>
        </div>
      </form>
    </div>
    </AdminShell>
  );
}

function FormCard({ title, children }) {
  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-black">{title}</h2>
      {children}
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}
