# Currículo Online

React 18 + TypeScript + Vite, organizado em Clean Architecture (veja README.md).

## Comandos
- `npm run dev` — servidor de desenvolvimento
- `npm test` — testes (Vitest, em `tests/`)
- `npm run build` — `tsc --noEmit` + build de produção

## Convenções
- Conteúdo do currículo: só em `src/infrastructure/data/resumeData.ts`.
- Dependências apontam para dentro: `presentation` → `application` → `domain`. O domínio não importa React nem infraestrutura.
- Implementações concretas são ligadas apenas em `src/main/container.ts`.
- Aliases: `@domain`, `@application`, `@infrastructure`, `@presentation`, `@main`.
- Estilos com CSS Modules por componente; cores, fontes e espaçamentos em `src/presentation/styles/tokens.css`.
- Textos da interface em português (pt-BR).
