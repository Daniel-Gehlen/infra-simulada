// API Route - Servers (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

let servers = [
  { id: 'srv-001', name: 'DC-PRINCIPAL', os: 'Windows Server 2022', ip: '192.168.1.10', status: 'online', cpu: 45, ram: 62, disk: 55, role: 'Domain Controller', location: 'Data Center A', createdAt: new Date().toISOString() },
  { id: 'srv-002', name: 'WEB-SERVER-01', os: 'Ubuntu 22.04 LTS', ip: '192.168.1.20', status: 'online', cpu: 32, ram: 48, disk: 40, role: 'Web Server', location: 'Data Center A', createdAt: new Date().toISOString() },
  { id: 'srv-003', name: 'DB-PROD-01', os: 'Windows Server 2019', ip: '192.168.1.30', status: 'online', cpu: 78, ram: 85, disk: 72, role: 'Database Server', location: 'Data Center B', createdAt: new Date().toISOString() },
  { id: 'srv-004', name: 'FILE-SERVER', os: 'Windows Server 2022', ip: '192.168.1.40', status: 'offline', cpu: 0, ram: 0, disk: 65, role: 'File Server', location: 'Data Center A', createdAt: new Date().toISOString() }
];

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
}

function checkAuth(req) {
  const authToken = req.headers['x-auth-token'];
  return authToken === 'edge-token-2024' || authToken === undefined;
}

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (!checkAuth(req)) {
    return res.status(401).json({ success: false, message: 'Acesso negado', edgeSecurity: 'Zero Trust Policy Violation' });
  }
  try {
    switch (req.method) {
      case 'GET':
        servers.forEach(srv => {
          if (srv.status === 'online') {
            srv.cpu = Math.min(100, Math.max(0, srv.cpu + (Math.random() * 10 - 5)));
            srv.ram = Math.min(100, Math.max(0, srv.ram + (Math.random() * 8 - 4)));
          }
        });
        res.status(200).json({ success: true, data: servers });
        break;
      case 'POST':
        const { name, os, ip, role, location } = req.body;
        if (!name || !os || !ip) return res.status(400).json({ success: false, message: 'Campos obrigatórios' });
        const ns = { id: `srv-${uuidv4().slice(0,8)}`, name, os, ip, status: 'offline', cpu: 0, ram: 0, disk: Math.floor(Math.random()*30)+20, role: role||'Generic', location: location||'Data Center A', createdAt: new Date().toISOString() };
        servers.push(ns);
        res.status(201).json({ success: true, data: ns, message: 'Criado' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
