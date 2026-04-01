// API Route - Backup (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

let backups = [
  { id: 'bkp-001', name: 'Backup Full - DC-PRINCIPAL', type: 'full', source: 'DC-PRINCIPAL', status: 'completed', size: '45 GB', duration: '02:15:30', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'bkp-002', name: 'Backup Incremental - DB-PROD', type: 'incremental', source: 'DB-PROD-01', status: 'completed', size: '12 GB', duration: '00:45:00', createdAt: new Date(Date.now() - 43200000).toISOString() }
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

  const { action, id } = req.query;

  try {
    if (req.method === 'GET') {
      res.status(200).json({ success: true, data: backups });
    } else if (req.method === 'POST') {
      if (action === 'restore' && id) {
        const backup = backups.find(b => b.id === id);
        if (!backup) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, message: `Restauração iniciada: ${backup.name}` });
      } else {
        const { name, type, source } = req.body;
        const nb = {
          id: `bkp-${uuidv4().slice(0,8)}`,
          name: name || `Backup ${new Date().toLocaleString()}`,
          type: type || 'full',
          source: source || 'DC-PRINCIPAL',
          status: 'running',
          size: '-',
          duration: '-',
          createdAt: new Date().toISOString()
        };
        backups.push(nb);
        // Simular conclusão após 3 segundos
        setTimeout(() => {
          nb.status = 'completed';
          nb.size = `${Math.floor(Math.random() * 50) + 10} GB`;
          nb.duration = `00:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
        }, 3000);
        res.status(201).json({ success: true, data: nb, message: 'Backup iniciado' });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
