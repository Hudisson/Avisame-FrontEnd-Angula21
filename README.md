# Avisa-me — Front-end

Front-end em Angular do **Avisa-me**, um sistema pessoal de organização que permite gerenciar **tarefas recorrentes** (por dia da semana) e **eventos agendados** (por data específica), com painel visual de acompanhamento e notificações por e-mail geridas pelo back-end.

Este projeto consome a API REST do [Avisa-me API](https://github.com/Hudisson/Avisa-me), desenvolvida em Java com Spring Boot.

## Funcionalidades

- **Autenticação** com JWT (login e registro), com rotas protegidas por `AuthGuard`
- **Dashboard** com resumo visual: total de tarefas (ativas/inativas) e eventos (notificados/pendentes)
- **Tarefas** — CRUD completo:
  - Criação e edição com descrição em texto rico (TinyMCE)
  - Recorrência por dia da semana
  - Listagem, visualização detalhada e exclusão com confirmação
- **Eventos** — CRUD completo:
  - Criação e edição com descrição em texto rico (TinyMCE)
  - Data específica de ocorrência
  - Listagem, visualização detalhada e exclusão com confirmação
- **Perfil** do usuário e **configuração de horário** de notificações

## Tecnologias

- [Angular](https://angular.dev/) 21 — standalone components, Signals e a nova sintaxe de controle de fluxo (`@if`, `@for`)
- TypeScript
- [TinyMCE](https://www.tiny.cloud/) (via `@tinymce/tinymce-angular`) para edição de texto rico, hospedado localmente
- [Font Awesome](https://fontawesome.com/) (`@fortawesome/angular-fontawesome`) para ícones
- RxJS
- Angular Router com lazy loading (`loadComponent`) nas rotas internas

## Pré-requisitos

- [Node.js](https://nodejs.org/) e npm
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`) — opcional, também é possível usar `npx ng`
- A [API do Avisa-me](https://github.com/Hudisson/Avisa-me) rodando localmente em `http://localhost:8080` (as URLs da API estão fixas no código, então o back-end precisa estar de pé para o front funcionar)

## Instalação

```bash
git clone <url-do-repositorio>
cd avisame-frontend
npm install
```

## Rodando o projeto

Com a API já em execução em `http://localhost:8080`, inicie o servidor de desenvolvimento:

```bash
ng serve
```

Acesse `http://localhost:4200/` no navegador. A aplicação recarrega automaticamente a cada alteração nos arquivos-fonte.

> **TinyMCE:** o editor é carregado localmente (self-hosted, sem chave de API na nuvem) a partir de `/tinymce/tinymce.min.js`. Garanta que os arquivos da biblioteca estejam disponíveis nesse caminho (normalmente copiados para a pasta de assets pública via configuração no `angular.json`).

## Estrutura de rotas

| Caminho | Descrição | Protegida |
|---|---|---|
| `/` | Login | Não |
| `/register` | Cadastro de usuário | Não |
| `/home` | Dashboard (resumo de tarefas e eventos) | Sim |
| `/home/perfil` | Perfil do usuário | Sim |
| `/home/tarefas` | Listagem de tarefas | Sim |
| `/home/tarefas/nova` | Criar tarefa | Sim |
| `/home/tarefas/:id` | Detalhes da tarefa | Sim |
| `/home/tarefas/:id/editar` | Editar tarefa | Sim |
| `/home/eventos` | Listagem de eventos | Sim |
| `/home/eventos/novo` | Criar evento | Sim |
| `/home/eventos/:id` | Detalhes do evento | Sim |
| `/home/eventos/:id/editar` | Editar evento | Sim |
| `/home/horarios` | Configuração de horário de notificações | Sim |

Rotas protegidas exigem um token JWT válido, salvo no `localStorage` sob a chave `jwt_token` e enviado em todas as requisições autenticadas via header `Authorization: Bearer <token>`.

## Scaffolding de código

Para gerar um novo componente seguindo o padrão do projeto:

```bash
ng generate component components/nome-do-componente --skip-tests
```

Para ver todos os schematics disponíveis (components, directives, pipes, etc.):

```bash
ng generate --help
```

## Build

```bash
ng build
```

Os artefatos de build ficam em `dist/`. Por padrão, o build de produção já vem otimizado.

## Testes

Testes unitários (via [Vitest](https://vitest.dev/)):

```bash
ng test
```

Testes end-to-end — o Angular CLI não inclui um framework de e2e por padrão; escolha o de sua preferência (Cypress, Playwright, etc.) caso deseje adicionar.

## Recursos adicionais

- [Angular CLI — Overview e referência de comandos](https://angular.dev/tools/cli)
- [Repositório da API (back-end)](https://github.com/Hudisson/Avisa-me)

---

Desenvolvido por [Hudisson Xavier](https://github.com/hudisson) · [LinkedIn](https://linkedin.com/in/hudisson-xavier)
