import { company } from '../../config/company';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/modulosprefabricadossanjose', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/modulosprefabricadossanjose/', Icon: InstagramIcon },
] as const;

export const SocialLinks = ({ className = '', variant = 'light' }: { className?: string; variant?: 'light' | 'dark' }) => {
  const theme = variant === 'dark'
    ? 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
    : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand-orange/40 hover:bg-orange-50 hover:text-brand-orange';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visitar ${label} de ${company.name}`}
          title={label}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition duration-200 ${theme}`}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
      <path d="M14.2 8.35V6.9c0-.7.48-.86.82-.86h2.1V2.82l-2.9-.01c-3.22 0-3.95 2.41-3.95 3.95v1.59H8.4v3.6h1.87v9.25h3.75v-9.25h2.82l.38-3.6H14.2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.9]">
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.9" cy="7.1" r=".85" className="fill-current stroke-none" />
    </svg>
  );
}
