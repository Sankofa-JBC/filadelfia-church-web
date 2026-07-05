# Backend WhatsApp - Igreja Missionaria Filadelfia

Backend para automacao de atendimento pelo WhatsApp usando Baileys e WhatsApp Web como aparelho conectado. Este fluxo nao usa a WhatsApp Cloud API da Meta.

## Requisitos

- Node.js 24.x
- npm
- WhatsApp no celular para escanear o QR Code

## Configuracao local

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run bot:dev
```

Quando o QR Code aparecer no terminal, abra o WhatsApp no celular e use:

```text
Aparelhos conectados > Conectar aparelho
```

Por padrao, o servidor HTTP roda em:

```text
http://localhost:3000
```

## Scripts

```powershell
npm run bot:dev
npm run bot:start
npm run dev
npm run build
npm run typecheck
npm test
```

## Variaveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`.

```text
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
WHATSAPP_BOT_ENABLED=false
WHATSAPP_SESSION_DIR=.session/baileys
WHATSAPP_IGNORE_GROUPS=true
WHATSAPP_MIN_REPLY_INTERVAL_MS=60000
```

O script `npm run bot:dev` ativa `WHATSAPP_BOT_ENABLED=true` automaticamente.

Nao commitar `.env` real nem a pasta `.session`. A sessao do WhatsApp fica salva em:

```text
backend/.session/baileys
```

## Endpoints

### GET /health

Verifica se a API esta rodando.

```powershell
Invoke-RestMethod http://localhost:3000/health
```

### GET /whatsapp/status

Mostra se o bot esta habilitado e o estado atual da conexao.

```powershell
Invoke-RestMethod http://localhost:3000/whatsapp/status
```

## Respostas automaticas

O bot responde mensagens de texto com regras simples:

- cultos, horarios ou programacao;
- localizacao/endereco;
- pedido de oracao;
- contato/atendimento humano;
- resposta padrao para mensagens fora do escopo.

Por seguranca operacional, o bot:

- ignora grupos por padrao;
- ignora mensagens enviadas pelo proprio numero;
- limita resposta por contato usando `WHATSAPP_MIN_REPLY_INTERVAL_MS`;
- nao faz disparos em massa.

## Deploy

O Render ainda pode hospedar o servidor HTTP, mas o modo Baileys precisa de sessao persistente. Render Free nao e adequado para manter o bot em producao porque a instancia pode dormir e o filesystem local nao e persistente entre reinicios/deploys.

Documentacao:

```text
backend/docs/baileys-whatsapp-setup.md
backend/docs/deploy-render.md
```

## Escopo fora do MVP atual

- Painel CRM.
- Historico de conversas em banco.
- Atendimento humano pelo painel.
- IA com Gemini.
- Hospedagem definitiva com disco persistente.
