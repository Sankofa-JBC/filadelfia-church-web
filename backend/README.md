# Backend WhatsApp - Igreja Missionaria Filadelfia

Backend minimo para preparar uma futura automacao oficial de atendimento pelo WhatsApp usando a WhatsApp Business Platform / Cloud API da Meta.

Este MVP nao envia mensagens e nao depende de uma conta real da Meta. Ele apenas prepara rotas locais para health check, verificacao futura de webhook e recebimento de payloads simulados.

## Requisitos

- Node.js 20 ou superior
- npm

## Configuracao local

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Por padrao, o servidor roda em:

```text
http://localhost:3000
```

## Scripts

```powershell
npm run dev
npm run build
npm run typecheck
npm test
```

## Deploy

O deploy inicial recomendado esta documentado em:

```text
backend/docs/deploy-render.md
```

O repositorio tambem possui `render.yaml` na raiz para criar o Web Service no Render.

## Variaveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`.

```text
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
WHATSAPP_VERIFY_TOKEN=troque-este-token-local
```

Nao commitar `.env` real. Tokens da Meta e chaves de IA devem ficar apenas no backend.

## Endpoints

### GET /health

Verifica se a API esta rodando.

```powershell
Invoke-RestMethod http://localhost:3000/health
```

### GET /webhook/whatsapp

Prepara a verificacao futura do webhook da Meta.

Exemplo local:

```powershell
Invoke-RestMethod "http://localhost:3000/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=troque-este-token-local&hub.challenge=abc123"
```

Resposta esperada:

```text
abc123
```

### POST /webhook/whatsapp

Recebe payloads simulados e registra logs basicos das mensagens recebidas.

```powershell
$body = @{
  messages = @(
    @{
      from = "5521974350384"
      id = "wamid.test"
      timestamp = "1710000000"
      type = "text"
      text = @{
        body = "Ola, gostaria de saber os horarios dos cultos."
      }
    }
  )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/webhook/whatsapp" `
  -ContentType "application/json" `
  -Body $body
```

Resposta esperada:

```json
{
  "status": "received",
  "receivedMessages": 1
}
```

## Escopo fora do MVP 1

- Envio real pela Cloud API.
- Templates aprovados pela Meta.
- Mensagens ativas fora da janela de 24 horas.
- Banco de dados.
- Cadastro de contatos.
- IA com Gemini.
- Painel administrativo.

## Proxima etapa: Meta

O checklist para conectar o webhook na WhatsApp Cloud API esta em:

```text
backend/docs/meta-whatsapp-setup.md
```
