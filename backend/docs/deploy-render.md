# Deploy do backend no Render

Este projeto usa Render para o primeiro deploy publico do backend porque ele aceita um servidor Node.js comum, fornece HTTPS e permite configurar variaveis secretas sem colocar tokens no Git.

## Objetivo

Publicar o backend em uma URL HTTPS para que a Meta consiga chamar:

```text
https://SEU-BACKEND.onrender.com/webhook/whatsapp
```

## Configuracao criada

O arquivo `render.yaml` na raiz do repositorio define:

- servico web Node.js;
- pasta raiz `backend`;
- build com `npm ci --include=dev && npm run build`;
- start com `npm start`;
- health check em `/health`;
- variaveis sensiveis como `sync: false`.

## Passo a passo

1. Acesse o Render e conecte o repositorio `Sankofa-JBC/filadelfia-church-web`.
2. Crie um novo Blueprint usando o arquivo `render.yaml`.
3. Preencha as variaveis secretas solicitadas:

```text
WHATSAPP_VERIFY_TOKEN=crie-um-token-forte
META_WHATSAPP_ACCESS_TOKEN=preencher-depois
META_WHATSAPP_PHONE_NUMBER_ID=preencher-depois
META_GRAPH_API_VERSION=v24.0
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

- O plano gratuito pode dormir apos um periodo sem uso. Para webhook real em producao, isso pode atrasar a primeira resposta.
- Nao coloque tokens reais em `.env.example`, README, commits ou mensagens publicas.
- A URL do Render sera usada no painel da Meta como Callback URL do webhook.

## Se precisar editar manualmente no Render

Na tela do servico, use estes valores:

```text
Build Command: npm ci --include=dev && npm run build
Start Command: npm start
```

Nao cole `buildCommand:` dentro do campo **Build Command**. Esse texto pertence apenas ao arquivo `render.yaml`; se for colado na interface, o Render tentara executar `buildCommand:` como comando de terminal e o deploy falhara com status 127.
