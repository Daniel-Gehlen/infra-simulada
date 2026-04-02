// API Route - Network (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

let firewallRules = [
  { id: 'fw-stealth', name: 'Check Point Stealth Rule', action: 'deny', protocol: 'any', port: 'any', source: 'any', destination: 'Gateway_Firewall', enabled: true, description: 'Bloqueia acesso direto ao Firewall' },
  { id: 'fw-001', name: 'Allow SSH', action: 'allow', protocol: 'TCP', port: 22, source: '192.168.1.0/24', destination: 'any', enabled: true },
  { id: 'fw-icmp', name: 'Allow ICMP Admin', action: 'allow', protocol: 'ICMP', port: 'any', source: '192.168.1.0/24', destination: 'any', enabled: true, description: 'Permite ping para troubleshooting interno' },
  { id: 'fw-002', name: 'Allow HTTP', action: 'allow', protocol: 'TCP', port: 80, source: 'any', destination: 'any', enabled: true },
  { id: 'fw-003', name: 'Allow HTTPS', action: 'allow', protocol: 'TCP', port: 443, source: 'any', destination: 'any', enabled: true },
  { id: 'fw-004', name: 'Block Telnet', action: 'deny', protocol: 'TCP', port: 23, source: 'any', destination: 'any', enabled: true },
  { id: 'fw-cleanup', name: 'Cleanup Rule', action: 'deny', protocol: 'any', port: 'any', source: 'any', destination: 'any', enabled: true, description: 'Drop Any Any final' }
];

let vpns = [
  { id: 'vpn-001', name: 'VPN-CORPORATIVA', type: 'IPSec', status: 'active', remoteEndpoint: '200.100.50.1', localSubnet: '192.168.1.0/24', remoteSubnet: '10.0.0.0/24', connectedUsers: 12, createdAt: new Date().toISOString() },
  { id: 'vpn-ra-01', name: 'Remote-Access-VPN', type: 'Check Point Mobile', status: 'active', remoteEndpoint: '0.0.0.0', localSubnet: '192.168.1.0/24', remoteSubnet: 'VPN_Pool', connectedUsers: 5, createdAt: new Date().toISOString() }
];

let vpnUsers = [
  { id: 'vpu-001', username: 'eng_checkpoint', name: 'Senior Security Engineer', accessLevel: 'admin', status: 'connected' },
  { id: 'vpu-002', username: 'dev_user', name: 'Developer', accessLevel: 'regular', status: 'disconnected' }
];

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

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
}

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { resource } = req.query;

  try {
    switch (resource) {
      case 'firewall':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: firewallRules });
        } else if (req.method === 'POST') {
          const { name, action, protocol, port, source, destination } = req.body;
          if (!name || !action || !protocol || !port) return res.status(400).json({ success: false });
          const nr = { id: `fw-${uuidv4().slice(0,8)}`, name, action, protocol, port: parseInt(port), source: source || 'any', destination: destination || 'any', enabled: true };
          firewallRules.push(nr);
          res.status(201).json({ success: true, data: nr });
        }
        break;
      case 'firewall-toggle':
        if (req.method === 'PUT') {
          const { id } = req.query;
          const rule = firewallRules.find(r => r.id === id);
          if (!rule) return res.status(404).json({ success: false });
          rule.enabled = !rule.enabled;
          res.status(200).json({ success: true, data: rule });
        }
        break;
      case 'firewall-delete':
        if (req.method === 'DELETE') {
          const { id } = req.query;
          const idx = firewallRules.findIndex(r => r.id === id);
          if (idx === -1) return res.status(404).json({ success: false });
          firewallRules.splice(idx, 1);
          res.status(200).json({ success: true });
        }
        break;
      case 'vpn':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: vpns });
        } else if (req.method === 'POST' && !req.query.id) {
          const nv = { id: `vpn-${uuidv4().slice(0,8)}`, name: req.body.name || 'Nova VPN', type: req.body.type || 'IPSec', status: 'inactive', remoteEndpoint: req.body.remoteEndpoint || '0.0.0.0', localSubnet: req.body.localSubnet || '192.168.0.0/24', remoteSubnet: req.body.remoteSubnet || '10.0.0.0/24', connectedUsers: 0, createdAt: new Date().toISOString() };
          vpns.push(nv);
          res.status(201).json({ success: true, data: nv });
        }
        break;
      case 'vpn-toggle':
        if (req.method === 'POST') {
          const { id } = req.query;
          const vpn = vpns.find(v => v.id === id);
          if (!vpn) return res.status(404).json({ success: false });
          vpn.status = vpn.status === 'active' ? 'inactive' : 'active';
          vpn.connectedUsers = vpn.status === 'active' ? Math.floor(Math.random() * 20) + 1 : 0;
          res.status(200).json({ success: true, data: vpn, message: `VPN ${vpn.status === 'active' ? 'ativada' : 'desativada'}` });
        }
        break;
      case 'vpn-users':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: vpnUsers });
        }
        break;
      case 'routes':
        res.status(200).json({ success: true, data: staticRoutes });
        break;
      case 'arp':
        res.status(200).json({ success: true, data: arpTable });
        break;
      default:
        res.status(400).json({ success: false, message: 'Recurso não especificado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
