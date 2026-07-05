# Deploy do backend no Render

O Render continua podendo hospedar o servidor HTTP do backend, mas o modo de automacao via Baileys nao deve depender do Render Free para producao.

## Objetivo

Manter uma URL publica para health check e status:

```text
https://SEU-BACKEND.onrender.com/health
https://SEU-BACKEND.onrender.com/whatsapp/status
```

## Configuracao criada

O arquivo `render.yaml` na raiz do repositorio define:

- servico web Node.js;
- pasta raiz `backend`;
- build com `npm ci --include=dev && npm run build`;
- start com `npm start`;
- health check em `/health`;
- bot desligado por padrao em hospedagem sem armazenamento persistente.

## Passo a passo

1. Acesse o Render e conecte o repositorio `Sankofa-JBC/filadelfia-church-web`.
2. Crie um novo Blueprint usando o arquivo `render.yaml`.
3. Confira as variaveis:

```text
WHATSAPP_BOT_ENABLED=false
WHATSAPP_SESSION_DIR=.session/baileys
WHATSAPP_IGNORE_GROUPS=true
WHATSAPP_MIN_REPLY_INTERVAL_MS=60000
```

4. Aguarde o deploy terminar.
5. Abra a rota de saude:

```text
https://SEU-BACKEND.onrender.com/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "filadelfia-whatsapp-backend"
}
```

## Observacoes

- O plano gratuito pode dormir apos um periodo sem uso.
- Render Free nao preserva arquivos locais entre reinicios/deploys, entao nao e adequado para manter a sessao do Baileys em producao.
- Para o bot real, rode localmente ou em uma hospedagem com disco persistente.

## Se precisar editar manualmente no Render

Na tela do servico, use estes valores:

```text
Build Command: npm ci --include=dev && npm run build
Start Command: npm start
```

Nao cole `buildCommand:` dentro do campo **Build Command**. Esse texto pertence apenas ao arquivo `render.yaml`; se for colado na interface, o Render tentara executar `buildCommand:` como comando de terminal e o deploy falhara com status 127.
