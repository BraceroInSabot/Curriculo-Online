# Currículo Online — Guilherme Bracero

Página de currículo em **React + TypeScript + Vite**. O hero é enxuto: nome em
destaque, "sou ___" alternando entre os papéis com transição suave, uma frase curta,
dois botões e a foto num card inclinado sobre um bloco de cor, com um selo girando e
parallax leve ao mover o mouse. Abaixo, uma faixa rolante com as tecnologias.
O restante da página (cabeçalho escuro, seções com títulos em caixa-alta e cards com
sombra suave) segue uma linha limpa inspirada no
[adhamdannaway.com](https://www.adhamdannaway.com/).

## Como rodar

```bash
npm install
npm run dev        # ambiente de desenvolvimento (http://localhost:5173)
npm test           # testes unitários (Vitest)
npm run build      # checa tipos + gera a versão de produção em dist/
npm run preview    # serve o build localmente
```

## Como atualizar o conteúdo

Tudo o que aparece na página está em **`src/infrastructure/data/resumeData.ts`**:
perfil, experiências, formação, habilidades, projetos e contatos. Datas usam o formato
`AAAA-MM`; use `end: null` para algo atual. Os períodos são validados (fim antes do
início gera erro) e a duração e o status "em andamento" são calculados automaticamente.

### Sua foto

A foto fica em **`public/foto-perfil.jpg`** (quadrada ou vertical, rosto centralizado).
Ela é exibida num card 4:5, então as laterais de uma foto quadrada são levemente
cortadas. Se o arquivo não existir, aparece uma ilustração provisória.

Os papéis do hero ficam em `profile.roles` (ex.: `['desenvolvedor', 'professor']`) e a
frase de efeito em `profile.tagline`.

## Arquitetura

O projeto segue **Clean Architecture**: as dependências sempre apontam para dentro,
em direção ao domínio.

```
src/
├── domain/            Regras de negócio puras — sem React, sem framework
│   ├── entities/        Resume, Profile, Experience, Education, Project…
│   ├── value-objects/   YearMonth e Period (imutáveis e auto-validados)
│   ├── repositories/    ResumeRepository (porta / interface)
│   └── errors/          Erros de domínio
├── application/       Casos de uso
│   ├── ports/           Clock (abstração do tempo, para testes determinísticos)
│   └── use-cases/       GetResumeOverview: ordena, calcula durações e status
├── infrastructure/    Detalhes concretos
│   ├── data/            resumeData.ts ← conteúdo do currículo
│   ├── mappers/         Dados brutos → entidades de domínio
│   ├── repositories/    StaticResumeRepository (implementa a porta)
│   └── clock/           SystemClock
├── presentation/      React: componentes, seções, hooks, formatadores e estilos
│   ├── context/         Injeção de dependências via Context
│   ├── hooks/           useResumeOverview, useRotatingIndex, usePointerParallax…
│   ├── components/      Header, Footer, Section, Button, RotatingWord, RotatingBadge, Marquee…
│   ├── sections/        Hero, Sobre, Experiência, Formação, Habilidades, Projetos, Contato
│   └── styles/          tokens.css (design tokens) + global.css
└── main/              Composition root: monta as dependências e renderiza o App
```

**Por que isso importa aqui:** trocar a origem dos dados (uma API, um CMS, um JSON
remoto) é só criar outra classe que implemente `ResumeRepository` e trocá-la em
`src/main/container.ts` — nenhum componente muda.

### Princípios de Clean Code aplicados

- Nomes descritivos e em português para o domínio do currículo.
- Funções e componentes pequenos, com uma única responsabilidade.
- Sem números mágicos: constantes nomeadas e design tokens em CSS.
- Value objects imutáveis que se validam na criação.
- Tempo injetado via `Clock`, então os testes não dependem da data atual.
- CSS Modules por componente, sem estilos globais vazando.
- Acessibilidade: HTML semântico, `aria-*`, foco visível e `prefers-reduced-motion`.

## Deploy

`npm run build` gera arquivos estáticos em `dist/` (com caminhos relativos).

Em produção o site roda como container (nginx sem root, porta 8080) num pod Kubernetes.
O pipeline do GitHub Actions testa, valida e publica a imagem no GHCR a cada push na
`master`. Para testar a imagem localmente: `docker compose up --build` → http://localhost:8080.

Detalhes, passo a passo e requisitos do pod: [docs/DEPLOY.md](docs/DEPLOY.md).
