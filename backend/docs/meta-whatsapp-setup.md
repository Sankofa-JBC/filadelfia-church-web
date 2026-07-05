# Setup da WhatsApp Cloud API da Meta

Este backend ja possui as rotas necessarias para a primeira verificacao de webhook da Meta. A conexao real ainda depende de dados que devem ser criados dentro da conta Meta.

## Dados necessarios

- URL publica do backend hospedado.
- `WHATSAPP_VERIFY_TOKEN`, criado por nos e salvo tambem no Render.
- App da Meta com produto WhatsApp configurado.
- WhatsApp Business Account.
- Phone Number ID.
- Access Token da Cloud API.

## Callback URL

Use a URL publica do backend com este caminho:

```text
https://SEU-BACKEND.onrender.com/webhook/whatsapp
```

## Verify Token

Use o mesmo valor cadastrado no Render:

```text
WHATSAPP_VERIFY_TOKEN=crie-um-token-forte
```

A Meta chamara o endpoint `GET /webhook/whatsapp` com `hub.mode`, `hub.verify_token` e `hub.challenge`. Se o token bater, o backend devolve o `hub.challenge`.

## Eventos do webhook

Na configuracao do webhook da Meta, assine pelo menos:

```text
messages
```

## Variaveis de ambiente futuras

Quando formos enviar respostas reais pelo WhatsApp, o Render tambem precisara de:

```text
META_WHATSAPP_ACCESS_TOKEN=
META_WHATSAPP_PHONE_NUMBER_ID=
```

Essas variaveis ja estao reservadas, mas o codigo atual ainda nao envia mensagens.

## Estado atual

Ja implementado:

- `GET /webhook/whatsapp` para verificacao da Meta;
- `POST /webhook/whatsapp` para receber payloads de mensagens;
- validacao basica de payload com Zod;
- logs das mensagens recebidas.

Ainda nao implementado:

- envio real de respostas via Cloud API;
- templates aprovados pela Meta;
- persistencia em banco;
- painel administrativo;
- IA para respostas.
