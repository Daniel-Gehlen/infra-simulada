// API Route - Tickets (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

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

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
}

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { resource, id, action } = req.query;

  try {
    switch (resource) {
      case 'tickets':
        if (req.method === 'GET' && !id) {
          res.status(200).json({ success: true, data: tickets });
        } else if (req.method === 'GET' && id) {
          const ticket = tickets.find(t => t.id === id);
          if (!ticket) return res.status(404).json({ success: false });
          res.status(200).json({ success: true, data: ticket });
        } else if (req.method === 'POST' && !action) {
          const { title, description, category, priority, assignee, createdBy } = req.body;
          if (!title || !description) return res.status(400).json({ success: false });
          const nt = {
            id: `tkt-${uuidv4().slice(0,8)}`,
            title,
            description,
            category: category || 'general',
            priority: priority || 'medium',
            status: 'open',
            assignee: assignee || 'Não atribuído',
            createdBy: createdBy || 'Sistema',
            createdAt: new Date().toISOString(),
            comments: []
          };
          tickets.push(nt);
          res.status(201).json({ success: true, data: nt, message: 'Chamado criado' });
        } else if (req.method === 'PUT' && id) {
          const ticket = tickets.find(t => t.id === id);
          if (!ticket) return res.status(404).json({ success: false });
          Object.assign(ticket, req.body);
          res.status(200).json({ success: true, data: ticket, message: 'Chamado atualizado' });
        } else if (req.method === 'POST' && action === 'comments' && id) {
          const ticket = tickets.find(t => t.id === id);
          if (!ticket) return res.status(404).json({ success: false });
          const comment = {
            id: `cmt-${uuidv4().slice(0,8)}`,
            user: req.body.user || 'Sistema',
            text: req.body.text,
            timestamp: new Date().toISOString()
          };
          ticket.comments.push(comment);
          res.status(200).json({ success: true, data: ticket });
        }
        break;
      case 'assets':
        res.status(200).json({ success: true, data: assets });
        break;
      default:
        res.status(400).json({ success: false, message: 'Recurso não especificado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
