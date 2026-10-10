import { lazy, Suspense, useEffect, useState } from 'react';
import { AdminPanel } from './components/admin/AdminPanel';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';
import { ConfiguratorPage } from './components/configurator/ConfiguratorPage';
import { LandingPage } from './components/landing/LandingPage';
import { CookieBanner } from './components/legal/CookieBanner';
import { LegalPages, type LegalPageType } from './components/legal/LegalPages';

const CatalogPage = lazy(() => import('./components/catalog/CatalogPage').then((module) => ({ default: module.CatalogPage })));

type View = 'public' | 'configurator' | 'admin' | 'legal' | 'catalog';

const getCatalogRouteFromPath = () => {
  const match = window.location.pathname.match(/^\/catalogo(?:\/([^/]+))?\/?$/);
  if (!match) return null;
  return { slug: match[1] ?? '' };
};

export default function App() {
  const initialCatalogRoute = getCatalogRouteFromPath();
  const [view, setView] = useState<View>(initialCatalogRoute ? 'catalog' : 'public');
  const [catalogSlug, setCatalogSlug] = useState(initialCatalogRoute?.slug ?? '');
  const [legalPage, setLegalPage] = useState<LegalPageType>('aviso-legal');
  const [legalReturnView, setLegalReturnView] = useState<Exclude<View, 'legal'>>('public');

  useEffect(() => {
    const syncPath = () => {
      const catalogRoute = getCatalogRouteFromPath();
      if (catalogRoute) {
        setCatalogSlug(catalogRoute.slug);
        setView('catalog');
      } else {
        setCatalogSlug('');
        setView('public');
      }
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const openLegal = (page: LegalPageType) => {
    setLegalReturnView(view === 'legal' ? legalReturnView : view);
    setLegalPage(page);
    setView('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCatalog = (slug = '') => {
    const path = slug ? `/catalogo/${slug}` : '/catalogo';
    window.history.pushState({}, '', path);
    setCatalogSlug(slug);
    setView('catalog');
    window.scrollTo({ top: 0 });
  };

  const returnToWebsite = () => {
    window.history.pushState({}, '', '/');
    setCatalogSlug('');
    setView('public');
    window.scrollTo({ top: 0 });
  };

  if (view === 'configurator') return <><ConfiguratorPage onBack={() => setView('public')} /><CookieBanner onLegalPage={openLegal} /><ChatbotWidget /></>;
  if (view === 'admin') return <AdminPanel onBack={() => setView('public')} />;
  if (view === 'legal') return <><LegalPages page={legalPage} onBack={() => setView(legalReturnView)} onNavigate={setLegalPage} /><CookieBanner onLegalPage={openLegal} /><ChatbotWidget /></>;
  if (view === 'catalog') return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 font-black text-slate-700">Cargando catálogo…</div>}><CatalogPage productSlug={catalogSlug} onNavigate={openCatalog} onBackToWebsite={returnToWebsite} onLegalPage={openLegal} /><CookieBanner onLegalPage={openLegal} /></Suspense>;

  return <><LandingPage onStart={() => setView('configurator')} onAdmin={() => setView('admin')} onLegalPage={openLegal} /><CookieBanner onLegalPage={openLegal} /><ChatbotWidget /></>;
}
