// API Route - Scripts (Vercel/Cloudflare compatible)
import { v4 as uuidv4 } from 'uuid';

let scripts = [
  { id: 'scr-001', name: 'Verificar Espaço em Disco', language: 'powershell', code: 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, Used, Free', description: 'Lista o espaço utilizado e livre em todos os drives' },
  { id: 'scr-002', name: 'Listar Processos', language: 'bash', code: 'ps aux --sort=-%cpu | head -20', description: 'Lista os 20 processos que mais consomem CPU' },
  { id: 'scr-003', name: 'Verificar Conectividade', language: 'python', code: 'import subprocess\nhosts = ["8.8.8.8", "google.com", "192.168.1.1"]\nfor host in hosts:\n    result = subprocess.run(["ping", "-c", "1", host], capture_output=True)\n    print(f"{host}: UP" if result.returncode == 0 else f"{host}: DOWN")', description: 'Verifica conectividade com múltiplos hosts' }
];

function simulateScriptExecution(language) {
  const outputs = {
    powershell: ['PS C:\\> Executando script...', 'Name    Used(GB)    Free(GB)', '----    --------    --------', 'C:      120.5       79.5', 'D:      450.2       549.8', '', 'Script executado com sucesso!'],
    bash: ['Executando script Bash...', 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND', 'root         1  0.0  0.1 169444 13204 ?        Ss   10:00   0:02 /sbin/init', 'www-data  1234  2.5  1.2 524288 98304 ?        S    10:15   0:45 nginx: worker', '', 'Script concluído.'],
    python: ['Executando script Python...', '8.8.8.8: UP', 'google.com: UP', '192.168.1.1: UP', '', 'Processo finalizado com código 0']
  };
  return outputs[language] || outputs.bash;
}

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
      res.status(200).json({ success: true, data: scripts });
    } else if (req.method === 'POST') {
      if (action === 'execute') {
        const { language, code } = req.body;
        if (!language) return res.status(400).json({ success: false, message: 'Linguagem não especificada' });
        res.status(200).json({
          success: true,
          data: {
            output: simulateScriptExecution(language),
            exitCode: 0,
            executionTime: `${Math.floor(Math.random() * 2000) + 100}ms`
          }
        });
      } else {
        const { name, language, code, description } = req.body;
        if (!name || !language || !code) return res.status(400).json({ success: false, message: 'Campos obrigatórios' });
        const ns = {
          id: `scr-${uuidv4().slice(0,8)}`,
          name,
          language,
          code,
          description: description || ''
        };
        scripts.push(ns);
        res.status(201).json({ success: true, data: ns, message: 'Script salvo' });
      }
    } else if (req.method === 'DELETE') {
      const idx = scripts.findIndex(s => s.id === id);
      if (idx === -1) return res.status(404).json({ success: false });
      scripts.splice(idx, 1);
      res.status(200).json({ success: true, message: 'Script removido' });
    } else {
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
}
