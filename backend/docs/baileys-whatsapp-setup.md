# Setup do WhatsApp sem API oficial

Este projeto usa Baileys para conectar o backend ao WhatsApp Web como um aparelho conectado. Nao usa a WhatsApp Cloud API da Meta.

## Como funciona

```text
WhatsApp do celular
-> Aparelhos conectados
-> QR Code exibido pelo backend
-> Baileys recebe mensagens
-> regras automaticas respondem pelo proprio WhatsApp
```

## Rodar localmente

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run bot:dev
```

Quando o QR Code aparecer no terminal:

1. Abra o WhatsApp no celular.
2. Toque em **Aparelhos conectados**.
3. Toque em **Conectar aparelho**.
4. Escaneie o QR Code do terminal.

Depois disso, a sessao fica salva em:

```text
backend/.session/baileys
```

Essa pasta nao deve ir para o Git.

## Configuracoes

```text
WHATSAPP_BOT_ENABLED=true
WHATSAPP_SESSION_DIR=.session/baileys
WHATSAPP_IGNORE_GROUPS=true
WHATSAPP_MIN_REPLY_INTERVAL_MS=60000
```

## Cuidados operacionais

- Use apenas para responder pessoas que chamarem primeiro.
- Nao use para disparo em massa.
- Nao use em grupos enquanto `WHATSAPP_IGNORE_GROUPS=true`.
- Se o WhatsApp desconectar, apague `backend/.session/baileys` e escaneie o QR Code novamente.
- Para producao, use uma hospedagem com armazenamento persistente. Render Free nao preserva sessao local entre reinicios/deploys.

## Estado atual

Ja implementado:

- QR Code no terminal;
- sessao local ignorada pelo Git;
- status em `GET /whatsapp/status`;
- respostas automaticas para cultos, localizacao, pedidos de oracao e contato;
- limitacao simples de uma resposta por contato a cada 60 segundos;
- grupos ignorados por padrao.

Ainda nao implementado:

- painel CRM;
- historico de conversas em banco;
- atendimento humano pelo painel;
- IA para respostas.
