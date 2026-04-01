// API Route - Security with Edge Security (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

let adUsers = [
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

const zeroTrustPolicies = [
  { id: 'zt-001', name: 'Verificação Explícita', description: 'Sempre autenticar e autorizar', status: 'implemented', coverage: 95 },
  { id: 'zt-002', name: 'Acesso com Menor Privilégio', description: 'Limitar acesso com JIT', status: 'implemented', coverage: 88 },
  { id: 'zt-003', name: 'Assumir Brecha', description: 'Minimizar blast radius', status: 'partial', coverage: 72 },
  { id: 'zt-004', name: 'Microsegmentação', description: 'Segmentar rede', status: 'in_progress', coverage: 45 }
];

// Edge Security - WAF Rules
const wafRules = [
  { id: 'waf-001', name: 'SQL Injection Block', pattern: /('|--|;|union|select|insert|update|delete|drop)/i, action: 'block', enabled: true, blockedCount: 0 },
  { id: 'waf-002', name: 'XSS Prevention', pattern: /(<script|javascript:|on\w+=)/i, action: 'block', enabled: true, blockedCount: 0 },
  { id: 'waf-003', name: 'Path Traversal', pattern: /\.\.\//g, action: 'block', enabled: true, blockedCount: 0 },
  { id: 'waf-004', name: 'Command Injection', pattern: /(;|\||&&|`)/g, action: 'block', enabled: true, blockedCount: 0 }
];

// Edge Security - Rate Limiting
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX = 100;

// Edge Security - Security Events Log
let securityEvents = [
  { id: 'evt-001', type: 'waf_block', rule: 'SQL Injection Block', ip: '192.168.1.100', timestamp: new Date(Date.now() - 3600000).toISOString(), payload: "' OR 1=1--" },
  { id: 'evt-002', type: 'rate_limit', ip: '10.0.0.50', timestamp: new Date(Date.now() - 1800000).toISOString(), requests: 150 },
  { id: 'evt-003', type: 'auth_failure', ip: '172.16.0.25', timestamp: new Date(Date.now() - 900000).toISOString(), user: 'admin' }
];

// DDoS Simulation State
let ddosState = { active: false, trafficMultiplier: 1, startTime: null };

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Auth-Token');
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '127.0.0.1';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { startTime: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    securityEvents.push({
      id: `evt-${uuidv4().slice(0,8)}`,
      type: 'rate_limit',
      ip,
      timestamp: new Date().toISOString(),
      requests: record.count
    });
    return { allowed: false, remaining: 0, resetTime: record.startTime + RATE_LIMIT_WINDOW };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetTime: record.startTime + RATE_LIMIT_WINDOW };
}

function checkWAF(payload, ip) {
  if (!payload) return { blocked: false };

  const payloadStr = JSON.stringify(payload).toLowerCase();

  for (const rule of wafRules) {
    if (rule.enabled && rule.pattern.test(payloadStr)) {
      rule.blockedCount++;
      securityEvents.push({
        id: `evt-${uuidv4().slice(0,8)}`,
        type: 'waf_block',
        rule: rule.name,
        ip,
        timestamp: new Date().toISOString(),
        payload: payloadStr.substring(0, 100)
      });
      return { blocked: true, rule: rule.name, message: `Bloqueado por: ${rule.name}` };
    }
  }

  return { blocked: false };
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const clientIP = getClientIP(req);
  const { action } = req.query;

  // Rate Limiting na borda
  const rateLimitResult = checkRateLimit(clientIP);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000));

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded - protegido pelo edge layer',
      edgeSecurity: 'Rate Limiting',
      retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
    });
  }

  // WAF na borda para POST/PUT
  if (['POST', 'PUT'].includes(req.method) && req.body) {
    const wafResult = checkWAF(req.body, clientIP);
    if (wafResult.blocked) {
      return res.status(403).json({
        success: false,
        message: wafResult.message,
        edgeSecurity: 'WAF Block'
      });
    }
  }

  try {
    switch (action) {
      case 'ad-users':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: adUsers });
        } else if (req.method === 'POST') {
          const { userId } = req.query;
          const user = adUsers.find(u => u.id === userId);
          if (!user) return res.status(404).json({ success: false });
          user.enabled = !user.enabled;
          res.status(200).json({ success: true, data: user });
        }
        break;

      case 'gpos':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: gpos });
        } else if (req.method === 'POST') {
          const { name, description, linkedTo, enabled } = req.body;
          const newGpo = {
            id: `gpo-${uuidv4().slice(0,8)}`,
            name,
            description,
            enabled: enabled !== false,
            linkedTo: linkedTo || 'Domain',
            settings: {}
          };
          gpos.push(newGpo);
          res.status(201).json({ success: true, data: newGpo });
        } else if (req.method === 'PUT') {
          const { gpoId } = req.query;
          const gpo = gpos.find(g => g.id === gpoId);
          if (!gpo) return res.status(404).json({ success: false });
          gpo.enabled = !gpo.enabled;
          res.status(200).json({ success: true, data: gpo });
        }
        break;

      case 'zero-trust':
        res.status(200).json({ success: true, data: zeroTrustPolicies });
        break;

      case 'waf':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: wafRules });
        } else if (req.method === 'POST') {
          const { testPayload } = req.body;
          const wafResult = checkWAF({ test: testPayload }, clientIP);
          res.status(200).json({
            success: true,
            data: {
              blocked: wafResult.blocked,
              rule: wafResult.rule,
              message: wafResult.blocked ? wafResult.message : 'Payload permitido'
            }
          });
        }
        break;

      case 'rate-limit':
        res.status(200).json({
          success: true,
          data: {
            limit: RATE_LIMIT_MAX,
            remaining: rateLimitResult.remaining,
            resetTime: rateLimitResult.resetTime,
            window: RATE_LIMIT_WINDOW / 1000
          }
        });
        break;

      case 'ddos':
        if (req.method === 'GET') {
          res.status(200).json({ success: true, data: ddosState });
        } else if (req.method === 'POST') {
          const { active } = req.body;
          ddosState = {
            active,
            trafficMultiplier: active ? Math.floor(Math.random() * 10) + 5 : 1,
            startTime: active ? new Date().toISOString() : null
          };
          if (active) {
            securityEvents.push({
              id: `evt-${uuidv4().slice(0,8)}`,
              type: 'ddos_detected',
              ip: 'multiple',
              timestamp: new Date().toISOString(),
              traffic: `${ddosState.trafficMultiplier}x normal`
            });
          }
          res.status(200).json({ success: true, data: ddosState });
        }
        break;

      case 'events':
        res.status(200).json({ success: true, data: securityEvents.slice(-50) });
        break;

      case 'dashboard':
        const wafBlocks = securityEvents.filter(e => e.type === 'waf_block').length;
        const rateLimits = securityEvents.filter(e => e.type === 'rate_limit').length;
        const authFailures = securityEvents.filter(e => e.type === 'auth_failure').length;

        res.status(200).json({
          success: true,
          data: {
            totalEvents: securityEvents.length,
            wafBlocks,
            rateLimits,
            authFailures,
            activeThreats: ddosState.active ? 1 : 0,
            wafRulesStatus: wafRules.map(r => ({ name: r.name, enabled: r.enabled, blocked: r.blockedCount })),
            recentEvents: securityEvents.slice(-10).reverse()
          }
        });
        break;

      default:
        res.status(400).json({ success: false, message: 'Ação não especificada' });
    }
  } catch (error) {
    console.error('Security API Error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}
