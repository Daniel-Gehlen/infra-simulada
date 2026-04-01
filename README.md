# 🏗️ Infra Simulada - Plataforma de Gerenciamento de Infraestrutura

Uma plataforma completa para simular e gerenciar infraestrutura de TI, com foco em segurança na borda (edge security) e deploy serverless.

## 🚀 Tecnologias

- **Frontend**: React, Tailwind CSS, Recharts, React Router, React Joyride
- **Backend**: Node.js (Serverless Functions)
- **Deploy**: Vercel / Cloudflare Pages
- **Segurança**: WAF simulado, Rate Limiting, DDoS Protection, Zero Trust

## 📦 Estrutura do Projeto

```
infra-simulada/
├── api/                    # API Routes (Vercel/Cloudflare)
│   ├── health.js
│   ├── servers/
│   ├── network/
│   ├── virtualization/
│   ├── monitoring/
│   ├── backup/
│   ├── scripts/
│   ├── tickets/
│   ├── security/
│   └── orchestration/
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── modules/
│   │   │   └── edgeSecurity/  # Módulo Edge Security
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
├── vercel.json             # Configuração Vercel
└── README.md
```

## 🛡️ Módulo Edge Security

O módulo Edge Security implementa conceitos de segurança na borda:

### WAF (Web Application Firewall)
- Detecção de SQL Injection
- Prevenção de XSS (Cross-Site Scripting)
- Bloqueio de Path Traversal
- Proteção contra Command Injection

### Rate Limiting
- Limite de 100 requisições por minuto por IP
- Headers de resposta: X-RateLimit-Limit, X-RateLimit-Remaining
- Retorno HTTP 429 quando limite excedido

### DDoS Protection
- Simulação de detecção de anomalias de tráfego
- Mitigação automática de ataques
- Dashboard com estatísticas em tempo real

### Zero Trust
- Verificação de identidade na borda (X-Auth-Token)
- Políticas de acesso simuladas
- Cloudflare Access-like authentication

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta na Vercel (gratuita)
- Vercel CLI instalado: `npm i -g vercel`

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/infra-simulada.git
cd infra-simulada
```

2. **Instale as dependências**
```bash
cd frontend
npm install
cd ..
```

3. **Deploy com Vercel CLI**
```bash
vercel
```

4. **Ou deploy via GitHub**
   - Conecte seu repositório GitHub na Vercel
   - A Vercel detectará automaticamente a configuração do `vercel.json`
   - O deploy será automático a cada push

### URL de Produção
Após o deploy, sua aplicação estará disponível em:
```
https://seu-projeto.vercel.app
```

## 🚀 Deploy na Cloudflare Pages

### Pré-requisitos
- Conta na Cloudflare (gratuita)
- Wrangler CLI instalado: `npm i -g wrangler`

### Passos

1. **Build do frontend**
```bash
cd frontend
npm run build
cd ..
```

2. **Deploy com Wrangler**
```bash
wrangler pages project create infra-simulada
wrangler pages deploy frontend/dist --project-name=infra-simulada
```

3. **Ou deploy via Dashboard Cloudflare**
   - Acesse Cloudflare Pages
   - Conecte seu repositório GitHub
   - Configure:
     - Build command: `cd frontend && npm install && npm run build`
     - Build output directory: `frontend/dist`

### URL de Produção
Após o deploy, sua aplicação estará disponível em:
```
https://infra-simulada.pages.dev
```

## 🔧 Desenvolvimento Local

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse: http://localhost:5173

### API (simulada)
As API routes funcionam tanto em produção quanto em desenvolvimento local com Vercel CLI:
```bash
vercel dev
```

## 🔐 Testando a Segurança na Borda

### WAF
1. Acesse o módulo "🛡️ Edge Security"
2. Vá para a aba "🔥 WAF"
3. Clique nos botões de payload malicioso (SQL Injection, XSS, etc)
4. Observe o bloqueio na interface

### Rate Limiting
1. Acesse a aba "⚡ Rate Limit"
2. Observe o contador de requisições restantes
3. Faça múltiplas requisições para ver o limite

### DDoS Simulation
1. Acesse a aba "🛡️ DDoS"
2. Clique em "Ativar Simulação DDoS"
3. Observe os cards de detecção e mitigação

### Zero Trust
1. Acesse a aba "🔐 Zero Trust"
2. Observe as políticas de acesso
3. Veja a explicação sobre autenticação na borda

## 📊 Módulos Disponíveis

1. **🖥️ Servidores** - Gerenciamento de servidores Windows/Linux
2. **🌐 Rede** - Firewall, VPN, Rotas e ARP
3. **☁️ Virtualização** - VMs e pool de recursos
4. **📈 Monitoramento** - Métricas e alertas em tempo real
5. **💾 Backup** - Gestão de backups e restaurações
6. **🤖 Scripts** - Automação com PowerShell, Bash e Python
7. **🎫 Chamados** - Sistema de gestão de incidentes
8. **🔐 Segurança** - AD, GPOs e Zero Trust
9. **🔄 Orquestração** - Terraform e Ansible simulados
10. **🛡️ Edge Security** - WAF, Rate Limiting, DDoS, Zero Trust

## 🎓 Tour Interativo

O sistema inclui um tour interativo (React Joyride) que explica cada módulo. Clique no ícone de "?" no header para iniciar.

## 📝 Variáveis de Ambiente

Nenhuma variável de ambiente é necessária para o funcionamento básico. Para persistência real entre deploys, configure:

```
UPSTASH_REDIS_URL=your_redis_url (opcional)
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit as mudanças: `git commit -m 'feat: nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

MIT License

## 👨‍💻 Autor

Daniel Gehlen - [GitHub](https://github.com/Daniel-Gehlen)

---

**Nota**: Este é um projeto educacional para demonstração de conceitos de infraestrutura e segurança na borda. Os dados são simulados e não persistem entre deploys na versão gratuita.
