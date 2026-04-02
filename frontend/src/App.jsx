import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Joyride, { STATUS } from 'react-joyride';
import toast, { Toaster } from 'react-hot-toast';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  ServerIcon, GlobeAltIcon, CloudIcon, ChartBarIcon,
  CircleStackIcon, CommandLineIcon, TicketIcon, ShieldCheckIcon,
  CogIcon, SunIcon, MoonIcon, ChevronLeftIcon, ChevronRightIcon,
  PlusIcon, TrashIcon, PlayIcon, StopIcon, ArrowPathIcon,
  CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,
  InformationCircleIcon, DocumentTextIcon, BriefcaseIcon,
  QuestionMarkCircleIcon, XMarkIcon, PowerIcon, SignalIcon,
  FolderIcon, ComputerDesktopIcon, WifiIcon, LockClosedIcon,
  CpuChipIcon, CircleStackIcon as DiskIcon, UserGroupIcon
} from '@heroicons/react/24/outline';
import { EdgeSecurityModule } from './modules/edgeSecurity';
import { CheckpointModule } from './modules/checkpoint';
import { SecurityPoliciesModule } from './modules/securityPolicies';

const API_BASE = '/api';
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark(!dark) }}>{children}</ThemeContext.Provider>;
}

function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
}

function Card({ children, className = '' }) {
  return <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>;
}

function CardHeader({ title, subtitle, action }) {
  return <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"><div><h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>{subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}</div>{action}</div>;
}

function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><XMarkIcon className="w-6 h-6" /></button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return <div>{label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}<input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...props} /></div>;
}

function Select({ label, options, ...props }) {
  return <div>{label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}<select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" {...props}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}

function ProgressBar({ value, max = 100, color = 'blue' }) {
  const pct = Math.min(100, (value / max) * 100);
  const colors = { blue: 'bg-blue-500', green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' };
  return <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className={`${colors[color]} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div></div>;
}

function StatusDot({ status }) {
  const colors = { online: 'bg-green-500', running: 'bg-green-500', active: 'bg-green-500', offline: 'bg-red-500', stopped: 'bg-red-500', inactive: 'bg-gray-400', warning: 'bg-yellow-500' };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status] || 'bg-gray-400'}`}></span>;
}

const api = {
  get: async (url) => { const r = await fetch(`${API_BASE}${url}`); return r.json(); },
  post: async (url, data) => { const r = await fetch(`${API_BASE}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return r.json(); },
  put: async (url, data) => { const r = await fetch(`${API_BASE}${url}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return r.json(); },
  delete: async (url) => { const r = await fetch(`${API_BASE}${url}`, { method: 'DELETE' }); return r.json(); },
};

const caseStudies = {
  servers: { title: '🖥️ Caso: Alta Disponibilidade', content: 'Um hospital precisava garantir 99.99% de uptime para seus servidores de prontuário eletrônico. Implementou-se cluster de servidores com failover automático, resultando em zero downtime em 2 anos.' },
  network: { title: '🌐 Caso: Ataque DDoS', content: 'Uma empresa de e-commerce sofreu um ataque DDoS durante Black Friday. O firewall configurado bloqueou 95% do tráfego malicioso, mantendo o site operacional.' },
  virtualization: { title: '☁️ Caso: Migração para Cloud', content: 'Uma fintech migrou 50 VMs on-premises para AWS em 3 meses. A migração reduziu custos em 40% e melhorou a escalabilidade.' },
  monitoring: { title: '📊 Caso: Prevenção de Incidentes', content: 'Uma empresa de telecomunicações implementou monitoramento proativo. Detectou-se degradação de disco 72h antes de uma falha.' },
  backup: { title: '💾 Caso: Ransomware', content: 'Um escritório de advocacia foi vítima de ransomware. Graças aos backups Veeam com RPO de 1 hora, toda a base de dados foi restaurada em 4 horas.' },
  scripts: { title: '🤖 Caso: Automação', content: 'Uma empresa automatizou criação de usuários com PowerShell. Tempo de provisionamento reduzido de 2 horas para 5 minutos.' },
  tickets: { title: '🎫 Caso: Gestão ITIL', content: 'Um banco implementou gestão de incidentes ITIL. SLA de resolução reduzido de 48h para 4h.' },
  security: { title: '🔐 Caso: Zero Trust', content: 'Uma empresa implementou Zero Trust após vazamento. Microsegmentação e MFA reduziram ataques em 99%.' },
  orchestration: { title: '🔄 Caso: IaC com Terraform', content: 'Uma startup usou Terraform para gerenciar infraestrutura em 3 clouds. Deploy reduzido de semanas para minutos.' },
};

function Sidebar({ collapsed, setCollapsed }) {
  const navItems = [
    { id: 'servers', path: '/', icon: ServerIcon, label: 'Servidores' },
    { id: 'network', path: '/network', icon: GlobeAltIcon, label: 'Rede' },
    { id: 'virtualization', path: '/virtualization', icon: CloudIcon, label: 'Virtualização' },
    { id: 'monitoring', path: '/monitoring', icon: ChartBarIcon, label: 'Monitoramento' },
    { id: 'backup', path: '/backup', icon: CircleStackIcon, label: 'Backup' },
    { id: 'scripts', path: '/scripts', icon: CommandLineIcon, label: 'Scripts' },
    { id: 'tickets', path: '/tickets', icon: TicketIcon, label: 'Chamados' },
    { id: 'security', path: '/security', icon: ShieldCheckIcon, label: 'Segurança' },
    { id: 'orchestration', path: '/orchestration', icon: CogIcon, label: 'Orquestração' },
    { id: 'edge-security', path: '/edge-security', icon: ShieldCheckIcon, label: '🛡️ Edge Security' },
    { id: 'checkpoint', path: '/checkpoint', icon: ShieldCheckIcon, label: '🔒 Check Point' },
    { id: 'security-policies', path: '/security-policies', icon: ShieldCheckIcon, label: '📜 Políticas' },
  ];
  return (
    <aside id="sidebar" className={`fixed left-0 top-0 h-full bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && <h1 className="text-xl font-bold text-blue-400">🏗️ Infra Sim</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-800 transition-colors">{collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}</button>
      </div>
      <nav className="mt-4 px-2">
        {navItems.map(item => (
          <NavLink key={item.id} id={`nav-${item.id}`} to={item.path} end={item.path === '/'} className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <item.icon className="w-5 h-5 flex-shrink-0" />{!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function Header({ health, onTourStart }) {
  const { dark, toggle } = React.useContext(ThemeContext);
  const statusColor = health?.overallStatus === 'healthy' ? 'text-green-500' : health?.overallStatus === 'warning' ? 'text-yellow-500' : 'text-red-500';
  const statusText = health?.overallStatus === 'healthy' ? 'Saudável' : health?.overallStatus === 'warning' ? 'Atenção' : 'Crítico';
  return (
    <header id="header" className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center justify-between px-6 ml-16 md:ml-64 transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2"><SignalIcon className={`w-5 h-5 ${statusColor}`} /><span className={`text-sm font-semibold ${statusColor}`}>{statusText}</span></div>
        {health && <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400"><span>🖥️ {health.servers?.online}/{health.servers?.total} Servidores</span><span>☁️ {health.vms?.running}/{health.vms?.total} VMs</span></div>}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onTourStart} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Iniciar Tour"><QuestionMarkCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{dark ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5 text-gray-600" />}</button>
      </div>
    </header>
  );
}

function ServersModule() {
  const [servers, setServers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', os: 'Windows Server 2022', ip: '', role: '', location: 'Data Center A' });
  const load = useCallback(async () => { const r = await api.get('/servers'); if (r.success) setServers(r.data); }, []);
  useEffect(() => { load(); const i = setInterval(load, 5000); return () => clearInterval(i); }, [load]);
  const create = async () => { const r = await api.post('/servers', form); if (r.success) { toast.success(r.message); setShowModal(false); setForm({ name: '', os: 'Windows Server 2022', ip: '', role: '', location: 'Data Center A' }); load(); } };
  const togglePower = async (id) => { const r = await api.post(`/servers/${id}/power`); if (r.success) toast.success(r.message); };
  const remove = async (id) => { const r = await api.delete(`/servers/${id}`); if (r.success) { toast.success('Servidor removido'); load(); } };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🖥️ Servidores</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie servidores Windows e Linux</p></div><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Novo Servidor</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map(s => <Card key={s.id}><div className="p-5"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><StatusDot status={s.status} /><h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3></div><Badge variant={s.status === 'online' ? 'success' : 'danger'}>{s.status}</Badge></div><div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4"><p>💻 {s.os}</p><p>🌐 {s.ip}</p><p>📋 {s.role}</p></div>{s.status === 'online' && <div className="space-y-2 mb-4"><div><span className="text-xs text-gray-500">CPU: {Math.round(s.cpu)}%</span><ProgressBar value={s.cpu} color={s.cpu > 80 ? 'red' : 'blue'} /></div><div><span className="text-xs text-gray-500">RAM: {Math.round(s.ram)}%</span><ProgressBar value={s.ram} color={s.ram > 80 ? 'red' : 'green'} /></div></div>}<div className="flex gap-2"><Button size="sm" variant={s.status === 'online' ? 'danger' : 'success'} onClick={() => togglePower(s.id)}><PowerIcon className="w-3 h-3 mr-1" />{s.status === 'online' ? 'Desligar' : 'Ligar'}</Button><Button size="sm" variant="ghost" onClick={() => remove(s.id)}><TrashIcon className="w-3 h-3" /></Button></div></div></Card>)}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Servidor">
        <div className="space-y-4"><Input label="Nome do Servidor" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="SERVIDOR-01" /><Input label="Endereço IP" value={form.ip} onChange={e => setForm({ ...form, ip: e.target.value })} placeholder="192.168.1.100" /><Input label="Função" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Web Server" /><div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={create}>Criar Servidor</Button></div></div>
      </Modal>
    </div>
  );
}

function NetworkModule() {
  const [rules, setRules] = useState([]);
  const [tab, setTab] = useState('firewall');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', action: 'allow', protocol: 'TCP', port: '', source: 'any', destination: 'any' });
  const load = async () => { const r = await api.get('/network/firewall'); if (r.success) setRules(r.data); };
  useEffect(() => { load(); }, []);
  const createRule = async () => { const r = await api.post('/network/firewall', form); if (r.success) { toast.success('Regra criada'); setShowModal(false); setForm({ name: '', action: 'allow', protocol: 'TCP', port: '', source: 'any', destination: 'any' }); load(); } };
  const toggleRule = async (id) => { await api.put(`/network/firewall/${id}/toggle`); load(); };
  const deleteRule = async (id) => { await api.delete(`/network/firewall/${id}`); toast.success('Regra removida'); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🌐 Rede</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Firewall, VPN, Rotas e ARP</p></div><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Nova Regra</Button></div>
      <Card><CardHeader title="Regras de Firewall" /><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Nome</th><th className="px-4 py-3 text-left">Ação</th><th className="px-4 py-3 text-left">Protocolo</th><th className="px-4 py-3 text-left">Porta</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Ações</th></tr></thead><tbody>{rules.map(r => <tr key={r.id} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.name}</td><td className="px-4 py-3"><Badge variant={r.action === 'allow' ? 'success' : 'danger'}>{r.action}</Badge></td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.protocol}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.port}</td><td className="px-4 py-3"><Badge variant={r.enabled ? 'success' : 'default'}>{r.enabled ? 'Ativa' : 'Inativa'}</Badge></td><td className="px-4 py-3 flex gap-1"><Button size="sm" variant="ghost" onClick={() => toggleRule(r.id)}>{r.enabled ? 'Desativar' : 'Ativar'}</Button><Button size="sm" variant="ghost" onClick={() => deleteRule(r.id)}><TrashIcon className="w-3 h-3" /></Button></td></tr>)}</tbody></table></div></Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Regra de Firewall">
        <div className="space-y-4"><Input label="Nome da Regra" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Allow SSH" /><Select label="Ação" value={form.action} onChange={e => setForm({ ...form, action: e.target.value })} options={[{ value: 'allow', label: 'Permitir' }, { value: 'deny', label: 'Bloquear' }]} /><Input label="Porta" type="number" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} placeholder="22" /><div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={createRule}>Criar Regra</Button></div></div>
      </Modal>
    </div>
  );
}

function VirtualizationModule() {
  const [vms, setVms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', host: 'HOST-ESXI-01', vcpus: 2, ram: 4, disk: 50, os: 'Ubuntu Server 22.04' });
  const load = async () => { const r = await api.get('/virtualization/vms'); if (r.success) setVms(r.data); };
  useEffect(() => { load(); }, []);
  const create = async () => { const r = await api.post('/virtualization/vms', form); if (r.success) { toast.success(r.message); setShowModal(false); load(); } };
  const remove = async (id) => { await api.delete(`/virtualization/vms/${id}`); toast.success('VM removida'); load(); };
  const togglePower = async (id) => { const r = await api.post(`/virtualization/vms/${id}/power`); if (r.success) toast.success(r.message); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">☁️ Virtualização</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie VMs e pool de recursos</p></div><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Nova VM</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vms.map(v => <Card key={v.id}><div className="p-5"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><StatusDot status={v.status} /><h3 className="font-semibold text-gray-900 dark:text-white">{v.name}</h3></div><Badge variant={v.status === 'running' ? 'success' : 'default'}>{v.status}</Badge></div><div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4"><p>🖥️ {v.os}</p><p>🏠 Host: {v.host}</p><p>⚡ {v.vcpus} vCPUs | 💾 {v.ram} GB RAM</p></div><div className="flex gap-2 flex-wrap"><Button size="sm" variant={v.status === 'running' ? 'danger' : 'success'} onClick={() => togglePower(v.id)}>{v.status === 'running' ? 'Parar' : 'Iniciar'}</Button><Button size="sm" variant="ghost" onClick={() => remove(v.id)}><TrashIcon className="w-3 h-3" /></Button></div></div></Card>)}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Máquina Virtual">
        <div className="space-y-4"><Input label="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VM-NOVA-01" /><div className="grid grid-cols-3 gap-4"><Input label="vCPUs" type="number" value={form.vcpus} onChange={e => setForm({ ...form, vcpus: parseInt(e.target.value) })} /><Input label="RAM (GB)" type="number" value={form.ram} onChange={e => setForm({ ...form, ram: parseInt(e.target.value) })} /><Input label="Disco (GB)" type="number" value={form.disk} onChange={e => setForm({ ...form, disk: parseInt(e.target.value) })} /></div><div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={create}>Criar VM</Button></div></div>
      </Modal>
    </div>
  );
}

function MonitoringModule() {
  const [metrics, setMetrics] = useState(null);
  const [alertsList, setAlerts] = useState([]);
  const load = async () => { const [m, a] = await Promise.all([api.get('/monitoring/metrics'), api.get('/monitoring/alerts')]); if (m.success) setMetrics(m.data); if (a.success) setAlerts(a.data); };
  useEffect(() => { load(); const i = setInterval(load, 5000); return () => clearInterval(i); }, []);
  const resolveAlert = async (id) => { await api.post(`/monitoring/alerts/${id}/resolve`); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Monitoramento</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Métricas em tempo real e alertas</p></div></div>
      {metrics && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card><CardHeader title="CPU (%)" /><div className="p-4"><ResponsiveContainer width="100%" height={200}><AreaChart data={metrics.cpu}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" hide /><YAxis domain={[0, 100]} /><Tooltip /><Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} /></AreaChart></ResponsiveContainer></div></Card>
        <Card><CardHeader title="Memória (%)" /><div className="p-4"><ResponsiveContainer width="100%" height={200}><AreaChart data={metrics.memory}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" hide /><YAxis domain={[0, 100]} /><Tooltip /><Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} /></AreaChart></ResponsiveContainer></div></Card>
      </div>}
      <Card><CardHeader title="Alertas" /><div className="divide-y divide-gray-200 dark:divide-gray-700">
        {alertsList.map(a => <div key={a.id} className="px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-3">{a.severity === 'critical' ? <ExclamationTriangleIcon className="w-5 h-5 text-red-500" /> : <InformationCircleIcon className="w-5 h-5 text-blue-500" />}<div><p className="text-sm font-medium text-gray-900 dark:text-white">{a.message}</p></div></div><Button size="sm" variant="secondary" onClick={() => resolveAlert(a.id)}>Resolver</Button></div>)}
      </div></Card>
    </div>
  );
}

function BackupModule() {
  const [backups, setBackups] = useState([]);
  const load = async () => { const r = await api.get('/backup'); if (r.success) setBackups(r.data); };
  useEffect(() => { load(); }, []);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">💾 Backup</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie backups e restaurações</p></div></div>
      <Card><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Nome</th><th className="px-4 py-3 text-left">Tipo</th><th className="px-4 py-3 text-left">Status</th></tr></thead><tbody>{backups.map(b => <tr key={b.id} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{b.name}</td><td className="px-4 py-3"><Badge variant="info">{b.type}</Badge></td><td className="px-4 py-3"><Badge variant={b.status === 'completed' ? 'success' : 'warning'}>{b.status}</Badge></td></tr>)}</tbody></table></div></Card>
    </div>
  );
}

function ScriptsModule() {
  const [scripts, setScripts] = useState([]);
  const [output, setOutput] = useState([]);
  const load = async () => { const r = await api.get('/scripts'); if (r.success) setScripts(r.data); };
  useEffect(() => { load(); }, []);
  const execute = async (lang, code) => { const r = await api.post('/scripts/execute', { language: lang, code }); if (r.success) setOutput(r.data.output); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🤖 Scripts</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Automação com PowerShell, Bash e Python</p></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div><h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scripts Salvos</h3><div className="space-y-3">{scripts.map(s => <Card key={s.id}><div className="p-4"><div className="flex items-center justify-between mb-2"><h4 className="font-medium text-gray-900 dark:text-white">{s.name}</h4><Badge variant="info">{s.language}</Badge></div><pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-xs font-mono overflow-x-auto mb-3 text-gray-800 dark:text-gray-200">{s.code}</pre><Button size="sm" onClick={() => execute(s.language, s.code)}><PlayIcon className="w-3 h-3 mr-1" />Executar</Button></div></Card>)}</div></div>
        <div><h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🖥️ Terminal</h3><Card><div className="p-4 bg-gray-900 rounded-lg font-mono text-sm text-green-400 min-h-[300px] overflow-y-auto">{output.length === 0 ? <p className="text-gray-500">$ Execute um script...</p> : output.map((line, i) => <div key={i}>{line}</div>)}</div></Card></div>
      </div>
    </div>
  );
}

function TicketsModule() {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const load = async () => { const r = await api.get('/tickets'); if (r.success) setTickets(r.data); };
  useEffect(() => { load(); }, []);
  const create = async () => { const r = await api.post('/tickets', form); if (r.success) { toast.success('Chamado criado'); setShowModal(false); load(); } };
  const updateStatus = async (id, status) => { await api.put(`/tickets/${id}`, { status }); toast.success('Status atualizado'); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🎫 Chamados</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Sistema de gestão de incidentes</p></div><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Novo Chamado</Button></div>
      <div className="space-y-3">{tickets.map(t => <Card key={t.id}><div className="p-5"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-gray-900 dark:text-white">{t.title}</h3><Badge variant={t.status === 'open' ? 'info' : t.status === 'resolved' ? 'success' : 'warning'}>{t.status}</Badge></div><p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t.description}</p>{t.status === 'open' && <Button size="sm" variant="secondary" onClick={() => updateStatus(t.id, 'in_progress')}>Iniciar</Button>}{t.status === 'in_progress' && <Button size="sm" variant="success" onClick={() => updateStatus(t.id, 'resolved')}>Resolver</Button>}</div></Card>)}</div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Chamado">
        <div className="space-y-4"><Input label="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Descreva o problema" /><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label><textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div><div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={create}>Criar Chamado</Button></div></div>
      </Modal>
    </div>
  );
}

function SecurityModule() {
  const [users, setUsers] = useState([]);
  const [gpos, setGpos] = useState([]);
  const [tab, setTab] = useState('ad');
  const load = async () => { const [u, g] = await Promise.all([api.get('/security/ad-users'), api.get('/security/gpos')]); if (u.success) setUsers(u.data); if (g.success) setGpos(g.data); };
  useEffect(() => { load(); }, []);
  const toggleUser = async (id) => { await api.post(`/security/ad-users/${id}/toggle`); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔐 Segurança</h2><p className="text-gray-500 dark:text-gray-400 mt-1">AD, GPOs e Zero Trust</p></div><div className="flex gap-2"><Button variant={tab === 'ad' ? 'primary' : 'secondary'} onClick={() => setTab('ad')}>👥 AD</Button><Button variant={tab === 'gpo' ? 'primary' : 'secondary'} onClick={() => setTab('gpo')}>📜 GPOs</Button></div></div>
      {tab === 'ad' && <Card><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Usuário</th><th className="px-4 py-3 text-left">Nome</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Ações</th></tr></thead><tbody>{users.map(u => <tr key={u.id} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{u.username}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.fullName}</td><td className="px-4 py-3"><Badge variant={u.enabled ? 'success' : 'danger'}>{u.enabled ? 'Ativo' : 'Desativado'}</Badge></td><td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => toggleUser(u.id)}>{u.enabled ? 'Desativar' : 'Ativar'}</Button></td></tr>)}</tbody></table></div></Card>}
      {tab === 'gpo' && <div className="space-y-3">{gpos.map(g => <Card key={g.id}><div className="p-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-900 dark:text-white">{g.name}</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{g.description}</p></div><Badge variant={g.enabled ? 'success' : 'default'}>{g.enabled ? 'Ativa' : 'Inativa'}</Badge></div></div></Card>)}</div>}
    </div>
  );
}

function OrchestrationModule() {
  const [tfOutput, setTfOutput] = useState([]);
  const [tab, setTab] = useState('terraform');
  const tfPlan = async () => { const r = await api.post('/orchestration/terraform/plan'); if (r.success) setTfOutput(r.data.output); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔄 Orquestração</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Terraform e Ansible simulados</p></div><div className="flex gap-2"><Button variant={tab === 'terraform' ? 'primary' : 'secondary'} onClick={() => setTab('terraform')}>🏗️ Terraform</Button><Button variant={tab === 'ansible' ? 'primary' : 'secondary'} onClick={() => setTab('ansible')}>📋 Ansible</Button></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader title="Saída" /><div className="p-4 bg-gray-900 rounded-b-xl font-mono text-sm text-green-400 min-h-[300px] overflow-y-auto">{tfOutput.length === 0 ? <p className="text-gray-500">$ Execute terraform plan...</p> : tfOutput.map((line, i) => <div key={i}>{line}</div>)}</div></Card>
        <div><Button onClick={tfPlan}>📋 Plan</Button></div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [health, setHealth] = useState(null);
  const [servers, setServers] = useState([]);
  useEffect(() => {
    const load = async () => { const [h, s] = await Promise.all([api.get('/monitoring/health'), api.get('/servers')]); if (h.success) setHealth(h.data); if (s.success) setServers(s.data); };
    load(); const i = setInterval(load, 5000); return () => clearInterval(i);
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🏠 Dashboard</h2>
      {health && <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-green-500">{health.servers?.online}</p><p className="text-sm text-gray-500 dark:text-gray-400">Servidores Online</p></div></Card>
        <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-blue-500">{health.vms?.running}</p><p className="text-sm text-gray-500 dark:text-gray-400">VMs Rodando</p></div></Card>
        <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-yellow-500">{health.alerts?.warning || 0}</p><p className="text-sm text-gray-500 dark:text-gray-400">Alertas Warning</p></div></Card>
        <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-red-500">{health.alerts?.critical || 0}</p><p className="text-sm text-gray-500 dark:text-gray-400">Alertas Críticos</p></div></Card>
      </div>}
    </div>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [health, setHealth] = useState(null);
  useEffect(() => {
    const loadHealth = async () => { const r = await api.get('/monitoring/health'); if (r.success) setHealth(r.data); };
    loadHealth(); const i = setInterval(loadHealth, 5000); return () => clearInterval(i);
  }, []);
  return (
    <ThemeProvider><Router><div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Header health={health} />
      <main className={`pt-16 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-16 md:ml-64'}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/servers" element={<ServersModule />} />
          <Route path="/network" element={<NetworkModule />} />
          <Route path="/virtualization" element={<VirtualizationModule />} />
          <Route path="/monitoring" element={<MonitoringModule />} />
          <Route path="/backup" element={<BackupModule />} />
          <Route path="/scripts" element={<ScriptsModule />} />
          <Route path="/tickets" element={<TicketsModule />} />
          <Route path="/security" element={<SecurityModule />} />
          <Route path="/orchestration" element={<OrchestrationModule />} />
          <Route path="/edge-security" element={<EdgeSecurityModule />} />
          <Route path="/checkpoint" element={<CheckpointModule />} />
          <Route path="/security-policies" element={<SecurityPoliciesModule />} />
        </Routes>
      </main>
    </div></Router></ThemeProvider>
  );
}

export default App;
