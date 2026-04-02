// API Route - Monitoring (Vercel/Cloudflare compatible)

let monitoringMetrics = { cpu: [], memory: [], network: [], disk: [] };
for (let i = 0; i < 20; i++) {
  monitoringMetrics.cpu.push({ time: i, value: Math.floor(Math.random() * 40) + 30 });
  monitoringMetrics.memory.push({ time: i, value: Math.floor(Math.random() * 30) + 50 });
  monitoringMetrics.network.push({ time: i, value: Math.floor(Math.random() * 100) + 50 });
  monitoringMetrics.disk.push({ time: i, value: Math.floor(Math.random() * 20) + 40 });
}

let alerts = [
  { id: 'alt-001', severity: 'warning', message: 'CPU do DB-PROD-01 acima de 75%', timestamp: new Date().toISOString(), resolved: true },
  { id: 'alt-002', severity: 'critical', message: 'Servidor FILE-SERVER offline', timestamp: new Date().toISOString(), resolved: true },
  { id: 'alt-003', severity: 'info', message: 'Backup noturno concluído com sucesso', timestamp: new Date().toISOString(), resolved: true }
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
      case 'metrics':
        // Simular atualização de métricas
        monitoringMetrics.cpu.push({ time: Date.now(), value: Math.floor(Math.random() * 40) + 30 });
        monitoringMetrics.memory.push({ time: Date.now(), value: Math.floor(Math.random() * 30) + 50 });
        monitoringMetrics.network.push({ time: Date.now(), value: Math.floor(Math.random() * 100) + 50 });
        monitoringMetrics.disk.push({ time: Date.now(), value: Math.floor(Math.random() * 20) + 40 });
        if (monitoringMetrics.cpu.length > 50) {
          monitoringMetrics.cpu.shift();
          monitoringMetrics.memory.shift();
          monitoringMetrics.network.shift();
          monitoringMetrics.disk.shift();
        }
        res.status(200).json({ success: true, data: monitoringMetrics });
        break;
      case 'alerts':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: alerts });
        } else if (req.method === 'POST') {
          const { id } = req.query;
          const alert = alerts.find(a => a.id === id);
          if (!alert) return res.status(404).json({ success: false });
          alert.resolved = true;
          res.status(200).json({ success: true, data: alert });
        }
        break;
      case 'health':
        res.status(200).json({
          success: true,
          data: {
            servers: { online: 4, total: 4 },
            vms: { running: 2, total: 2 },
            alerts: {
              critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
              warning: alerts.filter(a => a.severity === 'warning' && !a.resolved).length
            },
            overallStatus: alerts.filter(a => a.severity === 'critical' && !a.resolved).length > 0 ? 'critical' : 'healthy'
          }
        });
        break;
      default:
        res.status(400).json({ success: false, message: 'Recurso não especificado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
