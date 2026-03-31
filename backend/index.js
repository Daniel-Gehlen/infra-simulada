const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Dados em memória
let servers = [
  { id: 'srv-001', name: 'DC-PRINCIPAL', os: 'Windows Server 2022', ip: '192.168.1.10', status: 'online', cpu: 45, ram: 62, disk: 55, role: 'Domain Controller', location: 'Data Center A', createdAt: new Date().toISOString() },
  { id: 'srv-002', name: 'WEB-SERVER-01', os: 'Ubuntu 22.04 LTS', ip: '192.168.1.20', status: 'online', cpu: 32, ram: 48, disk: 40, role: 'Web Server', location: 'Data Center A', createdAt: new Date().toISOString() },
  { id: 'srv-003', name: 'DB-PROD-01', os: 'Windows Server 2019', ip: '192.168.1.30', status: 'online', cpu: 78, ram: 85, disk: 72, role: 'Database Server', location: 'Data Center B', createdAt: new Date().toISOString() },
  { id: 'srv-004', name: 'FILE-SERVER', os: 'Windows Server 2022', ip: '192.168.1.40', status: 'offline', cpu: 0, ram: 0, disk: 65, role: 'File Server', location: 'Data Center A', createdAt: new Date().toISOString() }
];

let vms = [
  { id: 'vm-001', name: 'VM-DNS-01', host: 'HOST-ESXI-01', vcpus: 2, ram: 4, disk: 50, status: 'running', os: 'Ubuntu Server 22.04', cloudProvider: null, createdAt: new Date().toISOString() },
  { id: 'vm-002', name: 'VM-DOCKER-01', host: 'HOST-ESXI-01', vcpus: 4, ram: 8, disk: 100, status: 'running', os: 'CentOS 8', cloudProvider: null, createdAt: new Date().toISOString() }
];

const resourcePool = { totalVcpus: 16, totalRam: 64, totalDisk: 1000, usedVcpus: 6, usedRam: 12, usedDisk: 150 };

let firewallRules = [
  { id: 'fw-001', name: 'Allow SSH', action: 'allow', protocol: 'TCP', port: 22, source: '192.168.1.0/24', destination: 'any', enabled: true },
  { id: 'fw-002', name: 'Allow HTTP', action: 'allow', protocol: 'TCP', port: 80, source: 'any', destination: 'any', enabled: true },
  { id: 'fw-003', name: 'Allow HTTPS', action: 'allow', protocol: 'TCP', port: 443, source: 'any', destination: 'any', enabled: true },
  { id: 'fw-004', name: 'Block Telnet', action: 'deny', protocol: 'TCP', port: 23, source: 'any', destination: 'any', enabled: true }
];

let vpns = [{ id: 'vpn-001', name: 'VPN-CORPORATIVA', type: 'IPSec', status: 'active', remoteEndpoint: '200.100.50.1', localSubnet: '192.168.1.0/24', remoteSubnet: '10.0.0.0/24', connectedUsers: 12, createdAt: new Date().toISOString() }];

const staticRoutes = [
  { id: 'rt-001', destination: '10.0.0.0/24', gateway: '192.168.1.1', interface: 'eth0', metric: 10 },
  { id: 'rt-002', destination: '172.16.0.0/16', gateway: '192.168.1.1', interface: 'eth0', metric: 20 },
  { id: 'rt-003', destination: '0.0.0.0/0', gateway: '192.168.1.254', interface: 'eth0', metric: 1 }
];

const arpTable = [
  { ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:01', interface: 'eth0', type: 'dynamic' },
  { ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:02', interface: 'eth0', type: 'static' },
  { ip: '192.168.1.20', mac: '00:1A:2B:3C:4D:03', interface: 'eth0', type: 'dynamic' },
  { ip: '192.168.1.30', mac: '00:1A:2B:3C:4D:04', interface: 'eth0', type: 'dynamic' },
  { ip: '192.168.1.254', mac: '00:1A:2B:3C:4D:FF', interface: 'eth0', type: 'static' }
];

let monitoringMetrics = { cpu: [], memory: [], network: [], disk: [] };
for (let i = 0; i < 20; i++) {
  monitoringMetrics.cpu.push({ time: i, value: Math.floor(Math.random() * 40) + 30 });
  monitoringMetrics.memory.push({ time: i, value: Math.floor(Math.random() * 30) + 50 });
  monitoringMetrics.network.push({ time: i, value: Math.floor(Math.random() * 100) + 50 });
  monitoringMetrics.disk.push({ time: i, value: Math.floor(Math.random() * 20) + 40 });
}

let alerts = [
  { id: 'alt-001', severity: 'warning', message: 'CPU do DB-PROD-01 acima de 75%', timestamp: new Date().toISOString(), resolved: false },
  { id: 'alt-002', severity: 'critical', message: 'Servidor FILE-SERVER offline', timestamp: new Date().toISOString(), resolved: false },
  { id: 'alt-003', severity: 'info', message: 'Backup noturno concluído com sucesso', timestamp: new Date().toISOString(), resolved: true }
];

let backups = [
  { id: 'bkp-001', name: 'Backup Full - DC-PRINCIPAL', type: 'full', source: 'DC-PRINCIPAL', status: 'completed', size: '45 GB', duration: '02:15:30', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'bkp-002', name: 'Backup Incremental - DB-PROD', type: 'incremental', source: 'DB-PROD-01', status: 'completed', size: '12 GB', duration: '00:45:00', createdAt: new Date(Date.now() - 43200000).toISOString() }
];

let scripts = [
  { id: 'scr-001', name: 'Verificar Espaço em Disco', language: 'powershell', code: 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, Used, Free', description: 'Lista o espaço utilizado e livre em todos os drives' },
  { id: 'scr-002', name: 'Listar Processos', language: 'bash', code: 'ps aux --sort=-%cpu | head -20', description: 'Lista os 20 processos que mais consomem CPU' },
  { id: 'scr-003', name: 'Verificar Conectividade', language: 'python', code: 'import subprocess\nhosts = ["8.8.8.8", "google.com", "192.168.1.1"]\nfor host in hosts:\n    result = subprocess.run(["ping", "-c", "1", host], capture_output=True)\n    print(f"{host}: UP" if result.returncode == 0 else f"{host}: DOWN")', description: 'Verifica conectividade com múltiplos hosts' }
];

let tickets = [
  { id: 'tkt-001', title: 'Servidor WEB com lentidão', description: 'Usuários relatam acesso lento ao sistema ERP', category: 'performance', priority: 'high', status: 'open', assignee: 'João Silva', createdBy: 'Maria Santos', createdAt: new Date(Date.now() - 7200000).toISOString(), comments: [{ id: 'cmt-001', user: 'João Silva', text: 'Investigando uso de CPU no servidor', timestamp: new Date().toISOString() }] },
  { id: 'tkt-002', title: 'Solicitação de novo usuário AD', description: 'Criar usuário para novo funcionário do financeiro', category: 'user_management', priority: 'medium', status: 'in_progress', assignee: 'Ana Costa', createdBy: 'RH - Patricia', createdAt: new Date(Date.now() - 3600000).toISOString(), comments: [] },
  { id: 'tkt-003', title: 'Backup falhou na noite passada', description: 'Job de backup do servidor DB apresentou erro', category: 'backup', priority: 'critical', status: 'resolved', assignee: 'Carlos Lima', createdBy: 'Sistema de Monitoramento', createdAt: new Date(Date.now() - 86400000).toISOString(), comments: [{ id: 'cmt-002', user: 'Carlos Lima', text: 'Espaço em disco insuficiente. Limpeza realizada.', timestamp: new Date(Date.now() - 82800000).toISOString() }] }
];

const assets = [
  { id: 'ast-001', type: 'server', name: 'DC-PRINCIPAL', serialNumber: 'SN-SRV-001-2024', manufacturer: 'Dell', model: 'PowerEdge R740', purchaseDate: '2023-01-15', warrantyEnd: '2026-01-15', status: 'active' },
  { id: 'ast-002', type: 'switch', name: 'SW-CORE-01', serialNumber: 'SN-SW-001-2024', manufacturer: 'Cisco', model: 'Catalyst 9300', purchaseDate: '2022-06-20', warrantyEnd: '2025-06-20', status: 'active' },
  { id: 'ast-003', type: 'router', name: 'RT-EDGE-01', serialNumber: 'SN-RT-001-2024', manufacturer: 'Juniper', model: 'SRX345', purchaseDate: '2023-03-10', warrantyEnd: '2026-03-10', status: 'active' },
  { id: 'ast-004', type: 'firewall', name: 'FW-PERIMETER', serialNumber: 'SN-FW-001-2024', manufacturer: 'Palo Alto', model: 'PA-820', purchaseDate: '2022-11-05', warrantyEnd: '2025-11-05', status: 'active' },
  { id: 'ast-005', type: 'server', name: 'DB-PROD-01', serialNumber: 'SN-SRV-002-2024', manufacturer: 'HP', model: 'ProLiant DL380', purchaseDate: '2023-05-20', warrantyEnd: '2026-05-20', status: 'active' }
];

const adUsers = [
  { id: 'ad-001', username: 'jsilva', fullName: 'João Silva', email: 'joao.silva@empresa.com', department: 'TI', groups: ['Domain Admins', 'IT Support'], enabled: true, lastLogon: new Date().toISOString() },
  { id: 'ad-002', username: 'acosta', fullName: 'Ana Costa', email: 'ana.costa@empresa.com', department: 'TI', groups: ['IT Support', 'Help Desk'], enabled: true, lastLogon: new Date().toISOString() },
  { id: 'ad-003', username: 'msantos', fullName: 'Maria Santos', email: 'maria.santos@empresa.com', department: 'Financeiro', groups: ['Finance Users'], enabled: true, lastLogon: new Date(Date.now() - 86400000).toISOString() },
  { id: 'ad-004', username: 'plima', fullName: 'Pedro Lima', email: 'pedro.lima@empresa.com', department: 'RH', groups: ['HR Users'], enabled: false, lastLogon: new Date(Date.now() - 2592000000).toISOString() }
];

let gpos = [
  { id: 'gpo-001', name: 'Política de Senha Forte', description: 'Exige senha com 12 caracteres, caracteres especiais e números', enabled: true, linkedTo: 'Domain', settings: { minLength: 12, complexity: true, maxAge: 90 } },
  { id: 'gpo-002', name: 'Bloquear USB', description: 'Desabilita portas USB em workstations', enabled: true, linkedTo: 'Workstations OU', settings: { disableUSBStorage: true } },
  { id: 'gpo-003', name: 'Configurar Wallpaper Corporativo', description: 'Define wallpaper padrão da empresa', enabled: false, linkedTo: 'All Users', settings: { wallpaperPath: '\\\\server\\share\\wallpaper.jpg' } }
];

const terraformState = { resources: [{ type: 'aws_instance', name: 'web_server_1', provider: 'AWS', status: 'created', id: 'i-0abc123def456' }, { type: 'aws_vpc', name: 'main_vpc', provider: 'AWS', status: 'created', id: 'vpc-0abc123def456' }, { type: 'azurerm_resource_group', name: 'rg_production', provider: 'Azure', status: 'created', id: '/subscriptions/.../resourceGroups/rg-prod' }] };

const ansiblePlaybooks = [
  { id: 'pb-001', name: 'Instalar Nginx', description: 'Instala e configura Nginx em servidores web', tasks: ['Instalar pacote', 'Configurar vhost', 'Iniciar serviço'], targets: ['webservers'] },
  { id: 'pb-002', name: 'Atualizar Sistema', description: 'Executa update e upgrade em servidores Linux', tasks: ['apt update', 'apt upgrade -y', 'reboot se necessário'], targets: ['allservers'] },
  { id: 'pb-003', name: 'Configurar Monitoramento', description: 'Instala agente Zabbix', tasks: ['Download agente', 'Configurar zabbix_agentd', 'Iniciar serviço'], targets: ['monitored_hosts'] }
];

function simulateScriptExecution(language) {
  const outputs = {
    powershell: ['PS C:\\> Executando script...', 'Name    Used(GB)    Free(GB)', '----    --------    --------', 'C:      120.5       79.5', 'D:      450.2       549.8', '', 'Script executado com sucesso!'],
    bash: ['Executando script Bash...', 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND', 'root         1  0.0  0.1 169444 13204 ?        Ss   10:00   0:02 /sbin/init', 'www-data  1234  2.5  1.2 524288 98304 ?        S    10:15   0:45 nginx: worker', '', 'Script concluído.'],
    python: ['Executando script Python...', '8.8.8.8: UP', 'google.com: UP', '192.168.1.1: UP', '', 'Processo finalizado com código 0']
  };
  return outputs[language] || outputs.bash;
}

setInterval(() => {
  monitoringMetrics.cpu.push({ time: Date.now(), value: Math.floor(Math.random() * 40) + 30 });
  monitoringMetrics.memory.push({ time: Date.now(), value: Math.floor(Math.random() * 30) + 50 });
  monitoringMetrics.network.push({ time: Date.now(), value: Math.floor(Math.random() * 100) + 50 });
  monitoringMetrics.disk.push({ time: Date.now(), value: Math.floor(Math.random() * 20) + 40 });
  if (monitoringMetrics.cpu.length > 50) {
    monitoringMetrics.cpu.shift(); monitoringMetrics.memory.shift(); monitoringMetrics.network.shift(); monitoringMetrics.disk.shift();
  }
  servers.forEach(srv => { if (srv.status === 'online') { srv.cpu = Math.min(100, Math.max(0, srv.cpu + (Math.random() * 10 - 5))); srv.ram = Math.min(100, Math.max(0, srv.ram + (Math.random() * 8 - 4))); } });
}, 5000);

// SERVIDORES
app.get('/api/servers', (req, res) => res.json({ success: true, data: servers }));
app.get('/api/servers/:id', (req, res) => { const s = servers.find(s => s.id === req.params.id); if (!s) return res.status(404).json({ success: false, message: 'Não encontrado' }); res.json({ success: true, data: s }); });
app.post('/api/servers', (req, res) => { const { name, os, ip, role, location } = req.body; if (!name || !os || !ip) return res.status(400).json({ success: false, message: 'Campos obrigatórios' }); const ns = { id: `srv-${uuidv4().slice(0,8)}`, name, os, ip, status: 'offline', cpu: 0, ram: 0, disk: Math.floor(Math.random()*30)+20, role: role||'Generic', location: location||'Data Center A', createdAt: new Date().toISOString() }; servers.push(ns); res.status(201).json({ success: true, data: ns, message: 'Criado' }); });
app.put('/api/servers/:id', (req, res) => { const i = servers.findIndex(s => s.id === req.params.id); if (i===-1) return res.status(404).json({ success: false }); servers[i] = { ...servers[i], ...req.body }; res.json({ success: true, data: servers[i] }); });
app.delete('/api/servers/:id', (req, res) => { const i = servers.findIndex(s => s.id === req.params.id); if (i===-1) return res.status(404).json({ success: false }); servers.splice(i,1); res.json({ success: true }); });
app.post('/api/servers/:id/power', (req, res) => { const s = servers.find(s => s.id === req.params.id); if (!s) return res.status(404).json({ success: false }); s.status = s.status==='online'?'offline':'online'; s.cpu = s.status==='online'?Math.floor(Math.random()*30)+20:0; s.ram = s.status==='online'?Math.floor(Math.random()*30)+40:0; res.json({ success: true, data: s }); });
app.post('/api/servers/:id/ping', (req, res) => { const s = servers.find(s => s.id === req.params.id); if (!s) return res.status(404).json({ success: false }); res.json({ success: true, data: { host: s.ip, reachable: s.status==='online', latency: s.status==='online'?`${Math.floor(Math.random()*50)+1}ms`:'timeout', packets: { sent:4, received: s.status==='online'?4:0, lost: s.status==='online'?0:4 } } }); });

// REDE
app.get('/api/network/firewall', (req, res) => res.json({ success: true, data: firewallRules }));
app.post('/api/network/firewall', (req, res) => { const { name, action, protocol, port, source, destination } = req.body; if (!name||!action||!protocol||!port) return res.status(400).json({ success: false }); const nr = { id: `fw-${uuidv4().slice(0,8)}`, name, action, protocol, port: parseInt(port), source: source||'any', destination: destination||'any', enabled: true }; firewallRules.push(nr); res.status(201).json({ success: true, data: nr }); });
app.put('/api/network/firewall/:id/toggle', (req, res) => { const r = firewallRules.find(r => r.id===req.params.id); if (!r) return res.status(404).json({ success: false }); r.enabled = !r.enabled; res.json({ success: true, data: r }); });
app.delete('/api/network/firewall/:id', (req, res) => { const i = firewallRules.findIndex(r => r.id===req.params.id); if (i===-1) return res.status(404).json({ success: false }); firewallRules.splice(i,1); res.json({ success: true }); });
app.get('/api/network/vpn', (req, res) => res.json({ success: true, data: vpns }));
app.post('/api/network/vpn', (req, res) => { const nv = { id: `vpn-${uuidv4().slice(0,8)}`, name: req.body.name||'Nova VPN', type: req.body.type||'IPSec', status: 'inactive', remoteEndpoint: req.body.remoteEndpoint||'0.0.0.0', localSubnet: req.body.localSubnet||'192.168.0.0/24', remoteSubnet: req.body.remoteSubnet||'10.0.0.0/24', connectedUsers: 0, createdAt: new Date().toISOString() }; vpns.push(nv); res.status(201).json({ success: true, data: nv }); });
app.post('/api/network/vpn/:id/toggle', (req, res) => { const v = vpns.find(v => v.id===req.params.id); if (!v) return res.status(404).json({ success: false }); v.status = v.status==='active'?'inactive':'active'; v.connectedUsers = v.status==='active'?Math.floor(Math.random()*20)+1:0; res.json({ success: true, data: v }); });
app.get('/api/network/routes', (req, res) => res.json({ success: true, data: staticRoutes }));
app.get('/api/network/arp', (req, res) => res.json({ success: true, data: arpTable }));

// VIRTUALIZAÇÃO
app.get('/api/virtualization/vms', (req, res) => res.json({ success: true, data: vms }));
app.get('/api/virtualization/pool', (req, res) => res.json({ success: true, data: resourcePool }));
app.post('/api/virtualization/vms', (req, res) => { const { name, host, vcpus, ram, disk, os } = req.body; if (vcpus>(resourcePool.totalVcpus-resourcePool.usedVcpus)) return res.status(400).json({ success: false, message: 'vCPUs insuficientes' }); if (ram>(resourcePool.totalRam-resourcePool.usedRam)) return res.status(400).json({ success: false, message: 'RAM insuficiente' }); const nv = { id: `vm-${uuidv4().slice(0,8)}`, name: name||`VM-${Date.now()}`, host: host||'HOST-ESXI-01', vcpus: parseInt(vcpus)||2, ram: parseInt(ram)||4, disk: parseInt(disk)||50, status: 'running', os: os||'Ubuntu Server 22.04', cloudProvider: null, createdAt: new Date().toISOString() }; resourcePool.usedVcpus+=nv.vcpus; resourcePool.usedRam+=nv.ram; resourcePool.usedDisk+=nv.disk; vms.push(nv); res.status(201).json({ success: true, data: nv }); });
app.delete('/api/virtualization/vms/:id', (req, res) => { const i = vms.findIndex(v => v.id===req.params.id); if (i===-1) return res.status(404).json({ success: false }); const v = vms[i]; resourcePool.usedVcpus-=v.vcpus; resourcePool.usedRam-=v.ram; resourcePool.usedDisk-=v.disk; vms.splice(i,1); res.json({ success: true }); });
app.post('/api/virtualization/vms/:id/migrate', (req, res) => { const v = vms.find(v => v.id===req.params.id); if (!v) return res.status(404).json({ success: false }); const hosts = ['HOST-ESXI-01','HOST-ESXI-02','HOST-ESXI-03']; v.host = hosts[(hosts.indexOf(v.host)+1)%3]; res.json({ success: true, data: v }); });
app.post('/api/virtualization/vms/:id/cloud', (req, res) => { const v = vms.find(v => v.id===req.params.id); if (!v) return res.status(404).json({ success: false }); v.cloudProvider = ['AWS','Azure','GCP'][Math.floor(Math.random()*3)]; res.json({ success: true, data: v }); });
app.post('/api/virtualization/vms/:id/power', (req, res) => { const v = vms.find(v => v.id===req.params.id); if (!v) return res.status(404).json({ success: false }); v.status = v.status==='running'?'stopped':'running'; res.json({ success: true, data: v }); });

// MONITORAMENTO
app.get('/api/monitoring/metrics', (req, res) => res.json({ success: true, data: monitoringMetrics }));
app.get('/api/monitoring/alerts', (req, res) => res.json({ success: true, data: alerts }));
app.post('/api/monitoring/alerts/:id/resolve', (req, res) => { const a = alerts.find(a => a.id===req.params.id); if (!a) return res.status(404).json({ success: false }); a.resolved = true; res.json({ success: true, data: a }); });
app.get('/api/monitoring/health', (req, res) => { const os = servers.filter(s => s.status==='online').length; res.json({ success: true, data: { servers: { online: os, total: servers.length }, vms: { running: vms.filter(v => v.status==='running').length, total: vms.length }, alerts: { critical: alerts.filter(a => a.severity==='critical'&&!a.resolved).length, warning: alerts.filter(a => a.severity==='warning'&&!a.resolved).length }, overallStatus: alerts.filter(a => a.severity==='critical'&&!a.resolved).length>0?'critical':'healthy' } }); });

// BACKUP
app.get('/api/backup', (req, res) => res.json({ success: true, data: backups }));
app.post('/api/backup', (req, res) => { const nb = { id: `bkp-${uuidv4().slice(0,8)}`, name: req.body.name||`Backup ${new Date().toLocaleString()}`, type: req.body.type||'full', source: req.body.source||'DC-PRINCIPAL', status: 'running', size: '-', duration: '-', createdAt: new Date().toISOString() }; backups.push(nb); setTimeout(() => { nb.status = 'completed'; nb.size = `${Math.floor(Math.random()*50)+10} GB`; nb.duration = `00:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`; }, 3000); res.status(201).json({ success: true, data: nb }); });
app.post('/api/backup/:id/restore', (req, res) => { const b = backups.find(b => b.id===req.params.id); if (!b) return res.status(404).json({ success: false }); res.json({ success: true, message: `Restauração: ${b.name}` }); });

// SCRIPTS
app.get('/api/scripts', (req, res) => res.json({ success: true, data: scripts }));
app.post('/api/scripts', (req, res) => { const { name, language, code, description } = req.body; if (!name||!language||!code) return res.status(400).json({ success: false }); const ns = { id: `scr-${uuidv4().slice(0,8)}`, name, language, code, description: description||'' }; scripts.push(ns); res.status(201).json({ success: true, data: ns }); });
app.post('/api/scripts/execute', (req, res) => { const { language } = req.body; if (!language) return res.status(400).json({ success: false }); res.json({ success: true, data: { output: simulateScriptExecution(language), exitCode: 0, executionTime: `${Math.floor(Math.random()*2000)+100}ms` } }); });
app.delete('/api/scripts/:id', (req, res) => { const i = scripts.findIndex(s => s.id===req.params.id); if (i===-1) return res.status(404).json({ success: false }); scripts.splice(i,1); res.json({ success: true }); });

// TICKETS
app.get('/api/tickets', (req, res) => res.json({ success: true, data: tickets }));
app.get('/api/tickets/:id', (req, res) => { const t = tickets.find(t => t.id===req.params.id); if (!t) return res.status(404).json({ success: false }); res.json({ success: true, data: t }); });
app.post('/api/tickets', (req, res) => { const { title, description, category, priority, assignee, createdBy } = req.body; if (!title||!description) return res.status(400).json({ success: false }); const nt = { id: `tkt-${uuidv4().slice(0,8)}`, title, description, category: category||'general', priority: priority||'medium', status: 'open', assignee: assignee||'Não atribuído', createdBy: createdBy||'Sistema', createdAt: new Date().toISOString(), comments: [] }; tickets.push(nt); res.status(201).json({ success: true, data: nt }); });
app.put('/api/tickets/:id', (req, res) => { const t = tickets.find(t => t.id===req.params.id); if (!t) return res.status(404).json({ success: false }); Object.assign(t, req.body); res.json({ success: true, data: t }); });
app.post('/api/tickets/:id/comments', (req, res) => { const t = tickets.find(t => t.id===req.params.id); if (!t) return res.status(404).json({ success: false }); t.comments.push({ id: `cmt-${uuidv4().slice(0,8)}`, user: req.body.user||'Sistema', text: req.body.text, timestamp: new Date().toISOString() }); res.json({ success: true, data: t }); });
app.get('/api/assets', (req, res) => res.json({ success: true, data: assets }));

// SEGURANÇA
app.get('/api/security/ad-users', (req, res) => res.json({ success: true, data: adUsers }));
app.get('/api/security/gpos', (req, res) => res.json({ success: true, data: gpos }));
app.post('/api/security/gpos', (req, res) => { const ng = { id: `gpo-${uuidv4().slice(0,8)}`, name: req.body.name, description: req.body.description, enabled: req.body.enabled!==false, linkedTo: req.body.linkedTo||'Domain', settings: req.body.settings||{} }; gpos.push(ng); res.status(201).json({ success: true, data: ng }); });
app.put('/api/security/gpos/:id/toggle', (req, res) => { const g = gpos.find(g => g.id===req.params.id); if (!g) return res.status(404).json({ success: false }); g.enabled = !g.enabled; res.json({ success: true, data: g }); });
app.post('/api/security/ad-users/:id/toggle', (req, res) => { const u = adUsers.find(u => u.id===req.params.id); if (!u) return res.status(404).json({ success: false }); u.enabled = !u.enabled; res.json({ success: true, data: u }); });
app.get('/api/security/zero-trust', (req, res) => res.json({ success: true, data: [{ id: 'zt-001', name: 'Verificação Explícita', description: 'Sempre autenticar e autorizar', status: 'implemented', coverage: 95 }, { id: 'zt-002', name: 'Acesso com Menor Privilégio', description: 'Limitar acesso com JIT', status: 'implemented', coverage: 88 }, { id: 'zt-003', name: 'Assumir Brecha', description: 'Minimizar blast radius', status: 'partial', coverage: 72 }, { id: 'zt-004', name: 'Microsegmentação', description: 'Segmentar rede', status: 'in_progress', coverage: 45 }] }));

// ORQUESTRAÇÃO
app.get('/api/orchestration/terraform', (req, res) => res.json({ success: true, data: terraformState }));
app.post('/api/orchestration/terraform/plan', (req, res) => res.json({ success: true, data: { output: ['Terraform will perform the following actions:', '', `  + resource "${terraformState.resources[0].type}" "${terraformState.resources[0].name}"`, '', `Plan: ${terraformState.resources.length} to add, 0 to change, 0 to destroy.`], planSummary: { add: terraformState.resources.length, change: 0, destroy: 0 } } }));
app.post('/api/orchestration/terraform/apply', (req, res) => res.json({ success: true, data: { output: ['aws_vpc.main_vpc: Creating...', 'aws_vpc.main_vpc: Creation complete', 'aws_instance.web_server_1: Creating...', 'aws_instance.web_server_1: Creation complete', '', 'Apply complete! Resources: 3 added, 0 changed, 0 destroyed.'], success: true } }));
app.get('/api/orchestration/ansible', (req, res) => res.json({ success: true, data: ansiblePlaybooks }));
app.post('/api/orchestration/ansible/run/:id', (req, res) => { const pb = ansiblePlaybooks.find(p => p.id===req.params.id); if (!pb) return res.status(404).json({ success: false }); const out = [`PLAY [${pb.targets.join(', ')}]`, '', 'TASK [Gathering Facts]', 'ok: [server1]', 'ok: [server2]', 'ok: [server3]', '']; pb.tasks.forEach(t => { out.push(`TASK [${t}]`); out.push('changed: [server1]'); out.push('changed: [server2]'); out.push('changed: [server3]'); out.push(''); }); out.push('PLAY RECAP'); out.push('server1: ok=4 changed=3'); out.push('server2: ok=4 changed=3'); out.push('server3: ok=4 changed=3'); res.json({ success: true, data: { output: out, success: true } }); });

// HEALTH
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API OK', timestamp: new Date().toISOString(), uptime: process.uptime() }));

app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
