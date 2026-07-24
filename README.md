# Filadelfia Church Web

Site institucional estático da Igreja Missionária Filadélfia Jesus Cristo Reina.

Frontend público:

```text
https://sankofa-jbc.github.io/filadelfia-church-web/
```

## Arquitetura

```text
.
├── index.html
├── sobre.html
├── programacao.html
├── mensagens.html
├── contato.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── hero-home.png
│       ├── logo-filadelfia.png
│       ├── logo.png
│       └── generated/
└── backend/
```

O frontend não usa framework nem processo de build. As cinco páginas compartilham `css/style.css` e `js/script.js`.

## Funcionalidades

- Páginas institucionais: Início, Sobre, Programação, Mensagens e Contato.
- Hero responsivo com AVIF/WebP e PNG original como fallback.
- Navegação móvel acessível, com fechamento por `Escape` e retorno de foco.
- FAQ, filtros de mensagens, geração de evento `.ics`, galeria com `<dialog>`, formulário de contato via WhatsApp e cópia de localização.
- Google Maps carregado sob demanda na página de contato, sem chave de API.
- Metadados canonical, Open Graph, Twitter Card, JSON-LD, `robots.txt`, `sitemap.xml` e página 404.

## Execução local

Como o frontend é estático, qualquer servidor HTTP simples funciona:

```bash
python -m http.server 8080
```

Depois acesse:

```text
http://localhost:8080/
```

## Publicação

O site é publicado pelo GitHub Pages a partir da branch `gh-pages`. A branch `main` guarda o código principal.

Fluxo usado:

```bash
git checkout main
git push origin main --tags
git push origin main:gh-pages
```

## Performance

Os PNGs originais continuam no repositório como fonte e fallback. Os navegadores modernos usam os arquivos em `assets/images/generated/`, reduzindo o carregamento inicial e melhorando LCP.

Metas de verificação:

- Lighthouse móvel: 90+ em Início, Sobre, Programação e Mensagens; 85+ em Contato.
- Acessibilidade, boas práticas e SEO: 95+.
- LCP móvel até 2,5 s, CLS abaixo de 0,1 e TBT abaixo de 200 ms.

## Backend

O backend fica isolado em `backend/` e prepara a automação de WhatsApp via Baileys/WhatsApp Web, sem a API oficial da Meta. Ele não é necessário para o frontend estático publicado no GitHub Pages.

Mais detalhes:

```text
backend/README.md
```
