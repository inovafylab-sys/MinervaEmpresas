# Minerva Aurora — nova versão do Workspace

Interface criada do zero, em diretório independente. Os documentos existentes foram preservados. Não havia código da versão Replit no checkout nem em outra branch remota durante esta implementação; portanto essa versão não foi importada ou alterada.

A inspiração das referências é a identidade tecnológica. A composição é original: luz azul difusa em fundo preto, painéis de vidro fosco, bordas delicadas, letras claras e espaços amplos. Nenhuma imagem do PDF foi reproduzida na interface.

## Executar

Sem dependências de produção, instalação de pacotes ou build:

```bash
cd /workspace/MinervaEmpresas/versions/aurora
python -m http.server 4173 --bind 127.0.0.1
```

Abra o servidor em um navegador compatível. Também é possível servir a pasta com qualquer servidor estático. Não precisa de credenciais. Rotas usam hash, permitindo links diretos e recarregamento sem configuração de fallback. Fontes, ícones vetoriais e fundos são locais; não há CDN ou importação externa.

## Páginas

- Painel único por perfil, dividido em seções; o painel do gestor reúne todos os indicadores empresariais: dois funis completos, conversão entre etapas, filtro de campanha, resultados comerciais, pedidos e desempenho da equipe.
- Estratégia, distribuição validada em 100% e segmentação contextual.
- Campanhas, filtros, criação local e ficha da campanha.
- Pessoas com galeria, lista e visualização compacta; busca e filtros combináveis por tipo, especialidade/contexto, cidade, etapa e responsável; popup de prévia por hover/foco/toque e ficha individual. Filtros são preservados no retorno da ficha.
- Conversas com composição de mensagens explicitamente não enviadas.
- Reuniões, calendário demonstrativo, preparação e registro de resultado.
- Visitas, mapa conceitual, roteiro e registro de resultado.
- Quadros de pessoas por jornada, reutilizando os registros de Pessoas e a mesma ficha.
- Tarefas em página própria, com criação, alteração de estado e persistência local; tarefas atribuídas conforme o perfil.
- Pedidos, ficha, detalhe de pagamento, envio, catálogo, produto, estoque e movimentos.
- Prévias de catálogo e pagamento do paciente, acessíveis pela busca global.
- Cérebro: identidade, manuais, conhecimento, memória, decisões, fontes e versões.
- Gestão: empresa, equipe, permissões explicativas, conexões, plano e preferências. Equipe abre as mesmas fichas de colaboradores de Pessoas, com indicadores, carteira/atividades ou pedidos/logística de cada profissional.
- Notificações e proposta de aprovação.
- Apresentação do sistema em oito etapas, orientada pelo material Neurum.

Apenas uma página ocupa a área principal. Fichas substituem a página principal e têm navegação de retorno. O Copilot é aberto pelo cabeçalho e permanece ao lado da página no desktop; em telas pequenas usa painel sobreposto. O menu mantém altura fixa e expande por hover ou foco do teclado, deslocando a página principal para abrir espaço em desktop, tablet e celular. Busca global: botão no cabeçalho ou Ctrl/Cmd+K. A preferência do dispositivo por movimento reduzido é respeitada.

## Limites reais

Esta entrega é uma versão navegável de frontend com dados fictícios sinalizados. Há três prévias de perfil: Gestor, Representante e Despachante. Cada prévia delimita menus, indicadores, pessoas, pedidos, tarefas, busca e fichas na demonstração. Gestor acompanha a operação empresarial; representante trabalha sua carteira; despachante recebe contatos operacionais e pedidos atribuídos. Não há autenticação ou autorização de servidor, IA real, API CEBD, WhatsApp, Telegram, calendário, checkout, envio ou prospecção conectados. O seletor é uma ferramenta de revisão da interface, não um controle de segurança. Catálogo e checkout do paciente são prévias de apresentação e não devem ser usados para dados reais.

O Copilot é um demonstrador determinístico de navegação: entende comandos como “abra os pedidos”, abre a página e explica o contexto. Não executa ações externas e não usa LLM.

Pessoas (incluindo colaboradores), campanhas, tarefas, pedidos, produtos, documentos e agenda de reuniões/visitas têm criação, consulta, edição e exclusão com confirmação, salvas no armazenamento deste navegador. A distribuição da estratégia também é preservada. Ações de gerenciamento respeitam os escopos demonstrativos; vínculos de pedidos e atividades bloqueiam exclusões de pessoas, produtos e campanhas. Formulários de resultado atualizam os registros da agenda. Mensagens e propostas continuam demonstrativas e temporárias. Não existe compartilhamento entre navegadores ou dispositivos. Falhas de armazenamento são informadas e deixam os registros temporários na aba. Dados clínicos, confirmação de pagamento e regras comerciais não são inferidos pelo frontend. O backend deverá fornecer identidade, autorização, validações e evidências antes de qualquer uso operacional.

## Validação

```bash
node --check app.js
node --check company.js
node --check people-preview.js
# Em outro terminal, com o servidor acima ativo:
python tests/smoke.py
python tests/profiles.py
python tests/company.py
python tests/crud.py
python tests/routes.py
python tests/growth.py
```

O teste requer o pacote Python Playwright e Chromium. Use `MINERVA_CHROMIUM` para definir outro caminho de navegador e `MINERVA_TEST_URL` para outra origem. Não são dependências da aplicação.

O teste de smoke percorre as 44 rotas principais e contextuais, valida página única, busca, filtros e estado vazio, criação segura de pessoa, persistência e edição de tarefas, soma da estratégia, navegação do Copilot, mensagens não enviadas, seis abas de Gestão, oito slides, hover do menu e ausência de overflow de página no mobile. A suíte adicional de perfis valida as três prévias, contagens por população, restrições de apresentação em links diretos/busca/Copilot, separação de Quadros/Tarefas, filtros compartilhados entre visualizações, retorno à coleção e adaptador de nome/foto da sessão. Essas verificações não substituem testes de autorização do futuro backend. Capturas de revisão são produzidas em `/tmp` e as capturas selecionadas estão em `preview/`.

## Referências

Documentação em `../../docs/produto` e PDF Minerva Empresa — Neurum fornecido pelo proprietário. As definições atuais do proprietário prevalecem: identidade tech como inspiração, uma página por vez e botão do Copilot no cabeçalho.

## Fichas humanas e contexto da IA

A ficha de gestão, a ficha de relacionamento e a ficha operacional são apresentações diferentes para finalidades humanas. O contexto privado de atendimento da IA pertence à operação Minerva e não é incluído nos fixtures nem retornado por uma página de usuário. O contrato proposto, a matriz de perfis e a ligação futura ao Google estão em [Perfis e fichas](docs/perfis-e-fichas.md).

O cabeçalho aceita nome e foto por um adaptador de apresentação, depois de uma sessão validada pelo backend. Login Google real ainda não está configurado. O adaptador não atribui papel nem verifica token.

A suíte `tests/company.py` verifica os 9 marcos médicos e 10 marcos do paciente, taxas calculadas na mesma coorte, filtro de campanha, ausência de denominador, populações abertas a partir dos números, fichas da equipe com escopo individual, popup por hover/teclado/toque e adaptação ao celular. `company.js` contém o cenário fictício e a apresentação dos indicadores; `people-preview.js` controla a prévia não modal.

## Revisão de CRUD

Use **Gerenciar registros** nas páginas ou **Novo registro** para criar, editar ou excluir dados fictícios. Equipe é gerenciada como Pessoas do tipo Colaborador. O saldo de produto é uma edição de demonstração; não cria um razão de movimentação de estoque. Reuniões e visitas compartilham a agenda local, sem enviar convites. Edição de etapa não produz marcos de conversão automaticamente. Documentos editados ficam locais e não publicam instruções para agentes.

## Painel único e rotas de visitas

O menu oferece um único **Painel**. `#indicadores` continua como endereço compatível e mostra a mesma página de `#inicio`. Gestor reúne os funis, campanhas, logística, equipe, tarefas e supervisão das rotas; representante e despachante recebem seções correspondentes ao seu escopo.

Em Pessoas, registre **Aceite para visitas** e **Região de visitas**. Quando a região não estiver preenchida, a cidade é usada como agrupamento. Sem aceite explícito, o médico não entra na lista. Em Visitas, escolha a região e monte a rota com os médicos elegíveis. A seleção do representante é limitada à sua carteira. As paradas podem ser reordenadas e a rota é salva no navegador.

**Fluxo de produto acordado:** Nova rota ou pedido ao Copilot → sugestão por IA dos médicos elegíveis e caminho no mapa → revisão → Iniciar rota → localização GPS durante a execução → supervisão no painel do gestor. O rastreamento real, a integração de mapas, cálculo de caminhos e geração por IA ainda não estão implementados. Os controles atuais são explicitamente de simulação; não solicitam geolocalização, não enviam localização e não acompanham outros dispositivos. O gestor vê as rotas registradas na mesma origem/navegador, com progresso simulado e última atualização. Revogação do aceite, mudança de região ou carteira sinalizam rotas que precisam de revisão.

## Aprimoramento dos funis

O gestor abre um único Painel com as guias **Indicadores**, **Análises e hipóteses**, **Experimentos**, **Configuração atual** e **Operação**. Indicadores é a primeira guia e mantém os funis completos lado a lado no desktop: médicos em azul, pacientes em verde. Em telas menores, os funis ficam empilhados.

Hover/foco numa etapa mostra bases de cálculo, conversão da passagem anterior e desde a entrada, pessoas que ainda não avançaram e alcance da última etapa. Clique/toque abre detalhe lateral, com abas **Análise**, **Hipóteses**, **Experimentos** e **Padrão atual**. No celular, o detalhe ocupa a tela e pode ser fechado para voltar ao painel. Escape fecha o detalhe e devolve o foco. As guias aceitam setas, Home e End.

Hipóteses, experimentos e padrões de referência têm CRUD local, ligados à etapa do funil. As guias gerais exibem os mesmos registros, com filtro por etapa. A análise atual é uma leitura determinística identificada como demonstrativa, sem IA conectada. Não existe histórico comparável, execução de A/B, cálculo de significância ou aplicação de variantes. Não se declara melhora, vencedor nem efeito causal a partir dos exemplos fictícios. Salvar um padrão é documentação local e não configura agentes. A configuração real e a vigência devem vir de integração futura.

## Menu do usuário

A foto ou as iniciais no cabeçalho abrem um dropdown com identidade, Meu perfil, Preferências e Notificações. Gestão da empresa aparece apenas para o gestor. O menu aceita setas, Home/End e Escape, fecha ao clicar/focar fora e devolve o foco ao avatar ao fechar por Escape. Preferência pessoal de redução de animações é salva neste navegador. Não há ação de logout enquanto a autenticação real não estiver integrada.

Validação: `python tests/user_menu.py`.
