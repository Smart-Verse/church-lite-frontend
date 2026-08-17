# Handoff — Church Lite Frontend

> Atualizado em 21/07/2026.

> Configuração da igreja e aprovação de fechamento documentadas em `spec/SESSION_2026-07-17_CASH_CLOSING.md` na raiz do workspace.

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
- `/signup`;
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

A grafia `bank-statament` é legada e ainda está em uso. A antiga rota incorreta `singup` foi corrigida para `signup` em 21/07/2026.

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


## Revisão do módulo de células — ajustes de navegação e interface (15/07/2026)

O item de dashboard do submenu de células foi removido temporariamente porque possuía rota vazia e acionava o redirecionamento do dashboard geral. Ele só deve retornar quando existir rota e componente próprios para o dashboard de células.

A área de organização passou a permitir edição inline de níveis e unidades pelo CRUD gerado: o lápis carrega o registro no formulário, o salvamento usa `PUT` e existe cancelamento do modo de edição. A tela de equipe mantém o contexto da célula selecionada, separando liderança e membros. Encerrar um vínculo atualiza status/data e preserva o histórico; não realiza exclusão física.

Os layouts do módulo foram padronizados para ocupar toda a largura disponível, com cards, grid de 12 colunas, gaps equivalentes aos cadastros e quebra responsiva. Isso inclui:

- cadastro básico de células;
- configurações do módulo;
- organização, liderança e membros;
- reuniões, relatórios, presença e pedidos de oração;
- visitantes, incluindo os campos de próxima ação e observações.

Formulários e tabelas de reuniões e visitantes ficam em linhas completas, evitando cards comprimidos lado a lado. Componentes PrimeNG internos são forçados a preencher a coluna do grid. Todas as novas labels continuam usando os quatro catálogos i18n. Os builds de produção executados após cada revisão foram concluídos com sucesso.


## Atualização — grupos e permissionamento (16/07/2026)

A administração de grupos está em `src/app/pages/permission-groups/`. A listagem segue o padrão compacto das demais tabelas. O cadastro possui nome, descrição, status por dropdown, usuários e matriz de permissões. Usuários são pesquisados pelo `app-auto-complete` padrão na rota `userConfiguration`, adicionados à lista e removidos individualmente; não criar seletor paralelo.

A matriz consome `GET /getPermissionResources` e renderiza tabela com descrição e colunas traduzidas Criar, Visualizar, Editar e Excluir. Cada operação existente usa `p-toggleswitch`; operação ausente mostra traço. Switch ligado significa permitido e desligado vira denial no payload. Recursos novos do JSON aparecem ligados automaticamente. O identificador técnico fica abaixo da descrição.

O carregamento do catálogo não deve ser mascarado por falhas paralelas de grupos/usuários. Todas as chamadas relativas passam pelo `authInterceptor`, que prefixa `environment.apiUrl` e envia JWT. O backend deve aceitar o preflight CORS.

O feedback de autorização é global: respostas `403` exibem a tradução `permission_access_denied`. Existe apenas um `MessageService`, fornecido em `app.config.ts`; não adicionar provider local no `AppComponent`, pois o interceptor e o `<p-toast>` precisam compartilhar a mesma instância.

Chaves novas devem existir em `pt.json`, `pt-BR.json`, `en-US.json` e `es-ES.json`. Enquanto não existir `VIEW_ALL`, a coluna Visualizar representa toda operação GET. Especificação canônica: `spec/FEATURE_PERMISSION_GROUPS_SPEC.md`. Build validado com `npm run build`.


## Atualização — template de cabeçalho e rodapé de relatórios (16/07/2026)

A rota `/home/report-template`, acessível por Configurações globais → Cabeçalho de relatório, mantém a configuração visual usada pelos relatórios. A tela não possui listagem: consulta `reportTemplate` com `size=1` e decide entre POST e PUT conforme a existência do registro.

A imagem reutiliza o componente compartilhado `app-image-upload`. Cabeçalho e rodapé usam `p-editor` do PrimeNG com Quill; toda formatação fica no HTML armazenado em `headerText` e `footerText`. Não adicionar novamente campos separados de tamanho de fonte. A página apresenta pré-visualização aproximada em formato de papel.

Arquivos principais:

- `src/app/pages/report-template/report-template.component.ts`;
- `src/app/pages/report-template/report-template.component.html`;
- `src/app/pages/report-template/report-template.component.scss`.

O pacote `quill` é dependência direta. O build pode emitir aviso não bloqueante de CommonJS para `quill-delta`. Textos da funcionalidade existem em `pt.json`, `pt-BR.json`, `en-US.json` e `es-ES.json`. Validação concluída com `npm run build`.


## Atualização — listagens mobile incrementais (17/07/2026)

O `DatatableComponent` possui duas apresentações sobre o mesmo estado e o mesmo `CrudService`: `p-table` paginada no desktop e cards com carregamento incremental abaixo de 768 px. O mobile usa `IntersectionObserver` com antecipação de 240 px, anexa novas páginas, deduplica por `id` e mostra o loading no final da lista sem bloquear a página.

`RequestData.append` é um sinal local para a página consumidora decidir entre substituir ou anexar resultados. O `CrudService.onGetAll` continua enviando somente os parâmetros HTTP conhecidos; não encaminhar `append` ao backend. Pesquisa, filtros, atualização e troca de listagem devem sempre reiniciar os dados.

Plano de Contas e Centro de Custo reutilizam `shared/components/mobile-tree-list`. No mobile, a árvore é apresentada como cards recuados por nível, com expansão/recolhimento e ações de adicionar filho, editar e excluir. O lazy incremental pagina somente raízes com `parentCode isNull`; cada DTO raiz fornece seus filhos aninhados. No desktop, o `p-treeTable` e o paginador permanecem.

Ao evoluir essas listagens:

- manter uma única fonte de dados para desktop e mobile;
- usar sentinel com `IntersectionObserver`, não evento bruto de scroll;
- impedir requisições concorrentes e interromper ao atingir `totalRecords`;
- preservar o filtro aplicado nas páginas incrementais;
- em árvores, nunca paginar uma sequência achatada de pais e filhos;
- validar claro, escuro, expansão profunda, lista vazia e viewport curta.

Build de produção validado com `npm run build`; permaneceu somente o aviso conhecido do `quill-delta`.


## Atualização — planos e limites SaaS no frontend (19/07/2026)

O estado da assinatura é centralizado em `shared/services/subscription/SubscriptionService`. O shell consulta `GET /getCurrentSubscription` antes de montar menu e páginas; falha nessa consulta não bloqueia o restante da aplicação. O serviço mantém a resposta em memória e expõe estado para plano, recursos, funcionalidades e modal de upgrade.

Contas FREE exibem um banner fixo com botão “Ver planos”. Ele abre somente uma apresentação dos planos Essencial (R$ 19,99) e Premium (R$ 39,99), sem checkout fictício. Contas pagas não exibem o banner.

As limitações visuais complementam, mas nunca substituem, o backend:

- pessoas e usuários administrativos desabilitam a criação ao atingir o limite;
- células podem ser criadas como planejadas e bloqueiam apenas a ativação sem capacidade;
- criação de grupo de permissão ativo respeita o limite;
- dashboard executivo mostra paywall sem chamar suas APIs;
- traduções personalizadas e template de relatório somem do menu FREE e recusam URL direta;
- erros de assinatura 403/422 exibem a mensagem específica devolvida pelo backend.

Overrides de idioma não são consultados quando `CUSTOM_TRANSLATIONS` está desabilitado. Build validado com `ng build --configuration production --no-progress`; permaneceu apenas o aviso conhecido do `quill-delta`.

### Complemento — limites financeiros (20/07/2026)

O formulário de caixas limita separadamente registros físicos (`CASH_ACCOUNT`) e contas bancárias (`BANK_ACCOUNT`) conforme o tipo selecionado. Criação e mudança de tipo são bloqueadas sem capacidade; editar um registro mantendo seu tipo continua permitido. O catálogo de instituições bancárias não é limitado. Após salvar, o estado da assinatura é recarregado.


## Encerramento — assinatura, autorização e site público (20/07/2026)

O `authInterceptor` diferencia as duas camadas de bloqueio: `permission_access_denied` representa autorização do usuário; respostas `403/422` com chave `subscription_*` representam plano, feature ou limite e devem manter a mensagem específica do backend. A interface pode ocultar e desabilitar ações para orientar o usuário, mas o backend continua sendo a autoridade.

O site público de lançamento vive em `../site/`, separado em `index.html`, `styles.css` e `app.js`, com Vue 3 via CDN. `APP_URL`, no topo de `app.js`, é a única origem dos links para `/login` e `/signup`. A landing apresenta somente funcionalidades confirmadas pelos handoffs e pelo produto atual. Não anunciar notificações, conciliação, impressão, exportações, checkout ou qualquer fluxo ainda não consolidado.

A seção de planos contém os valores e limites persistidos: pessoas 30/150/500, usuários 2/5/15, células ativas 2/15/60, caixas 1/5/20, contas bancárias 1/5/20, grupos ativos 1/5/ilimitado e armazenamento 100 MB/1 GB/5 GB. Dashboard financeiro/agenda, traduções personalizadas e template de relatório aparecem como recursos pagos implementados. Os CTAs dos planos pagos levam ao cadastro gratuito porque ainda não existe checkout online.

Validações finais: build de produção Angular aprovado; site validado com `node --check`, balanceamento CSS e DOM Vue renderizado em Chrome headless.

## Identidade pública e experiência instalável — 21/07/2026

O Church Lite é o primeiro produto do ecossistema SmartVerse. Nas telas públicas, Church Lite identifica o produto de gestão de igrejas e SmartVerse funciona como assinatura institucional. Login e cadastro usam a mesma composição visual: marca Church Lite junto ao formulário, logo vetorial SmartVerse no painel institucional e fundo escuro violeta com apoios azul/verde alinhados à interface interna.

A tela `/login` contextualiza o retorno à igreja e aceita submissão nativa do formulário. A tela `/signup` contextualiza a criação gratuita da igreja e apresenta o Church Lite como início da jornada dentro do ecossistema. Em telas pequenas, o painel institucional é ocultado para priorizar os formulários. O SVG oficial usado nessas páginas está em `src/assets/logo/smartverse.svg`.

O favicon do Angular é `src/favicon.svg`, com quadrado violeta e estrela branca. As páginas de desenvolvimento e produção referenciam esse SVG.

A pasta `public/` contém a experiência de instalação móvel:

- `manifest.json`: nome, descrição, escopo e cores do Church Lite;
- `icons/church-lite-192.png` e `icons/church-lite-512.png`: ícones `any maskable`;
- `start_url`, `scope` e `id`: `/church-lite/`;
- exibição `standalone`, idioma `pt-BR` e orientação livre;
- metadados Android/iOS declarados em `index.html` e `index.dev.html`.

O `angular.json` exporta todo o conteúdo de `public/` para a raiz do build. O manifest oferece nome, ícone e aparência de aplicativo ao adicionar à tela inicial, mas não fornece operação offline; isso exigirá service worker em uma evolução própria.

## Atualização — confirmação e reenvio de e-mail (11/08/2026)

Após o cadastro, o backend envia o link de confirmação. Quando uma nova tentativa de cadastro retorna `account_confirmation_pending`, `/signup` oferece a ação de reenvio usando o endpoint anônimo `POST /resendConfirmation`. A resposta é deliberadamente neutra para não revelar a existência da conta. A rota `/register-church/:hash` agora informa quando o token é inválido e mantém o redirecionamento ao login após confirmação válida. Build de produção validado com `npm run build`.

## Atualização — contratação de planos pelo Smart Payment (15/08/2026)

O modal compartilhado de upgrade deixou de ser apenas informativo. A igreja escolhe entre Essencial e Premium, seleciona o ciclo `MONTHLY`, `QUARTERLY` ou `SEMIANNUAL`, visualiza o total com desconto e chama `POST /createPaymentLink`. O frontend não envia valor nem tenant; esses dados são resolvidos e validados pelo backend. A URL retornada só é aberta quando usa HTTPS ou HTTP local, e o checkout substitui a página atual.

O mesmo modal consulta `GET /getPaymentHistory` e mostra as cinco cobranças mais recentes, com plano, ciclo, valor, data e situação. A confirmação visual não ativa a assinatura: após o Smart Payment publicar o evento confirmado, o próximo carregamento de `GET /getCurrentSubscription` reflete o plano concedido pelo backend. Textos da jornada existem nos quatro catálogos e o limite exibido do Essencial foi alinhado para 150 pessoas.

Erros `403/422` continuam centralizados no interceptor; indisponibilidade ou resposta inválida do checkout recebe feedback próprio. Build de produção validado com `npm run build`; permaneceu apenas o aviso conhecido de CommonJS do `quill-delta`.

## Atualização — relatórios dinâmicos por tela (15/08/2026)

O componente compartilhado `ScreenReportButtonComponent` consulta `GET /getScreenReports` usando a URL canônica atual, sem query string e sem barra final. Se não houver relatório ativo para a tela, nenhuma ação é exibida. Com um relatório, o clique gera diretamente; com dois ou mais, abre um menu com os nomes vindos do banco. Assim, novos relatórios tenant-local podem ser disponibilizados sem alteração ou nova publicação do frontend.

O `DatatableComponent` incorpora essa ação em todas as listagens compartilhadas e envia ao backend o snapshot que está na tela: `contents`, `total`, `size`, `offset` e `filter`. A tela `/home/transactions` substituiu o botão de impressão inativo e acrescenta caixa, saldo inicial, receitas, despesas e saldo final. `/home/bank-statament` também expõe a ação e acrescenta conta, receitas, despesas e saldo. As duas ações contextuais ficam desabilitadas até a seleção da conta/caixa.

`ScreenReportService` mantém os contratos tipados e envia somente o UUID local e o JSON para `POST /generateScreenReport`. O navegador decodifica o Base64, cria um `Blob` PDF e abre uma nova aba; API key e UUID remoto permanecem exclusivamente no backend. Falhas fecham a aba provisória e mostram toast traduzido. Textos foram adicionados aos quatro catálogos. Build de produção validado com `npm run build`; permaneceu apenas o aviso conhecido de CommonJS do `quill-delta`.

## Atualização — lançamentos financeiros recorrentes (17/08/2026)

A rota `/home/register/recurringFinancial`, acessível pelo menu Financeiro, usa a listagem compartilhada `RegisterComponent`/`DatatableComponent`; criação e edição abrem o formulário padronizado em `new` e `:id`. O formulário oferece tipo financeiro, repetição, frequência, valor fixo ou estimado, datas, quantidade de 2 a 60 parcelas e classificações. Na edição, a programação fica bloqueada e somente dados aplicáveis às ocorrências futuras podem mudar. Os textos existem nos quatro catálogos de idioma. Build de produção validado com `npm run build`.

## Atualização — preenchimento de endereço por CEP (17/08/2026)

`PostalCodeService` consulta exclusivamente o endpoint interno `GET /lookupPostalCode`. O componente compartilhado de máscara expõe `blurred`; pessoa e configuração da igreja usam o evento para preencher logradouro, bairro, complemento não vazio e a entidade `city`. Número e dados manuais são preservados quando a consulta falha. Mensagens existem nos quatro catálogos.
