import { useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  CreditCard,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchFooterContent, subscribeNewsletter } from "@/features/footer/footerSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const iconMap = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
};

export function Footer() {
  const dispatch = useDispatch();
  const { content, newsletterLoading } = useSelector((state) => state.footer);
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    if (!content) {
      dispatch(fetchFooterContent());
    }
  }, [content, dispatch]);

  const socialEntries = useMemo(() => Object.entries(content?.socialLinks || {}), [content?.socialLinks]);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    await dispatch(subscribeNewsletter(email.trim())).unwrap();
    toast.success("Subscribed to newsletter");
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!content) {
    return null;
  }

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/60 bg-white/70 pb-6 pt-14 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
      <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-200">
              <ShieldCheck size={16} />
              {content.offerHighlight?.title}
            </div>
            <h3 className="text-2xl font-black">{content.newsletter?.title}</h3>
            <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">{content.newsletter?.subtitle}</p>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubscribe}>
            <Input
              aria-label="Newsletter email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={content.newsletter?.placeholder || "Enter your email"}
              className="h-12 rounded-full"
            />
            <Button type="submit" className="h-12 rounded-full px-6" disabled={newsletterLoading}>
              {content.newsletter?.buttonText || "Subscribe"}
            </Button>
          </form>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-panel">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xl font-black">{content.brandName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{content.tagline}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{content.description}</p>
          </div>

          <FooterColumn title="Quick Links" links={content.quickLinks} />
          <FooterColumn title="Popular Medicines" links={content.featureLinks} />
          <FooterColumn title="Support" links={content.supportLinks} />

          <div className="space-y-5">
            <h3 className="text-sm font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Contact & Social
            </h3>
            <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-brand-600" />
                <span>{content.contact?.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-brand-600" />
                <span>{content.contact?.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-brand-600" />
                <span>{content.contact?.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {socialEntries.map(([key, value]) => {
                const Icon = iconMap[key];
                if (!Icon || !value) return null;
                return (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 transition hover:-translate-y-1 hover:bg-brand-600 hover:text-white dark:bg-slate-800"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 rounded-[28px] border border-white/70 bg-gradient-to-br from-brand-50 to-white p-5 shadow-panel dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Accepted payments</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(content.paymentMethods || []).map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                >
                  <CreditCard size={15} className="text-brand-600" />
                  {method}
                </span>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:bg-slate-800">
            <Globe2 size={16} className="text-brand-600" />
            <select
              aria-label="Select language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="bg-transparent outline-none"
            >
              {(content.languageOptions || ["English"]).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <Button variant="secondary" className="gap-2 rounded-full" onClick={scrollToTop}>
            <ArrowUp size={16} />
            Back to top
          </Button>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>{content.bottomBar?.copyright}</p>
            <p>{content.bottomBar?.developerCredit}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {(content.bottomBar?.smallLinks || []).map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links = [] }) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="space-y-3">
        {links.map((link) => (
          <FooterLink key={link.label} link={link} />
        ))}
      </div>
    </div>
  );
}

function FooterLink({ link }) {
  const isExternal = String(link.path || "").startsWith("http");

  const className =
    "group inline-flex text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300";

  if (isExternal) {
    return (
      <a href={link.path} target="_blank" rel="noreferrer" className={className}>
        <span className="border-b border-transparent transition group-hover:border-current">{link.label}</span>
      </a>
    );
  }

  return (
    <Link to={link.path} className={className}>
      <span className="border-b border-transparent transition group-hover:border-current">{link.label}</span>
    </Link>
  );
}
