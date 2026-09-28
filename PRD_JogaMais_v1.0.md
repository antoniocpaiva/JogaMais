# JogaMais v1.0 — Documento de requisitos do produto

**Versão:** 1.0, proposta para implementação  
**Data:** 20 de setembro de 2026  
**Responsável pelo produto:** Antonio Carlos de Paiva  
**Estado:** especificação do MVP; decisões em aberto identificadas ao final

## 1. Resumo executivo

JogaMais é uma plataforma de acompanhamento do desenvolvimento esportivo de crianças e adolescentes em escolinhas de futebol. O treinador registra avaliações periódicas com critérios descritos, define metas e acompanha a evolução. O coordenador acompanha a operação. A família visualiza somente os dados de seus filhos, em linguagem clara e sem ranking entre crianças.

O primeiro marco funcional é cadastrar **Atleta Demo 01** em uma turma Sub-11 de demonstração, registrar uma avaliação, publicá-la e visualizar seu histórico e suas metas nos perfis autorizados. Este perfil é uma fixture inteiramente fictícia. Nomes e fotografias reais não devem compor demonstrações públicas, repositórios abertos ou material comercial; qualquer uso privado ou em produção depende das permissões e do registro de autorização apropriados.

O MVP deve funcionar em navegador no computador e celular, com interface responsiva e instalação PWA quando tecnicamente disponível. A primeira implantação atende uma escolinha piloto, mas o modelo de dados e a autorização devem isolar múltiplas organizações desde o começo.

## 2. Problema, público e resultado esperado

Hoje avaliações podem ficar dispersas em conversas e planilhas, com critérios subjetivos e pouco histórico acessível à família. O JogaMais organiza o ciclo **avaliar → definir metas → treinar → reavaliar → comunicar evolução**.

| Público | Necessidade principal | Resultado no MVP |
|---|---|---|
| Treinador | Registrar avaliações em campo sem perder tempo | Avaliar atletas em sequência, salvar rascunhos e publicar |
| Coordenador | Saber quem foi avaliado e acompanhar as turmas | Ver cobertura por ciclo, pendências e avaliações publicadas |
| Responsável | Entender a trajetória do próprio filho | Consultar avaliações publicadas, metas e comentários |
| Administrador da plataforma | Operar organizações e contas | Criar/ativar escolinhas e gestores, sem acesso regular ao conteúdo individual |

**Hipótese a validar:** avaliações consistentes, comunicação compreensível e histórico visível aumentam a adoção pelos treinadores e o valor percebido pelas famílias. Não há meta numérica ou alegação comercial comprovada nesta etapa.

## 3. Escopo e prioridades

### Incluído no lançamento piloto

1. Organizações, contas, papéis e isolamento entre escolinhas.
2. Turmas, vínculo de treinadores, cadastro de atletas e vínculo de responsáveis.
3. Ciclos trimestrais configurados pelo coordenador; metodologia padrão versionada.
4. Avaliação por critério em escala de 1 a 5, rascunho, revisão e publicação.
5. Fluxo móvel de avaliação sequencial da turma.
6. Metas vinculadas a critérios e revisadas no ciclo seguinte.
7. Perfil e histórico do atleta; comparações entre ciclos comparáveis.
8. Painel de cobertura das avaliações e portal da família.
9. Foto de perfil opcional em armazenamento privado; trilha de auditoria para operações críticas.
10. Estados vazios, convites de acesso, recuperação de conta e configurações básicas da escolinha.

### Depois do piloto, sujeito à validação

Upload de vídeos e outras evidências, exportação PDF, diário de observações, importação em lote, critérios personalizados por escolinha, cálculo agregado de evolução por turma e assistência de IA na redação. Aplicativo nativo, cobrança, assinatura e gestão de planos também ficam fora do primeiro lançamento. O modelo admite essas extensões sem apresentá-las como funcionalidades já entregues.

### Fora de escopo

Rankings públicos de crianças, comparação direta entre faixas etárias, diagnóstico clínico ou biométrico, nota gerada automaticamente por IA, rede social de atletas, transmissão de jogos e divulgação pública de perfis.

## 4. Papéis e permissões

O usuário pode ter associação com mais de uma organização; o papel pertence à associação, não à identidade global. Uma pessoa com papéis diferentes muda explicitamente de organização/contexto.

| Ação | Plataforma | Coordenador | Treinador vinculado | Responsável vinculado |
|---|---:|---:|---:|---:|
| Criar/ativar organização e gestor | Sim | Não | Não | Não |
| Gerir turmas, vínculos e ciclos | Não* | Sim | Não | Não |
| Cadastrar/editar atleta | Não* | Sim | Não | Não |
| Ver atletas e avaliações da organização | Não* | Sim | Só turmas atribuídas | Só seus filhos e publicações |
| Criar/editar avaliação em rascunho | Não | Sim** | Só turmas atribuídas | Não |
| Publicar ou reabrir avaliação | Não | Sim | Só avaliações próprias, se autorizado | Não |
| Criar/revisar metas | Não | Sim** | Só turmas atribuídas | Não |
| Ver auditoria da organização | Metadados operacionais | Sim | Não | Não |

\* Suporte da plataforma não lê conteúdo de crianças por padrão; qualquer acesso extraordinário exige processo separado, justificativa, prazo e auditoria.  
\** Coordenador pode intervir com autoria explícita e registro de alteração; nunca se faz passar pelo treinador.

Autorização é aplicada no servidor e nas regras de banco/armazenamento. Ocultar um botão na interface não concede segurança. Remover um vínculo revoga o acesso futuro imediatamente, inclusive a mídias privadas.

## 5. Jornadas essenciais

**Implantação:** administrador cria escolinha → convida coordenador → coordenador cria temporada, turmas e ciclo → convida treinadores → cadastra atletas e responsáveis → atribui turmas.

**Treinador:** entra em Minhas turmas → escolhe turma e ciclo → vê atletas pendentes → abre Atleta Demo 01 → preenche critérios aplicáveis → salva rascunho → define até três metas → revisa → publica → avança ao próximo atleta. Mudanças posteriores ficam auditadas e sujeitas à política de reabertura.

**Coordenador:** consulta progresso do ciclo por turma → filtra pendentes → acompanha publicação e corrige vínculos/configuração → lê resultados individuais quando necessário.

**Família:** aceita convite → seleciona o filho, se houver mais de um → lê último ciclo publicado, histórico, metas e comentário → nunca vê rascunhos, comparativos entre colegas ou dados de outros atletas.

## 6. Requisitos funcionais e aceitação

| ID | Requisito | Condição de aceite |
|---|---|---|
| RF01 | Convite e acesso | Convite expira; conta verificada recebe apenas papéis/vínculos concedidos; troca de contexto não mistura organizações. |
| RF02 | Escolinha e turmas | Coordenador cria turma por temporada, categoria e nome; atribui mais de um treinador; atleta pode mudar de turma sem perder histórico. |
| RF03 | Cadastro do atleta | Nome, nascimento, turma, estado e posição opcional; foto opcional; campos sensíveis desnecessários são omitidos. |
| RF04 | Vínculos familiares | Mais de um responsável por atleta e mais de um atleta por responsável; acesso só após convite e vínculo ativo. |
| RF05 | Ciclos | Coordenador abre/fecha ciclo com datas e metodologia fixada; cada atleta tem no máximo uma avaliação publicada por ciclo e metodologia. |
| RF06 | Formulário móvel | Critérios agrupados por pilar, botões acessíveis de 1 a 5 e âncoras visíveis; progresso e salvamento de rascunho. |
| RF07 | Publicação | Critérios obrigatórios aplicáveis preenchidos e comentário final informado; publicação grava autor e instante; família só vê publicados. |
| RF08 | Avaliar turma | Após salvar/publicar, avança para próximo atleta pendente da mesma turma/ciclo sem perder dados. |
| RF09 | Metas | Treinador cria até três metas ativas por ciclo, com nível inicial, alvo, ação e prazo; revisão registra atingida, revisada ou cancelada. |
| RF10 | Evolução | Compara apenas o mesmo critério e a mesma versão metodológica ou exibe aviso de incomparabilidade; ausência de avaliação não equivale a zero. |
| RF11 | Painel | Total de elegíveis, publicados e pendentes por ciclo e turma; percentual = publicados ÷ elegíveis, com denominador indicado. |
| RF12 | Família | Mostra apenas publicações próprias e metas liberadas; comunicação simples, sem ordenação competitiva. |
| RF13 | Auditoria | Registra quem alterou vínculo, dados essenciais, avaliação, publicação e meta, com data, organização e identificador do objeto. |
| RF14 | Foto | Arquivo privado e acesso autorizado temporário; opção de remover/substituir; nunca depende de URL pública permanente. |

**Elegível:** atleta ativo vinculado à turma abrangida pelo ciclo na data de referência. O coordenador pode justificar uma exclusão do ciclo; ela fica auditada. Transferências não duplicam a avaliação publicada.

## 7. Metodologia de avaliação

A escala é **1 Inicial, 2 Em desenvolvimento, 3 Adequado à etapa, 4 Avançado, 5 Destaque**. Cada critério apresenta descritores por nível para sua faixa de desenvolvimento. O significado de um nível depende da etapa; níveis entre Sub-9 e Sub-15 não são equivalentes. O treinador marca **não observado** quando não há evidência suficiente; isso exige justificativa e não entra em média.

**Pilares e catálogo inicial:** técnico (passe, domínio, condução, drible, finalização, pé não dominante); tático (posicionamento, leitura de jogo, tomada de decisão, movimentação sem bola, ocupação de espaços, transição); físico (velocidade, agilidade, coordenação, resistência, equilíbrio); comportamental (disciplina, concentração, trabalho em equipe, comunicação, resiliência, comprometimento). O formulário mostra um subconjunto obrigatório por etapa, para que o uso no campo seja viável. Posição específica, inclusive goleiro, entra como conjunto opcional validado com profissionais antes de virar regra obrigatória.

**Exemplo de âncora, finalização:** 1 exige orientação frequente na execução básica; 2 executa com consistência limitada; 3 finaliza adequadamente em situações usuais da etapa; 4 mantém boa execução em situações mais difíceis; 5 demonstra execução consistente e repertório destacado para a etapa. Estas âncoras são exemplos de produto, não metodologia esportiva certificada. Um profissional de formação deve revisar o catálogo antes do piloto.

O ciclo padrão é trimestral, ajustável pela escolinha. O MVP mostra evolução como **mudança de nível por critério** e, quando o conjunto é exatamente comparável, média por pilar acompanhada de seus componentes. Não usa percentuais como “+12%” entre notas ordinais de 1 a 5. Se critérios, aplicabilidade ou versão mudarem, apresenta comparação individual compatível ou apenas avaliações lado a lado. Nunca calcula ranking de atletas.

Rascunhos podem mudar livremente pelo autor autorizado. Após publicação, correção requer motivo, registra versão anterior e republica; o responsável vê a versão vigente e a data de atualização. Ciclos encerrados ficam somente para leitura, salvo reabertura motivada pelo coordenador.

## 8. Telas e estados

| Tela | Conteúdo e ações principais | Estado que precisa existir |
|---|---|---|
| 01 Acesso | Entrar, aceitar convite, recuperar senha | Convite expirado, acesso negado |
| 02 Painel | Ciclo, elegíveis, publicados, pendentes por turma | Nenhum ciclo ativo |
| 03 Turmas | Temporada, categoria, treinadores, lista | Turma vazia |
| 04 Atletas | Busca, filtros, cadastro, vínculo familiar | Sem resultados |
| 05 Perfil do atleta | Foto, turma, último ciclo, histórico e metas | Sem avaliação |
| 06 Nova avaliação | Critérios aplicáveis, âncoras, comentário, rascunho/publicação | Não observado, salvamento falhou |
| 07 Avaliar turma | Progresso e próximo pendente | Ciclo concluído |
| 08 Evolução | Comparação por critério e ciclos | Dados incomparáveis |
| 09 Metas | Criar, revisar, encerrar | Sem metas |
| 10 Portal da família | Seletor de filho, resumo, histórico, metas | Aguardando publicação |
| 11 Configurações | Organização, papéis, vínculos, temporadas/ciclos | Permissão insuficiente |

No celular, o treinador deve chegar à avaliação em poucos toques, usar botões com área de toque confortável e conservar rascunho ao mudar de seção. Se a conexão cair, a interface mostra claramente o estado de salvamento; sincronização offline completa não integra o MVP. O design usa a identidade visual preliminar JogaMais; cores, tipografia e marca final permanecem ajustáveis. **Atleta Demo 01** é o perfil inteiramente fictício da demonstração pública, sem notas, posição ou resultados predefinidos.

## 9. Modelo de dados lógico

| Entidade | Campos/relações essenciais |
|---|---|
| organizations | id, name, status, created_at |
| users | id de autenticação, name, email, status |
| memberships | organization_id, user_id, role, status, invited_at |
| teams | id, organization_id, season_id, name, age_category, status |
| team_coaches | organization_id, team_id, membership_id, active_from/to |
| athletes | id, organization_id, name, birth_date, optional position/photo_key, status |
| athlete_team_memberships | organization_id, athlete_id, team_id, active_from/to |
| guardian_athletes | organization_id, membership_id, athlete_id, relationship, status |
| methodology_versions | id, organization_id or platform scope, version, status |
| criteria | methodology_version_id, pillar, key, label, descriptors 1–5, applicability, required |
| assessment_cycles | organization_id, season_id, methodology_version_id, start/end, status |
| assessments | organization_id, athlete_id, team_id, cycle_id, author_id, status, comment, published_at, revision |
| assessment_scores | organization_id, assessment_id, criterion_id, score nullable, not_observed_reason |
| goals | organization_id, athlete_id, source_assessment_id, criterion_id, baseline, target, action, due_at, status |
| athlete_media | organization_id, athlete_id, storage_key, kind, authorization reference, status |
| consents | organization_id, athlete_id, guardian_id, purpose, scope, status, recorded_at, evidence reference |
| audit_events | organization_id, actor_id, action, resource, resource_id, timestamp, change metadata |

IDs e chaves estrangeiras compostas devem impedir ligações cruzadas entre organizações. Unicidade de publicação e integridade de critérios do ciclo são impostas no banco/transação, além da API. Histórico decorre de avaliações e metas; não há tabela separada com percentuais pré-gravados. Um atleta transferido mantém sua trajetória e a turma de cada avaliação permanece identificável.

## 10. Arquitetura e requisitos não funcionais

**Candidato de implementação:** Next.js, React, TypeScript, Tailwind CSS, PostgreSQL e autenticação/armazenamento privado gerenciado, com Supabase como candidato e deploy web a definir. A escolha de fornecedor exige verificar custo, localização/transferência de dados, autenticação, backups e operação antes da implantação real. APIs verificam sessão, membership, organização e vínculo com atleta em toda leitura/escrita. Políticas de acesso no banco reforçam esse isolamento; não confiar apenas no `organization_id` enviado pelo navegador.

Fotos são opcionais, validadas por tamanho e tipo, armazenadas em bucket privado e entregues por URL temporária após autorização. Segredos não entram no cliente nem no repositório. Sessões, convites e redefinição de senha usam fluxos do provedor escolhido. Backup com restauração testada, migrações versionadas, logs sem dados sensíveis desnecessários e ambientes separados são requisitos para disponibilizar o piloto.

**Qualidade mensurável no piloto:** ações comuns em celular e desktop; formulário utilizável com teclado e leitor de tela nas funções essenciais; indicadores corretamente recalculados após publicação; isolamento entre organizações, responsáveis e turmas comprovado por testes automatizados de autorização; ausência de vazamento de fotos em URLs públicas; recuperação de rascunho após erro de rede quando o servidor já confirmou o salvamento. Metas de disponibilidade e tempo de resposta serão definidas após o ambiente do piloto ser escolhido.

## 11. Privacidade e governança

O tratamento de dados de crianças e adolescentes exige análise jurídica e operacional antes de produção. O produto deve registrar finalidade, base legal aplicável, responsáveis pelo tratamento, texto e versão da autorização quando cabível, preferência de uso de imagem separada, revogação, retenção, exclusão e atendimento a solicitações dos titulares/responsáveis. A foto enviada nesta conversa não constitui autorização genérica de divulgação.

Dados são mínimos para avaliação esportiva; visibilidade limitada por papel/vínculo; registros de acesso e alterações críticas são auditados; relatórios e mídias não são indexados publicamente. Antes de receber atletas reais, confirmar contratos e responsabilidades entre plataforma e escolinha, política de retenção, transferência internacional eventual, procedimento de incidente e revisão dos textos por profissional habilitado. Isto é requisito de lançamento, sem presumir uma base legal específica para todo cenário.

## 12. Métricas e validação do piloto

Medir: proporção de atletas elegíveis com avaliação publicada por ciclo; tempo mediano para concluir avaliação; proporção de rascunhos abandonados; quantidade de metas revisadas no ciclo seguinte; acessos de responsáveis a avaliações publicadas; erros de permissão/salvamento. Registrar entrevistas curtas com treinador, coordenador e responsáveis. Eventos analíticos usam identificadores pseudônimos e evitam nomes, comentários e fotos.

**Critério de saída do piloto:** uma escolinha conclui um ciclo completo; treinadores avaliam em celular; coordenador identifica pendências; responsáveis vinculados consultam somente seus filhos; comparações mostram mudança por critério sem distorções; controles de autorização e restauração são demonstrados. Metas numéricas de adoção serão pactuadas com a escolinha piloto.

## 13. Plano de entrega

1. **Fundação:** repositório, design básico, autenticação, organizações, membership, políticas de isolamento, migrações e ambiente.
2. **Cadastro:** temporada, turmas, treinadores, atletas e responsáveis; convites e permissões.
3. **Núcleo:** metodologia versionada, ciclos, avaliação móvel, rascunho, publicação e auditoria.
4. **Valor visível:** metas, perfil, evolução, painel do coordenador e portal da família.
5. **Piloto:** testes de autorização e fluxos ponta a ponta, acessibilidade essencial, revisão de privacidade, backup/restauração e validação com usuários reais.

**Cenário de aceite ponta a ponta:** coordenador cria Sub-11 e vincula treinador e Atleta Demo 01; responsável fictício é convidado; treinador publica avaliação com critérios aplicáveis e meta; perfil e histórico refletem a publicação; responsável vinculado a Atleta Demo 01 a visualiza; responsável de outro atleta e treinador de outra turma não a visualizam; segundo ciclo altera um critério e mostra a diferença corretamente.

## 14. Decisões pendentes antes de desenvolvimento ou piloto

| Decisão | Encaminhamento proposto |
|---|---|
| Identidade e nome | JogaMais é nome de trabalho; verificar marca, domínio e conflitos antes de uso comercial. |
| Metodologia | Revisar âncoras, conjuntos obrigatórios e critérios por idade/posição com profissional de formação. |
| Operação piloto | Identificar escolinha, coordenador, turmas, quantidade de atletas e quem administrará convites. |
| Uso de imagens reais | Manter imagens fora da demonstração pública e confirmar autorização, finalidade e escopo antes de qualquer uso privado ou posterior. |
| Fornecedores | Escolher hospedagem, autenticação, banco e storage após estimar custos e requisitos de dados. |
| Publicação | Definir se treinador publica diretamente ou coordenador aprova por escolinha; MVP propõe publicação direta com reabertura auditada. |
| Retenção e privacidade | Formalizar bases, avisos, consentimentos aplicáveis, prazo de retenção e exclusão antes de dados reais. |

**Próximo artefato de engenharia:** backlog de histórias e critérios de teste da primeira fase, seguido de esquema SQL/políticas de acesso e protótipo clicável alinhados a este PRD.
