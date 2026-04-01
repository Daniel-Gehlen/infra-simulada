// API Route - Virtualization (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

let vms = [
  { id: 'vm-001', name: 'VM-DNS-01', host: 'HOST-ESXI-01', vcpus: 2, ram: 4, disk: 50, status: 'running', os: 'Ubuntu Server 22.04', cloudProvider: null, createdAt: new Date().toISOString() },
  { id: 'vm-002', name: 'VM-DOCKER-01', host: 'HOST-ESXI-01', vcpus: 4, ram: 8, disk: 100, status: 'running', os: 'CentOS 8', cloudProvider: null, createdAt: new Date().toISOString() }
];

const resourcePool = { totalVcpus: 16, totalRam: 64, totalDisk: 1000, usedVcpus: 6, usedRam: 12, usedDisk: 150 };

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
      case 'vms':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: vms });
        } else if (req.method === 'POST') {
          const { name, host, vcpus, ram, disk, os } = req.body;
          const requestedVcpus = parseInt(vcpus) || 2;
          const requestedRam = parseInt(ram) || 4;
          const requestedDisk = parseInt(disk) || 50;

          if (requestedVcpus > (resourcePool.totalVcpus - resourcePool.usedVcpus)) {
            return res.status(400).json({ success: false, message: 'vCPUs insuficientes no pool' });
          }
          if (requestedRam > (resourcePool.totalRam - resourcePool.usedRam)) {
            return res.status(400).json({ success: false, message: 'RAM insuficiente no pool' });
          }

          const nv = {
            id: `vm-${uuidv4().slice(0,8)}`,
            name: name || `VM-${Date.now()}`,
            host: host || 'HOST-ESXI-01',
            vcpus: requestedVcpus,
            ram: requestedRam,
            disk: requestedDisk,
            status: 'running',
            os: os || 'Ubuntu Server 22.04',
            cloudProvider: null,
            createdAt: new Date().toISOString()
          };

          resourcePool.usedVcpus += nv.vcpus;
          resourcePool.usedRam += nv.ram;
          resourcePool.usedDisk += nv.disk;
          vms.push(nv);
          res.status(201).json({ success: true, data: nv, message: 'VM criada com sucesso' });
        }
        break;
      case 'pool':
        res.status(200).json({ success: true, data: resourcePool });
        break;
      case 'vm-delete':
        if (req.method === 'DELETE') {
          const { id } = req.query;
          const idx = vms.findIndex(v => v.id === id);
          if (idx === -1) return res.status(404).json({ success: false });
          const vm = vms[idx];
          resourcePool.usedVcpus -= vm.vcpus;
          resourcePool.usedRam -= vm.ram;
          resourcePool.usedDisk -= vm.disk;
          vms.splice(idx, 1);
          res.status(200).json({ success: true, message: 'VM removida' });
        }
        break;
      case 'vm-migrate':
        if (req.method === 'POST') {
          const { id } = req.query;
          const vm = vms.find(v => v.id === id);
          if (!vm) return res.status(404).json({ success: false });
          const hosts = ['HOST-ESXI-01', 'HOST-ESXI-02', 'HOST-ESXI-03'];
          vm.host = hosts[(hosts.indexOf(vm.host) + 1) % 3];
          res.status(200).json({ success: true, data: vm, message: `VM migrada para ${vm.host}` });
        }
        break;
      case 'vm-cloud':
        if (req.method === 'POST') {
          const { id } = req.query;
          const vm = vms.find(v => v.id === id);
          if (!vm) return res.status(404).json({ success: false });
          vm.cloudProvider = ['AWS', 'Azure', 'GCP'][Math.floor(Math.random() * 3)];
          res.status(200).json({ success: true, data: vm, message: `VM expandida para ${vm.cloudProvider}` });
        }
        break;
      case 'vm-power':
        if (req.method === 'POST') {
          const { id } = req.query;
          const vm = vms.find(v => v.id === id);
          if (!vm) return res.status(404).json({ success: false });
          vm.status = vm.status === 'running' ? 'stopped' : 'running';
          res.status(200).json({ success: true, data: vm, message: `VM ${vm.status === 'running' ? 'iniciada' : 'parada'}` });
        }
        break;
      default:
        res.status(400).json({ success: false, message: 'Recurso não especificado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
