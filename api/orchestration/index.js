// API Route - Orchestration (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

const terraformState = {
  resources: [
    { type: 'aws_instance', name: 'web_server_1', provider: 'AWS', status: 'created', id: 'i-0abc123def456' },
    { type: 'aws_vpc', name: 'main_vpc', provider: 'AWS', status: 'created', id: 'vpc-0abc123def456' },
    { type: 'azurerm_resource_group', name: 'rg_production', provider: 'Azure', status: 'created', id: '/subscriptions/.../resourceGroups/rg-prod' }
  ]
};

const ansiblePlaybooks = [
  { id: 'pb-001', name: 'Instalar Nginx', description: 'Instala e configura Nginx em servidores web', tasks: ['Instalar pacote', 'Configurar vhost', 'Iniciar serviço'], targets: ['webservers'] },
  { id: 'pb-002', name: 'Atualizar Sistema', description: 'Executa update e upgrade em servidores Linux', tasks: ['apt update', 'apt upgrade -y', 'reboot se necessário'], targets: ['allservers'] },
  { id: 'pb-003', name: 'Configurar Monitoramento', description: 'Instala agente Zabbix', tasks: ['Download agente', 'Configurar zabbix_agentd', 'Iniciar serviço'], targets: ['monitored_hosts'] }
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

  const { resource, action, id } = req.query;

  try {
    switch (resource) {
      case 'terraform':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: terraformState });
        } else if (req.method === 'POST' && action === 'plan') {
          res.status(200).json({
            success: true,
            data: {
              output: [
                'Terraform will perform the following actions:',
                '',
                `  + resource "${terraformState.resources[0].type}" "${terraformState.resources[0].name}"`,
                '',
                `Plan: ${terraformState.resources.length} to add, 0 to change, 0 to destroy.`
              ],
              planSummary: { add: terraformState.resources.length, change: 0, destroy: 0 }
            }
          });
        } else if (req.method === 'POST' && action === 'apply') {
          res.status(200).json({
            success: true,
            data: {
              output: [
                'aws_vpc.main_vpc: Creating...',
                'aws_vpc.main_vpc: Creation complete',
                'aws_instance.web_server_1: Creating...',
                'aws_instance.web_server_1: Creation complete',
                '',
                'Apply complete! Resources: 3 added, 0 changed, 0 destroyed.'
              ],
              success: true
            }
          });
        }
        break;
      case 'ansible':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: ansiblePlaybooks });
        } else if (req.method === 'POST' && action === 'run' && id) {
          const pb = ansiblePlaybooks.find(p => p.id === id);
          if (!pb) return res.status(404).json({ success: false });

          const out = [`PLAY [${pb.targets.join(', ')}]`, '', 'TASK [Gathering Facts]', 'ok: [server1]', 'ok: [server2]', 'ok: [server3]', ''];
          pb.tasks.forEach(t => {
            out.push(`TASK [${t}]`);
            out.push('changed: [server1]');
            out.push('changed: [server2]');
            out.push('changed: [server3]');
            out.push('');
          });
          out.push('PLAY RECAP');
          out.push('server1: ok=4 changed=3');
          out.push('server2: ok=4 changed=3');
          out.push('server3: ok=4 changed=3');

          res.status(200).json({ success: true, data: { output: out, success: true } });
        }
        break;
      default:
        res.status(400).json({ success: false, message: 'Recurso não especificado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
