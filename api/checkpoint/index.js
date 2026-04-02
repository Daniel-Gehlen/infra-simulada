// API Route - Check Point Firewall Administration (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

// Dados simulados de firewall Check Point
let checkpointFirewall = {
  version: 'R81.10',
  status: 'active',
  lastPolicyInstall: new Date().toISOString(),
  connectedGateways: [
    { id: 'gw-001', name: 'GW-PRINCIPAL', ip: '192.168.1.1', status: 'connected', version: 'R81.10', policy: 'Standard_V1' },
    { id: 'gw-002', name: 'GW-FILIAL', ip: '10.0.0.1', status: 'connected', version: 'R81.10', policy: 'Standard_V1' }
  ],
  policies: [
    { id: 'pol-001', name: 'Standard_V1', type: 'Access', status: 'installed', lastInstall: new Date().toISOString() },
    { id: 'pol-002', name: 'NAT_Policy', type: 'NAT', status: 'installed', lastInstall: new Date().toISOString() },
    { id: 'pol-003', name: 'Threat_Prevention', type: 'Threat Prevention', status: 'installed', lastInstall: new Date().toISOString() }
  ],
  rules: [
    { id: 'rule-001', name: 'Allow_HTTPS', source: 'Any', destination: 'Any', service: 'HTTPS', action: 'Accept', track: 'Log', position: 1, enabled: true },
    { id: 'rule-002', name: 'Allow_HTTP', source: 'Any', destination: 'Any', service: 'HTTP', action: 'Accept', track: 'Log', position: 2, enabled: true },
    { id: 'rule-003', name: 'Allow_DNS', source: 'Any', destination: 'DNS_Servers', service: 'DNS', action: 'Accept', track: 'Log', position: 3, enabled: true },
    { id: 'rule-004', name: 'Block_Telnet', source: 'Any', destination: 'Any', service: 'Telnet', action: 'Drop', track: 'Log', position: 4, enabled: true },
    { id: 'rule-005', name: 'Cleanup_Rule', source: 'Any', destination: 'Any', service: 'Any', action: 'Drop', track: 'Log', position: 5, enabled: true }
  ],
  natRules: [
    { id: 'nat-001', name: 'Hide_NAT_LAN', originalSource: '192.168.1.0/24', translatedSource: '200.100.50.1', type: 'Hide', enabled: true },
    { id: 'nat-002', name: 'Static_NAT_Server', originalSource: '192.168.1.10', translatedSource: '200.100.50.10', type: 'Static', enabled: true }
  ],
  backups: [
    { id: 'bkp-001', name: 'Backup_20260402', timestamp: new Date().toISOString(), size: '45.2 MB', status: 'completed' }
  ]
};

let checkpointLogs = [
  { id: 'log-001', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Accept', source: '192.168.1.100', destination: '8.8.8.8', service: 'DNS', rule: 'Allow_DNS', gateway: 'GW-PRINCIPAL' },
  { id: 'log-002', timestamp: new Date(Date.now() - 3000000).toISOString(), action: 'Accept', source: '192.168.1.50', destination: 'google.com', service: 'HTTPS', rule: 'Allow_HTTPS', gateway: 'GW-PRINCIPAL' },
  { id: 'log-003', timestamp: new Date(Date.now() - 2400000).toISOString(), action: 'Drop', source: '10.0.0.100', destination: '192.168.1.10', service: 'Telnet', rule: 'Block_Telnet', gateway: 'GW-PRINCIPAL' }
];

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Auth-Token');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { resource, action, id } = req.query;

  try {
    switch (resource) {
      case 'status':
        if (req.method === 'GET') {
          res.status(200).json({
            success: true,
            data: {
              version: checkpointFirewall.version,
              status: checkpointFirewall.status,
              lastPolicyInstall: checkpointFirewall.lastPolicyInstall,
              connectedGateways: checkpointFirewall.connectedGateways.length,
              activePolicies: checkpointFirewall.policies.filter(p => p.status === 'installed').length,
              totalRules: checkpointFirewall.rules.length,
              enabledRules: checkpointFirewall.rules.filter(r => r.enabled).length
            }
          });
        }
        break;

      case 'gateways':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: checkpointFirewall.connectedGateways });
        }
        break;

      case 'policies':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: checkpointFirewall.policies });
        } else if (req.method === 'POST' && action === 'install') {
          const { policyId, gatewayId } = req.body;
          const policy = checkpointFirewall.policies.find(p => p.id === policyId);
          if (policy) {
            policy.lastInstall = new Date().toISOString();
            checkpointFirewall.lastPolicyInstall = new Date().toISOString();
            res.status(200).json({ success: true, message: `Política ${policy.name} instalada com sucesso`, data: policy });
          } else {
            res.status(404).json({ success: false, message: 'Política não encontrada' });
          }
        }
        break;

      case 'rules':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: checkpointFirewall.rules });
        } else if (req.method === 'POST') {
          const { name, source, destination, service, action: ruleAction, track } = req.body;
          if (!name || !source || !destination || !service) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios: name, source, destination, service' });
          }
          const newRule = {
            id: `rule-${uuidv4().slice(0, 8)}`,
            name,
            source,
            destination,
            service,
            action: ruleAction || 'Accept',
            track: track || 'Log',
            position: checkpointFirewall.rules.length + 1,
            enabled: true
          };
          checkpointFirewall.rules.push(newRule);
          res.status(201).json({ success: true, data: newRule, message: 'Regra criada com sucesso' });
        } else if (req.method === 'PUT' && action === 'toggle') {
          const rule = checkpointFirewall.rules.find(r => r.id === id);
          if (rule) {
            rule.enabled = !rule.enabled;
            res.status(200).json({ success: true, data: rule, message: `Regra ${rule.enabled ? 'habilitada' : 'desabilitada'}` });
          } else {
            res.status(404).json({ success: false, message: 'Regra não encontrada' });
          }
        } else if (req.method === 'DELETE') {
          const idx = checkpointFirewall.rules.findIndex(r => r.id === id);
          if (idx !== -1) {
            const deleted = checkpointFirewall.rules.splice(idx, 1);
            res.status(200).json({ success: true, data: deleted[0], message: 'Regra removida com sucesso' });
          } else {
            res.status(404).json({ success: false, message: 'Regra não encontrada' });
          }
        }
        break;

      case 'nat':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: checkpointFirewall.natRules });
        }
        break;

      case 'logs':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: checkpointLogs.slice(-50) });
        }
        break;

      case 'backup':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: checkpointFirewall.backups });
        } else if (req.method === 'POST') {
          const newBackup = {
            id: `bkp-${uuidv4().slice(0, 8)}`,
            name: `Backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
            timestamp: new Date().toISOString(),
            size: `${(Math.random() * 50 + 30).toFixed(1)} MB`,
            status: 'completed'
          };
          checkpointFirewall.backups.push(newBackup);
          res.status(201).json({ success: true, data: newBackup, message: 'Backup criado com sucesso' });
        }
        break;

      default:
        res.status(400).json({ success: false, message: 'Recurso não especificado' });
    }
  } catch (error) {
    console.error('Check Point API Error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}
