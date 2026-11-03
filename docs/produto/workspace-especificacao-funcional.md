# Minerva Empresa — especificação funcional do Workspace

> Leia primeiro o [briefing de contexto para o Replit](00-contexto-minerva-para-replit.md).<br>
> Este arquivo detalha o funcionamento de cada página e subpágina.<br>
> Versão 0.1 — proposta funcional detalhada, baseada nas decisões do proprietário.<br>
> Complementa [Contexto, jornadas e contratos de execução](minerva-contexto-e-jornadas.md).<br>
> Não comprova interface construída, endpoints existentes ou integrações ativas.

## 1. Princípio e escopo

O Workspace W apresenta a operação de C, E, B e D e permite ao usuário trabalhar sobretudo pelo Copilot. Não é uma coleção de telas com bases isoladas. Coleções, fichas, conversas, indicadores e wiki são perspectivas relacionadas dos mesmos registros.

O Replit implementa interface, navegação, estados visuais e execução dos comandos autorizados de apresentação. Codex implementa backend, contratos, contexto, dados e integração n8n. Não permitir acesso direto do navegador a credenciais de modelos, ferramentas administrativas do n8n ou arquivos privados.

**Confirmado:** até quatro páginas centrais; menu retrátil empurra o conteúdo; cabeçalho permanece independente; detalhes abrem como páginas contextuais; Copilot controla a tela por MCPWeb; fichas apresentam síntese direcionada à tarefa com fontes e aprofundamentos; personalização por empresa/perfil e módulos Médico/Paciente.

**Proposta:** a organização específica do menu, nomes de abas, filtros e controles abaixo são desenho para validação. Capacidades futuras ou integrações não definidas não devem aparecer como já operacionais. Padrão inicial da Home (Chat ou Indicadores) permanece decisão aberta.

### Navegação deste documento

- [Estrutura comum](#2-estrutura-comum)
- [Menu e mapa de páginas](#3-menu-e-mapa-de-páginas)
- [Copilot](#4-minerva--copilot)
- [Indicadores](#5-indicadores)
- [Campanhas](#6-campanhas)
- [Estratégia](#7-estratégia)
- [Conversas](#8-conversas)
- [Pessoas e fichas](#9-pessoas-e-fichas-contextuais)
- [Reuniões](#10-reuniões)
- [Visitas](#11-visitas)
- [Pedidos](#12-pedidos)
- [Catálogo e estoque](#13-catálogo-e-estoque)
- [Cérebro](#14-cérebro--wiki-contextual-e-modificável)
- [Gestão](#15-gestão--configurações)
- [Notificações, tarefas e aprovações](#16-notificações-tarefas-e-aprovações)
- [Perfis, atualização e execução](#17-perfis-atualização-e-execução)
- [Entrega modular ao Replit](#18-entrega-modular-ao-replit)

## 2. Estrutura comum

### 2.1 Cabeçalho

Exibe empresa ativa, identidade do usuário e perfil/contexto de atuação; busca global; notificações; calendário; acesso ao Copilot; menu pessoal com ajuda e saída. Não repetir ações de ajuda/saída no menu lateral por padrão.

Trocar empresa exige revalidar permissões e retirar dados/páginas da empresa anterior da tela e do contexto ativo. Caso existam ações em execução, sua empresa originadora continua identificada; a troca não as transfere ao novo contexto.

Busca global recupera apenas objetos autorizados, com agrupamento por tipo e identificação do resultado. Selecionar abre o item no visualizador adequado. Não mostrar prévias de documentos restritos a quem não possa lê-los.

Calendário global leva à agenda aplicável, sem criar outra base paralela de compromissos.

### 2.2 Área dinâmica e painéis

Até quatro páginas centrais abertas ao mesmo tempo. O Chat aberto como página conta nesse limite; menu e cabeçalho não contam. O atalho flutuante reabre/foca o Chat, sem criar uma quinta página persistente ou um segundo Copilot.

Painéis alinhados, altura disponível comum, divisórias redimensionáveis, fechamento e maximização/restauração. Abertura de coleção/item deve preservar filtros e seleção da página de origem. Larguras iniciais semelhantes, com chat mais estreito e menu menor, conforme referência histórica.

Ao abrir a quinta página, substituir uma página segundo política explícita. **Proposta:** focar instância já aberta quando o mesmo recurso/contexto existir; caso contrário, substituir a página menos recente não fixada. Se todas estiverem fixadas ou houver alteração pendente, solicitar escolha. Política final é pendente; não descartar edição silenciosamente nem acumular páginas comprimidas.

No celular, **proposta:** uma página ativa por vez, com navegação entre páginas abertas, preservando contexto; menu por toque, sem exigir hover. O limite desktop não deve produzir quatro colunas ilegíveis em celular.

### 2.3 Gramática coleção → item → relações

Coleção permite buscar, filtrar, ordenar e alternar visualizações úteis ao tipo de objeto. Item abre ficha/detalhe como nova página central. Relações abrem objetos conectados sem recadastro.

Exemplo: `Pessoas filtradas → Ficha de médico → Conversa → Reunião`. Campanhas, pedidos, documentos e visitas usam a mesma gramática.

Não criar ficha diferente e incompatível quando o mesmo médico é aberto por Pessoas, Campanha ou Agenda. O objeto é o mesmo; o propósito/contexto seleciona a apresentação.

### 2.4 Ficha contextual comum

Toda ficha pode oferecer, conforme pertinência:

1. Identificação, situação atual, responsável e momento da atualização.
2. Resumo direcionado à tarefa: o que saber agora e por quê.
3. Pendências, compromissos e próxima ação.
4. Análise e sugestões do Copilot, identificadas como tal.
5. Dados objetivos necessários e atividades recentes.
6. Relações para abrir conversas, fontes, documentos, pedidos e decisões.
7. Detalhes/histórico sob demanda, sem despejar tudo na abertura.

Fatos, relatos, inferências, sugestões e decisões autorizadas têm apresentação distinguível. Não usar “análise IA” para inventar justificativas. Aprofundamentos resolvem para recursos reais com controle de acesso.

### 2.5 Visual e estados

Referência: fundo escuro fosco, transparência controlada, texto claro, bordas arredondadas, legibilidade acima do fundo. Predominância monocromática; aro colorido indica área aberta, não bola sólida. Ícone da página corresponde ao do menu. Não interpretar imagens promocionais como dados reais ou especificação exata de componentes.

Toda página precisa de estados: carregando; vazia; parcialmente preenchida; indisponível/erro; acesso negado; desatualizada; ação pendente; sucesso confirmado; modo demonstrativo. Falta de integração não equivale a zero resultados. Exibir exemplos fictícios como demonstração.

Mudanças de negócio são conversacionais por padrão, com botões contextuais e confirmação quando exigida. Não construir dezenas de campos obrigatórios apenas porque sistemas tradicionais usam formulários. Upload, seleção de itens, ajuste de calendário e outras ações diretas podem existir quando facilitarem a tarefa.

## 3. Menu e mapa de páginas

**Proposta de arquitetura de informação:** menu contém áreas de trabalho; item/ficha é uma página contextual, não uma entrada por registro. Quantidade final de ícones não deve ser fixada artificialmente ao número de cards de um infográfico antigo.

| Acesso principal | Página principal | Subpáginas/contextos |
|---|---|---|
| Minerva / Chat | Copilot | Conversa interna selecionada, execução, proposta e resultado |
| Indicadores | Painel por perfil | Funil, indicador detalhado, lista subjacente, relatório e decisão |
| Campanhas | Coleção | Ficha, criativos, links/origens e resultados |
| Estratégia | Distribuição dos créditos do ciclo | Detalhe da segmentação e da alocação |
| Conversas | Atendimento | Conversa, ficha, suporte e anexos autorizados |
| Pessoas | Coleção | Médico, paciente ou colaborador, com perspectiva contextual |
| Reuniões | Agenda | Reunião, disponibilidade e preparação |
| Visitas | Agenda/mapa de visitas | Rota, visita e médico |
| Pedidos | Fila/coleção | Pedido, pagamento, envio e pendência |
| Contextual, fora do menu: Catálogo/Estoque | Coleção de produtos e disponibilidade | Produto e movimentações |
| Cérebro | Wiki contextual | Página, fonte, manual, versão, experimento e decisão |
| Gestão | Administração empresarial | Equipe, acessos, conexões, plano e preferências |
| Cabeçalho: notificações | Central/lista | Aviso, tarefa, suporte e aprovação |

**Correção confirmada pelo proprietário:** fichas e Catálogo/Estoque são páginas contextuais, sem entrada obrigatória no menu principal. Abrem por Pedidos, coleções, relações e Copilot. Estratégia substitui Prospecção no menu do cliente. A busca com mapa, fontes e lista de candidatos é trabalho interno da Minerva, não outra página de prospecção acessível ao gestor. Os médicos incorporados aparecem em Pessoas; o atendimento, em Conversas; os resultados, em Indicadores.

Disponibilidade das áreas depende do sistema contratado. Não mostrar “pacientes externos” ou resultados de vendas como se conhecidos quando a empresa só tem o sistema Médico e encaminha a um atendimento externo sem integração.

## 4. Minerva / Copilot

**Finalidade:** principal meio de solicitar, compreender e realizar trabalho. É um Copilot por experiência, com comportamento por perfil, não três chats obrigatórios por cargo.

### Conteúdo

Mensagem inicial discreta, entrada de texto, envio de áudio e acesso a voz. Áudio gravado e conversa em tempo real são recursos distintos; se integração de voz não estiver disponível, identificar a limitação. Histórico de conversas internas e retomada por assunto quando suportados.

Cada resposta pode conter referências a recursos, resultados de execução e ações pertinentes. Exibir andamento real: solicitação recebida → executando → concluída/falhou/aguardando autorização. Não apresentar texto “feito” como prova de operação.

Contexto visível: empresa ativa, objeto em discussão quando houver e link para abrir esse objeto. O usuário pode dizer “este médico” se a seleção foi fornecida explicitamente; não presumir acesso à tela inteira sem contrato.

### Ações

Consultar e explicar; abrir/focar/filtrar páginas; solicitar execução; preparar alteração; pedir autorização quando necessária; navegar pelas fontes de uma análise. Comandos visuais não fazem alteração empresarial implícita.

### Subpáginas e conexões

- Resultado de execução: entrada resumida, situação, resultado, recursos afetados e falha recuperável quando permitida.
- Proposta de alteração: antes/depois, motivo, impacto e autoridade necessária; abre aprovação.
- Todas as áreas autorizadas podem ser abertas por referências da conversa.

### Perspectiva

Gestor: estratégia, análise, equipe e aprimoramento. Representante: reuniões, visitas, suporte e relacionamento. Despachante: pagamento, pedido, entrega e estoque. Combinação de papéis precisa de contexto ativo ou esclarecimento, não escolha arbitrária do agente.

## 5. Indicadores

**Finalidade:** compreender o andamento da empresa ou carteira e identificar onde agir. A abertura deve priorizar os indicadores relevantes ao perfil, sem um mural igual para todos.

### Conteúdo principal

- Período/ciclo e escopo ativo.
- Funil médico e/ou paciente conforme contratação.
- Realização de metas, tarefas/pendências e atividade recente.
- Análise do Copilot: achados, limitações e sugestões com referências.
- Comparação com período/variante quando os dados forem comparáveis.

### Perspectivas

Gestor: operação, segmentos, equipe, gargalos e decisões. Representante: carteira atribuída, reuniões/visitas, parceiros e pendências; remuneração somente quando contrato/cálculo estiverem definidos. Despachante: pagamentos pendentes pertinentes, pedidos, preparação, entrega e estoque.

### Filtros e ações

Período, ciclo, sistema, segmento, responsável, etapa e variante quando disponível. Abrir o grupo de registros que compõe um número, perguntar ao Copilot, comparar ou propor ajuste. Filtros não ampliam acesso.

### Subpáginas

- **Indicador detalhado:** definição, cálculo, fonte, atualização, série e registros de origem; ausência de dados distinta de valor zero.
- **Funil detalhado:** etapas, volumes, conversões e tempo, com acesso à coleção filtrada. Reuniões/visitas opcionais não devem distorcer conversão obrigando todo médico a passar por elas.
- **Relatório contextual:** período, evidências, análise, sugestões e decisões tomadas.
- **Experimento/decisão:** abre Cérebro no registro relacionado.

### Conexões

Número de médicos em etapa → Pessoas filtrada. Pendência → tarefa ou ficha. Resultado de segmento → indicador detalhado ou Pessoas filtrada; alocação desse segmento → Estratégia. Pedido → detalhe de pedido. Decisão → manual/experimento. Não recalcular número por geração livre do LLM no frontend.

## 6. Campanhas

**Finalidade:** organizar pontos de aquisição e relacionamento rastreáveis. Capacidade aparece no histórico; escopo inicial exato ainda precisa de decisão. Não confundir Campanha com Segmentação de prospecção.

### Coleção

Cards/lista com nome, objetivo, situação, responsável, canal/origem, período e métricas disponíveis. Busca e filtros por situação, tipo, origem, criador, responsável e período. Estados propostos: rascunho, ativa, pausada e encerrada; dependem da implementação.

### Ficha da campanha

Resumo do propósito, público, materiais, link/código, responsáveis, atividade e resultados. Exibir relação entre origem e médicos/pacientes; um código referencia registro no backend, não é credencial de acesso.

### Subpáginas

- **Material/criativo:** prévia, versão, canal pretendido e situação; geração/publicação apenas se implementadas.
- **Link/origem:** destino, código, QR quando suportado, autoria e regras de atribuição.
- **Registros originados:** coleção de pessoas filtrada pela campanha, reutilizando Pessoas.
- **Resultado:** indicador detalhado e conversas/atividades autorizadas.

### Ações e conexões

Criar/ajustar pelo Copilot; copiar link existente; propor material; pausar/ativar por autorização. Não fingir integração Instagram/Ads ou geração de criativo. Campanha pode levar à Consultora; ficha de pessoa mostra origem, sem expor toda a carteira da campanha a quem não pode acessá-la.

## 7. Estratégia

**Finalidade confirmada:** o gestor define e acompanha onde utiliza os créditos de aquisição. Esta página substitui Prospecção no menu do cliente; não apresenta o mapa de busca, a lista de candidatos ou ferramentas de pesquisa internas da Minerva.

### Estratégia do ciclo

Pizza grande no centro e segmentações na lateral. Cada item identifica filtro, percentual, quantidade planejada e consumo/alocação pertinente. Mostrar saldo e utilização agregada quando disponíveis. Capacidade de referência: 500 médicos/mês, até 25 segmentações/mês e até 25 representantes cadastrados. Limites são dados do plano, não constantes da interface.

Exemplo: 10% neurologistas = 50; 20% São Paulo cidade = 100; 15% Brasília = 75. Distribuição restante explícita. Percentuais representam distribuição planejada, não conversão nem porcentagem de execução. Quantidade de representantes não é número de segmentos.

### Interação

Gestor conversa com Copilot, que apresenta/ajusta a estratégia e controla a tela pelo MCPWeb. Selecionar fatia destaca segmento e vice-versa. Um ajuste direto pode ser conveniência, usando a mesma validação e autorização. Rascunho, versão autorizada e mudanças ficam distinguíveis.

### Segmentação — subpágina contextual

Explica filtro, percentual, meta, créditos alocados/utilizados e versão da estratégia. Não contém galeria de médicos, conversa, mapa de candidatos nem logs de pesquisa. Consumo e saldo dependem das regras ainda pendentes de contabilização; não inventar equivalência entre descoberta, qualificação e consumo.

### Separação da execução interna

A Minerva executa busca/qualificação com Maps e Perplexity internamente. Candidatos brutos, credenciais, pesquisa, mapa operacional e detalhes técnicos não são expostos ao gestor por esta página. Acesso de operadores Minerva é escopo separado, ainda não desenhado.

### Conexões com outras áreas

Para acompanhar os médicos resultantes, abrir Pessoas com filtro de ciclo/segmento. Para atendimento, abrir Conversas. Para funil/conversão/resultados, abrir Indicadores. Esses são outros visualizadores, não listas duplicadas dentro de Estratégia. À medida que o trabalho acontece, atualizam-se coleções, fichas, conversas e indicadores.

### Perfis e pendências

Gestor define/acompanha a distribuição. Representante acompanha sua carteira e tarefas em Pessoas, Agenda e Indicadores; acesso à estratégia depende de autorização explícita. Despachante não recebe acesso padrão. Regras de consumo, arredondamento, segmentos insuficientes e alteração durante o ciclo continuam pendentes.

## 8. Conversas

**Finalidade:** acompanhar atendimentos externos e atuar quando autorizado. Não confundir com o Chat interno do Copilot.

### Conteúdo principal

Lista de conversas e conversa selecionada. Identificar canal/Consultora Médica ou Paciente, interlocutor, empresa, responsável, última atividade, etapa e pendências. Não misturar os dois WhatsApps como se fossem uma única linha de atendimento.

Filtros: sistema, interlocutor, etapa, responsável, pendência, encaminhamento humano e período. Busca respeita acesso a conteúdo. Lista pode mostrar prévias apenas quando autorizadas.

### Página da conversa

Mensagens cronológicas; autor IA/humano/interlocutor; datas e situação do canal quando comprovada; anexos com acesso controlado; eventos relevantes e ligação à ficha. Distinguir enviado/entregue/lido apenas quando evidência existir.

Exibir síntese contextual e próxima ação, sem substituir o histórico original. Comunicação externa não deve mostrar prompts, memória interna restrita, análises privadas da equipe ou raciocínio interno do modelo.

### Ações

Abrir ficha; solicitar resumo; encaminhar suporte; criar tarefa; preparar intervenção. Assumir/devolver atendimento exige protocolo de responsabilidade e pausa da IA, ainda a definir. Mensagem real só sai por operação autorizada e confirmada, não por preencher um mock.

### Subpáginas e conexões

Ficha do interlocutor; documento/anexo; caso de suporte; reunião/visita; pedido; evento/transição. Evidência de uma transição abre na mensagem/atividade originadora quando permitido.

Representante acessa atendimentos e casos atribuídos. Despachante acessa contexto logístico necessário, não todo o acolhimento clínico. Gestor também depende da política de acesso, não de leitura universal automática.

## 9. Pessoas e fichas contextuais

### 9.1 Coleção

**Finalidade:** explorar pessoas e vínculos da empresa. Tipos: médicos, pacientes e colaboradores. Não criar coleção global indiscriminada da rede.

Visualizações úteis: galeria, lista/tabela e quadro de etapas para jornadas. Quadro é uma forma de visualizar os mesmos vínculos, não outro cadastro. Colaboradores não são obrigados a percorrer funil.

Busca por identificação autorizada; filtros por tipo, etapa/situação, responsável, origem, segmento, localidade, especialidade e pendência quando pertinentes. Filtros variam conforme tipo; não oferecer especialidade para todos indiscriminadamente.

Cards: identificação, situação/etapa, responsável, sinal de pendência e contexto curto. Não carregar documento clínico e histórico completo na coleção.

### 9.2 Ficha do médico

- **Resumo por tarefa:** quem é, contexto da parceria, última interação relevante e próximo passo.
- **Estado:** etapa, responsável, pendências e compromissos.
- **Dados:** especialidade, localidade, contato, origem e situação de confirmação.
- **Análise:** recomendações do Copilot com evidência e atualização identificadas.
- **Aprofundamentos:** conversa, reuniões, visitas, conteúdos, histórico de transições e fontes.
- **Parceria:** condições/versão, aceite, onboarding e link de encaminhamento.
- **Resultados:** encaminhamentos e resultados conhecidos/autorizados, sem inventar dados externos.

Representante preparando reunião vê dúvidas, combinados e recomendações. Gestor investigando conversão vê evolução, intervenções e resultados. A mesma ficha muda o foco; dados não são duplicados.

### 9.3 Ficha do paciente

- Identificação e origem contextual.
- Resumo da jornada e pendências.
- Documentação/consulta/receita conforme permissão.
- Pedidos, pagamentos, envios e acompanhamento relacionados.
- Encaminhamentos e tarefas.
- Memória e relatos pertinentes, claramente atribuídos.

Despachante vê destinatário, pedido, endereço, itens e contexto logístico necessário; não recebe relato clínico completo. Representante vê suporte atribuído quando autorizado. Documentos sensíveis abrem em contexto protegido, sem prévias globais.

Vários pedidos podem existir ao mesmo tempo; não sobrescrever a ficha como se paciente tivesse um único estado de envio.

### 9.4 Ficha do colaborador

Identificação, perfil/vínculos, situação, responsabilidades, carteira/tarefas, disponibilidade e atividade pertinente. Gestor administra; usuário consulta sua informação autorizada. Privilégios são efetivados em Gestão, com auditoria, não editados por texto livre na memória.

### 9.5 Ações comuns

Pedir correção/atualização ao Copilot; abrir relação; registrar atividade; solicitar tarefa; perguntar sobre contexto. Alterações de etapa passam por regra/evento. Se houver arrastar card em quadro, deve solicitar uma transição validada; não permitir movimento livre que invente aceite/pagamento.

Novos cadastros são conversacionais por padrão. Importações em lote dependem de escopo próprio. Duplicidade/ambiguidade devem aparecer como pendência, não fusão automática silenciosa.

### 9.6 Subpáginas

Histórico de atividades/transições; documento autorizado; relação/parceria; tarefa/caso; reunião; visita; pedido. Coleção origem e seleção permanecem disponíveis ao abrir o item.

## 10. Reuniões

**Finalidade:** organizar disponibilidade e compromissos, preparar pessoas e registrar resultados. Não exige videoconferência própria.

### Agenda principal

Alternância calendário/lista; filtros por responsável, período, tipo e situação; respeitar fuso de apresentação definido pela empresa/usuário. Data/hora exata e fuso devem aparecer em confirmação, evitando interpretação ambígua de “amanhã”.

Mostrar médicos/interlocutores, responsável, horário, situação, propósito e link quando existente. Reunião comercial com médico não é consulta clínica do paciente; distinguir tipos.

### Ficha da reunião

Quem participa; objetivo; agendamento e situação; preparação contextual do Copilot; documentos pertinentes; pendências; resultado e próximos passos. Não presumir gravação/transcrição.

### Subpáginas

- **Disponibilidade:** horários do representante, exceções e conflitos; alteração autorizada com resultado real.
- **Preparação:** ficha contextual e recomendações baseadas no histórico.
- **Resultado:** realização, relato, compromissos e eventuais gatilhos de jornada.

### Ações e conexões

Solicitar agendamento/reagendamento/cancelamento; abrir reunião externa; registrar realização; criar tarefa. Abrir pessoa/conversa/atividade relacionada. Agenda da médica parceira só aparece se esse fluxo for implementado, sem exigir futuro sistema médico.

Conflito ou falha de integração aparece como pendência. Agendar não significa realizar; realizar não significa aceitar parceria.

## 11. Visitas

**Finalidade:** preparar e acompanhar atuação presencial e seu resultado.

### Página principal

Alternância lista/agenda/mapa, conforme integração disponível. Médicos e visitas relacionados; filtros por representante, período, região e situação. Endereços sem confirmação ficam identificados.

### Rota — subpágina

Data, responsável, ponto inicial/final quando definidos, médicos/paradas, ordem sugerida e observações. Copilot prepara; representante revisa/ajusta. Distância/tempo só são exibidos se calculados por fonte disponível; não inventar otimização.

Abrir médico da rota em ficha independente. Reordenar paradas é edição do plano; não registra visitas realizadas automaticamente.

### Visita — subpágina

Médico, local, horário/combinação, propósito, preparação, situação, resultado e próximos passos. Registrar ocorrência por texto/áudio via Copilot; GPS/check-in aparece apenas se implementado e autorizado. Não exigir rastreamento contínuo para demonstrar a função.

### Ações e conexões

Solicitar/editar rota, abrir navegação externa, registrar visita ou impedimento, gerar tarefa. Conecta a Pessoas, Conversas, Agenda e histórico. Resultado relevante pode produzir transição validada; não pressupor aceite por geolocalização ou check-in.

## 12. Pedidos

**Finalidade:** visualizar e executar a operação de compra e atendimento logístico, com estados distintos.

### Coleção/fila — página de ação do despachante

**Confirmado:** reunir informação e ação na mesma página. O despachante trabalha na lista, filtra, abre ficha quando precisa de detalhes, inclui rastreamento e confirma ações no próprio sistema. Não exigir várias páginas para executar cada passo simples.

Lista operacional por situação com filtros de período, responsável, pagamento, documentação, preparação e envio. Separar cada dimensão: pedido pode estar pago e com impedimento de preparação. Não esconder tudo em um único rótulo.

Cada item mostra identificador, comprador/destinatário autorizado, itens e quantidades, situação de pagamento, preparação/envio, rastreio e pendência principal; valor e demais campos conforme necessidade/permissão. Selecionar abre a ficha sem perder filtros/posição da coleção.

A linha oferece ações contextuais permitidas: registrar código de rastreio e confirmar preparação/despacho conforme estado. O “OK” deve nomear o que confirma (“preparado”, “despachado” etc.), não concluir toda a jornada indistintamente. Informar rastreio não comprova por si só entrega ou pagamento. Campos/ações adicionais dependem do procedimento operacional.

Mostrar salvando, confirmado ou falhou; evitar dois cliques registrando a mesma ação. Não exigir abertura de ficha para uma atualização que já tenha contexto suficiente na linha. Não presumir atualização em lote nesta versão.

### Ficha do pedido

Resumo do que precisa acontecer agora; itens/quantidades/preços congelados da compra; condições; endereço; estados de pagamento, requisitos e envio; responsável; histórico; próximos passos. Observações operacionais não autorizam alteração de prescrição.

### Subpáginas

- **Pagamento:** referência, valor, situação verificada, eventos e pendências; dados sensíveis de pagamento não são expostos.
- **Preparação:** conferência, itens, responsável e problemas.
- **Envio/entrega:** transportador, identificação/rastreio, atualizações e ocorrências.
- **Documentação:** situação de requisitos e fontes acessíveis conforme função; não entregar receita completa a todo usuário.
- **Suporte do pedido:** ocorrência, responsável, ações e resolução.
- **Catálogo/Estoque:** abre a mesma área de produtos para conferência de disponibilidade.

### Ações

Solicitar criação/ajuste autorizado; consultar pagamento; registrar preparação/despacho; informar rastreio; abrir suporte. As alterações também podem ser solicitadas ao Copilot pelo chat: por exemplo, “o pedido X foi despachado; o código é Y”. Linha, ficha e chat chamam os mesmos contratos de negócio e atualizam as mesmas informações. O canal de interação não amplia permissões nem elimina validações. Pedidos ambíguos precisam de esclarecimento antes da alteração. Cancelamento, reembolso, reserva e substituição exigem política antes da implementação. Não fornecer botões que aparentem executar regras ainda ausentes.

### Conexões

Pedido → paciente; item → produto; produto → estoque; envio → ocorrência; decisão → atividade; pagamento → evidência autorizada. Despachante opera dentro de suas atribuições; gestor acompanha; representante não recebe acesso universal a pedidos.

## 13. Catálogo e estoque

### 13.1 Catálogo — página contextual, fora do menu principal

**Acesso:** Pedidos, item do pedido, ficha de produto relacionada ou Copilot; não exigir ícone próprio no menu.

**Finalidade:** apresentar produtos e condições reais da empresa. Galeria/lista com foto quando disponível, nome, apresentação/concentração pertinente, situação comercial e disponibilidade autorizada. Não usar fotos genéricas como se fossem o produto real.

Filtros por nome/código, categoria, disponibilidade e situação. Descrições informativas e dados operacionais podem ter fontes diferentes, mas produto tem identidade estável.

### 13.2 Ficha do produto

Informação descritiva autorizada, apresentação, documentos/materiais, condições e preço vigente; disponibilidade; histórico editorial pertinente. Links para estoque, pedidos e conteúdo empresarial relacionado. Não gerar indicação terapêutica ou equivalência clínica por semelhança de nome.

Alterações descritivas/comerciais seguem permissões e publicação. Preservar valores originais de pedidos existentes quando preço mudar.

### 13.3 Estoque — lista operacional de produtos e quantidades

**Confirmado:** o despachante precisa ver a lista de produtos com a quantidade existente, e pode solicitar alterações pelo chat. Priorizar produto, apresentação pertinente, quantidade e pendência; histórico e detalhamento abrem por contexto. Alterações de quantidade registram entrada/saída/ajuste e motivo, conforme regra, em vez de apagar o saldo anterior sem rastreabilidade.

Acesso por Catálogo, ficha de produto, pedido ou comando do Copilot. Visão por produto, saldo físico/disponível/reservado se tais conceitos forem implementados, último movimento e alertas de nível baixo conforme regra.

Não presumir armazenamento nacional, múltiplos depósitos ou logística física específica. Se houver diferentes modalidades, explicitar a unidade e o responsável pela disponibilidade.

### 13.4 Movimentações — coleção e item

Entradas, saídas e ajustes com quantidade, motivo, responsável, data e referência a pedido quando existir. Registrar eventos fora do sistema também, como entrada de compra ou saída externa. Proposta de ajuste apresenta efeito antes de executar quando necessário. Saldo resulta de movimentos consistentes, não de resumo LLM.

### 13.5 Ações e conexões

Consultar, registrar entrada/saída/ajuste autorizado, explicar divergência, abrir pedidos relacionados e alertas. Política de aprovação e momento de reserva/baixa são pendentes. Duas operações concorrentes não podem confirmar disponibilidade incompatível.

Notificação de estoque baixo leva ao produto/estoque correspondente. Se não houver integração, exibir informação manual e data de atualização, sem fingir atualização em tempo real.

### 13.6 Catálogo e pagamento vistos pelo paciente

**Confirmado:** existem apresentações de catálogo e pagamento para o cliente final/paciente, distintas das ferramentas internas do despachante. Esses links podem ser entregues pela Consultora de Pacientes; não concedem acesso ao Workspace da equipe nem exigem criar um portal completo de paciente.

- **Catálogo cliente:** produtos/informações/condições autorizados para aquele contexto; não expor quantidades internas de estoque por padrão. Forma de seleção e sua relação com prescrição seguem a jornada, sem troca autônoma de produto pela interface.
- **Pagamento cliente:** pedido/itens/valor pertinentes e mecanismo seguro de pagamento, conforme provedor. O paciente vê o necessário à compra, sem logs administrativos, contatos de outros pacientes ou credenciais.
- **Detalhe interno de pagamento:** referência, situação verificável, ocorrências e ações permitidas, acessado pela equipe via pedido/Copilot. Não é a mesma tela do checkout cliente.
- **Consistência:** apresentações cliente e interna usam os mesmos produtos/pedidos autorizados; edição de preço/estoque não reescreve compra já confirmada. Não afirmar pagamento confirmado apenas por visita à página de retorno.

**Pendente:** formato do catálogo cliente (página ou outro formato), checkout próprio/hospedado pelo provedor, autenticação/links e política de disponibilidade. Replit implementará a apresentação definida; backend emite acesso com escopo limitado ao destinatário/recurso.

## 14. Cérebro — wiki contextual e modificável

**Finalidade:** compreender o conhecimento e o modo de operação, suas fontes e a razão das decisões; alterar conteúdo permitido pelo Copilot.

### Página de entrada

Uma página contextual navegável, com resumo da empresa/assunto e ramificações. Pontos de entrada propostos: Identidade, Manuais das IAs, Manuais humanos, Processos, Conhecimento comum, Memória pertinente, Produtos, Estratégia, Decisões e Fontes. Não exigir uma árvore completa de arquivos para o usuário achar cada resposta.

Separar base Minerva compartilhada de conteúdo empresarial. Padrão publicado, rascunho e memória operacional não são o mesmo tipo de página.

### Página de conteúdo — subpágina

Título/identificação; síntese; tipo/escopo; vigência e atualização; conteúdo consolidado; análise quando pertinente; relações; fontes; quem pode propor/autorizar mudança. Expandir detalhes quando necessários, preservando versão/contexto de leitura.

### Manual — subpágina especializada

Perfil/agente e etapa/tarefa; objetivo; contexto necessário; orientações; ações permitidas; gatilhos; continuidade; versão padrão; variantes de experimento e links de decisão. Não mostrar instruções técnicas secretas nem permitir que um usuário externo altere regras do agente.

### Fonte — subpágina

Origem, arquivo/link, data, situação de preparação, conteúdo extraído disponível e páginas consolidadas relacionadas. Original permanece preservado; correções não o reescrevem. Acesso a arquivo é temporário/autorizado conforme backend.

### Decisão — subpágina

Questão, evidências, análise, alternativas quando registradas, decisão do gestor, autor/data e efeito publicado. Não inventar por que algo virou padrão quando essa justificativa não existe.

### Experimento — subpágina

Configuração com variantes, distribuição, população/etapa, indicador/definição, período, resultados, limitações, análise e decisão. Padrão e experimento usam a mesma base de configuração; experimento acrescenta variação/atribuição/comparação.

Links: indicador → experimento → decisão → versão do manual → atendimentos associados autorizados. Sem alegação automática de causalidade ou vencedor.

### Proposta e versões — subpáginas

Antes/depois; justificativa; solicitante; impacto; versão-base; autoridade e situação. Comparar versões, aprovar/rejeitar quando autorizado e solicitar ajustes. Mudança da proposta invalida aprovação anterior quando alterar o objeto aprovado.

Manuais/identidade/processos são modificáveis segundo autoridade. Memória pode ser corrigida; fonte permanece identificada. Conhecimento comum é mantido pela Minerva, não sobrescrito pelo gestor cliente.

### Conexões

Pessoas e atividades são aprofundamentos contextuais, não todo o histórico despejado numa wiki. Catálogo, tarefas, estratégia e relatórios mantêm registros únicos. Gestão administra acessos/conexões; Cérebro explica conteúdo/regras e suas versões.

## 15. Gestão / Configurações

**Finalidade:** administrar organização, equipe e conexões; complementar a visão de conteúdo do Cérebro. Não duplicar editor de manual em outro lugar com versão diferente.

### Empresa

Identificação, sistemas contratados, contexto organizacional e acesso à página empresarial do Cérebro. Alterações de plano/contrato não são automaticamente liberadas por editar uma nota.

### Equipe — coleção e ficha

Membros, perfil, situação, responsabilidade, carteira e disponibilidade pertinente. Ações: convidar/cadastrar, alterar atribuição, suspender acesso conforme permissão. Limite de representantes vem do plano; estado pendente/inativo e efeitos no limite ainda precisam de regra.

Ficha do colaborador reutiliza Pessoas. Gestão abre controles de acesso; Pessoas apresenta contexto para trabalhar. Não duplicar identidade.

### Papéis e permissões

Mostrar responsabilidades e escopos compreensíveis. Não expor um editor arbitrário de privilégios sem política. Mudanças relevantes registram autor, versão e efeito. Trocar cargo não garante leitura retroativa de todo o histórico sensível.

### Conexões

WhatsApp Médico, WhatsApp Paciente, Telegram e integrações contratadas. Exibir situação: não configurada, em verificação, conectada, falha ou indisponível, conforme evidência.

Configurar por fluxo seguro quando disponível; nunca mostrar token existente ou pedir segredo via Copilot/conversa. Área técnica de administrador/desenvolvedor separada da experiência comum. Não colocar editor n8n nem credencial em bundle frontend.

### Plano e capacidade

Sistemas habilitados, limites e utilização conhecida. Mostrar 500/25/25 quando esse plano for o aplicado, sem hardcode geral. Gestão comercial de assinatura/cobrança só se implementada; não inventar checkout.

### Preferências e perfil

Idioma/fuso, preferências de comunicação e dados pessoais permitidos; ajuda e saída no menu pessoal. Preferência não pode desativar controles obrigatórios nem modificar permissão do próprio usuário.

## 16. Notificações, tarefas e aprovações

### Notificações — cabeçalho e página central

Ícone com contagem quando confiável; prévia de avisos autorizados; abrir central completa como página central. Lista por recência, tipo, prioridade e situação. Proposta de filtros: para mim, não lidas, exigem ação e concluídas, conforme dados existentes.

Cada item mostra o que aconteceu, por que requer atenção, origem, recurso e ação possível. Abrir leva a contexto real: médico, pedido, tarefa, rota ou aprovação. Marcar lida não conclui trabalho.

Recebimento por Telegram e exibição W referem-se ao mesmo acontecimento; canais não devem gerar tarefas duplicadas. Situação de leitura pode ser específica do canal.

### Tarefas — coleção e ficha contextual

Solicitação, responsável, vínculo/recurso, prazo, situação, instrução/contexto e resultado. Tarefa pode ser manual, originada em jornada ou proposta pelo Copilot. O humano pode concluir se autorizado e fornecer evidência pertinente; a conclusão não dispara qualquer etapa sem regra.

### Aprovação — ficha contextual

Proposta, autor, motivo, antes/depois, impacto, versão-base, destinatário e histórico. Gestor aprova/rejeita/pede ajuste; a aprovação libera E, não finge execução imediata. Mostrar situação posterior de aplicação e comunicar resultado ao solicitante.

### Suporte — caso contextual

Motivo, etapa original, interlocutor, responsável, prioridade, comunicações e resolução. Não apaga a jornada. Se houver responsável externo sem conta, acompanhar o encaminhamento conforme os dados realmente disponíveis.

## 17. Perfis, atualização e execução

### 17.1 Matriz funcional de referência

A tabela expressa foco de trabalho, não concede acesso universal. Permissões finais dependem da política e atribuição.

| Área | Gestor | Representante | Despachante |
|---|---|---|---|
| Indicadores | Operação autorizada | Carteira/trabalho | Operação logística |
| Estratégia | Define e acompanha distribuição de créditos | Somente se autorizado; carteira em Pessoas | Sem acesso padrão |
| Conversas/pessoas | Conforme política | Carteira e suporte atribuído | Contexto operacional necessário |
| Reuniões/visitas | Coordenação | Executa/prepara | Apenas se tarefa exigir |
| Pedidos/estoque | Acompanha/configura conforme política | Relações autorizadas | Operação atribuída |
| Cérebro | Conteúdo e alterações permitidos | Manuais/contexto e propostas | Manuais/contexto e propostas |
| Gestão | Administração autorizada | Preferências/dados próprios | Preferências/dados próprios |
| Copilot/notificações | Adaptados ao perfil | Adaptados ao perfil | Adaptados ao perfil |

### 17.2 Contrato com CEBD

Toda visualização precisa de: identificador de recurso, empresa, tipo, dados autorizados, situação, atualização e relações resolvíveis. Análise traz fontes e momento. Comando precisa de situação/resultado; alteração segue validação backend.

Eventos relevantes atualizam páginas abertas sem perder seleção/filtro indevidamente. Atualização crítica de estado não espera resumo semântico. Se memória consolidada estiver atrasada, indicar data/atualização pendente em vez de contradizer silenciosamente o evento novo.

Persistir filtros/layout por usuário/empresa é proposta de conveniência. Nunca reutilizar cache de outra empresa após troca. Conexão em tempo real, polling ou outro mecanismo será escolhido com o backend; frontend não inventa disponibilidade de evento.

### 17.3 Navegação por MCPWeb

Contrato conceitual: abrir/focar/fechar página, selecionar recurso, aplicar filtro, trocar visualização e organizar painéis. Cada comando deve reportar resultado. Somente abrir/mostrar contexto autorizado; não avaliar código arbitrário recebido do modelo.

Abrir mesma ficha por conversa ou coleção preserva identidade e pode alterar foco de tarefa. Contexto enviado ao C inclui referências explícitas selecionadas; interface não concede leitura invisível de todos os dados na tela.

### 17.4 Demonstração e integração

Modo mock usa dados fictícios consistentes entre páginas e rótulo de demonstração. Não disparar mensagens/cobranças ao clicar na demo. Conexão real substitui o adaptador de dados com o mesmo contrato. Falha real não deve retornar silenciosamente dados mock e parecer sucesso.

## 18. Entrega modular ao Replit

### Primeira cadeia demonstrável

Gestor configura distribuição → execução simulada gera médicos → coleção atualiza → ficha abre contextualizada → conversa mostra evolução → indicador abre a mesma população.

### Ordem proposta

1. Estrutura compartilhada: empresa/perfil, menu/cabeçalho, gerenciador de até quatro painéis, coleção e ficha genéricas.
2. Copilot como página e comandos de apresentação simulados com resultados explícitos.
3. Indicadores, Estratégia, Pessoas e Conversas com dados fictícios relacionados; pesquisa operacional interna fica fora de W cliente.
4. Reuniões e Visitas, preparação contextual e registro de resultado.
5. Pedidos, Catálogo/Estoque, Pagamento e Envio com estados separados.
6. Wiki/Cérebro, fontes, versões, decisões, experimentos e aprovações.
7. Gestão e conexões, campanhas conforme escopo, integração progressiva com CEBD.

Copilot, notificações e permissões são transversais desde a estrutura, não só adicionados ao final. Conhecimento comum, dados sensíveis e regras de negócio não devem ser improvisados pelo Replit para fazer telas parecerem completas.

### Critérios de aceite funcionais

- Coleção/item/relações usam o mesmo registro em qualquer caminho.
- Lista do despachante une visualização e ação; rastreio/confirmações podem ser registrados na linha ou pelo chat sem duplicar efeitos.
- Catálogo/pagamento cliente são separados da lista interna de estoque e da administração de pagamentos, com dados autorizados do mesmo produto/pedido.
- Painéis mantêm contexto e não descartam alteração pendente silenciosamente.
- Troca de perfil/empresa não expõe conteúdo anterior indevido.
- Estratégia valida distribuição e mostra créditos/segmentações; pesquisa interna da Minerva não aparece como página cliente. Pessoas, Conversas e Indicadores refletem a execução em áreas próprias.
- Ficha distingue fato, relato, análise, sugestão e decisão.
- Pedido e paciente têm ciclos relacionados sem serem um estado único.
- Aprovar e executar têm estados distintos; notificação lida não conclui tarefa.
- Número de indicador é rastreável a definição/recursos autorizados.
- Fonte e versão sustentam manual/decisão; ausência é explícita.
- Modos demonstração, integração indisponível, falha e sucesso não se confundem.
- Contratos compartilhados permitem trocar mocks por backend sem reconstruir toda a navegação.

### Decisões que continuam abertas

Home padrão; lista final de itens do menu e posição de Campanhas; política de substituição da quinta página; granularidade de permissões; integradores reais; calendário/logística; tipos de filtros e métricas finais; publicação de alterações e retomada de atendimento; mecanismos de atualização do frontend.

Este arquivo detalha comportamento e conteúdo. Não é um scaffold de interface, uma prova de integração ou uma ordem para publicar. Os próximos briefings devem referenciar esta especificação e as decisões posteriores, sem voltar aos rascunhos anteriores à recuperação do contexto.
