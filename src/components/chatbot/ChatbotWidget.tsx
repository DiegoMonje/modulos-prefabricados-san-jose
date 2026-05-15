import { useMemo, useState } from 'react';
import { Bot, ChevronDown, MessageCircle, Send, X } from 'lucide-react';
import { company } from '../../config/company';
import { chatbotIntro, chatbotTopics, defaultChatbotTopic, quoteWhatsappText, type ChatbotTopic } from './chatbotKnowledge';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ChatbotTopic>(defaultChatbotTopic);

  const whatsappUrl = useMemo(
    () => `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(quoteWhatsappText)}`,
    []
  );

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end sm:right-6">
      {isOpen && (
        <section className="mb-4 w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:w-[390px]" aria-label="Asistente de presupuesto">
          <header className="bg-brand-navy p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Bot size={24} />
                </div>
                <div>
                  <p className="text-sm font-black leading-tight">Asistente de presupuesto</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-200">{company.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar chat"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          <div className="max-h-[68vh] overflow-y-auto p-4">
            <div className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold leading-6 text-slate-700">
              {chatbotIntro}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {chatbotTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`rounded-2xl border px-3 py-2 text-left text-xs font-black transition ${
                    selectedTopic.id === topic.id
                      ? 'border-brand-orange bg-orange-50 text-brand-orange'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-orange hover:bg-orange-50 hover:text-brand-orange'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <article className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-blue">Información de la web</p>
              <h3 className="mt-2 text-lg font-black text-slate-900">{selectedTopic.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{selectedTopic.answer}</p>
              {selectedTopic.bullets && (
                <ul className="mt-3 space-y-2 text-sm font-semibold leading-5 text-slate-600">
                  {selectedTopic.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">
              Nota: los precios son orientativos. El presupuesto final se confirma tras revisar medidas, extras, transporte, montaje y acceso al lugar de instalación.
            </div>

            <div className="mt-4 grid gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-green px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <Send size={18} /> Pedir presupuesto por WhatsApp
              </a>
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:border-brand-orange hover:text-brand-orange"
              >
                Llamar al {company.phone}
              </a>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-4 text-sm font-black text-white shadow-2xl transition hover:-translate-y-0.5 hover:brightness-105"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      >
        {isOpen ? <ChevronDown size={20} /> : <MessageCircle size={20} />}
        {isOpen ? 'Cerrar' : '¿Necesitas ayuda?'}
      </button>
    </div>
  );
};
