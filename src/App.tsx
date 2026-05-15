import { useState } from 'react';
import { AdminPanel } from './components/admin/AdminPanel';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';
import { ConfiguratorPage } from './components/configurator/ConfiguratorPage';
import { LandingPage } from './components/landing/LandingPage';
import { CookieBanner } from './components/legal/CookieBanner';
import { LegalPages, type LegalPageType } from './components/legal/LegalPages';

type View = 'public' | 'configurator' | 'admin' | 'legal';

export default function App() {
  const [view, setView] = useState<View>('public');
  const [legalPage, setLegalPage] = useState<LegalPageType>('aviso-legal');

  const openLegal = (page: LegalPageType) => {
    setLegalPage(page);
    setView('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'configurator') return <><ConfiguratorPage onBack={() => setView('public')} /><CookieBanner onLegalPage={openLegal} /><ChatbotWidget /></>;
  if (view === 'admin') return <AdminPanel onBack={() => setView('public')} />;
  if (view === 'legal') return <><LegalPages page={legalPage} onBack={() => setView('public')} onNavigate={setLegalPage} /><CookieBanner onLegalPage={openLegal} /><ChatbotWidget /></>;

  return <><LandingPage onStart={() => setView('configurator')} onAdmin={() => setView('admin')} onLegalPage={openLegal} /><CookieBanner onLegalPage={openLegal} /><ChatbotWidget /></>;
}
