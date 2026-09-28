# JogaMais — M1 executável e fundação M2

O repositório contém a demonstração responsiva do M1 e a fundação segura do M2:

- M1: **Turmas → Sub-11 → Atleta Demo 01 → avaliação demonstrativa → perfil atualizado**;
- M2: PostgreSQL/Supabase, login real, memberships por organização, RLS multi-tenant, convites e cadastros essenciais da coordenação.

## Preview rápido (sem banco)

Requer Node.js 22.6 ou superior e npm.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). As rotas do M1 continuam disponíveis sem credenciais. A página `/entrar` mostra as instruções de configuração enquanto o Supabase não estiver configurado.

## Ambiente M2 local

O ambiente completo requer Docker Desktop (ou runtime compatível com Docker) para executar o Supabase local.

```bash
cp .env.example .env.local
npm run supabase:start
npm run db:reset
npm run db:test
npm run dev
```

Após `supabase:start`, substitua em `.env.local` a URL e a chave publicável pelos valores exibidos pelo CLI. Nunca versione `.env.local`, chaves secretas ou a `service_role`.

Para um projeto hospedado, crie o projeto no Supabase, aplique as migrações com o CLI e configure:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

O primeiro usuário autenticado acessa `/app/configuracoes` e cria a organização. A coordenação então pode:

1. gerar convites de técnico ou responsável;
2. criar temporada e turma;
3. cadastrar atleta já vinculado a uma turma;
4. atribuir técnico à turma;
5. vincular responsável ao atleta;
6. revogar atribuições e vínculos com efeito imediato.

## Verificação

| Comando | Finalidade |
|---|---|
| `npm run check` | lint, testes de domínio e build de produção |
| `npm run supabase:start` | inicia o stack Supabase local |
| `npm run db:reset` | reaplica migrações e seed |
| `npm run db:test` | executa testes pgTAP de constraints e RLS |
| `npm run supabase:stop` | encerra o stack local |

O CI executa duas trilhas independentes: qualidade da aplicação e testes reais das migrações/RLS em Supabase local.

## Segurança do M2

- O servidor verifica a sessão com `getClaims()`; não usa dados de sessão não verificados para autorizar.
- Server Actions são tratadas como endpoints públicos: autenticação, papel e entrada são verificados em cada mutação.
- RLS está habilitado em todas as tabelas públicas e `anon` não recebe privilégios de tabela.
- Chaves estrangeiras compostas impedem vínculos entre organizações.
- Técnico sem atribuição não vê atleta; responsável sem vínculo não vê atleta; responsável nunca vê rascunho.
- Convites expiram em sete dias, são vinculados ao e-mail autenticado e armazenam apenas o hash do token.

Detalhes e matriz de papéis: [`docs/M2_ARQUITETURA.md`](docs/M2_ARQUITETURA.md).

## Dados demonstrativos e limites

Todos os atletas versionados são fixtures genéricas “Atleta Demo”. Não há fotos, datas de nascimento, históricos ou escolas reais no repositório. O rascunho M1 continua em `localStorage` e não representa publicação real.

O catálogo metodológico real, workflow completo de revisão/publicação e metas pertencem ao M3. Uploads, notificações, auditoria automática e hardening operacional pertencem aos marcos seguintes.
