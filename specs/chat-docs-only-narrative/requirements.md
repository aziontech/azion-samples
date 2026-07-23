# Requirements: Chat Docs-Only Narrative + Compact Typography

## Overview

Ajustar a narrativa dos templates de chat AI da Azion (`vue-chat-ai` e
`vue3-ai-chatbot-widget`) para deixar explícito que o assistente responde
apenas perguntas sobre a documentação do produto, e reduzir a escala
tipográfica global de ambos os chats para uma aparência mais compacta e
densa. Aplica-se apenas à camada de UI (copy visível + tokens de tipografia);
não altera o comportamento do backend, o system prompt do modelo, nem a
lógica de recusa de perguntas fora do escopo.

## Personas

- **Visitante da documentação**: acessa o template rodando localmente ou
  em demo pra experimentar o chat da Azion e entender rapidamente o que
  pode perguntar.
- **Developer que forkou o template**: usa o template como base pra
  construir seu próprio chat de documentação e espera que o copy default
  já reflita esse caso de uso.

## User Stories & Acceptance Criteria

### 1. Narrativa "só documentação" visível na UI

**User Story:** Como visitante do chat, quero entender no primeiro olhar
que o assistente só responde sobre a documentação da Azion, pra não
perder tempo perguntando sobre outros assuntos.

**Acceptance Criteria:**

1.1 The system shall exibir, no header de cada template de chat, um
título ou subtítulo que declare explicitamente que o assistente é
especializado na documentação da Azion.

1.2 When o usuário abre o chat sem histórico de mensagens, the system
shall renderizar uma mensagem de boas-vindas (empty state) que descreva
que o assistente responde apenas dúvidas sobre a documentação da Azion e
dê 2–4 exemplos de perguntas válidas.

1.3 The system shall usar, no `placeholder` do campo de input, uma
frase que remeta ao escopo de documentação (ex.: "Pergunte sobre a
documentação da Azion...").

1.4 The system shall aplicar as mudanças de copy consistentemente em
ambos os templates: `templates/vue/vue-chat-ai` e
`templates/vue/vue3-ai-chatbot-widget`.

1.5 If o template já expõe o copy via slot, prop ou arquivo de
configuração, then the system shall preservar essa camada de
customização e apenas alterar os valores default.

### 2. Tipografia global compacta

**User Story:** Como visitante, quero uma interface de chat mais densa e
compacta, pra ver mais conteúdo em uma tela sem scroll.

**Acceptance Criteria:**

2.1 The system shall reduzir a escala tipográfica global do chat de
forma que o corpo das mensagens fique com tamanho de fonte menor que o
atual, mantendo hierarquia visível entre header, mensagens, metadados
(timestamps, autor) e placeholder.

2.2 The system shall preservar a proporção relativa entre os tamanhos
(header > mensagem > metadado) após a redução — nenhum par deve inverter
hierarquia.

2.3 The system shall aplicar a redução via tokens/variáveis existentes
(design system, Tailwind config, ou CSS variables no root do template) e
não via overrides pontuais espalhados pelos componentes.

2.4 If o template usa `@aziontech/webkit` ou `@aziontech/theme`, then
the system shall respeitar as classes de tipografia oficiais do design
system (não introduzir `text-xs`/`text-lg` cru nem font-sizes hardcoded).

2.5 The system shall garantir line-height proporcional ao novo
font-size, evitando linhas coladas ou espaçamento excessivo.

## Non-Functional Requirements

### 3. Acessibilidade

3.1 The system shall manter o tamanho mínimo de fonte do corpo das
mensagens em ≥ 12px após a redução, pra não violar boas práticas de
legibilidade.

3.2 The system shall manter contraste WCAG AA entre o texto e o fundo
após qualquer ajuste de estilo.

3.3 The system shall preservar o comportamento de zoom do navegador —
nenhum tamanho de fonte pode ser fixado em unidades que impeçam o
usuário de aumentar o texto (evitar `px` puro onde `rem`/`em` já era
usado).

### 4. Consistência e i18n

4.1 Where o template já suporta múltiplos idiomas, the system shall
atualizar as strings de narrativa em todos os idiomas presentes.

4.2 If o template só tem inglês, then the system shall manter o novo
copy em inglês (não introduzir PT-BR sem infraestrutura de i18n).

## Out of Scope

- Alterar o system prompt do modelo ou implementar recusa server-side
  para perguntas fora do escopo (fica pra outra spec de guardrail de
  agente).
- Redesign visual do chat além de tipografia (cores, spacing, layout,
  ícones permanecem).
- Alterar `templates/react/tanstack-chat-ai` (já sendo removido nesta
  branch).
- Criar novos templates ou variantes de chat.
- Traduzir o chat para novos idiomas.

## Open Questions

- [ ] Qual é a lista canônica de 2–4 exemplos de pergunta que devem
  aparecer no empty state? (usar exemplos do domínio de Edge/CDN/WAF ou
  algo mais genérico?)
- [ ] O `vue3-ai-chatbot-widget` é embedável em sites terceiros — a
  redução de tipografia deve respeitar herança do host ou fixar valores
  absolutos pra garantir consistência?
