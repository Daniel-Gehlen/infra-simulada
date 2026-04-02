// API Route - Security Policies Management (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

// Políticas de segurança
let securityPolicies = [
  {
    id: 'pol-001',
    name: 'Política de Senha Forte',
    description: 'Exige senha com 12 caracteres, caracteres especiais e números',
    category: 'password',
    enabled: true,
    settings: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      historyCount: 5
    },
    coverage: 95,
    lastReview: new Date(Date.now() - 86400000 * 30).toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 60).toISOString(),
    compliance: 'LGPD'
  },
  {
    id: 'pol-002',
    name: 'Autenticação Multifator (MFA)',
    description: 'Exige autenticação de dois fatores para acesso remoto',
    category: 'authentication',
    enabled: true,
    settings: {
      requiredForRemoteAccess: true,
      requiredForAdmin: true,
      allowedMethods: ['totp', 'sms', 'push'],
      gracePeriod: 7
    },
    coverage: 88,
    lastReview: new Date(Date.now() - 86400000 * 15).toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 75).toISOString(),
    compliance: 'ISO 27001'
  },
  {
    id: 'pol-003',
    name: 'Controle de Acesso Baseado em Função (RBAC)',
    description: 'Acesso baseado na função do usuário na organização',
    category: 'access_control',
    enabled: true,
    settings: {
      defaultRole: 'viewer',
      roles: ['admin', 'operator', 'viewer', 'auditor'],
      inheritPermissions: true,
      reviewInterval: 90
    },
    coverage: 92,
    lastReview: new Date(Date.now() - 86400000 * 20).toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 70).toISOString(),
    compliance: 'ISO 27001'
  },
  {
    id: 'pol-004',
    name: 'Criptografia de Dados em Trânsito',
    description: 'Exige TLS 1.3 para todas as comunicações',
    category: 'encryption',
    enabled: true,
    settings: {
      minTLSVersion: '1.3',
      allowedCiphers: ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256'],
      certificateValidity: 365,
      autoRenewal: true
    },
    coverage: 98,
    lastReview: new Date(Date.now() - 86400000 * 10).toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 80).toISOString(),
    compliance: 'PCI DSS'
  },
  {
    id: 'pol-005',
    name: 'Registro e Auditoria',
    description: 'Mantém logs de todas as atividades por 180 dias',
    category: 'logging',
    enabled: true,
    settings: {
      retentionDays: 180,
      logLevel: 'info',
      includeUserData: true,
      includeSystemData: true,
      realTimeAlerts: true
    },
    coverage: 100,
    lastReview: new Date(Date.now() - 86400000 * 5).toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 85).toISOString(),
    compliance: 'LGPD'
  },
  {
    id: 'pol-006',
    name: 'Segmentação de Rede',
    description: 'Separação de ambientes por VLANs e firewall',
    category: 'network',
    enabled: true,
    settings: {
      segmentationLevel: 'strict',
      allowedCrossZoneTraffic: ['monitoring', 'backup'],
      defaultAction: 'deny',
      loggingEnabled: true
    },
    coverage: 85,
    lastReview: new Date(Date.now() - 86400000 * 25).toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 65).toISOString(),
    compliance: 'ISO 27001'
  }
];

// Histórico de revisões
let policyReviews = [
  {
    id: 'rev-001',
    policyId: 'pol-001',
    reviewer: 'João Silva',
    date: new Date(Date.now() - 86400000 * 30).toISOString(),
    findings: 'Política em conformidade',
    recommendations: 'Nenhuma alteração necessária',
    status: 'approved'
  },
  {
    id: 'rev-002',
    policyId: 'pol-002',
    reviewer: 'Ana Costa',
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    findings: 'Cobertura abaixo da meta',
    recommendations: 'Estender MFA para todos os usuários',
    status: 'pending'
  }
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
      case 'policies':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: securityPolicies });
        } else if (req.method === 'POST') {
          const { name, description, category, settings, compliance } = req.body;
          if (!name || !description || !category) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios: name, description, category' });
          }
          const newPolicy = {
            id: `pol-${uuidv4().slice(0, 8)}`,
            name,
            description,
            category,
            enabled: true,
            settings: settings || {},
            coverage: 0,
            lastReview: new Date().toISOString(),
            nextReview: new Date(Date.now() + 86400000 * 90).toISOString(),
            compliance: compliance || 'Interno'
          };
          securityPolicies.push(newPolicy);
          res.status(201).json({ success: true, data: newPolicy, message: 'Política criada com sucesso' });
        } else if (req.method === 'PUT' && action === 'toggle') {
          const policy = securityPolicies.find(p => p.id === id);
          if (policy) {
            policy.enabled = !policy.enabled;
            res.status(200).json({ success: true, data: policy, message: `Política ${policy.enabled ? 'habilitada' : 'desabilitada'}` });
          } else {
            res.status(404).json({ success: false, message: 'Política não encontrada' });
          }
        } else if (req.method === 'PUT') {
          const policy = securityPolicies.find(p => p.id === id);
          if (policy) {
            Object.assign(policy, req.body);
            res.status(200).json({ success: true, data: policy, message: 'Política atualizada' });
          } else {
            res.status(404).json({ success: false, message: 'Política não encontrada' });
          }
        } else if (req.method === 'DELETE') {
          const idx = securityPolicies.findIndex(p => p.id === id);
          if (idx !== -1) {
            securityPolicies.splice(idx, 1);
            res.status(200).json({ success: true, message: 'Política removida' });
          } else {
            res.status(404).json({ success: false, message: 'Política não encontrada' });
          }
        }
        break;

      case 'reviews':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: policyReviews });
        } else if (req.method === 'POST') {
          const { policyId, reviewer, findings, recommendations, status } = req.body;
          const newReview = {
            id: `rev-${uuidv4().slice(0, 8)}`,
            policyId,
            reviewer: reviewer || 'Sistema',
            date: new Date().toISOString(),
            findings,
            recommendations,
            status: status || 'pending'
          };
          policyReviews.push(newReview);

          const policy = securityPolicies.find(p => p.id === policyId);
          if (policy) {
            policy.lastReview = new Date().toISOString();
            policy.nextReview = new Date(Date.now() + 86400000 * 90).toISOString();
          }

          res.status(201).json({ success: true, data: newReview, message: 'Revisão registrada' });
        }
        break;

      case 'compliance':
        if (req.method === 'GET') {
          const complianceReport = {
            totalPolicies: securityPolicies.length,
            enabledPolicies: securityPolicies.filter(p => p.enabled).length,
            averageCoverage: Math.round(securityPolicies.reduce((sum, p) => sum + p.coverage, 0) / securityPolicies.length),
            byCompliance: {
              'LGPD': securityPolicies.filter(p => p.compliance === 'LGPD').length,
              'ISO 27001': securityPolicies.filter(p => p.compliance === 'ISO 27001').length,
              'PCI DSS': securityPolicies.filter(p => p.compliance === 'PCI DSS').length,
              'Interno': securityPolicies.filter(p => p.compliance === 'Interno').length
            },
            byCategory: {
              password: securityPolicies.filter(p => p.category === 'password').length,
              authentication: securityPolicies.filter(p => p.category === 'authentication').length,
              access_control: securityPolicies.filter(p => p.category === 'access_control').length,
              encryption: securityPolicies.filter(p => p.category === 'encryption').length,
              logging: securityPolicies.filter(p => p.category === 'logging').length,
              network: securityPolicies.filter(p => p.category === 'network').length
            },
            pendingReviews: policyReviews.filter(r => r.status === 'pending').length
          };
          res.status(200).json({ success: true, data: complianceReport });
        }
        break;

      case 'optimize':
        if (req.method === 'POST') {
          const optimizations = securityPolicies.map(p => ({
            policyId: p.id,
            policyName: p.name,
            currentCoverage: p.coverage,
            recommendations: p.coverage < 90 ? ['Aumentar cobertura', 'Revisar configurações'] : ['Manter configurações atuais'],
            priority: p.coverage < 80 ? 'high' : p.coverage < 90 ? 'medium' : 'low'
          }));
          res.status(200).json({ success: true, data: optimizations });
        }
        break;

      default:
        res.status(400).json({ success: false, message: 'Recurso não especificado' });
    }
  } catch (error) {
    console.error('Security Policies API Error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}
