# Handoff — Church Lite Frontend

> Atualizado em 15/07/2026.

## Visão do produto

O Church Lite é um sistema de gestão para igrejas. O frontend reúne autenticação multi-igreja, cadastros de pessoas e entidades auxiliares, agenda, rotinas financeiras, dashboard e preferências do usuário.

Este documento descreve a aplicação Angular. O `entity-generator` possui documentação própria em `docs/handoff/entity-generator-project/`.

## Stack e execução

- Angular 21.2 com componentes standalone;
- TypeScript 5.9, RxJS 7.8 e SSR com Express;
- PrimeNG 21, PrimeFlex, PrimeIcons e tema Aura customizado;
- DayPilot Lite 5.9 para agenda;
- ngx-translate para internacionalização;
- autenticação por JWT armazenado em cookie;
- fonte Inter carregada localmente.

```bash
npm install
npm start
npm run build
npm test
```

API configurada nos environments:

- desenvolvimento: `http://localhost:5050/church-lite`;
- produção: `https://develop.smartverse.com.br/api/church-lite`.

O build de produção foi validado em 15/07/2026.

## Organização

```text
src/app/
├── components/       formulários e componentes de domínio
├── pages/            páginas e composição das funcionalidades
├── security/         login, cadastro, tenant e guards
├── services/         serviços específicos
├── shared/           CRUD, tabela, inputs, estilos e utilitários
└── config/           HTTP, interceptor, tema e menu lateral
```

Fluxo predominante:

```text
Página/listagem → componente de formulário → configuração/DTO → serviço → API
```

O `CrudService` cobre os CRUDs convencionais:

- `POST /{entidade}`;
- `PUT /{entidade}/{id}`;
- `DELETE /{entidade}/{id}`;
- `GET /{entidade}/{id}`;
- `GET /{entidade}?size=&offset=&filter=&order=&displayFields=`.

Use serviços específicos quando houver regra de negócio, como autenticação, usuários, agenda, movimentações, dashboard e configuração do usuário.

## Identidade visual atual

A interface foi revitalizada após a migração para Angular 21:

- cor primária violeta/lilás;
- Inter como fonte global;
- tema claro com fundo off-white levemente frio;
- tema escuro explicitamente restaurado para tons neutros zinc (`#09090b` e `#18181b`);
- páginas com breadcrumb, cabeçalho, descrição, cards temáticos e ações responsivas;
- cards de formulário empilhados em largura total para facilitar o uso mobile;
- sidebar em rail compacta, painel de submenu integrado ao tema, estados ativo/hover e cabeçalho mobile;
- avatar no rodapé da sidebar abre as configurações do usuário.

Tokens globais de claro/escuro ficam em `src/styles.scss`. A classe `.app-dark` é aplicada no elemento `html` pelo `ThemeService`. Evite cores de fundo fixas nos componentes; use tokens `--p-*`.

## Cadastros como páginas

Os formulários deixaram a arquitetura de modal e usam rotas próprias de criação/edição. O padrão visual atual é card em coluna única, com ícone, título e instrução curta.

### Pessoas

O mesmo componente atende membros, novos convertidos, fornecedores, visitantes e igrejas. As antigas abas foram removidas. A página contínua contém cards de:

- foto;
- dados pessoais;
- documentos;
- contato;
- endereço;
- informações ministeriais, quando aplicável.

Os grupos reativos e o DTO original foram preservados.

### Financeiro e auxiliares

O padrão de cards foi aplicado em:

- receitas e despesas;
- caixas/contas bancárias;
- abertura e fechamento de caixa;
- bancos;
- cargos;
- tipos de evento;
- plano de contas;
- centro de custo;
- usuários.

Receitas/despesas exibem situação aberta/liquidada e mantêm ações de salvar, baixar e estornar. Abertura/fechamento mantém filtros e bloqueios próprios de cada operação.

As rotas `/home/transactions` e `/home/bank-statament` também seguem a identidade atual: breadcrumb, cabeçalho descritivo, seletor contextual em card, indicadores de saldo, tabela compacta, empty state, paginação real e responsividade. `transactions` preserva as ações de abrir/fechar caixa; a ação de impressão continua sem implementação funcional.

## Listagens e tabelas

O datatable compartilhado foi compactado para exibir mais dados e contém:

- toolbar profissional e ações reorganizadas;
- breadcrumb na página consumidora;
- paginação no rodapé;
- adaptação à altura disponível;
- empty state com imagem;
- margens laterais reduzidas;
- limpeza dos dados ao trocar de rota/listagem.

As tabelas em árvore de Plano de contas e Centro de custo e a tabela de Histórico de fechamento receberam a mesma identidade.

O drawer de filtros foi corrigido para remover corretamente o bloqueio/overlay ao fechar. Ao mexer nele, validar fechamento por botão, clique externo, Escape e troca de rota.

### Filtros compartilhados

O `DatatableComponent` renderiza os filtros declarados em `src/assets/configuration/view.json`. O estado aplicado é preservado ao paginar e limpo ao atualizar ou trocar de listagem. A busca rápida usa o primeiro campo configurado: `name` nos cadastros de pessoas e `description` nas listagens financeiras.

Filtros disponíveis em membros, novos convertidos, visitantes e fornecedores:

- nome;
- CPF por `personalDocs.cpf`;
- situação `ACTIVE`/`INACTIVE`.

Filtros disponíveis em receitas e despesas:

- descrição;
- pessoa por `person.name`;
- caixa ou conta bancária por `cash.description`;
- plano de contas por `planAccount.description`;
- centro de custo por `costCenter.description`;
- situação derivada de `paymentReceiptDate isNull` (em aberto) e `paymentReceiptDate notNull` (liquidada).

O filtro específico é combinado com o filtro fixo da rota usando `and`, por exemplo `type eq 0 and name eq João`. Valores contendo os conectores textuais ` and ` ou ` or ` são normalizados porque o parser não oferece escape. Não misturar `and` e `or`, não usar parênteses e não adicionar filtros numéricos, booleanos, de data ou intervalo sem confirmar suporte no backend.

O `CrudService.onGetAll` usa `HttpParams` para codificar `size`, `offset`, `filter`, `order` e `displayFields`; não voltar a concatenar esses valores manualmente na URL.

## Plano de contas e centro de custo

O campo de código da árvore é bloqueado para edição manual. `src/app/shared/util/tree-code.ts` calcula automaticamente o próximo código:

- primeiro registro raiz: `1`;
- próximos registros raiz: `2`, `3` etc.;
- filhos de `1`: `1.1`, `1.2` etc.;
- a inclusão pelo botão `+` carrega o pai por `parentId`.

## Agenda

A agenda usa `@daypilot/daypilot-lite-angular`. O FullCalendar e seus pacotes foram removidos.

Recursos atuais:

- visualizações de mês, semana e dia;
- navegação anterior, próxima e hoje;
- scroll interno;
- criação por seleção de dia/horário;
- edição ao clicar;
- drag-and-drop e redimensionamento;
- compromissos únicos ou recorrentes por dias da semana;
- cancelamento e exclusão;
- cores vindas de `eventsType`;
- eventos cancelados em cinza;
- integração com `appointments` e configuração do usuário.

A criação exige um tipo de evento cadastrado e usuário carregado.

## Configurações do usuário

A página `/home/user-configuration` possui breadcrumb e cards para foto, informações pessoais, aparência e idioma. O avatar é limitado e responsivo. Tema e idioma são aplicados após salvar e o carregamento dessas preferências não depende da existência de foto.

## Autenticação, cookies e logout

- `authInterceptor` prefixa URLs relativas com `environment.apiUrl` e envia `Authorization: Bearer`;
- URLs absolutas, assets e URLs assinadas externas não são reescritas;
- em `401`, o token é removido e o usuário volta ao login;
- guards retornam `UrlTree`, evitando navegação concorrente;
- cookies novos são gravados com path `/`;
- o logout é ação direta, limpa cookies em paths conhecidos, `localStorage` e `sessionStorage`;
- `/login?logout=1` força o `publicGuard` a permitir o login mesmo diante de cookie residual.

A rota pública `/select-tenant` e o componente `security/tenant-selection` implementam o fluxo multi-igreja. O login recebe do backend apenas os vínculos cuja senha foi validada. Com um vínculo, grava o JWT e entra diretamente; com vários, mantém as opções temporariamente no `sessionStorage`, solicita a escolha e somente então grava o token selecionado no cookie. As opções temporárias são removidas ao selecionar ou cancelar.

## Rotas principais

Rotas públicas:

- `/login`;
- `/select-tenant`;
- `/singup`;
- `/register-church/:hash`.

Rotas privadas sob `/home`:

- `dashboard`;
- `scheduler`;
- `user-configuration`;
- `transactions`, `transactions/open`, `transactions/close`;
- `cash-history`;
- `bank-statament`;
- `register/:hash`, `register/:hash/new`, `register/:hash/:id`;
- rotas explícitas de receitas, despesas, bancos, caixas, cargos, tipos de evento e usuários;
- `planAccount` e `costCenter`, incluindo criação/edição.

As grafias `singup` e `bank-statament` são legadas e ainda estão em uso. Não renomear sem revisar todos os links.

## Funcionalidades implementadas

- login, cadastro inicial, guards e seleção de tenant multi-igreja;
- cadastros de pessoas e igrejas;
- usuários administrativos;
- cargos, bancos, caixas e tipos de evento;
- plano de contas e centro de custo em árvore;
- receitas, despesas, abertura/fechamento e movimentações;
- extrato bancário e histórico de fechamento;
- agenda integrada à API;
- preferências de usuário, tema, idioma e foto;
- datatable e tree tables compartilhados;
- dashboard executivo financeiro e de agenda.

Presentes no menu, mas sem fluxo consolidado:

- traduções administrativas;
- permissionamento;
- cabeçalho de relatórios;
- notificações definitivas.

## Convenções de desenvolvimento

- Usar `CrudService` para CRUD padrão e serviço próprio para regras de negócio.
- Manter metadados/conversão de formulário em `*.config.ts` quando o domínio já usa esse padrão.
- Preferir interfaces a `any`.
- Preservar nomes do backend: `person`, `financial`, `cash`, `bank`, `planAccount`, `costCenter` etc.
- Novos formulários devem ser páginas, não modais, salvo interação curta explicitamente modal.
- Usar breadcrumb, cabeçalho, cards empilhados, instruções e ações responsivas.
- Usar tokens PrimeNG para respeitar claro/escuro.
- Traduzir textos novos; ainda existem textos fixos no menu e em orientações recentes.
- Não tratar uma entrada no menu como funcionalidade concluída.
- Preservar alterações locais não relacionadas: o worktree pode conter trabalho de dashboard e tenant em andamento.

## Pontos de atenção

- O menu ainda mistura traduções e textos fixos.
- Algumas classes/rotas mantêm nomes legados, como `cost-center-modal`, embora a tela já seja uma página.
- Testes são principalmente scaffolds; o build é hoje a principal validação automatizada.
- Validar qualquer novo operador de filtro contra o parser do backend; número, booleano, datas, comparações e intervalos ainda não têm suporte confiável.
- Verificar se erro de rede `status 0` não deve encerrar sessão.
- Validar contratos de recorrência da agenda e datas em timezone local.
- Não executar `npm audit fix` automaticamente; há vulnerabilidades que exigem revisão de impacto.

## Checklist para novas funcionalidades

1. Confirmar contrato no backend.
2. Criar interfaces de entrada e saída.
3. Implementar serviço e tratamento de erros.
4. Criar página/formulário no padrão visual atual.
5. Adicionar rota, menu, breadcrumb e traduções.
6. Validar autenticação, tenant, loading e estados vazios.
7. Testar temas claro/escuro e responsividade.
8. Executar `npm run build`.

## Atualização — identidade de movimentações e filtros (15/07/2026)

Alterações validadas com `npm run build`:

- revitalização visual de `bank-statement` e `transactions`, compatível com claro, escuro e mobile;
- paginação real, formatação de datas/valores e estados vazios nas duas telas;
- drawer de filtros funcional e configurável pelo `view.json`;
- filtros iniciais para os quatro cadastros de pessoas e para receitas/despesas;
- busca rápida integrada ao dialeto `eq`;
- composição entre filtro fixo da rota e filtros do usuário;
- envio seguro dos parâmetros do CRUD com `HttpParams`.

## Atualização — dashboard executivo (15/07/2026)

A rota `/home/dashboard` possui implementação completa em `src/app/pages/dash/`:

```text
dash.component.ts                 estado, filtros e navegação
dash.component.html               composição executiva
dash.component.scss               layout responsivo e temas
models/dashboard.models.ts        contratos tipados
services/dashboard.service.ts     chamadas específicas da API
```

O frontend consome dois snapshots:

- `GET /getDashboardFinancial`: filtros disponíveis, cards, evolução, despesas por centro de custo/plano de contas, saldos, movimentações e alertas;
- `GET /getDashboardAgenda`: agenda do dia, próximos eventos e indicadores.

Comportamento importante:

- filtros financeiros usam `Subject`, `debounceTime`, `distinctUntilChanged` e `switchMap`, cancelando respostas antigas;
- a agenda é carregada separadamente e não é refeita ao mudar filtros financeiros;
- o stream financeiro trata erros dentro do `switchMap`, permitindo tentar novamente sem recriar o componente;
- valores monetários são formatados no navegador em `pt-BR`;
- gráficos são renderizados com CSS, sem dependência adicional, e possuem legenda/tooltip via título;
- existem estados de carregamento, erro e ausência de dados;
- atalhos levam às telas completas de movimentações e agenda.

### Temas do dashboard

O tema é controlado pela classe `html.app-dark`. O dashboard deve usar os tokens ativos definidos em `src/styles.scss`:

- `--app-page-background`;
- `--app-surface-background`;
- `--p-content-background`;
- `--p-content-border-color`;
- `--p-content-hover-background`;
- `--p-text-color`;
- `--p-text-muted-color`;
- `--p-primary-color`.

Não usar no dashboard os tokens legados `--surface-card`, `--surface-ground`, `--surface-border` ou cores claras fixas. Fundos semânticos de receita, despesa e alerta usam `color-mix` para funcionar nos dois temas. Revalidar claro, escuro, desktop e mobile ao alterar o SCSS.

Validação executada:

```bash
npm run build
```


## Atualização — traduções customizadas (15/07/2026)

A rota `/home/translations` lista as chaves do JSON padrão do idioma selecionado e mescla as sobrescritas do tenant obtidas pelo CRUD `translation`. A tela permite busca, edição inline, salvamento em lote no cliente e restauração do padrão. Após autenticação ou troca de idioma, `TranslateService` carrega primeiro o JSON local e aplica as customizações do banco; o menu é reconstruído para refletir os novos textos.


## Atualização consolidada — traduções e usuários (15/07/2026)

### Traduções

A área administrativa está disponível em `/home/translations`. `TranslateService` carrega o JSON do idioma, consulta o CRUD `translation` após autenticação e aplica as sobrescritas do tenant. Inclusões não enviam `id`; o UUID é gerado pelo backend. Restaurar o padrão exclui a customização persistida.

A cobertura foi ampliada para o menu, títulos e breadcrumbs de listagens, tabelas de movimentações e extrato, árvores de plano de contas/centro de custo e o datatable compartilhado. `src/assets/configuration/view.json` agora armazena chaves em `header`, `label` e opções; os componentes traduzem essas chaves ao renderizar. A auditoria atual encontrou zero chaves ausentes em `pt-BR`, `en-US` e `es-ES`.

Ao adicionar telas, não gravar textos finais em configurações dinâmicas. Cabeçalhos, filtros, placeholders, ações e estados vazios devem usar chaves presentes em todos os idiomas suportados. Ainda existem textos diretos fora desse pacote, especialmente no dashboard, agenda e alguns formulários.

### Cadastro administrativo de usuários

A listagem usa a configuração `users` e o formulário `UserAdminComponent`. A criação chama `POST /createChurchUser`; edição e exclusão mantêm integração com os contratos do backend. Nome, e-mail e telefone são os dados administrativos principais, e senha é enviada apenas no fluxo que a exige.

No login multi-igreja, opções validadas ficam temporariamente em `sessionStorage`; somente o token escolhido é persistido em cookie. O frontend nunca define o tenant no payload de criação de usuário. Labels, mensagens e cabeçalhos novos dessa feature devem seguir o sistema de traduções customizáveis.

Especificações reutilizáveis na raiz do workspace:

- `spec/FEATURE_TRANSLATIONS_SPEC.md`;
- `spec/FEATURE_USER_REGISTRATION_SPEC.md`.


## Atualização — módulo de células, Fase 1 inicial (15/07/2026)

O menu `Células`, a listagem configurável e o cadastro/edição básico foram iniciados. A rota `/home/register/cells` usa o datatable compartilhado; `CellComponent` cobre dados básicos, estrutura, agenda, localização, capacidade e metas. Todos os textos novos possuem chaves em português, inglês e espanhol. Itens futuros do menu permanecem sem rota ativa até suas telas existirem.

Os contratos de estrutura organizacional, liderança, membros e configurações já existem no backend. As próximas telas da Fase 1 são organograma/unidades, liderança, membros e configurações; dashboard, reuniões e multiplicações pertencem às fases posteriores.


### Continuação da Fase 1 — fundação administrativa (15/07/2026)

Foram adicionadas as rotas `/home/cells/organization`, `/home/cells/team` e `/home/cells/settings`. A área de estrutura cadastra tipos de nível e unidades hierárquicas; equipe vincula e encerra lideranças e membros por célula; configurações mantém as regras operacionais iniciais do módulo. Encerramentos usam atualização de status/data, preservando histórico.

O menu ativa somente as áreas implementadas; dashboard, reuniões, visitantes e multiplicações continuam sem rota até as fases correspondentes.


## Atualização — módulo de células, Fase 2 (15/07/2026)

As rotas `/home/cells/meetings` e `/home/cells/visitors` estão ativas no menu. `CellsOperationsComponent` centraliza a operação contextual por célula: cadastro e acompanhamento de visitantes, lançamento de reunião, contagens, presença individual, pedidos de oração, submissão e revisão do relatório.

Reuniões são criadas como `DRAFT`; rascunhos e rejeitadas exibem a ação de submissão, e reuniões `SUBMITTED` exibem aprovação/rejeição com motivo obrigatório na rejeição. Presenças e pedidos de oração são carregados após selecionar a reunião. Os endpoints de workflow são consumidos pelo mesmo `CrudService`, preservando interceptadores e tratamento HTTP existentes.

Todas as labels e todos os status novos possuem chaves equivalentes em `pt.json`, `pt-BR.json`, `en-US.json` e `es-ES.json`; a auditoria de paridade retornou zero diferenças. Validação realizada com `npm run build`.
