import { AlertCircle, CalendarClock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './Ui';

export const UrgencyBar = ({
  onAction,
  variant = 'dark',
}: {
  onAction?: () => void;
  variant?: 'dark' | 'light';
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={isDark ? 'rounded-[28px] border border-orange-300/20 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 p-4 text-white shadow-2xl' : 'rounded-[28px] border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 p-4 text-slate-900 shadow-soft'}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className={isDark ? 'rounded-2xl bg-orange-500 p-3 text-white shadow-lg shadow-orange-950/40' : 'rounded-2xl bg-brand-orange p-3 text-white shadow-lg shadow-orange-200'}>
            <CalendarClock size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={isDark ? 'inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-orange-200 ring-1 ring-white/10' : 'inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-brand-orange'}>
                <AlertCircle size={14} /> Agenda limitada
              </span>
              <span className={isDark ? 'inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200 ring-1 ring-emerald-300/20' : 'inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700'}>
                <CheckCircle2 size={14} /> Prioridad por orden de solicitud
              </span>
            </div>
            <p className="mt-2 text-lg font-black md:text-xl">Reserva tu hueco de fabricación antes de que se complete la agenda del mes</p>
            <p className={isDark ? 'mt-1 max-w-3xl text-sm font-semibold text-slate-300' : 'mt-1 max-w-3xl text-sm font-semibold text-slate-600'}>
              Las solicitudes con plano y datos completos se revisan antes. Configura tu módulo ahora y recibe una proforma orientativa para avanzar más rápido.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col xl:flex-row">
          <div className={isDark ? 'rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10' : 'rounded-2xl bg-white px-4 py-3 ring-1 ring-orange-100'}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-orange" />
              <p className="text-xs font-black uppercase tracking-wide">Disponibilidad estimada</p>
            </div>
            <div className="mt-2 flex gap-1.5">
              {[0, 1, 2, 3, 4].map((slot) => (
                <span key={slot} className={slot < 2 ? 'h-2.5 w-9 rounded-full bg-brand-orange' : isDark ? 'h-2.5 w-9 rounded-full bg-white/20' : 'h-2.5 w-9 rounded-full bg-slate-200'} />
              ))}
            </div>
            <p className={isDark ? 'mt-2 text-xs font-bold text-orange-100' : 'mt-2 text-xs font-bold text-orange-700'}>Pocas revisiones prioritarias disponibles</p>
          </div>
          {onAction ? <Button onClick={onAction}>Configurar ahora</Button> : null}
        </div>
      </div>
    </div>
  );
};
