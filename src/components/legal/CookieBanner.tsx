import { useEffect, useState } from 'react';
import { Cookie, Settings, ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/Ui';
import type { LegalPageType } from './LegalPages';

const STORAGE_KEY = 'mpsj_cookie_consent';
export const OPEN_COOKIE_SETTINGS_EVENT = 'mpsj:open-cookie-settings';

type Consent = 'accepted' | 'rejected' | 'configured';
type ConsentPreferences = { status: Consent; analytics: boolean; marketing: boolean; savedAt: string };

const readSavedConsent = (): ConsentPreferences | null => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as Partial<ConsentPreferences> | null;
    if (!stored || !['accepted', 'rejected', 'configured'].includes(stored.status ?? '')) return null;
    return {
      status: stored.status as Consent,
      analytics: stored.status === 'accepted' || stored.analytics === true,
      marketing: stored.status === 'accepted' || stored.marketing === true,
      savedAt: typeof stored.savedAt === 'string' ? stored.savedAt : '',
    };
  } catch {
    return null;
  }
};

export const CookieBanner = ({ onLegalPage }: { onLegalPage: (page: LegalPageType) => void }) => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readSavedConsent();
    if (!stored) setVisible(true);

    const openSettings = () => {
      const current = readSavedConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setShowSettings(true);
      setVisible(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const save = (status: Consent, options?: { analytics?: boolean; marketing?: boolean }) => {
    const preferences = {
      analytics: options?.analytics ?? false,
      marketing: options?.marketing ?? false,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, ...preferences, savedAt: new Date().toISOString() }));
    window.mpsjSetGoogleConsent(preferences);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-2xl shadow-slate-950/50 sm:rounded-[28px]">
        <div className="grid gap-3 p-3 sm:gap-5 sm:p-5 md:grid-cols-[1fr_auto] md:items-start">
          <div className="flex gap-3 sm:gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white sm:flex"><Cookie size={24} /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-300 sm:text-sm sm:tracking-[0.18em]">Privacidad y cookies</p>
                  <h2 className="mt-0.5 text-base font-black leading-tight sm:mt-1 sm:text-xl">Usamos cookies para mejorar tu experiencia</h2>
                </div>
                <button onClick={() => save('rejected')} className="shrink-0 rounded-full bg-slate-900 p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white sm:p-2 md:hidden" aria-label="Cerrar banner"><X size={18} /></button>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-300 sm:hidden">Usamos cookies técnicas y, con tu permiso, analíticas o de marketing.</p>
              <p className="mt-2 hidden max-w-3xl text-sm leading-6 text-slate-300 sm:block">Utilizamos cookies técnicas necesarias. Las cookies de analítica o marketing solo se activarán si las aceptas o las configuras.</p>
              {showSettings && <div className="mt-3 grid gap-2 rounded-xl bg-slate-900 p-3 text-xs text-slate-200 sm:mt-4 sm:grid-cols-2 sm:gap-3 sm:rounded-2xl sm:p-4 sm:text-sm"><label className="flex items-start gap-2 rounded-xl border border-slate-700 p-2.5 sm:gap-3 sm:p-3"><input type="checkbox" checked disabled className="mt-1" /><span><strong>Necesarias</strong><br /><span className="text-slate-400">Siempre activas.</span></span></label><label className="flex items-start gap-2 rounded-xl border border-slate-700 p-2.5 sm:gap-3 sm:p-3"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1" /><span><strong>Analítica</strong><br /><span className="text-slate-400">Para medir el uso y rendimiento de la web.</span></span></label><label className="flex items-start gap-2 rounded-xl border border-slate-700 p-2.5 sm:col-span-2 sm:gap-3 sm:p-3"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1" /><span><strong>Marketing</strong><br /><span className="text-slate-400">Para medir campañas y conversiones con Google Ads y Meta (Facebook).</span></span></label></div>}
              <button onClick={() => onLegalPage('cookies')} className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-orange-300 hover:text-orange-200 sm:mt-3 sm:gap-2 sm:text-sm"><ShieldCheck size={15} /> Ver política de cookies</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:flex md:min-w-48 md:flex-col">
            <Button onClick={() => save('accepted', { analytics: true, marketing: true })} className="rounded-xl px-3 py-2 text-sm sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base">Aceptar todas</Button>
            <Button variant="outline" onClick={() => save('rejected')} className="rounded-xl border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base">Rechazar</Button>
            {showSettings ? <Button variant="secondary" onClick={() => save('configured', { analytics, marketing })} className="col-span-2 rounded-xl px-3 py-2 text-sm sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base">Guardar configuración</Button> : <button onClick={() => setShowSettings(true)} className="col-span-2 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-slate-300 transition hover:bg-slate-900 hover:text-white sm:px-4 sm:py-3 sm:text-sm"><Settings size={15} /> Configurar</button>}
          </div>
        </div>
      </div>
    </div>
  );
};
