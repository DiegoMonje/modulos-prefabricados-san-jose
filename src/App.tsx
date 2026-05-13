import { useState } from 'react';
import { AdminPanel } from './components/admin/AdminPanel';
import { ConfiguratorPage } from './components/configurator/ConfiguratorPage';
import { LandingPage } from './components/landing/LandingPage';
import { CookieBanner } from './components/legal/CookieBanner';
import { LegalPages, type LegalPageType } from './components/legal/LegalPages';
import { UrgencyBar } from './components/ui/UrgencyBar';

type View = 'public' | 'configurator' | 'admin' | 'legal';

export default function App() {
  const [view, setView] = useState<View>('public');
  const [legalPage, setLegalPage] = useState<LegalPageType>('aviso-legal');

  const openLegal = (page: LegalPageType) => {
    setLegalPage(page);
    setView('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'configurator') {
    return (
      <>
        <div className="bg-slate-50 px-4 pt-4">
          <div className="mx-auto max-w-7xl">
            <UrgencyBar variant="light" />
          </div>
        </div>
        <ConfiguratorPage onBack={() => setView('public')} />
        <CookieBanner onLegalPage={openLegal} />
      </>
    );
  }

  if (view === 'admin') return <AdminPanel onBack={() => setView('public')} />;
  if (view === 'legal') return <><LegalPages page={legalPage} onBack={() => setView('public')} onNavigate={setLegalPage} /><CookieBanner onLegalPage={openLegal} /></>;

  return (
    <>
      <LandingPage onStart={() => setView('configurator')} onAdmin={() => setView('admin')} onLegalPage={openLegal} />
      <section className="bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <UrgencyBar onAction={() => setView('configurator')} variant="dark" />
        </div>
      </section>
      <CookieBanner onLegalPage={openLegal} />
    </>
  );
}
