# JogaMais Fase 1 — Backlog e primeiro prompt para o Codex

**Base:** PRD JogaMais v1.0  
**Objetivo:** criar a experiência inicial, depois persistência e autorização, e então o fluxo real de avaliação.  
**Estado:** tarefas planejadas, ainda não implementadas.

## Como executar

Abra um repositório privado no Codex e forneça este arquivo e o PRD. Execute primeiro apenas M1. Revise a experiência no computador e no celular antes de iniciar M2.

Fotografias e nomes reais de crianças não devem entrar no repositório nem em demonstração pública. Use somente aliases explicitamente fictícios, sem inventar data de nascimento, posição, notas ou desempenho, e mantenha um avatar neutro no código.

## Marcos

| Marco | Resultado | Portão |
|---|---|---|
| M1 — Demonstração local | Turma → atleta → avaliação de demonstração → perfil responsivo | Fluxo validado em celular |
| M2 — Base persistente | Banco, identidade, vínculos, isolamento entre escolinhas | Testes de autorização negativos |
| M3 — Núcleo real | Ciclos, critérios versionados, rascunho, publicação, metas e histórico | Teste ponta a ponta |
| M4 — Piloto posterior | Convites, família, foto privada, auditoria e operação | Revisão esportiva e privacidade |

O **primeiro prompt executa somente M1**. Não apresente M1 como sistema pronto para receber dados reais.

## Backlog priorizado

### M1 — Demonstração local

**F1-01 Preparar o projeto.** Inspecionar o repositório existente. Se vazio, criar aplicação Next.js/TypeScript responsiva, scripts de desenvolvimento, lint e build, estrutura de componentes e README. Aceite: instalação e inicialização documentadas, sem segredos ou dados pessoais no controle de versão.

**F1-02 Criar navegação e identidade provisória.** Cabeçalho JogaMais, caminhos Turmas, Atletas e Perfil; layout para celular e desktop, foco de teclado visível, estados vazios e erros. Aceite: navegação compreensível em larguras móvel e desktop. Depende de F1-01.

**F1-03 Isolar dados fictícios.** Tipos, fixtures fictícias e uma interface de acesso a dados substituível por API. Aceite: demo explicitamente rotulada, sem dados reais; qualquer persistência local descrita como temporária. Depende de F1-01.

**F1-04 Mostrar turma e perfil.** Turma Sub-11 de demonstração, lista de atletas e perfil selecionável. Aceite: perfil sem avaliação mostra estado vazio; todas as identidades são fixtures fictícias e nada afirma idade, posição ou desempenho predefinido. Depende de F1-02 e F1-03.

**F1-05 Avaliar na demonstração.** Critérios exemplificativos nos quatro pilares; escala 1–5 com descritores, não observado com justificativa; rascunho e conclusão da demo; perfil atualizado. Aceite: validação dos campos exigidos, fluxo utilizável no celular; nenhuma publicação real ou percentual de evolução ordinal. Depende de F1-04.

**F1-06 Verificar M1.** Rodar lint/build e teste funcional do percurso turma → atleta → avaliação → perfil; revisar celular e desktop. Aceite: comandos e limites registrados no README, falhas corrigidas. Depende de F1-05.

### M2 — Persistência e autorização

**F1-07 Esquema e migrações.** PostgreSQL com organizações, usuários/memberships, temporadas, turmas, atribuições de treinadores, atletas, responsáveis/vínculos, metodologia/versões, ciclos, avaliações/notas, metas e eventos de auditoria. Aceite: chaves e restrições impedem referências entre organizações; transferência de turma preserva histórico. Depende de M1.

**F1-08 Autenticação e permissões.** Login real, papéis por organização, autorização no servidor e políticas de banco. Aceite: testes mostram negação entre escolinhas, treinador sem turma atribuída e responsável sem vínculo; responsável não vê rascunhos. Depende de F1-07.

**F1-09 Cadastros essenciais.** Coordenador cria temporada, turma, atribuição de treinador, atleta e vínculo familiar. Aceite: validação e revogação eficaz; ninguém obtém acesso familiar sem convite e vínculo válidos. Depende de F1-08.

### M3 — Núcleo real

**F1-10 Metodologia e ciclos.** Critérios 1–5 com descritores, aplicabilidade por faixa e versão fixada ao ciclo. Aceite: versões usadas não mudam retroativamente; catálogo é identificado como provisório até revisão esportiva. Depende de F1-09.

**F1-11 Rascunho e publicação.** Treinador salva/retoma rascunho, publica após validação e avança ao próximo atleta pendente. Aceite: autoria e instante, uma versão vigente por atleta/ciclo, correção posterior motivada e revisionada, operações auditadas. Depende de F1-10.

**F1-12 Metas e evolução.** Até três metas ativas por ciclo, ação/alvo/prazo e revisão posterior. Histórico compara mesmo critério e versão; incompatíveis lado a lado. Aceite: não observado não equivale a zero; sem rankings ou percentuais das notas. Depende de F1-11.

**F1-13 Teste ponta a ponta.** Coordenador cadastra turma e atleta fictício; treinador autorizado publica avaliação e meta; perfil reflete o resultado; segundo ciclo mostra mudança de critério. Aceite: outro tenant, treinador sem vínculo e responsável de outra criança recebem acesso negado. Depende de F1-12.

## Definição de pronto

Cada história inclui comportamento demonstrável, tratamento de erro, checagens relevantes, documentação de execução e testes significativos de autorização quando há dados reais. Nunca adicionar credenciais, foto pessoal ou dados reais de menor em commits. Não apresentar fixture como dado persistido ou protegido.

**Portão do piloto:** antes de usar dados reais, validar critérios com profissional de formação, formalizar responsabilidades e permissões de imagem, retenção e exclusão, implementar portal familiar e convites, foto privada, auditoria, backups e restauração testada.

## Primeiro prompt para o Codex

Copie o texto a seguir e anexe este backlog e o PRD ao projeto:

> Você é o engenheiro responsável pela primeira entrega executável do JogaMais. Leia integralmente o PRD_JogaMais_v1.0.md e o JogaMais_Fase_1_Backlog_e_Prompt_Codex.md antes de editar. Execute apenas F1-01 a F1-06, marco M1. Não implemente autenticação, banco real, upload, integração, portal da família ou deploy nesta tarefa.
>
> 1. Inspecione o repositório. Preserve o código útil se já existir. Se estiver vazio, crie uma aplicação Next.js com TypeScript e interface responsiva. Registre qualquer conflito com o PRD.
> 2. Crie navegação JogaMais, lista de turmas, turma Sub-11 de demonstração, lista de atletas, perfil e formulário de avaliação, com visual consistente em celular e desktop e controles acessíveis.
> 3. Use somente fixtures fictícias, claramente identificadas. Use “Atleta Demo 01” no perfil principal e não invente nascimento, posição, notas, histórico ou escola real. Não coloque fotografias reais no repositório; use avatar neutro. Uma avaliação demo deve ser criada pelo usuário durante o teste.
> 4. Agrupe critérios exemplificativos em técnico, tático, físico e comportamental. Mostre escala de 1 a 5 com descritores e opção não observado com justificativa. Permita salvar rascunho e concluir avaliação de demonstração, atualizando o perfil. Se usar armazenamento local, identifique seus limites na interface e no README. Não chame isso de publicação real.
> 5. Não calcule percentuais a partir das notas 1–5. Sem dois ciclos comparáveis, mostre estado sem histórico comparável. Não mostre ranking.
> 6. Separe tipos, fixtures e acesso a dados da interface para permitir substituição posterior por API. Documente instalação, execução e limites da demo.
> 7. Execute lint e build, corrija falhas e adicione somente testes relevantes ao fluxo. Se houver preview, confira celular e desktop.
>
> Ao terminar, informe arquivos criados ou alterados, comandos para executar, passos para conferir turma → atleta → avaliação → perfil, verificações realizadas e pendências de M2. Não afirme que dados estão protegidos por autenticação ou persistidos em servidor. Registre escolhas reversíveis feitas onde o PRD não define uma regra.

**Revisão do produto após M1:** Antonio percorre a avaliação no celular. Se o caminho exigir esforço excessivo, ajusta-se o fluxo antes de F1-07.
