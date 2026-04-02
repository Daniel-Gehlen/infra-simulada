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
import { SecurityPoliciesModule } from './modules/securityPolicies';
>>>>>>> feature/politicas-seguranca
import { EdgeSecurityModule } from './modules/edgeSecurity';
import { CheckpointModule } from './modules/checkpoint';
import { SecurityPoliciesModule } from './modules/securityPolicies';
=======
import { SecurityPoliciesModule } from './modules/securityPolicies';
>>>>>>> feature/politicas-seguranca

const API_BASE = '/api';

// ============================================
// CONTEXTO DE TEMA
// ============================================
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(!dark) }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================
// COMPONENTES UI
// ============================================
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
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

function Card({ children, className = '' }) {
  return <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>;
}

function CardHeader({ title, subtitle, action }) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...props} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = 'blue' }) {
  const pct = Math.min(100, (value / max) * 100);
  const colors = { blue: 'bg-blue-500', green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' };
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div className={`${colors[color]} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
    </div>
  );
}

function StatusDot({ status }) {
  const colors = { online: 'bg-green-500', running: 'bg-green-500', active: 'bg-green-500', offline: 'bg-red-500', stopped: 'bg-red-500', inactive: 'bg-gray-400', warning: 'bg-yellow-500' };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status] || 'bg-gray-400'}`}></span>;
}

// ============================================
// SERVIÇOS API
// ============================================
const api = {
  get: async (url) => { const r = await fetch(`${API_BASE}${url}`); return r.json(); },
  post: async (url, data) => { const r = await fetch(`${API_BASE}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return r.json(); },
  put: async (url, data) => { const r = await fetch(`${API_BASE}${url}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return r.json(); },
  delete: async (url) => { const r = await fetch(`${API_BASE}${url}`, { method: 'DELETE' }); return r.json(); },
};

// ============================================
// TOUR STEPS
// ============================================
const tourSteps = [
  { target: '#sidebar', title: '🖥️ Barra Lateral de Navegação', content: 'Aqui você acessa todos os 9 módulos de infraestrutura. No mundo real, um analista de infraestrutura trabalha diariamente com esses componentes.', placement: 'right' },
  { target: '#header', title: '📊 Header com Status da Infraestrutura', content: 'Este painel mostra o status geral da infraestrutura em tempo real, similar ao que você veria em um dashboard Zabbix ou Grafana.', placement: 'bottom' },
  { target: '#nav-servers', title: '🖥️ Módulo de Servidores', content: 'Gerencie servidores Windows e Linux. Um analista de infraestrutura usa isso para monitorar disponibilidade, CPU e RAM dos servidores da empresa.', placement: 'right' },
  { target: '#nav-network', title: '🌐 Módulo de Rede', content: 'Configure firewalls, VPNs e visualize rotas. Essencial para administrar a conectividade e segurança da rede corporativa.', placement: 'right' },
  { target: '#nav-virtualization', title: '☁️ Módulo de Virtualização', content: 'Crie e gerencie VMs com pool de recursos limitado. Simula VMware/Hyper-V e migração para AWS/Azure/GCP.', placement: 'right' },
  { target: '#nav-monitoring', title: '📈 Módulo de Monitoramento', content: 'Dashboard com métricas em tempo real e alertas. Representa ferramentas como Zabbix, Nagios e Grafana.', placement: 'right' },
  { target: '#nav-backup', title: '💾 Módulo de Backup', content: 'Agende e gerencie backups. Simula ferramentas como Veeam para recuperação de desastres.', placement: 'right' },
  { target: '#nav-scripts', title: '🤖 Módulo de Scripts', content: 'Editor de automação com PowerShell, Bash e Python. Um analista usa scripts para automatizar tarefas repetitivas.', placement: 'right' },
  { target: '#nav-tickets', title: '🎫 Módulo de Chamados', content: 'Sistema de tickets estilo GLPI para gestão de incidentes e solicitações.', placement: 'right' },
  { target: '#nav-security', title: '🔐 Módulo de Segurança', content: 'Active Directory, GPOs e Zero Trust. Fundamental para controle de acesso e compliance.', placement: 'right' },
  { target: '#nav-orchestration', title: '🔄 Módulo de Orquestração', content: 'Terraform e Ansible simulados. IaC é o futuro da infraestrutura moderna.', placement: 'right' },
];

// ============================================
// ESTUDOS DE CASO
// ============================================
const caseStudies = {
  servers: { title: '🖥️ Caso: Alta Disponibilidade', content: 'Um hospital precisava garantir 99.99% de uptime para seus servidores de prontuário eletrônico. Implementou-se cluster de servidores com failover automático, resultando em zero downtime em 2 anos. O analista de infraestrutura configurou load balancing e monitoramento 24/7.' },
  network: { title: '🌐 Caso: Ataque DDoS', content: 'Uma empresa de e-commerce sofreu um ataque DDoS durante Black Friday. O firewall configurado bloqueou 95% do tráfego malicioso, mantendo o site operacional. O analista reconfigurou as regras de firewall em tempo real usando IPS/IDS.' },
  virtualization: { title: '☁️ Caso: Migração para Cloud', content: 'Uma fintech migrou 50 VMs on-premises para AWS em 3 meses. A migração reduziu custos em 40% e melhorou a escalabilidade. O analista usou Terraform para infraestrutura como código e Ansible para configuração.' },
  monitoring: { title: '📊 Caso: Prevenção de Incidentes', content: 'Uma empresa de telecomunicações implementou monitoramento proativo com Zabbix e Grafana. Detectou-se degradação de disco 72h antes de uma falha, permitindo substituição sem downtime. Economia estimada: R$ 500.000.' },
  backup: { title: '💾 Caso: Ransomware', content: 'Um escritório de advocacia foi vítima de ransomware. Graças aos backups Veeam com RPO de 1 hora, toda a base de dados foi restaurada em 4 horas. O analista de infraestrutura executou o plano de recuperação de desastres com sucesso.' },
  scripts: { title: '🤖 Caso: Automação de Provisionamento', content: 'Uma empresa de TI automatizou a criação de usuários e configuração de estações com PowerShell e Bash. Tempo de provisionamento reduzido de 2 horas para 5 minutos por usuário. Produtividade da equipe de TI aumentou em 300%.' },
  tickets: { title: '🎫 Caso: Gestão de Incidentes ITIL', content: 'Um banco implementou gestão de incidentes seguindo ITIL. SLA de resolução reduzido de 48h para 4h. Satisfação dos usuários internos aumentou de 65% para 92%. O analista usou GLPI para rastrear todos os chamados.' },
  security: { title: '🔐 Caso: Implementação Zero Trust', content: 'Uma empresa de seguros implementou Zero Trust após um vazamento de dados. Microsegmentação e autenticação MFA reduziram ataques em 99%. O analista configurou GPOs para reforçar políticas de segurança em toda a rede.' },
  orchestration: { title: '🔄 Caso: IaC com Terraform', content: 'Uma startup de SaaS usou Terraform para gerenciar infraestrutura em 3 clouds (AWS, Azure, GCP). Deploy de ambientes reduzido de semanas para minutos. O analista versionava toda a infraestrutura no Git.' },
};

// ============================================
// COMPONENTE: TOUR
// ============================================
function TourGuide({ runTour, setRunTour }) {
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.setItem('tourCompleted', 'true');
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={runTour}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{ options: { primaryColor: '#2563eb', zIndex: 10000 } }}
      locale={{ back: 'Voltar', close: 'Fechar', last: 'Finalizar', next: 'Próximo', skip: 'Pular' }}
    />
  );
}

// ============================================
// COMPONENTE: SIDEBAR
// ============================================
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
  ];

  return (
    <aside id="sidebar" className={`fixed left-0 top-0 h-full bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && <h1 className="text-xl font-bold text-blue-400">🏗️ Infra Sim</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
          {collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </div>
      <nav className="mt-4 px-2">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            id={`nav-${item.id}`}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

// ============================================
// COMPONENTE: HEADER
// ============================================
function Header({ health, onTourStart }) {
  const { dark, toggle } = React.useContext(ThemeContext);
  const statusColor = health?.overallStatus === 'healthy' ? 'text-green-500' : health?.overallStatus === 'warning' ? 'text-yellow-500' : 'text-red-500';
  const statusText = health?.overallStatus === 'healthy' ? 'Saudável' : health?.overallStatus === 'warning' ? 'Atenção' : 'Crítico';

  return (
    <header id="header" className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center justify-between px-6 ml-16 md:ml-64 transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <SignalIcon className={`w-5 h-5 ${statusColor}`} />
          <span className={`text-sm font-semibold ${statusColor}`}>{statusText}</span>
        </div>
        {health && (
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>🖥️ {health.servers?.online}/{health.servers?.total} Servidores</span>
            <span>☁️ {health.vms?.running}/{health.vms?.total} VMs</span>
            {health.alerts?.critical > 0 && <Badge variant="danger">🔴 {health.alerts.critical} Críticos</Badge>}
            {health.alerts?.warning > 0 && <Badge variant="warning">🟡 {health.alerts.warning} Avisos</Badge>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onTourStart} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Iniciar Tour">
          <QuestionMarkCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {dark ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5 text-gray-600" />}
        </button>
      </div>
    </header>
  );
}

// ============================================
// MÓDULO: SERVIDORES
// ============================================
function ServersModule() {
  const [servers, setServers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCase, setShowCase] = useState(false);
  const [form, setForm] = useState({ name: '', os: 'Windows Server 2022', ip: '', role: '', location: 'Data Center A' });

  const load = useCallback(async () => {
    const r = await api.get('/servers');
    if (r.success) setServers(r.data);
  }, []);

  useEffect(() => { load(); const i = setInterval(load, 5000); return () => clearInterval(i); }, [load]);

  const create = async () => {
    const r = await api.post('/servers', form);
    if (r.success) { toast.success(r.message); setShowModal(false); setForm({ name: '', os: 'Windows Server 2022', ip: '', role: '', location: 'Data Center A' }); load(); }
  };

  const togglePower = async (id) => {
    const r = await api.post(`/servers/${id}/power`);
    if (r.success) toast.success(r.message);
  };

  const ping = async (id) => {
    const r = await api.post(`/servers/${id}/ping`);
    if (r.success) toast(`${r.data.reachable ? '✅' : '❌'} Ping ${r.data.host}: ${r.data.latency}`, { icon: r.data.reachable ? '🟢' : '🔴' });
  };

  const remove = async (id) => {
    const r = await api.delete(`/servers/${id}`);
    if (r.success) { toast.success('Servidor removido'); load(); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🖥️ Servidores</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie servidores Windows e Linux</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button>
          <Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Novo Servidor</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map(s => (
          <Card key={s.id}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusDot status={s.status} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                </div>
                <Badge variant={s.status === 'online' ? 'success' : 'danger'}>{s.status}</Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>💻 {s.os}</p>
                <p>🌐 {s.ip}</p>
                <p>📋 {s.role}</p>
                <p>📍 {s.location}</p>
              </div>
              {s.status === 'online' && (
                <div className="space-y-2 mb-4">
                  <div><span className="text-xs text-gray-500">CPU: {Math.round(s.cpu)}%</span><ProgressBar value={s.cpu} color={s.cpu > 80 ? 'red' : s.cpu > 60 ? 'yellow' : 'blue'} /></div>
                  <div><span className="text-xs text-gray-500">RAM: {Math.round(s.ram)}%</span><ProgressBar value={s.ram} color={s.ram > 80 ? 'red' : s.ram > 60 ? 'yellow' : 'green'} /></div>
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant={s.status === 'online' ? 'danger' : 'success'} onClick={() => togglePower(s.id)}>
                  <PowerIcon className="w-3 h-3 mr-1" />{s.status === 'online' ? 'Desligar' : 'Ligar'}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => ping(s.id)}>Ping</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><TrashIcon className="w-3 h-3" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Servidor">
        <div className="space-y-4">
          <Input label="Nome do Servidor" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="SERVIDOR-01" />
          <Select label="Sistema Operacional" value={form.os} onChange={e => setForm({ ...form, os: e.target.value })} options={[{ value: 'Windows Server 2022', label: 'Windows Server 2022' }, { value: 'Windows Server 2019', label: 'Windows Server 2019' }, { value: 'Ubuntu 22.04 LTS', label: 'Ubuntu 22.04 LTS' }, { value: 'CentOS 8', label: 'CentOS 8' }]} />
          <Input label="Endereço IP" value={form.ip} onChange={e => setForm({ ...form, ip: e.target.value })} placeholder="192.168.1.100" />
          <Input label="Função" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Web Server" />
          <Select label="Localização" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} options={[{ value: 'Data Center A', label: 'Data Center A' }, { value: 'Data Center B', label: 'Data Center B' }]} />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={create}>Criar Servidor</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.servers.title}>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.servers.content}</p>
      </Modal>
    </div>
  );
}

// ============================================
// MÓDULO: REDE
// ============================================
function NetworkModule() {
  const [rules, setRules] = useState([]);
  const [vpnList, setVpnList] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [arp, setArp] = useState([]);
  const [tab, setTab] = useState('firewall');
  const [showModal, setShowModal] = useState(false);
  const [showCase, setShowCase] = useState(false);
  const [form, setForm] = useState({ name: '', action: 'allow', protocol: 'TCP', port: '', source: 'any', destination: 'any' });

  const load = async () => {
    const [fw, vpn, rt, ar] = await Promise.all([api.get('/network/firewall'), api.get('/network/vpn'), api.get('/network/routes'), api.get('/network/arp')]);
    if (fw.success) setRules(fw.data);
    if (vpn.success) setVpnList(vpn.data);
    if (rt.success) setRoutes(rt.data);
    if (ar.success) setArp(ar.data);
  };

  useEffect(() => { load(); }, []);

  const createRule = async () => {
    const r = await api.post('/network/firewall', form);
    if (r.success) { toast.success('Regra criada'); setShowModal(false); setForm({ name: '', action: 'allow', protocol: 'TCP', port: '', source: 'any', destination: 'any' }); load(); }
  };

  const toggleRule = async (id) => { await api.put(`/network/firewall/${id}/toggle`); load(); };
  const deleteRule = async (id) => { await api.delete(`/network/firewall/${id}`); toast.success('Regra removida'); load(); };
  const toggleVpn = async (id) => { const r = await api.post(`/network/vpn/${id}/toggle`); if (r.success) toast.success(r.message); load(); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🌐 Rede</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Firewall, VPN, Rotas e ARP</p></div>
        <Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ id: 'firewall', label: '🔥 Firewall' }, { id: 'vpn', label: '🔒 VPN' }, { id: 'routes', label: '🗺️ Rotas' }, { id: 'arp', label: '📡 ARP' }].map(t => (
          <Button key={t.id} variant={tab === t.id ? 'primary' : 'secondary'} onClick={() => setTab(t.id)}>{t.label}</Button>
        ))}
      </div>

      {tab === 'firewall' && (
        <Card>
          <CardHeader title="Regras de Firewall" action={<Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Nova Regra</Button>} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Nome</th><th className="px-4 py-3 text-left">Ação</th><th className="px-4 py-3 text-left">Protocolo</th><th className="px-4 py-3 text-left">Porta</th><th className="px-4 py-3 text-left">Origem</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Ações</th></tr></thead>
              <tbody>
                {rules.map(r => (
                  <tr key={r.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.name}</td>
                    <td className="px-4 py-3"><Badge variant={r.action === 'allow' ? 'success' : 'danger'}>{r.action}</Badge></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.protocol}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.port}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.source}</td>
                    <td className="px-4 py-3"><Badge variant={r.enabled ? 'success' : 'default'}>{r.enabled ? 'Ativa' : 'Inativa'}</Badge></td>
                    <td className="px-4 py-3 flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleRule(r.id)}>{r.enabled ? 'Desativar' : 'Ativar'}</Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteRule(r.id)}><TrashIcon className="w-3 h-3" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'vpn' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vpnList.map(v => (
            <Card key={v.id}><div className="p-5">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><StatusDot status={v.status} /><h3 className="font-semibold text-gray-900 dark:text-white">{v.name}</h3></div><Badge variant={v.status === 'active' ? 'success' : 'default'}>{v.type}</Badge></div>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4"><p>🔗 Endpoint: {v.remoteEndpoint}</p><p>📍 Local: {v.localSubnet}</p><p>🎯 Remoto: {v.remoteSubnet}</p><p>👥 Usuários: {v.connectedUsers}</p></div>
              <Button size="sm" variant={v.status === 'active' ? 'danger' : 'success'} onClick={() => toggleVpn(v.id)}>{v.status === 'active' ? 'Desativar' : 'Ativar'}</Button>
            </div></Card>
          ))}
        </div>
      )}

      {tab === 'routes' && (
        <Card><CardHeader title="Tabela de Rotas" /><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Destino</th><th className="px-4 py-3 text-left">Gateway</th><th className="px-4 py-3 text-left">Interface</th><th className="px-4 py-3 text-left">Métrica</th></tr></thead><tbody>{routes.map(r => <tr key={r.id} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{r.destination}</td><td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{r.gateway}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.interface}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.metric}</td></tr>)}</tbody></table></div></Card>
      )}

      {tab === 'arp' && (
        <Card><CardHeader title="Tabela ARP" /><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">IP</th><th className="px-4 py-3 text-left">MAC</th><th className="px-4 py-3 text-left">Interface</th><th className="px-4 py-3 text-left">Tipo</th></tr></thead><tbody>{arp.map((a,i) => <tr key={i} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{a.ip}</td><td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{a.mac}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{a.interface}</td><td className="px-4 py-3"><Badge variant={a.type === 'static' ? 'info' : 'default'}>{a.type}</Badge></td></tr>)}</tbody></table></div></Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Regra de Firewall">
        <div className="space-y-4">
          <Input label="Nome da Regra" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Allow SSH" />
          <Select label="Ação" value={form.action} onChange={e => setForm({ ...form, action: e.target.value })} options={[{ value: 'allow', label: 'Permitir' }, { value: 'deny', label: 'Bloquear' }]} />
          <Select label="Protocolo" value={form.protocol} onChange={e => setForm({ ...form, protocol: e.target.value })} options={[{ value: 'TCP', label: 'TCP' }, { value: 'UDP', label: 'UDP' }, { value: 'ICMP', label: 'ICMP' }]} />
          <Input label="Porta" type="number" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} placeholder="22" />
          <Input label="Origem" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="192.168.1.0/24" />
          <div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={createRule}>Criar Regra</Button></div>
        </div>
      </Modal>
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.network.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.network.content}</p></Modal>
    </div>
  );
}

// ============================================
// MÓDULO: VIRTUALIZAÇÃO
// ============================================
function VirtualizationModule() {
  const [vms, setVms] = useState([]);
  const [pool, setPool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCase, setShowCase] = useState(false);
  const [form, setForm] = useState({ name: '', host: 'HOST-ESXI-01', vcpus: 2, ram: 4, disk: 50, os: 'Ubuntu Server 22.04' });

  const load = async () => {
    const [vm, p] = await Promise.all([api.get('/virtualization/vms'), api.get('/virtualization/pool')]);
    if (vm.success) setVms(vm.data);
    if (p.success) setPool(p.data);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    const r = await api.post('/virtualization/vms', form);
    if (r.success) { toast.success(r.message); setShowModal(false); setForm({ name: '', host: 'HOST-ESXI-01', vcpus: 2, ram: 4, disk: 50, os: 'Ubuntu Server 22.04' }); load(); }
    else toast.error(r.message);
  };

  const remove = async (id) => { await api.delete(`/virtualization/vms/${id}`); toast.success('VM removida'); load(); };
  const migrate = async (id) => { const r = await api.post(`/virtualization/vms/${id}/migrate`); if (r.success) toast.success(r.message); load(); };
  const toCloud = async (id) => { const r = await api.post(`/virtualization/vms/${id}/cloud`); if (r.success) toast.success(r.message); load(); };
  const togglePower = async (id) => { const r = await api.post(`/virtualization/vms/${id}/power`); if (r.success) toast.success(r.message); load(); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">☁️ Virtualização</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie VMs e pool de recursos</p></div>
        <div className="flex gap-2"><Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Nova VM</Button></div>
      </div>

      {pool && (
        <Card className="mb-6"><div className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📊 Pool de Recursos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><p className="text-sm text-gray-500 dark:text-gray-400">vCPUs</p><p className="text-lg font-bold text-gray-900 dark:text-white">{pool.usedVcpus} / {pool.totalVcpus}</p><ProgressBar value={pool.usedVcpus} max={pool.totalVcpus} color={pool.usedVcpus > pool.totalVcpus * 0.8 ? 'red' : 'blue'} /></div>
            <div><p className="text-sm text-gray-500 dark:text-gray-400">RAM (GB)</p><p className="text-lg font-bold text-gray-900 dark:text-white">{pool.usedRam} / {pool.totalRam}</p><ProgressBar value={pool.usedRam} max={pool.totalRam} color={pool.usedRam > pool.totalRam * 0.8 ? 'red' : 'green'} /></div>
            <div><p className="text-sm text-gray-500 dark:text-gray-400">Disco (GB)</p><p className="text-lg font-bold text-gray-900 dark:text-white">{pool.usedDisk} / {pool.totalDisk}</p><ProgressBar value={pool.usedDisk} max={pool.totalDisk} color="blue" /></div>
          </div>
        </div></Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vms.map(v => (
          <Card key={v.id}><div className="p-5">
            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><StatusDot status={v.status} /><h3 className="font-semibold text-gray-900 dark:text-white">{v.name}</h3></div><div className="flex gap-1"><Badge variant={v.status === 'running' ? 'success' : 'default'}>{v.status}</Badge>{v.cloudProvider && <Badge variant="info">{v.cloudProvider}</Badge>}</div></div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4"><p>🖥️ {v.os}</p><p>🏠 Host: {v.host}</p><p>⚡ {v.vcpus} vCPUs | 💾 {v.ram} GB RAM | 💿 {v.disk} GB</p></div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant={v.status === 'running' ? 'danger' : 'success'} onClick={() => togglePower(v.id)}>{v.status === 'running' ? 'Parar' : 'Iniciar'}</Button>
              <Button size="sm" variant="secondary" onClick={() => migrate(v.id)}>Migrar</Button>
              <Button size="sm" variant="secondary" onClick={() => toCloud(v.id)}>☁️ Cloud</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(v.id)}><TrashIcon className="w-3 h-3" /></Button>
            </div>
          </div></Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Máquina Virtual">
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VM-NOVA-01" />
          <Select label="Host" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} options={[{ value: 'HOST-ESXI-01', label: 'HOST-ESXI-01' }, { value: 'HOST-ESXI-02', label: 'HOST-ESXI-02' }, { value: 'HOST-ESXI-03', label: 'HOST-ESXI-03' }]} />
          <div className="grid grid-cols-3 gap-4"><Input label="vCPUs" type="number" value={form.vcpus} onChange={e => setForm({ ...form, vcpus: parseInt(e.target.value) })} /><Input label="RAM (GB)" type="number" value={form.ram} onChange={e => setForm({ ...form, ram: parseInt(e.target.value) })} /><Input label="Disco (GB)" type="number" value={form.disk} onChange={e => setForm({ ...form, disk: parseInt(e.target.value) })} /></div>
          <Select label="SO" value={form.os} onChange={e => setForm({ ...form, os: e.target.value })} options={[{ value: 'Ubuntu Server 22.04', label: 'Ubuntu Server 22.04' }, { value: 'CentOS 8', label: 'CentOS 8' }, { value: 'Windows Server 2022', label: 'Windows Server 2022' }]} />
          <div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={create}>Criar VM</Button></div>
        </div>
      </Modal>
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.virtualization.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.virtualization.content}</p></Modal>
    </div>
  );
}

// ============================================
// MÓDULO: MONITORAMENTO
// ============================================
function MonitoringModule() {
  const [metrics, setMetrics] = useState(null);
  const [alertsList, setAlerts] = useState([]);
  const [health, setHealth] = useState(null);
  const [showCase, setShowCase] = useState(false);

  const load = async () => {
    const [m, a, h] = await Promise.all([api.get('/monitoring/metrics'), api.get('/monitoring/alerts'), api.get('/monitoring/health')]);
    if (m.success) setMetrics(m.data);
    if (a.success) setAlerts(a.data);
    if (h.success) setHealth(h.data);
  };

  useEffect(() => { load(); const i = setInterval(load, 5000); return () => clearInterval(i); }, []);

  const resolveAlert = async (id) => { await api.post(`/monitoring/alerts/${id}/resolve`); load(); };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Monitoramento</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Métricas em tempo real e alertas</p></div>
        <Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button>
      </div>

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card><div className="p-4 text-center"><p className="text-3xl font-bold text-green-500">{health.servers?.online}/{health.servers?.total}</p><p className="text-sm text-gray-500 dark:text-gray-400">Servidores Online</p></div></Card>
          <Card><div className="p-4 text-center"><p className="text-3xl font-bold text-blue-500">{health.vms?.running}/{health.vms?.total}</p><p className="text-sm text-gray-500 dark:text-gray-400">VMs Rodando</p></div></Card>
          <Card><div className="p-4 text-center"><p className="text-3xl font-bold text-yellow-500">{health.alerts?.warning || 0}</p><p className="text-sm text-gray-500 dark:text-gray-400">Alertas Warning</p></div></Card>
          <Card><div className="p-4 text-center"><p className="text-3xl font-bold text-red-500">{health.alerts?.critical || 0}</p><p className="text-sm text-gray-500 dark:text-gray-400">Alertas Críticos</p></div></Card>
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card><CardHeader title="CPU (%)" /><div className="p-4"><ResponsiveContainer width="100%" height={200}><AreaChart data={metrics.cpu}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" hide /><YAxis domain={[0, 100]} /><Tooltip /><Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} /></AreaChart></ResponsiveContainer></div></Card>
          <Card><CardHeader title="Memória (%)" /><div className="p-4"><ResponsiveContainer width="100%" height={200}><AreaChart data={metrics.memory}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" hide /><YAxis domain={[0, 100]} /><Tooltip /><Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} /></AreaChart></ResponsiveContainer></div></Card>
          <Card><CardHeader title="Rede (Mbps)" /><div className="p-4"><ResponsiveContainer width="100%" height={200}><LineChart data={metrics.network}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" hide /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card>
          <Card><CardHeader title="Disco (%)" /><div className="p-4"><ResponsiveContainer width="100%" height={200}><BarChart data={metrics.disk}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" hide /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" /></BarChart></ResponsiveContainer></div></Card>
        </div>
      )}

      <Card>
        <CardHeader title="Alertas" />
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {alertsList.map(a => (
            <div key={a.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {a.severity === 'critical' ? <ExclamationTriangleIcon className="w-5 h-5 text-red-500" /> : a.severity === 'warning' ? <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" /> : <InformationCircleIcon className="w-5 h-5 text-blue-500" />}
                <div><p className="text-sm font-medium text-gray-900 dark:text-white">{a.message}</p><p className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</p></div>
              </div>
              <div className="flex items-center gap-2">
                {a.resolved ? <Badge variant="success">Resolvido</Badge> : <Button size="sm" variant="secondary" onClick={() => resolveAlert(a.id)}>Resolver</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.monitoring.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.monitoring.content}</p></Modal>
    </div>
  );
}

// ============================================
// MÓDULO: BACKUP
// ============================================
function BackupModule() {
  const [backups, setBackups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCase, setShowCase] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'full', source: 'DC-PRINCIPAL' });

  const load = async () => { const r = await api.get('/backup'); if (r.success) setBackups(r.data); };
  useEffect(() => { load(); const i = setInterval(load, 3000); return () => clearInterval(i); }, []);

  const create = async () => { const r = await api.post('/backup', form); if (r.success) { toast.success('Backup iniciado'); setShowModal(false); setForm({ name: '', type: 'full', source: 'DC-PRINCIPAL' }); load(); } };
  const restore = async (id) => { const r = await api.post(`/backup/${id}/restore`); if (r.success) toast.success(r.message); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">💾 Backup</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie backups e restaurações</p></div>
        <div className="flex gap-2"><Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Novo Backup</Button></div>
      </div>

      <Card>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Nome</th><th className="px-4 py-3 text-left">Tipo</th><th className="px-4 py-3 text-left">Origem</th><th className="px-4 py-3 text-left">Tamanho</th><th className="px-4 py-3 text-left">Duração</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Ações</th></tr></thead><tbody>{backups.map(b => (<tr key={b.id} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{b.name}</td><td className="px-4 py-3"><Badge variant={b.type === 'full' ? 'info' : 'default'}>{b.type}</Badge></td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{b.source}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{b.size}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{b.duration}</td><td className="px-4 py-3"><Badge variant={b.status === 'completed' ? 'success' : 'warning'}>{b.status}</Badge></td><td className="px-4 py-3">{b.status === 'completed' && <Button size="sm" variant="secondary" onClick={() => restore(b.id)}>Restaurar</Button>}</td></tr>))}</tbody></table></div>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Backup">
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Backup Full - Servidor" />
          <Select label="Tipo" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={[{ value: 'full', label: 'Full' }, { value: 'incremental', label: 'Incremental' }, { value: 'differential', label: 'Diferencial' }]} />
          <Input label="Origem" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="DC-PRINCIPAL" />
          <div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={create}>Iniciar Backup</Button></div>
        </div>
      </Modal>
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.backup.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.backup.content}</p></Modal>
    </div>
  );
}

// ============================================
// MÓDULO: SCRIPTS
// ============================================
function ScriptsModule() {
  const [scripts, setScripts] = useState([]);
  const [output, setOutput] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCase, setShowCase] = useState(false);
  const [form, setForm] = useState({ name: '', language: 'powershell', code: '', description: '' });

  const load = async () => { const r = await api.get('/scripts'); if (r.success) setScripts(r.data); };
  useEffect(() => { load(); }, []);

  const save = async () => { const r = await api.post('/scripts', form); if (r.success) { toast.success('Script salvo'); setShowModal(false); setForm({ name: '', language: 'powershell', code: '', description: '' }); load(); } };
  const execute = async (lang, code) => { const r = await api.post('/scripts/execute', { language: lang, code }); if (r.success) setOutput(r.data.output); };
  const remove = async (id) => { await api.delete(`/scripts/${id}`); toast.success('Script removido'); load(); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🤖 Scripts</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Automação com PowerShell, Bash e Python</p></div>
        <div className="flex gap-2"><Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Novo Script</Button></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scripts Salvos</h3>
          <div className="space-y-3">
            {scripts.map(s => (
              <Card key={s.id}><div className="p-4">
                <div className="flex items-center justify-between mb-2"><h4 className="font-medium text-gray-900 dark:text-white">{s.name}</h4><Badge variant="info">{s.language}</Badge></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{s.description}</p>
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-xs font-mono overflow-x-auto mb-3 text-gray-800 dark:text-gray-200">{s.code}</pre>
                <div className="flex gap-2"><Button size="sm" onClick={() => execute(s.language, s.code)}><PlayIcon className="w-3 h-3 mr-1" />Executar</Button><Button size="sm" variant="ghost" onClick={() => remove(s.id)}><TrashIcon className="w-3 h-3" /></Button></div>
              </div></Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🖥️ Terminal</h3>
          <Card><div className="p-4 bg-gray-900 rounded-lg font-mono text-sm text-green-400 min-h-[300px] overflow-y-auto">
            {output.length === 0 ? <p className="text-gray-500">$ Execute um script para ver a saída...</p> : output.map((line, i) => <div key={i}>{line}</div>)}
          </div></Card>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Script">
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Meu Script" />
          <Select label="Linguagem" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} options={[{ value: 'powershell', label: 'PowerShell' }, { value: 'bash', label: 'Bash' }, { value: 'python', label: 'Python' }]} />
          <Input label="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="O que este script faz?" />
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label><textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm" rows={6} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Escreva seu código aqui..." /></div>
          <div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={save}>Salvar Script</Button></div>
        </div>
      </Modal>
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.scripts.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.scripts.content}</p></Modal>
    </div>
  );
}

// ============================================
// MÓDULO: TICKETS
// ============================================
function TicketsModule() {
  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [tab, setTab] = useState('tickets');
  const [showModal, setShowModal] = useState(false);
  const [showCase, setShowCase] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'general', priority: 'medium', assignee: '', createdBy: '' });

  const load = async () => { const [t, a] = await Promise.all([api.get('/tickets'), api.get('/assets')]); if (t.success) setTickets(t.data); if (a.success) setAssets(a.data); };
  useEffect(() => { load(); }, []);

  const create = async () => { const r = await api.post('/tickets', form); if (r.success) { toast.success('Chamado criado'); setShowModal(false); setForm({ title: '', description: '', category: 'general', priority: 'medium', assignee: '', createdBy: '' }); load(); } };
  const updateStatus = async (id, status) => { await api.put(`/tickets/${id}`, { status }); toast.success('Status atualizado'); load(); };

  const priorityColors = { critical: 'danger', high: 'warning', medium: 'info', low: 'default' };
  const statusColors = { open: 'info', in_progress: 'warning', resolved: 'success', closed: 'default' };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🎫 Chamados</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Sistema de gestão de incidentes</p></div>
        <div className="flex gap-2">
          <Button variant={tab === 'tickets' ? 'primary' : 'secondary'} onClick={() => setTab('tickets')}>📋 Chamados</Button>
          <Button variant={tab === 'assets' ? 'primary' : 'secondary'} onClick={() => setTab('assets')}>📦 Ativos</Button>
          <Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button>
          {tab === 'tickets' && <Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Novo Chamado</Button>}
        </div>
      </div>

      {tab === 'tickets' && (
        <div className="space-y-3">
          {tickets.map(t => (
            <Card key={t.id}><div className="p-5">
              <div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-gray-900 dark:text-white">{t.title}</h3><div className="flex gap-2"><Badge variant={priorityColors[t.priority]}>{t.priority}</Badge><Badge variant={statusColors[t.status]}>{t.status}</Badge></div></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>👤 {t.assignee} | 📝 {t.createdBy} | 📁 {t.category}</span>
                <span>{new Date(t.createdAt).toLocaleString()}</span>
              </div>
              {t.comments.length > 0 && <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3"><p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">💬 Comentários:</p>{t.comments.map(c => <p key={c.id} className="text-xs text-gray-600 dark:text-gray-400">• {c.user}: {c.text}</p>)}</div>}
              <div className="flex gap-2">
                {t.status === 'open' && <Button size="sm" variant="secondary" onClick={() => updateStatus(t.id, 'in_progress')}>Iniciar</Button>}
                {t.status === 'in_progress' && <Button size="sm" variant="success" onClick={() => updateStatus(t.id, 'resolved')}>Resolver</Button>}
              </div>
            </div></Card>
          ))}
        </div>
      )}

      {tab === 'assets' && (
        <Card><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Tipo</th><th className="px-4 py-3 text-left">Nome</th><th className="px-4 py-3 text-left">Série</th><th className="px-4 py-3 text-left">Fabricante</th><th className="px-4 py-3 text-left">Modelo</th><th className="px-4 py-3 text-left">Garantia</th><th className="px-4 py-3 text-left">Status</th></tr></thead><tbody>{assets.map(a => (<tr key={a.id} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3"><Badge variant="info">{a.type}</Badge></td><td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{a.name}</td><td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{a.serialNumber}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{a.manufacturer}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{a.model}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{a.warrantyEnd}</td><td className="px-4 py-3"><Badge variant="success">{a.status}</Badge></td></tr>))}</tbody></table></div></Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Chamado">
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Descreva o problema" />
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label><textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4"><Select label="Categoria" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} options={[{ value: 'general', label: 'Geral' }, { value: 'performance', label: 'Performance' }, { value: 'backup', label: 'Backup' }, { value: 'user_management', label: 'Usuários' }]} /><Select label="Prioridade" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={[{ value: 'low', label: 'Baixa' }, { value: 'medium', label: 'Média' }, { value: 'high', label: 'Alta' }, { value: 'critical', label: 'Crítica' }]} /></div>
          <Input label="Responsável" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} placeholder="João Silva" />
          <div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={create}>Criar Chamado</Button></div>
        </div>
      </Modal>
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.tickets.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.tickets.content}</p></Modal>
    </div>
  );
}

// ============================================
// MÓDULO: SEGURANÇA
// ============================================
function SecurityModule() {
  const [users, setUsers] = useState([]);
  const [gpos, setGpos] = useState([]);
  const [zt, setZt] = useState([]);
  const [tab, setTab] = useState('ad');
  const [showModal, setShowModal] = useState(false);
  const [showCase, setShowCase] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', linkedTo: 'Domain', enabled: true });

  const load = async () => { const [u, g, z] = await Promise.all([api.get('/security/ad-users'), api.get('/security/gpos'), api.get('/security/zero-trust')]); if (u.success) setUsers(u.data); if (g.success) setGpos(g.data); if (z.success) setZt(z.data); };
  useEffect(() => { load(); }, []);

  const toggleUser = async (id) => { await api.post(`/security/ad-users/${id}/toggle`); load(); };
  const toggleGpo = async (id) => { await api.put(`/security/gpos/${id}/toggle`); load(); };
  const createGpo = async () => { const r = await api.post('/security/gpos', form); if (r.success) { toast.success('GPO criada'); setShowModal(false); setForm({ name: '', description: '', linkedTo: 'Domain', enabled: true }); load(); } };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔐 Segurança</h2><p className="text-gray-500 dark:text-gray-400 mt-1">AD, GPOs e Zero Trust</p></div>
        <div className="flex gap-2">
          <Button variant={tab === 'ad' ? 'primary' : 'secondary'} onClick={() => setTab('ad')}>👥 AD</Button>
          <Button variant={tab === 'gpo' ? 'primary' : 'secondary'} onClick={() => setTab('gpo')}>📜 GPOs</Button>
          <Button variant={tab === 'zt' ? 'primary' : 'secondary'} onClick={() => setTab('zt')}>🛡️ Zero Trust</Button>
          <Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button>
        </div>
      </div>

      {tab === 'ad' && (
        <Card><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-3 text-left">Usuário</th><th className="px-4 py-3 text-left">Nome Completo</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Departamento</th><th className="px-4 py-3 text-left">Grupos</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Ações</th></tr></thead><tbody>{users.map(u => (<tr key={u.id} className="border-t border-gray-200 dark:border-gray-700"><td className="px-4 py-3 font-mono font-medium text-gray-900 dark:text-white">{u.username}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.fullName}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td><td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.department}</td><td className="px-4 py-3">{u.groups.map(g => <Badge key={g} variant="info" className="mr-1">{g}</Badge>)}</td><td className="px-4 py-3"><Badge variant={u.enabled ? 'success' : 'danger'}>{u.enabled ? 'Ativo' : 'Desativado'}</Badge></td><td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => toggleUser(u.id)}>{u.enabled ? 'Desativar' : 'Ativar'}</Button></td></tr>))}</tbody></table></div></Card>
      )}

      {tab === 'gpo' && (
        <div>
          <div className="flex justify-end mb-4"><Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4 mr-1" />Nova GPO</Button></div>
          <div className="space-y-3">{gpos.map(g => (<Card key={g.id}><div className="p-5 flex items-center justify-between"><div><h3 className="font-semibold text-gray-900 dark:text-white">{g.name}</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{g.description}</p><p className="text-xs text-gray-400 mt-1">🔗 Vinculado a: {g.linkedTo}</p></div><div className="flex items-center gap-3"><Badge variant={g.enabled ? 'success' : 'default'}>{g.enabled ? 'Ativa' : 'Inativa'}</Badge><Button size="sm" variant="ghost" onClick={() => toggleGpo(g.id)}>{g.enabled ? 'Desativar' : 'Ativar'}</Button></div></div></Card>))}</div>
        </div>
      )}

      {tab === 'zt' && (
        <div className="space-y-4">{zt.map(z => (<Card key={z.id}><div className="p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-gray-900 dark:text-white">{z.name}</h3><Badge variant={z.status === 'implemented' ? 'success' : z.status === 'partial' ? 'warning' : 'info'}>{z.status}</Badge></div><p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{z.description}</p><div className="flex items-center gap-3"><span className="text-sm text-gray-600 dark:text-gray-400">Cobertura: {z.coverage}%</span><div className="flex-1"><ProgressBar value={z.coverage} color={z.coverage > 80 ? 'green' : z.coverage > 50 ? 'yellow' : 'red'} /></div></div></div></Card>))}</div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova GPO">
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Política de Segurança" />
          <Input label="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descreva a política" />
          <Input label="Vinculado a" value={form.linkedTo} onChange={e => setForm({ ...form, linkedTo: e.target.value })} placeholder="Domain" />
          <div className="flex justify-end gap-2 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={createGpo}>Criar GPO</Button></div>
        </div>
      </Modal>
      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.security.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.security.content}</p></Modal>
    </div>
  );
}

// ============================================
// MÓDULO: ORQUESTRAÇÃO
// ============================================
function OrchestrationModule() {
  const [tfState, setTfState] = useState(null);
  const [tfOutput, setTfOutput] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [ansibleOutput, setAnsibleOutput] = useState([]);
  const [tab, setTab] = useState('terraform');
  const [showCase, setShowCase] = useState(false);

  const load = async () => { const [tf, pb] = await Promise.all([api.get('/orchestration/terraform'), api.get('/orchestration/ansible')]); if (tf.success) setTfState(tf.data); if (pb.success) setPlaybooks(pb.data); };
  useEffect(() => { load(); }, []);

  const tfPlan = async () => { const r = await api.post('/orchestration/terraform/plan'); if (r.success) setTfOutput(r.data.output); };
  const tfApply = async () => { const r = await api.post('/orchestration/terraform/apply'); if (r.success) setTfOutput(r.data.output); };
  const runPlaybook = async (id) => { const r = await api.post(`/orchestration/ansible/run/${id}`); if (r.success) setAnsibleOutput(r.data.output); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔄 Orquestração</h2><p className="text-gray-500 dark:text-gray-400 mt-1">Terraform e Ansible simulados</p></div>
        <div className="flex gap-2">
          <Button variant={tab === 'terraform' ? 'primary' : 'secondary'} onClick={() => setTab('terraform')}>🏗️ Terraform</Button>
          <Button variant={tab === 'ansible' ? 'primary' : 'secondary'} onClick={() => setTab('ansible')}>📋 Ansible</Button>
          <Button variant="ghost" onClick={() => setShowCase(true)}><BriefcaseIcon className="w-4 h-4 mr-1" />Caso</Button>
        </div>
      </div>

      {tab === 'terraform' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card><CardHeader title="Estado dos Recursos" /><div className="p-4">
              {tfState?.resources.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div><p className="font-medium text-gray-900 dark:text-white">{r.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{r.type} | {r.provider}</p></div>
                  <div className="flex items-center gap-2"><Badge variant="success">{r.status}</Badge><span className="text-xs font-mono text-gray-400">{r.id}</span></div>
                </div>
              ))}
            </div></Card>
            <div className="flex gap-2 mt-4"><Button onClick={tfPlan}>📋 Plan</Button><Button variant="success" onClick={tfApply}>▶️ Apply</Button></div>
          </div>
          <Card><CardHeader title="Saída" /><div className="p-4 bg-gray-900 rounded-b-xl font-mono text-sm text-green-400 min-h-[300px] overflow-y-auto">
            {tfOutput.length === 0 ? <p className="text-gray-500">$ Execute terraform plan ou apply...</p> : tfOutput.map((line, i) => <div key={i} className={line.includes('complete') ? 'text-green-400' : line.includes('Creating') ? 'text-yellow-400' : ''}>{line}</div>)}
          </div></Card>
        </div>
      )}

      {tab === 'ansible' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Playbooks</h3>
            <div className="space-y-3">{playbooks.map(pb => (
              <Card key={pb.id}><div className="p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{pb.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{pb.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">{pb.tasks.map((t, i) => <Badge key={i} variant="default">{t}</Badge>)}</div>
                <div className="flex items-center justify-between"><span className="text-xs text-gray-400">🎯 {pb.targets.join(', ')}</span><Button size="sm" onClick={() => runPlaybook(pb.id)}><PlayIcon className="w-3 h-3 mr-1" />Executar</Button></div>
              </div></Card>
            ))}</div>
          </div>
          <Card><CardHeader title="Saída" /><div className="p-4 bg-gray-900 rounded-b-xl font-mono text-sm text-green-400 min-h-[300px] overflow-y-auto">
            {ansibleOutput.length === 0 ? <p className="text-gray-500">$ Execute um playbook...</p> : ansibleOutput.map((line, i) => <div key={i} className={line.includes('ok=') ? 'text-green-400 font-bold' : line.includes('changed:') ? 'text-yellow-400' : line.includes('TASK') ? 'text-blue-400 font-bold' : ''}>{line}</div>)}
          </div></Card>
        </div>
      )}

      <Modal isOpen={showCase} onClose={() => setShowCase(false)} title={caseStudies.orchestration.title}><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{caseStudies.orchestration.content}</p></Modal>
    </div>
  );
}

// ============================================
// PÁGINA INICIAL (DASHBOARD)
// ============================================
function Dashboard() {
  const [health, setHealth] = useState(null);
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [h, s] = await Promise.all([api.get('/monitoring/health'), api.get('/servers')]);
      if (h.success) setHealth(h.data);
      if (s.success) setServers(s.data);
    };
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🏠 Dashboard</h2>

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-green-500">{health.servers?.online}</p><p className="text-sm text-gray-500 dark:text-gray-400">Servidores Online</p><p className="text-xs text-gray-400">de {health.servers?.total} total</p></div></Card>
          <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-blue-500">{health.vms?.running}</p><p className="text-sm text-gray-500 dark:text-gray-400">VMs Rodando</p><p className="text-xs text-gray-400">de {health.vms?.total} total</p></div></Card>
          <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-yellow-500">{health.alerts?.warning || 0}</p><p className="text-sm text-gray-500 dark:text-gray-400">Alertas Warning</p></div></Card>
          <Card><div className="p-5 text-center"><p className="text-4xl font-bold text-red-500">{health.alerts?.critical || 0}</p><p className="text-sm text-gray-500 dark:text-gray-400">Alertas Críticos</p></div></Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader title="Status dos Servidores" /><div className="p-4 space-y-3">
          {servers.map(s => (
            <div key={s.id} className="flex items-center justify-between"><div className="flex items-center gap-2"><StatusDot status={s.status} /><span className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</span></div><span className="text-xs text-gray-500 dark:text-gray-400">{s.ip}</span></div>
          ))}
        </div></Card>

        <Card><CardHeader title="Visão Geral da Infraestrutura" /><div className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">🖥️</p><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Servidores</p></div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"><p className="text-2xl font-bold text-green-600 dark:text-green-400">☁️</p><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Virtualização</p></div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4"><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔒</p><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Segurança</p></div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4"><p className="text-2xl font-bold text-orange-600 dark:text-orange-400">💾</p><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Backup</p></div>
          </div>
        </div></Card>
      </div>
    </div>
  );
}

// ============================================
// APP PRINCIPAL
// ============================================
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [health, setHealth] = useState(null);
  const [runTour, setRunTour] = useState(() => !localStorage.getItem('tourCompleted'));

  useEffect(() => {
    const loadHealth = async () => { const r = await api.get('/monitoring/health'); if (r.success) setHealth(r.data); };
    loadHealth();
    const i = setInterval(loadHealth, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <TourGuide runTour={runTour} setRunTour={setRunTour} />
          <Toaster position="top-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Header health={health} onTourStart={() => setRunTour(true)} />
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
              <Route path="/checkpoint" element={<CheckpointModule />} />
              <Route path="/security-policies" element={<SecurityPoliciesModule />} />
>>>>>>> feature/politicas-seguranca
              <Route path="/orchestration" element={<OrchestrationModule />} />
              <Route path="/edge-security" element={<EdgeSecurityModule />} />
              <Route path="/checkpoint" element={<CheckpointModule />} />
              <Route path="/security-policies" element={<SecurityPoliciesModule />} />
=======
              <Route path="/checkpoint" element={<CheckpointModule />} />
              <Route path="/security-policies" element={<SecurityPoliciesModule />} />
>>>>>>> feature/politicas-seguranca
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
