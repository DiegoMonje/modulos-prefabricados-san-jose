import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }) => {
  const classes = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-black text-slate-700 transition hover:bg-slate-100',
    danger: 'inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700',
  }[variant];
  return <button className={`${classes} ${className}`} {...props} />;
};

export const Card = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div className={`card ${className}`}>{children}</div>
);

export const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => (
  <label className="block">
    <span className="field-label">{label}</span>
    {children}
    {error ? <span className="mt-1 block text-sm font-semibold text-red-600">{error}</span> : null}
  </label>
);

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => <input className={`input ${className}`} {...props} />;
export const Select = ({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) => <select className={`input ${className}`} {...props} />;
export const Textarea = ({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={`input ${className}`} {...props} />;

export const Badge = ({ color = 'slate', children }: { color?: 'orange' | 'blue' | 'green' | 'red' | 'purple' | 'slate'; children: ReactNode }) => {
  const classes = {
    orange: 'bg-orange-100 text-orange-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    slate: 'bg-slate-100 text-slate-800',
  }[color];
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${classes}`}>{children}</span>;
};
