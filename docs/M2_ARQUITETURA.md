# M2 — persistência, identidade e isolamento

## Decisões

- PostgreSQL e Supabase foram adotados para banco, Auth e Row Level Security (RLS).
- A identidade vem do `sub` verificado no JWT do Supabase. O papel não é confiado ao token: ele é consultado em `memberships` por organização.
- O Proxy do Next.js apenas renova a sessão. Toda leitura sensível passa pelo banco com RLS; toda Server Action autentica, autoriza e valida novamente a entrada.
- Relações de negócio carregam `organization_id` e usam chaves estrangeiras compostas. Um UUID válido de outra organização não pode ser conectado por acidente.
- Convites guardam somente SHA-256 do token. Técnico e responsável precisam de convite aceito para obter membership ativo.
- Um responsável só vê atleta com vínculo ativo; avaliações só aparecem ao responsável quando publicadas. A revogação do membership, da atribuição ou do vínculo deixa de satisfazer a política imediatamente.
- A criação de atleta e seu primeiro vínculo de turma ocorre em uma única função transacional.

## Matriz de autorização implementada

| Recurso | Coordenação | Técnico | Responsável |
|---|---|---|---|
| Organização, temporada e turma | leitura e gestão na própria organização | leitura na própria organização | leitura na própria organização |
| Atleta | todos da organização | somente turmas atribuídas | somente atletas vinculados |
| Avaliação | todas da organização | somente turmas atribuídas; edição de rascunho/devolvida | somente publicada e do atleta vinculado |
| Metas | gestão | atletas de turmas atribuídas | somente liberadas e do atleta vinculado |
| Vínculos e convites | gestão | sem gestão | sem gestão |
| Auditoria | leitura | sem acesso | sem acesso |

## Limites desta entrega

- O M2 cria a fundação e o fluxo operacional de convites por link copiável. Envio automático por e-mail fica para integração posterior.
- O catálogo metodológico, publicação/revisão completa e metas guiadas pertencem ao M3. As tabelas e políticas já estão prontas para esse trabalho.
- Auditoria automática detalhada pertence ao M4; o schema de eventos já existe, sem permitir inserção direta por clientes.
- Não usar dados pessoais reais antes da revisão de privacidade e da configuração do projeto Supabase de produção.
