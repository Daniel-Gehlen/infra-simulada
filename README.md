# 🏗️ Infra Simulada - Simulador de Infraestrutura de TI

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Descrição

**Infra Simulada** é uma aplicação web full-stack educacional que simula um ambiente completo de infraestrutura de TI. Projetado para analistas e estudantes de infraestrutura, oferece hands-on experience com:

- 🖥️ Gerenciamento de servidores Windows/Linux
- 🌐 Configuração de redes, firewalls e VPNs
- ☁️ Virtualização e Cloud Computing
- 📊 Monitoramento com gráficos em tempo real
- 💾 Backup e Recuperação de Desastres
- 🤖 Automação com Scripts (PowerShell, Bash, Python)
- 🎫 Sistema de Chamados estilo GLPI
- 🔐 Segurança (Active Directory, GPOs, Zero Trust)
- 🔄 Orquestração (Terraform, Ansible simulados)

## 🚀 Instruções de Instalação e Execução

### Pré-requisitos

- **Node.js** 18+ instalado
- **npm** 9+ ou **yarn** 1.22+
- Navegador moderno (Chrome, Firefox, Edge)

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/infra-simulada.git
cd infra-simulada

# 2. Instalar dependências do backend
cd backend
npm install

# 3. Instalar dependências do frontend
cd ../frontend
npm install

# 4. Voltar para a raiz e instalar dependências do projeto
cd ..
npm install

# 5. Iniciar a aplicação (backend + frontend simultaneamente)
npm run dev
```

### Acessando a Aplicação

Após executar `npm run dev`, a aplicação estará disponível em:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📁 Estrutura do Projeto

```
infra-simulada/
├── backend/
│   ├── index.js              # Servidor Express principal
│   ├── routes/               # Rotas da API
│   │   ├── servers.js
│   │   ├── network.js
│   │   ├── virtualization.js
│   │   ├── monitoring.js
│   │   ├── backup.js
│   │   ├── scripts.js
│   │   ├── tickets.js
│   │   ├── security.js
│   │   └── orchestration.js
│   ├── services/             # Lógica de negócio
│   │   ├── serverService.js
│   │   ├── networkService.js
│   │   ├── vmService.js
│   │   ├── monitoringService.js
│   │   ├── backupService.js
│   │   ├── scriptService.js
│   │   ├── ticketService.js
│   │   ├── securityService.js
│   │   └── orchestrationService.js
│   └── data/                 # Dados iniciais
│       └── seedData.js
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/           # Botões, inputs, modals
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── TourGuide.jsx
│   │   ├── modules/          # Módulos de infraestrutura
│   │   │   ├── servers/
│   │   │   ├── network/
│   │   │   ├── virtualization/
│   │   │   ├── monitoring/
│   │   │   ├── backup/
│   │   │   ├── scripts/
│   │   │   ├── tickets/
│   │   │   ├── security/
│   │   │   └── orchestration/
│   │   ├── services/         # Serviços do frontend
│   │   ├── hooks/            # Hooks customizados
│   │   ├── context/          # Context API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── package.json              # Scripts do projeto
└── README.md
```

## 🎮 Funcionalidades por Módulo

### 1. 🖥️ Servidores
- Criar, editar e remover servidores Windows/Linux
- Simular ligar/desligar/ping
- Visualizar consumo de CPU/RAM em tempo real

### 2. 🌐 Rede
- Visualizar topologia de rede
- Configurar regras de firewall
- Criar e gerenciar VPNs
- Exibir tabelas ARP e rotas

### 3. ☁️ Virtualização/Cloud
- Criar VMs com pool de recursos limitado
- Migrar VMs entre hosts
- Simular migração para AWS/Azure/GCP

### 4. 📊 Monitoramento
- Dashboard com métricas em tempo real
- Gráficos de CPU, RAM, rede e disco
- Sistema de alertas configurável
- Log de eventos

### 5. 💾 Backup
- Agendar backups de VMs e servidores
- Simular execução e restauração
- Logs detalhados de operações

### 6. 🤖 Automação
- Editor de scripts com syntax highlighting
- Suporte a PowerShell, Bash e Python
- Execução simulada com output realista

### 7. 🎫 Gestão de Chamados
- Sistema de tickets estilo GLPI
- Categorias e prioridades
- Inventário de ativos

### 8. 🔐 Segurança
- Usuários Active Directory simulados
- Políticas de Grupo (GPOs)
- Princípios Zero Trust

### 9. 🔄 Orquestração
- Visualizar código Terraform simulado
- Executar planos e apply
- Playbooks Ansible

## 🎯 Tour Interativo

Na primeira visita, um tour interativo guia você por todas as funcionalidades. Você pode:
- **Pular** o tour a qualquer momento
- **Reiniciar** o tour pelo botão de ajuda (?)

## 🌙 Modo Escuro/Claro

Alternância suave entre temas claro e escuro no cabeçalho.

## 📚 Estudos de Caso

Cada módulo inclui um ícone 💼 que abre estudos de casos reais de uso da tecnologia.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** 18+
- **Express.js** 4.x
- **CORS** para comunicação cross-origin
- **UUID** para geração de IDs únicos

### Frontend
- **React** 18
- **Vite** 5
- **TailwindCSS** 3
- **Recharts** para gráficos
- **React Joyride** para tour interativo
- **React Router** para navegação
- **Heroicons** para ícones
- **React Hot Toast** para notificações

## 📝 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📧 Contato

Projeto desenvolvido como ambiente educacional para análise de infraestrutura de TI.

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**
