# Minerva Empresa — briefing de contexto para o Replit

> **Leia este documento antes de desenvolver a interface.** Ele transmite o contexto do produto sem exigir acesso às conversas de planejamento.<br>
> **Estado:** contexto consolidado para a primeira versão; não comprova backend, agentes, canais ou integrações funcionando.<br>
> **Destinatário:** equipe/agente Replit responsável pelo frontend.<br>
> **Produto:** Minerva Empresa, da startup Minerva, no contexto da tecnologia Neurum.

## Como usar este material

Este briefing explica **o que estamos construindo, por que funciona assim e como interpretar as telas**. A [especificação funcional do Workspace](workspace-especificacao-funcional.md) detalha páginas, subpáginas, ações e navegação. A [base de contexto e jornadas](minerva-contexto-e-jornadas.md) aprofunda os contratos do backend e dos agentes.

Ordem de leitura:

1. Este briefing: compreensão do produto e da experiência.
2. Especificação do Workspace: comportamento das áreas e visualizadores.
3. Base de jornadas: consultar as seções pertinentes à implementação.

Não é necessário receber as exportações das conversas para compreender ou executar o frontend. Elas contêm exploração histórica, correções, propostas superadas e anexos nem sempre disponíveis. Este conjunto consolidado é a referência de trabalho; mudanças posteriores do proprietário devem ser incorporadas explicitamente.

Os arquivos antigos em `docs/planejamento/00-*`, `01-*`, `02-*` e o rascunho `03-base-consultora-de-medicos.md` não são o briefing vigente para o Replit. Não seguir suas escolhas de arquitetura em caso de conflito com os documentos de `docs/produto`.

**Convenção:** decisões expressas como confirmadas são requisitos. Detalhes identificados como proposta ou pendência ainda não devem ser transformados em regra empresarial definitiva. Replit pode resolver escolhas rotineiras de componentes sem reinventar jornadas, permissões ou condições comerciais.

## Índice

- [1. O que é a Minerva](#1-o-que-é-a-minerva)
- [2. O primeiro produto e sua transformação](#2-o-primeiro-produto-e-sua-transformação)
- [3. Quem usa e por quais canais](#3-quem-usa-e-por-quais-canais)
- [4. Como a operação funciona](#4-como-a-operação-funciona)
- [5. Jornada médica](#5-jornada-médica)
- [6. Jornada do paciente](#6-jornada-do-paciente)
- [7. O trabalho interno e o Copilot](#7-o-trabalho-interno-e-o-copilot)
- [8. Cérebro e design do contexto](#8-cérebro-e-design-do-contexto)
- [9. Como interpretar o Workspace](#9-como-interpretar-o-workspace)
- [10. Catálogo, pagamento e estoque](#10-catálogo-pagamento-e-estoque)
- [11. SaaS, vínculos e permissões](#11-saas-vínculos-e-permissões)
- [12. Divisão de desenvolvimento](#12-divisão-de-desenvolvimento)
- [13. Cenários para orientar o frontend](#13-cenários-para-orientar-o-frontend)
- [14. Visão maior e fronteira da primeira versão](#14-visão-maior-e-fronteira-da-primeira-versão)
- [15. Decisões abertas e critérios de entrega](#15-decisões-abertas-e-critérios-de-entrega)

## 1. O que é a Minerva

Minerva é uma startup de inteligência aplicada ao mercado de cannabis, cuja visão combina **tecnologia, rede e dados**. A experiência de consultoria e entendimento do setor orienta o produto: compreender jornadas reais, automatizar o trabalho recorrente e conectar participantes do mercado.

O primeiro produto empresarial atende organizações que comercializam/distribuem produtos de cannabis medicinal e precisam desenvolver parcerias médicas, acolher pacientes, conduzir compras e organizar sua operação.

Uma empresa passa a contar com um sistema e agentes que trabalham continuamente. O Workspace apresenta o que foi feito, o que está acontecendo, os resultados e o que exige participação humana. Ao conversar com o Copilot, a equipe também pode solicitar ações, visualizar informações e modificar aspectos autorizados do funcionamento.

A diferença não está apenas na existência de um chat. Os agentes usam conhecimento, identidade da empresa, memória das pessoas e estado das jornadas para realizar trabalho contextualizado. A interface deve tornar isso compreensível e utilizável.

A Minerva tem Produto e Equipe. Estamos desenvolvendo o **Produto Minerva Empresa**, não o sistema de vendas/administração interna da própria startup. Empresas clientes são organizações atendidas pelo SaaS.

## 2. O primeiro produto e sua transformação

### 2.1 Por que começar pelas empresas

O projeto identificou uma concentração de trabalho em aquisição, representação, relacionamento médico, atendimento, conversão e acompanhamento. Uma parte importante desse trabalho é informacional e operacional, portanto pode ser executada por agentes e fluxos.

O recorte inicial evita construir de uma vez todo o ecossistema: ferramentas clínicas completas, advocacia, pesquisa e todas as modalidades de marketing. Ele começa com uma cadeia empresarial conectada, capaz de produzir utilidade e receita e servir de base para expansões.

Preferencialmente, a empresa cliente já possui sua operação logística. O produto deve integrar e organizar essa operação, sem presumir que a Minerva produzirá, armazenará ou enviará fisicamente os produtos.

### 2.2 AI First

**Requisito:** a operação digital continua depois de estratégia e regras configuradas, sem depender de gestor ou representante conectado a cada interação. Pessoas participam onde há decisão, presença, relacionamento ou execução física.

Não impor reunião ou visita como pré-requisito de toda parceria. A IA pode conduzir a conversão dentro dos limites da configuração. Suporte e exceções podem exigir humanos.

Isso permite combinar:

- operação predominantemente autônoma;
- equipe própria pequena, presencial ou remota;
- representantes distribuídos por regiões e localidades;
- rede comissionada quando habilitada no modelo do negócio.

Essas possibilidades **não são três fases obrigatórias** nem planos mutuamente exclusivos. Um gestor pode priorizar reuniões nacionais, visitas locais ou maior aquisição com atendimento por IA. A interface deve respeitar a estratégia, sem exigir a mesma organização de todas as empresas.

### 2.3 Dois sistemas contratáveis

| Contratação | Atendimento externo | Perfis internos pertinentes |
|---|---|---|
| Sistema Médico | Consultora de Médicos | Gestor e representante |
| Sistema Paciente | Consultora de Pacientes | Gestor e despachante |
| Ambos | As duas Consultoras | Gestor, representante e despachante |

Módulos e dados são apresentados conforme contratação e acesso. Gestor e empresa não são duplicados ao contratar ambos. Não oferecer telas com dados inventados de um sistema não contratado.

Quando só o sistema Médico estiver contratado, o encaminhamento do paciente pode apontar para atendimento externo da empresa. Não presumir que a Minerva conhece os pedidos/resultados desse destino sem integração.

## 3. Quem usa e por quais canais

### 3.1 Três identidades de atendimento, cinco perfis

| Identidade apresentada ao cliente | Interlocutor | Canal | Contexto de atuação |
|---|---|---|---|
| Consultora de Médicos | Médico | WhatsApp próprio | Parceria e jornada médica |
| Consultora de Pacientes | Paciente | Outro WhatsApp | Atendimento e jornada do paciente |
| Copilot | Gestor | Workspace e Telegram | Estratégia, equipe, análise e aprimoramento |
| Mesmo Copilot | Representante | Workspace e Telegram | Reuniões, visitas, suporte e relacionamento |
| Mesmo Copilot | Despachante | Workspace e Telegram | Pagamento, pedido, entrega e estoque |

Para o cliente existe **um Copilot para a equipe**. Internamente ele seleciona contexto, metas, manual e permissões do perfil. Não desenhar três bots internos independentes por padrão. A expressão histórica “três números” representa as três identidades; o Copilot no Telegram não implica terceiro WhatsApp.

### 3.2 O que cada pessoa faz

**Gestor:** define direção e distribuição da aquisição, inclui e coordena usuários, analisa resultados e modifica padrões/manuais. Pode acompanhar a operação sem permanecer conectado.

**Representante:** participa de reuniões, faz visitas, atende suporte atribuído e aprofunda relacionamento com médicos. O Copilot prepara contexto e organiza o trabalho. O representante não deve precisar preencher um CRM enorme para comunicar o resultado de uma visita.

**Despachante:** acompanha pedidos e pagamentos pertinentes, confere/prepara, despacha, registra rastreio e mantém estoque. Precisa de uma lista operacional que permita agir rapidamente, não de uma sequência obrigatória de telas.

**Médico:** interlocutor externo que conhece a oportunidade, pode aceitar parceria e encaminhar pacientes. Não é automaticamente usuário do Workspace. A Consultora empresarial não é o futuro software clínico de prescrição do médico.

**Paciente:** interlocutor externo que recebe atendimento, apresenta documentação, compra e é acompanhado. Pode acessar páginas de catálogo/pagamento sem ganhar acesso ao Workspace interno.

## 4. Como a operação funciona

### 4.1 CEBD/W em linguagem de produto

| Componente | Responsabilidade | Reflexo para o frontend |
|---|---|---|
| C — Comunicação | Conversa com as pessoas e recebe solicitações | Chat, mensagens, respostas e contexto selecionado |
| E — Execução | Realiza tarefas e integra ferramentas | Andamento e resultado verificáveis de ações |
| B — Cérebro | Coleta, relaciona e consolida acontecimentos | Memória, fichas e conteúdo contextual atualizados |
| D — Dados | Persiste e recupera registros autorizados | Mesmos objetos e estados entre visualizações |
| W — Workspace | Apresenta a operação e permite interação | Frontend desenvolvido pelo Replit |

A cadeia conceitual é `C → E → B → W`, com D sustentando os registros e o Cérebro fornecendo contexto ao trabalho. Não são cinco páginas, cinco serviços obrigatórios ou cinco chamadas LLM.

**Decisão inicial:** agentes e fluxos começam no n8n no servidor Hostinger; Codex desenvolve CEBD e a ligação com o frontend. Obsidian/Markdown e PostgreSQL sustentam o Cérebro e dados. PaperClip e formalização de Habilidades MCP Neurum são evoluções possíveis, não dependências do primeiro frontend. Habilidade Neurum não é Skill de instruções.

### 4.2 A interface não precisa estar aberta

Uma conversa no WhatsApp pode produzir uma atualização de ficha e uma notificação ao gestor pelo Telegram. Quando ele abrir W, verá o resultado correspondente. A operação não pode ser uma simulação que só progride enquanto a página está aberta.

No protótipo podemos demonstrar isso com eventos fictícios controlados, claramente identificados. A infraestrutura real pertence ao backend.

### 4.3 Eventos e gatilhos

Atividade é o que aconteceu. Evento registra o acontecimento. Uma regra decide se ele altera uma etapa. Não são sinônimos de mensagem ou de texto produzido pela IA.

Exemplos: resposta recebida; aceite de parceria; reunião realizada; receita recebida; pagamento confirmado; despacho registrado. Nem todo evento avança a jornada.

O frontend deve mostrar o estado devolvido pelo backend e seu histórico, sem inferir pagamento a partir de um texto ou converter médico ao arrastar card livremente. Uma ação visual que solicite transição continua sujeita à regra.

### 4.4 Dúvida, suporte e notificação

São transversais aos dois Consultores e ao Copilot. Uma dúvida não reinicia a jornada. Um caso de suporte pode abrir tarefa/pausa sem apagar a etapa. Notificação informa ou solicita ação; leitura do aviso não conclui a tarefa.

## 5. Jornada médica

### 5.1 Estratégia é a página do gestor

O gestor distribui capacidade mensal entre segmentos. Referência atual: **500 novos médicos/mês, até 25 segmentações/mês e até 25 representantes cadastrados**. Limites devem vir do plano, não ser constantes gerais do frontend.

Exemplo ilustrativo:

| Segmento | Parcela | Meta |
|---|---:|---:|
| Neurologistas | 10% | 50 médicos |
| São Paulo — cidade | 20% | 100 médicos |
| Brasília | 15% | 75 médicos |
| Demais segmentos | 55% | 275 médicos |

A página do cliente chama-se **Estratégia**, substituindo Prospecção das referências antigas. Exibe pizza grande, segmentos laterais, créditos/metas e utilização pertinente. Pode ser montada/alterada pelo Copilot.

**Pesquisa com mapa e lista bruta de candidatos é operação interna da Minerva**, não ferramenta de busca que o gestor opera nessa página. Maps e Perplexity são ferramentas de execução; acesso administrativo a elas não é requisito do W cliente.

Quando os médicos entram na operação, aparecem em **Pessoas**. O atendimento aparece em **Conversas**. Conversões e resultados aparecem em **Indicadores**. Não colocar cópias de todas essas visualizações dentro de Estratégia.

### 5.2 Percurso do médico

| Momento | Significado e reflexo |
|---|---|
| Busca/qualificação | Execução encontra profissionais e constrói fichas iniciais com fontes e pendências. |
| Abordagem | Contato personalizado é iniciado; conversa surge quando houver mensagens. |
| Coleta de dados | A conversa confirma e complementa perfil, interesses e necessidades, como uma inscrição natural. |
| Oportunidade/parceria | A empresa e sua proposta são apresentadas; dúvidas e objeções são trabalhadas. |
| Reunião/visita opcional | Representante pode participar conforme interesse e estratégia. |
| Aceite/onboarding | Aceite é registrado; médico recebe orientações, condições, materiais e link de encaminhamento. |
| Parceria ativa | Atendimento continua, conteúdos podem ser programados e o representante mantém relacionamento humano. |

Reunião agendada não significa parceria aceita. Visita realizada não comprova aceite. O gatilho precisa de evidência e regra.

### 5.3 Continuidade

O médico pode encaminhar vários pacientes e continuar ativo. O encaminhamento não o retira do funil nem cria outro cadastro do médico. O paciente inicia sua própria jornada com outra IA e outro WhatsApp/destino.

500 é capacidade mensal de aquisição, não tamanho máximo da carteira acumulada. Regra exata de consumo, saldo, duplicidade e substituição de segmentos ainda será fechada; não criar cobrança arbitrária na interface.

## 6. Jornada do paciente

### 6.1 Dois caminhos iniciais

Quem chega com receita envia o documento para extração e conferência. Quem não tem é encaminhado à rede médica Minerva, inicialmente uma médica parceira. Agendamento/pagamento dessa consulta ainda precisam de definição; não inventar um sistema médico completo para viabilizar a primeira versão.

A avaliação e a prescrição são da médica. O sistema não pode prometer prescrição ou trocar produto por decisão comercial da interface.

### 6.2 Percurso

| Etapa | O que acontece |
|---|---|
| Acolhimento | Identificação, origem, necessidades e situação da receita. |
| Consulta, se necessária | Encaminhamento e acompanhamento até receber prescrição, quando houver. |
| Receita/produto | Extração de paciente, prescritor e produto; conferência e resolução de pendências. |
| Documentação | Verificação dos requisitos aplicáveis e orientação à autorização Anvisa quando necessária. |
| Pedido/pagamento | Confirmação de itens e condições, pagamento e liberação segundo regras. |
| Preparação/envio | Despachante confere, prepara, despacha e registra identificação do envio. |
| Entrega | Rastreamento, ocorrências e confirmação por fonte aceita. |
| Acompanhamento | Suporte, coleta prevista de experiência/relatos e continuidade ou recompra. |

Não obrigar repetição de consulta/documentos já válidos. A modalidade real de fornecimento é configuração/regra a confirmar. Um protocolo não é autorização; comprovante ou relato não é confirmação de pagamento; pedido embalado não é despacho; previsão não prova entrega.

### 6.3 Paciente e pedido não são a mesma coisa

A relação com paciente é contínua. Pode haver vários pedidos em diferentes estados ao mesmo tempo. A ficha pode mostrar seu contexto atual e uma coleção de pedidos, cada qual com pagamento/preparação/envio próprios.

A extração de receita não equivale à validação. Campos ausentes/ilegíveis ficam pendentes, não preenchidos ficticiamente. A equipe vê apenas os dados clínicos necessários e autorizados à função.

## 7. O trabalho interno e o Copilot

### 7.1 Conversa e ação direta convivem

Qualquer alteração permitida pode ser solicitada ao Copilot. Isso não proíbe ação direta útil: lista de pedidos com rastreio, ajuste de agenda, seleção, upload e confirmações operacionais.

**Mesma ação, mesmo contrato:** lista, ficha e chat chamam o mesmo mecanismo de negócio. O chat não ignora permissões, e um botão não precisa de uma segunda implementação independente das regras.

O usuário não deve preencher extensos formulários para tudo. Também não deve ser obrigado a abrir o chat para cada confirmação simples quando a própria página pode oferecer a ação.

### 7.2 Quatro responsabilidades por perfil

| Perfil | Trabalho que a interface e o Copilot apoiam |
|---|---|
| Gestor | Estratégia; equipe; análise; aprimoramento. |
| Representante | Reuniões; visitas; suporte; relacionamento. |
| Despachante | Pagamento; pedido; entrega; estoque. |

No momento zero, gestor inclui o usuário; criam-se cadastro, vínculo, perfil e acessos. Depois disso, o trabalho é recorrente, não um funil linear de funcionário.

### 7.3 Alterações de regras e aprovação

Representante e despachante podem propor mudanças ao manual/sistema. Se a alteração exigir autoridade do gestor, o Copilot prepara proposta e gera notificação para ele.

Aprovação apresenta o que muda, motivo, impacto e versão. Depois da autorização, a execução aplica a mudança e comunica o resultado. **Aprovado não significa aplicado**; ambos precisam de situação visível.

Não exigir aprovação do gestor para toda atualização cotidiana já permitida, como registrar uma visita. Distinguir dado operacional de regra de funcionamento.

### 7.4 Visualização e MCPWeb

O usuário pode pedir: “mostre os médicos dessa segmentação”, “abra a ficha desse médico ao lado da conversa” ou “explique o que mudou no resultado”. O Copilot consulta CEBD e controla a apresentação de W.

O frontend precisa de comandos controlados para abrir/focar página, selecionar item, filtrar e organizar painéis. Isso não significa executar código arbitrário gerado pelo modelo nem expor toda a tela ao agente automaticamente. Contexto selecionado deve ser referência explícita.

## 8. Cérebro e design do contexto

### 8.1 Por que existe

Duas empresas podem usar a mesma tecnologia e conhecimento comum, mas ter produtos, cultura, processos, critérios e condições diferentes. O Cérebro torna o atendimento específico da empresa e preserva a experiência acumulada.

Há conhecimento comum Minerva (ciência, legislação e outros domínios), conteúdo empresarial (identidade, produtos, manuais e processos) e memória das relações. “Fixo” significa mantido pela Minerva e comum, não imutável.

### 8.2 Fonte, consolidado e visualização

| Representação | Exemplo |
|---|---|
| Fonte original | Mensagem, áudio, receita, estudo, documento ou evento de integração. |
| Consolidado | Perfil/contexto, fatos, pendências, estado, memória e referências. |
| Visualização humana | Ficha, conversa, indicador, relatório ou página wiki. |

A wiki não é todo o W. Conversas e indicadores também refletem informações consolidadas. Não criar cópias incompatíveis dos fatos só porque aparecem em páginas diferentes.

### 8.3 Página contextual, com aprofundamentos

O proprietário deseja algo como uma página de conhecimento navegável: mostra primeiro o necessário, já compreendido e direcionado à tarefa, e oferece links para saber mais. Não é um documento enorme aberto por completo a cada consulta.

Exemplo fictício de ficha preparatória:

> Dr. João — parceria em negociação. Na última reunião pediu material científico e esclarecimentos sobre encaminhamento. Próximo compromisso: enviar o material combinado. Sugestão do Copilot: responder a pendência antes de propor nova reunião.
>
> Aprofundar: reunião • conversa • evidências • histórico • manual.

Essa síntese não substitui as fontes. Não inventar análise na interface só para preencher espaço.

### 8.4 Mesma pessoa, diferentes perspectivas

Representante preparando reunião precisa de compromissos, interesses, pendências e recomendações. Gestor analisando resultado precisa de evolução, desempenho e decisões. Despachante precisa do contexto logístico pertinente, não de toda a conversa clínica.

Perfil e tarefa mudam a seleção/apresentação, dentro das permissões. Não criar três pessoas nem três verdades independentes. Aprofundar continua sujeito ao acesso.

### 8.5 Fato, análise e decisão

Distinguir:

- Fato confirmado: houve reunião; pagamento está confirmado.
- Relato: paciente disse algo; representante observou algo.
- Análise: interpretação fundamentada do Copilot.
- Sugestão: ação recomendada, ainda não decidida.
- Decisão: escolha autorizada, com responsável.

Análise é parte importante da experiência: o usuário deve compreender o que os dados significam. Mas não é licença para o frontend fabricar causalidade ou resultado.

### 8.6 Configurações e experimentos

Configuração escolhe um padrão. Experimento usa duas ou mais variações do padrão para comparar resultados. Não são mecanismos de conteúdo totalmente diferentes.

O gestor pode escolher uma abordagem como padrão após avaliar teste centrado num indicador. Guardar a cadeia:

`Questão → variantes → indicador/resultados → análise → decisão → padrão publicado`.

A página do manual deve permitir entender por que aquele padrão foi adotado. Se a razão não foi registrada, não pedir à IA para inventá-la. Mostrar versão, atualização, fontes e limites da análise.

### 8.7 Modificação do Cérebro

Gestor altera conteúdo empresarial autorizado pelo Copilot. Equipe pode propor alterações. Memória é atualizada e pode ser corrigida; fontes originais permanecem identificáveis. Conhecimento comum não é sobrescrito por conversa de cliente.

“Cérebro modificável” significa que mudanças autorizadas em manual/regra/processo alteram o funcionamento dos agentes. Não é apenas um editor de notas decorativo. Replit implementa apresentação e solicitação; publicação, versão e efeitos são CEBD.

## 9. Como interpretar o Workspace

### 9.1 Estrutura conhecida

Cabeçalho global; menu lateral que expande e empurra o conteúdo; área central com até quatro páginas alinhadas e redimensionáveis. Chat pode ocupar uma página central e conta no limite. Atalho flutuante/cabeçalho leva ao mesmo Copilot.

Há versões históricas diferentes sobre Home padrão (chat ou Dashboard). Não resolver por suposição. A implementação pode suportar ambos enquanto essa escolha é consolidada.

No celular, preservar legibilidade com apresentação adaptada; não reduzir quatro painéis desktop a quatro colunas minúsculas. O comportamento específico é proposta de implementação.

### 9.2 Coleção → item → relações

Uma coleção permite buscar, filtrar, ordenar e alternar formas de visualizar. Selecionar item abre ficha contextual, que pode abrir conversa, pedido, reunião, fonte ou outro objeto relacionado.

`Pessoas → ficha de médico → conversa → reunião` usa registros conectados. Abrir ficha não precisa substituir a coleção. Preservar filtros e posição ao aprofundar.

**Fichas, Catálogo/Estoque e detalhes são páginas contextuais, não entradas obrigatórias do menu.** Abrir por botão/relação/Copilot não as torna pop-ups; elas usam o mesmo gerenciador de páginas centrais.

A referência visual antiga chama Pessoas de Quadros e Estratégia de Prospecção. Usar os conceitos atuais. Quadro/Kanban é uma forma de visualização, não outro cadastro.

### 9.3 Áreas principais e relações

- **Indicadores:** resultados e análise; um número pode abrir os registros que o compõem.
- **Estratégia:** distribuição de créditos e segmentos, sem pesquisa/mapa operacional do cliente.
- **Conversas:** atendimento externo; distinto do chat interno Copilot.
- **Pessoas:** coleção e fichas de médicos, pacientes e colaboradores autorizados.
- **Reuniões/Visitas:** preparação, agenda/rota, realização e resultado.
- **Pedidos:** lista de trabalho e detalhes relacionados.
- **Cérebro:** wiki contextual, fontes, manuais, versões, decisões e experimentos.
- **Gestão:** organização, equipe, acessos, conexões e plano.
- **Campanhas:** capacidade histórica de aquisição/rastreabilidade, escopo inicial ainda a fechar.
- **Notificações:** acesso global no cabeçalho e central contextual; não precisam de item fixo lateral.

Lista final do menu ainda é proposta na especificação. Não acrescentar páginas artificiais só para atingir uma contagem antiga de 12.

### 9.4 Linguagem visual

Referências fornecidas pelo proprietário têm fundo escuro, transparência fosca, tipografia clara, bordas arredondadas e identificação por ícones. Preferência de interface: majoritariamente monocromática, aro do ícone ativo colorido, sem bola sólida. Menu e página usam ícone correspondente.

Legibilidade deve sobreviver ao fundo. Não copiar números, nomes, erros de texto, integrações aparentes ou KPIs fictícios das imagens como requisitos reais. Os infográficos explicam a estrutura, não comprovam software existente.

## 10. Catálogo, pagamento e estoque

### 10.1 Despachante trabalha na lista

A lista de pedidos deve unir informação e ação: filtrar, identificar pendências, registrar rastreio e confirmar uma ação na própria linha quando houver contexto suficiente. Abrir ficha é opção para aprofundar, não obstáculo obrigatório.

“OK” precisa significar uma ação nomeada (preparado, despachado etc.), não concluir tudo. Inserir rastreio não confirma pagamento nem entrega. Exibir salvando, confirmado e falhou conforme resultado real.

Exemplos de interação equivalente:

- Na linha: informar rastreio e confirmar despacho.
- No chat: “o pedido X foi despachado; o código é Y”.

Ambos usam os mesmos contratos/validações e atualizam a mesma operação.

### 10.2 Estoque interno

Lista de produtos com quantidades e pendências. Entradas, saídas e ajustes podem ser solicitados pelo chat e registrados por operações autorizadas. Manter motivo/responsável/histórico, sem substituir saldo por texto sem rastreabilidade.

Catálogo/Estoque abre por Pedidos, item/produto, ficha relacionada ou Copilot. Não exigir entrada própria no menu principal.

### 10.3 O paciente vê outra apresentação

Existe catálogo e página de pagamento para o cliente final. Isso não é a tela administrativa de estoque/pagamento e não exige portal completo de paciente.

Cliente vê produtos/informações/condições autorizados, pedido e pagamento pertinentes. Quantidades internas de estoque, logs e outros clientes não ficam expostos por padrão. Formato do catálogo e checkout próprio/hospedado ainda são pendentes.

Ao receber um link, o paciente não ganha acesso ao W da equipe. O backend resolve o escopo da página. Status de pagamento vem da evidência real, não do redirecionamento visual de retorno.

## 11. SaaS, vínculos e permissões

### 11.1 Modelo mental

`Empresa → Pessoa → Vínculo → Jornada/Trabalho → Eventos/Atividades`.

Empresa determina configuração e fronteira de acesso. Pessoa é a identidade reconhecida quando houver evidência. Vínculo representa papel e relação naquela organização. Histórico e memória comercial são contextualizados por relação.

Um médico pode ter parceria com duas empresas. Um representante pode atuar em mais de uma. Isso não permite que uma empresa veja conversas ou carteira da outra. Não fazer fusão global só porque os nomes parecem iguais.

### 11.2 Implicações de interface

- Empresa ativa sempre reconhecível.
- Troca de empresa limpa/revalida o contexto e dados visíveis.
- Áreas dependem da contratação, perfil e atribuição.
- Ocultar ação não substitui autorização backend.
- Links e busca respeitam o mesmo acesso das páginas.
- Dados sensíveis não ficam em mocks compartilhados ou localStorage de produção.
- Ficha “resumida” não pode incluir síntese de informação que o perfil não poderia ler.

Disponibilidade de campo pode variar: não mostrar valor inventado para preencher uma coluna. Dado não conhecido, não autorizado, ainda consolidando e valor zero precisam de tratamento distinto.

## 12. Divisão de desenvolvimento

### Replit — W

Construir experiência e visualizadores, navegação, ações diretas, interfaces do Copilot, estados de execução, perspectiva por perfil e comandos programáticos de apresentação. Trabalhar inicialmente com dados fictícios relacionais e adaptador substituível pelo backend.

### Codex — CEBD

Construir agentes/fluxos n8n, acesso a Cérebro, fontes/consolidação, dados, isolamento, regras/transições, integrações e APIs/contratos consumidos por W. n8n/Hostinger ainda precisam de acesso e inventário verificáveis.

### Contrato de integração

Precisamos de IDs estáveis, recursos relacionados, empresa/vínculo, escopos, estados, atualização, versão e resultados de ação. Nomes finais de endpoints/eventos ainda não foram implementados. Coordenar contrato antes de fazer duas implementações incompatíveis.

O frontend deve distinguir:

- solicitação aceita;
- em execução;
- aguardando dado/ação/aprovação;
- concluída com resultado;
- falhou;
- demonstração sem execução real.

A solicitação de mudança ao manual e a aprovação podem ocorrer no W ou Telegram, com mesmo registro. O frontend não deve manter uma decisão paralela só na sessão local.

**Proposta de organização:** áreas separadas para frontend e backend no mesmo repositório, contratos coordenados. Não impor scaffold, framework ou lockfile sem inspecionar o estado real e alinhar a estrutura. Nenhum serviço de IA/integração deve receber token secreto do bundle navegador.

## 13. Cenários para orientar o frontend

Os exemplos são fictícios, não condições comerciais clínicas reais.

### Cenário A — Do pedido de estratégia ao atendimento

1. Gestor diz ao Copilot: “10% neurologistas, 20% São Paulo e 15% Brasília”.
2. Copilot mostra Estratégia com pizza/segmentos e capacidade restante; gestor conclui a distribuição e autoriza.
3. Execução interna pesquisa/qualifica; o cliente não recebe um mapa de raspagem.
4. Médicos incorporados surgem em Pessoas com ficha inicial.
5. Abordagem e respostas aparecem em Conversas; eventos atualizam o funil.
6. Gestor pode abrir um indicador e a coleção correspondente, depois uma ficha e conversa.

A interface deve demonstrar relações, não quatro telas com números inconsistentes.

### Cenário B — Preparação e retorno de reunião

1. Representante recebe notificação de reunião.
2. Abre ficha contextual com último compromisso, dúvidas pendentes e sugestão do Copilot.
3. Aprofunda a fonte quando precisa; abre reunião ao lado da ficha.
4. Depois informa por áudio/texto o resultado.
5. Atividade é registrada; se houver evidência de aceite conforme regra, jornada avança.
6. Próxima conversa da Consultora considera o acontecimento.

Não exigir ao representante transcrever toda a ficha em formulário.

### Cenário C — Jornada paciente com e sem receita

1. Paciente chega; Consultora reconhece origem e pergunta sobre receita se ainda não souber.
2. Sem receita, encaminha à médica parceira; com receita, recebe documento.
3. Documento é extraído/conferido e pendências aparecem.
4. Requisitos aplicáveis são atendidos; pedido e pagamento avançam por evidência.
5. Despachante recebe pedido na lista operacional.

Contato com a médica não é garantia de prescrição nem exige sistema clínico completo.

### Cenário D — Despacho sem atravessar várias páginas

1. Despachante filtra pedidos prontos para sua ação.
2. Confere linha e abre ficha apenas se precisar.
3. Informa rastreio e confirma despacho na lista ou pelo Copilot.
4. Resultado fica visível; paciente recebe atualização pertinente; envio aparece no pedido.
5. Se integração falhar, não mostrar despachado como fato consumado.

### Cenário E — Mudança vira padrão

1. Representante sugere alterar uma orientação.
2. Copilot prepara proposta e notifica gestor.
3. Gestor aprova a mudança ou define variantes para testar.
4. Experimento registra distribuição e indicador de comparação.
5. Gestor decide com base nos resultados; versão publicada passa a ser padrão.
6. Página do manual liga a decisão, teste e evidências.

Aprovação, execução e publicação são estados distintos. Análise não substitui decisão.

## 14. Visão maior e fronteira da primeira versão

### O horizonte

A mesma infraestrutura pode futuramente atender médicos com ferramentas próprias, empreendedores, distribuidores B2B, redes, advogados, associações e pesquisadores. A Consultora de Pacientes conecta necessidades e soluções ao longo da rede.

A aquisição tem origem/vínculo. Campanhas podem ter links/códigos rastreáveis e materiais; embaixadores podem atrair participantes. Impulsionamento é uma proposta futura de exposição a participantes já na rede e não deve apagar vínculos anteriores. Redes de representantes e modelos de fornecimento também foram explorados.

A startup Canvexo, de mídia/comunidade, aparece no contexto histórico como empreendimento separado. Não implementar rede social dentro do Minerva Empresa por esse motivo.

### O que isso exige agora

IDs, vínculos, origem, referências e modularidade que permitam evolução. Contexto e dados da relação preservados. Não hardcodear que só pode existir uma empresa ou um médico na rede.

### O que isso não autoriza implementar agora

Sistema clínico completo/prescrição; marketplace de impulsionamento; rede social; pesquisa clínica automatizada; escritório jurídico; operação de franquias; automação de marketing completa; integrações fictícias para parecer que todo o horizonte já funciona.

A primeira versão deve demonstrar as jornadas empresariais e o trabalho dos três perfis internos. Expansão modular depende de decisões posteriores.

## 15. Decisões abertas e critérios de entrega

### 15.1 Pendências que não devem ser inventadas

- Home padrão e política precisa de substituição da quinta página.
- Conteúdo comercial real, benefícios, condições e aceite da parceria.
- Contagem/consumo de créditos, saldo e alterações de segmentos durante o ciclo.
- Provedores reais e condições de canal, agenda, consulta, pagamento e logística.
- Modalidade de fornecimento e requisitos documentais atuais.
- Política fina de acesso, retenção e exportação.
- Escopo inicial de Campanhas e exposição dos recursos futuros.
- Formato do catálogo cliente, checkout e disponibilidade de voz.
- Endpoints/eventos reais e mecanismo de atualização de W.

Essas lacunas não impedem criar visualizadores com contratos propostos e dados fictícios. Devem impedir apenas a alegação de que uma regra não definida ou integração não conectada já está funcionando.

### 15.2 Entrega inicial proposta

1. Estrutura do Workspace, identidade/empresa e painel Copilot.
2. Visualizadores reutilizáveis de coleção, ficha contextual, conversas e indicadores.
3. Estratégia com pizza e segmentos; eventos fictícios atualizam Pessoas/Conversas/Indicadores.
4. Reuniões/Visitas e preparação contextual.
5. Lista de Pedidos com ação, Catálogo/Estoque contextual e apresentação cliente necessária.
6. Cérebro navegável, proposta/decisão/versão e Gestão.
7. Integração progressiva com CEBD, preservando contratos.

Transversais desde o começo: permissões, notificações, estados de execução, fontes e contexto, não recursos adicionados só ao final.

### 15.3 Critérios de interpretação correta

O frontend estará conceitualmente alinhado quando:

- O usuário percebe que acompanha e comanda uma operação, não que precisa alimentá-la manualmente em cada campo.
- Um Copilot adapta-se ao perfil, enquanto Consultoras atendem públicos externos em canais próprios.
- Estratégia distribui aquisição; resultados surgem em visualizadores relacionados.
- Coleção e ficha são níveis dos mesmos registros; páginas contextuais não poluem o menu.
- Ficha explica o necessário para a tarefa e oferece aprofundamento com fonte.
- Ações diretas e chat alteram a mesma operação.
- Paciente e pedido têm histórias relacionadas sem serem confundidos.
- Notificação, aprovação e execução têm significados distintos.
- Configuração, experimento e decisão possuem rastreabilidade.
- Dados fictícios, falhas e ausência de integração são explicitamente identificados.
- A base permite substituir mocks por backend sem reescrever toda a experiência.

### 15.4 O que não fazer ao receber este briefing

Não redesenhar o produto como SaaS genérico baseado em formulário; não tratar screenshot antigo como autoridade acima das correções descritas; não criar um backend paralelo para simular capacidades que serão fornecidas por Codex sem alinhar o contrato; não integrar canais externos reais com dados fictícios; não copiar conversas históricas, credenciais ou dados de pacientes para o repositório.

Usar a [especificação do Workspace](workspace-especificacao-funcional.md) para detalhar cada área. Quando a dúvida for sobre jornada, regra ou dado, consultar a [base técnica](minerva-contexto-e-jornadas.md) e manter a pendência visível, sem inventar comportamento empresarial.
