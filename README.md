# JogaMais — M1 demonstração local

Primeira entrega executável do JogaMais, limitada às histórias **F1-01 a F1-06**. O projeto demonstra o percurso responsivo:

**Turmas → Sub-11 → Atleta Demo 01 → avaliação de demonstração → perfil atualizado**

> Esta entrega não é um sistema pronto para dados reais. Não possui autenticação, servidor, banco, autorização, upload, portal familiar ou publicação real.

## Requisitos e execução

- Node.js 22.6 ou superior (validado com Node 24; os testes usam remoção nativa de tipos TypeScript)
- npm

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Para uma checagem completa:

```bash
npm run check
```

Comandos disponíveis:

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o ambiente local de desenvolvimento |
| `npm run lint` | Executa as regras de qualidade do código |
| `npm run test` | Testa as regras de validação da avaliação |
| `npm run build` | Gera a compilação de produção |
| `npm run start` | Serve a compilação gerada |
| `npm run check` | Executa lint, testes e build em sequência |

## Como conferir o percurso M1

1. Em **Turmas**, abra a turma Sub-11.
2. Na lista da turma, abra o perfil de **Atleta Demo 01**.
3. Confirme o estado vazio e inicie a avaliação.
4. Preencha os quatro critérios exemplificativos. Cada um aceita nível de 1 a 5 ou “não observado”; nesse último caso, a justificativa é obrigatória.
5. Use **Salvar rascunho**, navegue para outra tela e retorne para conferir a recuperação local.
6. Inclua o comentário final e use **Concluir demonstração**.
7. Abra o perfil atualizado. Ele mostra os critérios individualmente, sem média, percentual de desempenho ou ranking.
8. Use **Limpar dados da demo** no fim do perfil para retornar ao estado inicial.

Para revisar o celular, use uma largura de aproximadamente 390 px. A navegação migra para a barra inferior, os controles de nota mantêm áreas de toque amplas e as ações ficam empilhadas. Em desktop, a navegação permanece na lateral.

## Dados e arquitetura

- `src/domain/` contém tipos e regras puras de validação.
- `src/data/fixtures.ts` contém somente a turma e os critérios fictícios da demonstração.
- `src/data/demo-repository.ts` implementa a interface substituível de acesso a dados.
- `src/components/demo-provider.tsx` conecta a interface ao repositório temporário.
- `src/app/` contém as rotas do App Router.

Todos os atletas do código são fixtures genéricas identificadas como “Atleta Demo”. O código não inclui fotos, datas de nascimento, posições, notas, históricos ou escolas reais. A avaliação começa vazia e só é criada pela pessoa que percorre a demonstração.

## Limites deliberados do M1

- O rascunho usa `localStorage`, não é criptografado e existe apenas no navegador atual.
- “Concluir” atualiza a demonstração local; não significa publicar uma avaliação real.
- Não há sincronização entre dispositivos, controle de concorrência ou recuperação após limpar os dados do navegador.
- Os critérios e descritores são exemplos de produto e precisam de revisão por profissional de formação antes do piloto.
- Existe apenas um ciclo demonstrativo; portanto, o perfil exibe estado sem histórico comparável.
- Erros de rota e de renderização possuem estados próprios, mas não há observabilidade de servidor.

## Escolhas reversíveis

- Next.js 16, React 19, TypeScript e Tailwind CSS 4 compõem a base inicial.
- O M1 usa rotas reais para Turmas, Atletas, Perfil e Avaliação; a navegação pode evoluir sem alterar o domínio.
- O repositório local implementa o mesmo limite esperado para uma futura API e pode ser substituído no M2.
- Um critério por pilar reduz o esforço do teste de experiência; o catálogo completo pertence ao núcleo real e depende de revisão esportiva.
- A conclusão direta foi adotada para a demonstração, sem simular aprovação ou publicação.

## Pendências para M2

M2 deve introduzir PostgreSQL e migrações, identidade real, memberships por organização, isolamento entre escolinhas, autorização no servidor e no banco, cadastros essenciais e testes negativos de acesso. Dados reais não devem ser usados antes dessas proteções e da revisão de privacidade prevista no PRD.
