# Handoff — Church Lite Frontend

## Visão do produto

O Church Lite é um sistema de gestão para igrejas. O frontend centraliza cadastros de pessoas e igrejas, agenda, rotinas financeiras e configurações do usuário.

Este documento descreve a aplicação Angular existente. Ele não documenta o `entity-generator`; o gerador é relevante apenas porque parte dos CRUDs e metadados consumidos pelo frontend é produzida por ele no backend.

## Stack e execução

- Angular 21 com componentes standalone;
- TypeScript 5.9, RxJS e SSR com Express;
- PrimeNG, PrimeFlex e PrimeIcons;
- FullCalendar;
- traduções em `src/assets/i18n`;
- autenticação por JWT armazenado em cookie.

```bash
npm install
npm start
npm run build
npm test
```

API:

- desenvolvimento: `http://localhost:5050/church-lite`;
- produção: `https://develop.smartverse.com.br/api/church-lite`.

## Organização

```text
src/app/
├── components/       formulários e componentes de domínio
├── pages/            páginas e composição das funcionalidades
├── security/         login, cadastro e guards
├── services/         serviços específicos
├── shared/           CRUD, tabela, inputs, modal e utilitários
└── config/           HTTP, interceptor e menu lateral
```

Fluxo predominante:

```text
Página → componente/configuração de formulário → CrudService → API
```

O `CrudService` implementa:

- `POST /{entidade}`;
- `PUT /{entidade}/{id}`;
- `DELETE /{entidade}/{id}`;
- `GET /{entidade}/{id}`;
- `GET /{entidade}?size=&offset=&filter=&order=&displayFields=`.

## Funcionalidades mapeadas

### Acesso e implantação

Login, cadastro inicial, confirmação/cadastro da igreja por hash, guards de rotas e envio do JWT.

### Pessoas e comunidade

O cadastro-base é reutilizado para membros, visitantes, novos convertidos, fornecedores e outras igrejas. Contempla dados pessoais, endereço, documentos, contatos, nacionalidade, naturalidade, estado civil, gênero, imagem e dados de membro/cargo.

### Agenda

Agenda com FullCalendar, compromissos e tipos de evento, incluindo cor, local e período.

### Financeiro

Receitas, despesas, plano de contas, centros de custo, bancos, caixas/contas bancárias, abertura e fechamento, movimentações, extrato e histórico.

### Configurações

Preferências do usuário, tema, idioma, dados pessoais e upload de imagem por URL assinada.

## Rotas

As rotas privadas ficam sob `/home`: `dashboard`, `scheduler`, `register/:hash`, `planAccount`, `costCenter`, `transactions`, `bank-statament`, `cash-history`, `user-configuration` e `notification`.

As rotas públicas são `login`, `singup` e `register-church/:hash`. As grafias `singup` e `bank-statament` são atuais; alterá-las exige revisar links existentes.

## Estado atual

Com implementação visível:

- autenticação e cadastro inicial;
- pessoas, cargos, eventos, bancos e caixas;
- plano de contas e centros de custo;
- receitas, despesas e movimentações;
- agenda e preferências;
- componentes compartilhados de formulário e tabela.

Presentes no menu, mas incompletas ou sem fluxo consolidado:

- cadastro de usuários;
- traduções administrativas;
- permissionamento;
- cabeçalho de relatórios;
- notificações e dashboard definitivos.

## HTTP e autenticação

`authInterceptor` prefixa URLs relativas, inclui `Authorization`, libera URLs assinadas da Amazon e encerra a sessão em erros de autenticação. O tenant autenticado é extraído do JWT pelo backend.

Há registro de `HttpClient` em `app.config.ts` e em `HttpModule`. A evolução deve convergir para uma única configuração global com `provideHttpClient(withInterceptors([authInterceptor]))`.

## Convenções

- Usar `CrudService` para CRUDs padrão e serviço específico para regras de negócio.
- Manter formulários em arquivos `*.config.ts`.
- Criar interfaces TypeScript e reduzir `any`.
- Preservar nomes do backend: `person`, `financial`, `cash`, `bank`, `planAccount`, `costCenter` etc.
- Traduzir novos textos; o menu ainda tem textos fixos.
- Não tratar uma entrada no menu como funcionalidade concluída.

## Pontos de atenção

- Codificar `filter`, `order` e `displayFields` antes de montar a URL.
- Erro de rede (`status 0`) atualmente encerra a sessão.
- Visitantes usam `paramExtra: "SUPPLIER"` apesar do filtro de visitante.
- Testes atuais são principalmente scaffolds de criação.
- Build de produção validado em 13/07/2026.

## Checklist de funcionalidade

1. Confirmar contrato no backend.
2. Regenerar e compilar a saída `_gen`.
3. Criar interfaces de entrada e saída.
4. Implementar serviço, formulário e página.
5. Adicionar rota, menu e traduções.
6. Validar autenticação, tenant, loading e erros.
7. Testar o fluxo principal.
8. Executar `npm run build`.

## Atualização — agenda recorrente (14/07/2026)

A página de agenda deixou de usar eventos fixos e passou a carregar `appointments` e `eventsType` da API. O usuário pode criar compromissos únicos ou semanais, selecionar um ou vários dias (por exemplo, quinta e domingo), editar, arrastar para reagendar, cancelar e excluir.

O tipo de evento cadastrado fornece o título e a cor exibidos no FullCalendar. Eventos cancelados permanecem visíveis em cinza. A criação exige pelo menos um tipo de evento cadastrado e uma configuração de usuário válida.

## Atualização — cadastro de usuários (14/07/2026)

O menu Configurações possui a rota `/home/register/users`, com listagem baseada em `userConfiguration`. A criação usa `POST /createChurchUser` e solicita nome, e-mail, telefone e senha. Edição e exclusão usam o CRUD de `userConfiguration`, cujos handlers sincronizam o registro administrativo.

O telefone também foi incluído na tela de configuração do usuário atual.
