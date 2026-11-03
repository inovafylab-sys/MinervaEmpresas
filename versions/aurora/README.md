# Minerva Aurora — Workspace de demonstração

Frontend independente em HTML/CSS/JavaScript, com dados fictícios e persistência no navegador. Não há API de produção, autenticação real, IA conectada ou sincronização entre dispositivos.

## Executar

```bash
cd versions/aurora
python -m http.server 4173 --bind 127.0.0.1
```

Abra `http://127.0.0.1:4173`. A aplicação não exige build, pacotes de produção, CDN ou credenciais. A navegação usa hash. Os documentos de produto em `../../docs/produto` são referência funcional.

## Dashboard por perfil

Uma página reúne indicadores e trabalho, divididos em blocos:

- **Gestor:** resumo da empresa, avisos, tarefas da equipe, atividades e agenda, funis comerciais de médicos e pacientes, campanhas, pedidos e logística, desempenho da equipe e supervisão de rotas.
- **Representante:** carteira e indicadores próprios, avisos, tarefas, agenda e rotas atribuídas.
- **Despachante:** indicadores da operação atribuída, pendências, tarefas e fila de pedidos, com atalhos para catálogo e estoque.

Não há guias de análise da IA, hipóteses ou experimentos nesta versão. Os registros de aprimoramento previamente salvos permanecem no armazenamento local, sem interface ou ações habilitadas. O endereço antigo de aprimoramento não abre esses recursos.

Os funis mostram marcos alcançados, pessoas únicas, conversão da passagem anterior e desde a entrada da mesma coorte. Hover/foco mostra as bases; clique/toque abre somente os números e a população da etapa. Sem histórico comparável, o sistema não declara melhora ou piora. Reuniões e visitas são atividades de apoio, não passos obrigatórios do funil.

## Configurações da empresa

O gestor acessa uma central com os grupos:

1. Dados da empresa: nome, razão social, CNPJ, contatos, cidade, endereço, site e fuso horário.
2. Comercial e atendimento: capacidade de aquisição, responsável padrão, horário de visitas, orientações de pedidos/atendimento, distribuição por segmentos e campanhas.
3. Equipe e responsabilidades: colaboradores, funções e responsáveis pelos registros.
4. Catálogo e estoque: produtos, apresentações, preços e saldos demonstrativos.
5. Pedidos e agenda: estados operacionais, responsáveis, rastreio, atividades e rotas.
6. Cérebro e materiais: documentos de identidade, manuais e referências.
7. Preferências pessoais: acessibilidade e movimento reduzido.
8. Conexões e acesso: situação informativa; login, canais e permissões reais ainda não estão integrados.

O nome da empresa aparece no workspace e no perfil. A capacidade é usada na distribuição da estratégia; o responsável padrão vale para novos cadastros. Editar função de um colaborador não concede permissões reais. Dados e regras principais podem ser editados, mas não excluídos.

## Cadastros e persistência

Pessoas, campanhas, tarefas, pedidos, produtos, documentos e agenda possuem criação, leitura, edição e exclusão com confirmação. Vínculos bloqueiam exclusões de pessoas, produtos e campanhas quando há dependências. Colaboradores são pessoas do tipo Colaborador. As alterações ficam salvas nesta origem/navegador; falhas de armazenamento são informadas.

O saldo de produto é uma edição de demonstração, sem razão real de estoque. Etapas e pagamentos editados não geram marcos de conversão automaticamente. Documentos salvos não publicam instruções para agentes. Conversas, propostas, catálogo do paciente e pagamentos são prévias sem execução externa. Nunca usar dados reais de pacientes nesta demonstração.

## Rotas de visitas

Na ficha do médico, registre o aceite e a região de visitas. Na ausência de região, a cidade é usada como agrupamento. Sem aceite explícito, o médico não entra no planejamento. Representantes veem somente médicos de sua carteira. As paradas podem ser selecionadas e ordenadas; a rota é salva localmente.

Fluxo de produto previsto: Nova rota ou pedido ao Copilot → sugestão de médicos elegíveis e caminho no mapa → revisão → Iniciar rota → GPS durante a execução → supervisão pelo gestor. Mapa, cálculo de caminho, IA e rastreamento real ainda não estão implementados. Os controles de progresso são simulações identificadas, sem solicitar nem transmitir geolocalização. A supervisão mostra os registros do mesmo navegador e sua última atualização simulada. Mudança de aceite, região ou carteira sinaliza revisão da rota.

## Navegação e composição

A visualização do conjunto é o objetivo: cada bloco apresenta uma unidade completa de informação. Cabeçalhos compactos reservam espaço para os dados. A entrada mostra números, avisos, tarefas e atividades; as áreas seguintes aprofundam a operação. Experimentos não fazem parte desta versão.

O menu é ordenado por perfil, sem painel retangular de fundo: círculos flutuantes maiores, com contraste e destaque do item ativo. Todos os círculos ficam no mesmo eixo do logo do cabeçalho, com espaçamento uniforme entre itens e margens simétricas na área entre cabeçalho e rodapé. A altura disponível fica fixa durante a navegação. O hover/foco expande os rótulos deslocando o conteúdo; a seleção recolhe o menu. Seu espaçamento permite ver os itens em alturas comuns de notebook sem rolar. A foto/iniciais do cabeçalho abrem o dropdown pessoal com perfil, preferências e notificações; o gestor também acessa as configurações da empresa. Escape e clique fora fecham o dropdown; navegação por teclado e movimento reduzido são suportados. A troca de página tem uma entrada deslizante de 240 ms somente no conteúdo principal; filtros e edições não repetem o efeito. Preferências de movimento reduzido do dispositivo e do usuário desativam a transição.

## Validação

Requer Python Playwright e Chromium (`MINERVA_CHROMIUM` pode substituir o executável). `MINERVA_TEST_URL` define outra origem de teste.

```bash
node --check app.js
node --check company.js
node --check crud.js
python tests/smoke.py
python tests/profiles.py
python tests/company.py
python tests/crud.py
python tests/routes.py
python tests/user_menu.py
python tests/navigation_frame.py
python tests/dashboard_settings.py
python tests/floating_nav.py
python tests/page_transition.py
```

As verificações de perfis validam apenas apresentação e escopo da demonstração, não autorização de backend.
