import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Download, LogOut, MessageCircle, RefreshCcw, Search, Trash2 } from 'lucide-react';
import type { LeadRow, LeadStatus } from '../../types';
import { addLeadNote, deleteLead, exportNewsletterCsv, getLeads, updateLeadStatus } from '../../services/leads';
import { getCurrentUser, signIn, signOut } from '../../services/auth';
import { formatCurrency } from '../../utils/pricing';
import { Button, Card, Field, Input, Select, Textarea, Badge } from '../ui/Ui';

const statuses: LeadStatus[] = ['Nuevo', 'Contactado', 'Presupuesto enviado', 'Negociando', 'Vendido', 'Perdido'];

const statusColor = (status: LeadStatus): 'orange' | 'blue' | 'green' | 'red' | 'purple' | 'slate' => {
  if (status === 'Nuevo') return 'orange';
  if (status === 'Contactado') return 'blue';
  if (status === 'Presupuesto enviado') return 'purple';
  if (status === 'Vendido') return 'green';
  if (status === 'Perdido') return 'red';
  return 'slate';
};

export const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser().then((user) => setLoggedIn(Boolean(user))).finally(() => setChecking(false));
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      setLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    }
  };

  if (checking) return <div className="flex min-h-screen items-center justify-center bg-slate-50 font-black text-slate-600">Comprobando sesión...</div>;

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md">
          <Button variant="ghost" onClick={onBack} className="mb-6"><ArrowLeft size={18} /> Volver</Button>
          <Card>
            <h1 className="text-2xl font-black text-slate-900">Panel privado</h1>
            <p className="mt-2 text-sm text-slate-600">Accede para gestionar solicitudes de presupuesto.</p>
            <form onSubmit={login} className="mt-6 space-y-4">
              <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
              <Field label="Contraseña"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
              {error ? <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
            <p className="mt-4 text-xs text-slate-500">Crea el usuario administrador desde Supabase Auth antes de entrar.</p>
          </Card>
        </div>
      </div>
    );
  }

  return <AdminDashboard onBack={onBack} onLogout={async () => { await signOut(); setLoggedIn(false); }} />;
};

const AdminDashboard = ({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) => {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [note, setNote] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await getLeads();
      setLeads(rows);
      if (selectedLead) setSelectedLead(rows.find((lead) => lead.id === selectedLead.id) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const metrics = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    return {
      total: leads.length,
      newLeads: leads.filter((lead) => lead.status === 'Nuevo').length,
      contacted: leads.filter((lead) => lead.status === 'Contactado').length,
      quoted: leads.filter((lead) => lead.status === 'Presupuesto enviado').length,
      sold: leads.filter((lead) => lead.status === 'Vendido').length,
      potential: leads.reduce((sum, lead) => sum + Number(lead.estimated_price_without_vat || 0), 0),
      month: leads.filter((lead) => lead.created_at?.slice(0, 7) === month).length,
    };
  }, [leads]);

  const filtered = useMemo(() => leads.filter((lead) => {
    const config = lead.configurations?.[0];
    const haystack = `${lead.full_name} ${lead.phone} ${lead.email || ''} ${lead.province} ${lead.city} ${config?.use_type || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (!statusFilter || lead.status === statusFilter) && (!provinceFilter || lead.province.toLowerCase().includes(provinceFilter.toLowerCase()));
  }), [leads, search, statusFilter, provinceFilter]);

  const changeStatus = async (lead: LeadRow, status: LeadStatus) => { await updateLeadStatus(lead.id, status); await load(); };
  const removeLead = async (lead: LeadRow) => { if (!confirm(`¿Eliminar solicitud de ${lead.full_name}?`)) return; await deleteLead(lead.id); setSelectedLead(null); await load(); };
  const saveNote = async () => { if (!selectedLead || !note.trim()) return; await addLeadNote(selectedLead.id, note.trim()); setNote(''); await load(); setMessage('Nota guardada.'); };
  const downloadNewsletter = async () => {
    const csv = await exportNewsletterCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suscriptores-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const leadWhatsApp = (lead: LeadRow) => {
    const config = lead.configurations?.[0];
    const phone = lead.phone.replace(/\D/g, '').startsWith('34') ? lead.phone.replace(/\D/g, '') : `34${lead.phone.replace(/\D/g, '')}`;
    const dimensions = config ? `${config.length} x ${config.width} m` : 'caseta prefabricada';
    const msg = `Hola ${lead.full_name}, soy Diego de Módulos Prefabricados San José. He recibido tu solicitud para una caseta ${dimensions}. Te contacto para prepararte un presupuesto personalizado.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div><h1 className="text-xl font-black text-slate-900">Panel privado</h1><p className="text-sm text-slate-500">Módulos Prefabricados San José S.L.</p></div>
          <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={load}><RefreshCcw size={16} /> Actualizar</Button><Button variant="outline" onClick={downloadNewsletter}><Download size={16} /> Newsletter CSV</Button><Button variant="ghost" onClick={onBack}>Web pública</Button><Button variant="danger" onClick={onLogout}><LogOut size={16} /> Salir</Button></div>
        </div>
      </header>
      <main className="container-page py-8">
        {error ? <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p> : null}
        {message ? <p className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">{message}</p> : null}
        <section className="grid gap-4 md:grid-cols-4 lg:grid-cols-7"><Metric label="Solicitudes" value={metrics.total} /><Metric label="Nuevas" value={metrics.newLeads} /><Metric label="Contactados" value={metrics.contacted} /><Metric label="Presupuestos" value={metrics.quoted} /><Metric label="Ventas" value={metrics.sold} /><Metric label="Potencial" value={formatCurrency(metrics.potential)} /><Metric label="Este mes" value={metrics.month} /></section>
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl font-black text-slate-900">Solicitudes</h2><p className="text-sm text-slate-500">Gestiona los clientes interesados.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" className="pl-9" /></div><Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">Todos</option>{statuses.map((s) => <option key={s}>{s}</option>)}</Select><Input value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)} placeholder="Provincia" /></div></div>
            {loading ? <p className="py-10 text-center text-slate-500">Cargando...</p> : <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500"><th className="py-3">Fecha</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Provincia</th><th>Medida</th><th>Uso</th><th>Sin IVA</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filtered.map((lead) => { const config = lead.configurations?.[0]; return <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3">{new Date(lead.created_at).toLocaleDateString('es-ES')}</td><td className="font-bold text-slate-900">{lead.full_name}</td><td>{lead.phone}</td><td>{lead.email || '-'}</td><td>{lead.province}</td><td>{config ? `${config.length} x ${config.width} m` : '-'}</td><td>{config?.use_type || lead.intended_use || '-'}</td><td>{formatCurrency(lead.estimated_price_without_vat || 0)}</td><td><Badge color={statusColor(lead.status)}>{lead.status}</Badge></td><td><div className="flex gap-1"><Button variant="ghost" className="px-3 py-2 text-sm" onClick={() => setSelectedLead(lead)}>Ver</Button><a href={leadWhatsApp(lead)} target="_blank" rel="noreferrer" className="rounded-lg p-2 hover:bg-slate-200"><MessageCircle size={16} /></a><button onClick={() => removeLead(lead)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></td></tr>; })}</tbody></table></div>}
          </Card>
          <Card className="h-fit">{!selectedLead ? <div className="py-10 text-center text-slate-500">Selecciona una solicitud para ver el detalle.</div> : <div><div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">{selectedLead.full_name}</h2><p className="text-sm text-slate-500">{selectedLead.phone} · {selectedLead.city}, {selectedLead.province}</p></div><Badge color={statusColor(selectedLead.status)}>{selectedLead.status}</Badge></div><Field label="Estado comercial"><Select value={selectedLead.status} onChange={(e) => changeStatus(selectedLead, e.target.value as LeadStatus)}>{statuses.map((s) => <option key={s}>{s}</option>)}</Select></Field><div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><h3 className="mb-3 font-black text-slate-900">Configuración</h3>{selectedLead.configurations?.[0] ? <LeadConfiguration lead={selectedLead} /> : <p>No hay configuración asociada.</p>}</div><div className="mt-5 rounded-2xl bg-orange-50 p-4"><p className="text-sm font-bold text-orange-700">Precio estimado sin IVA</p><p className="text-2xl font-black text-brand-orange">{formatCurrency(selectedLead.estimated_price_without_vat || 0)}</p><p className="text-sm font-bold text-orange-900">Total con IVA: {formatCurrency(selectedLead.estimated_price_with_vat || 0)}</p></div><div className="mt-5"><h3 className="mb-3 font-black text-slate-900">Notas internas</h3><div className="space-y-2">{selectedLead.notes?.length ? selectedLead.notes.map((n) => <div key={n.id} className="rounded-xl bg-slate-50 p-3 text-sm"><p>{n.note}</p><p className="mt-1 text-xs text-slate-400">{new Date(n.created_at).toLocaleString('es-ES')}</p></div>) : <p className="text-sm text-slate-500">Sin notas todavía.</p>}</div><div className="mt-3 space-y-2"><Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Añadir nota interna..." /><Button onClick={saveNote}>Guardar nota</Button></div></div></div>}</Card>
        </section>
      </main>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string | number }) => <Card className="p-4"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-900">{value}</p></Card>;
const LeadConfiguration = ({ lead }: { lead: LeadRow }) => { const config = lead.configurations![0]; return <div className="space-y-1"><p><strong>Medidas:</strong> {config.length} x {config.width} m ({config.square_meters} m²)</p><p><strong>Tipo de medida:</strong> {config.is_special_measure ? 'Bajo consulta' : 'Estándar'}</p><p><strong>Panel:</strong> {config.panel_type || 'Panel sándwich'} · {config.panel_thickness} · {config.panel_color || 'Blanco'}</p><p><strong>Uso:</strong> {config.use_type}</p><p><strong>Extras:</strong> {config.extras?.length ? config.extras.join(', ') : 'Sin extras'}</p><p><strong>Plazo:</strong> {config.delivery_timeline}</p></div>; };
