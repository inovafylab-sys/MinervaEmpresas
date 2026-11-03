# Minerva Empresa — contexto, jornadas e contratos de execução

> Página de referência para desenvolver o produto sem depender da memória do chat.
>
> **Estado:** desenho funcional e técnico inicial; não representa workflows ou integrações já implementados.<br>
> **Versão:** 0.1.<br>
> **Escopo:** sistemas Médico e Paciente, Copilot por perfil, consolidação, dados e reflexo no Workspace.<br>
> **Referência temporal:** consolidação ao final da conversa iniciada em 2 de novembro de 2026; propostas comerciais antigas não comprovam contratação ou entrega.

## Como navegar e usar

Esta é uma página central, com aprofundamentos por links internos. Não carregar seu conteúdo integral como prompt de todo atendimento: recuperar a seção e os registros necessários à tarefa. Uma interface futura pode apresentar essas seções dinamicamente, mas este arquivo é uma referência Markdown estática, não essa interface já funcionando.

**Legenda:** **Confirmado** = definição do proprietário; **Proposta** = tradução técnica a validar; **Pendente** = regra não decidida. Identificadores, campos e nomes de operações são propostas de contrato, não APIs existentes.

As decisões recentes do proprietário prevalecem sobre as conversas antigas e as sugestões de assistentes. Os documentos de `docs/planejamento/00-*`, `01-*` e `02-*` foram escritos antes da recuperação do contexto. O documento `03-base-consultora-de-medicos.md` é um rascunho anterior e parcial. Em conflitos sobre os temas cobertos aqui, usar esta consolidação e decisões posteriores do proprietário. Não apagar silenciosamente os originais.

### Mapa da página

- [1. Produto e arquitetura](#1-produto-e-arquitetura)
- [2. Contexto: fonte, consolidação e apresentação](#2-contexto-fonte-consolidação-e-apresentação)
- [3. Entidades, jornadas e eventos](#3-entidades-jornadas-e-eventos)
- [4. Contratos compartilhados](#4-contratos-compartilhados)
- [5. Funil médico](#5-funil-médico)
- [6. Funil paciente](#6-funil-paciente)
- [7. Copilot e manuais humanos](#7-copilot-e-manuais-humanos)
- [8. Cérebro modificável e experimentos](#8-cérebro-modificável-e-experimentos)
- [9. Catálogo inicial de execuções](#9-catálogo-inicial-de-execuções)
- [10. Obsidian, PostgreSQL e arquivos](#10-obsidian-postgresql-e-arquivos)
- [11. Contrato funcional do Workspace](#11-contrato-funcional-do-workspace)
- [12. Construção modular e validação](#12-construção-modular-e-validação)
- [13. Pendências e retomada](#13-pendências-e-retomada)

## 1. Produto e arquitetura

### 1.1 Startup e sistemas contratáveis

**Confirmado:** Minerva é a startup; possui Produto e Equipe. Aqui desenhamos o Produto. Não confundir operação interna da startup com organizações clientes do SaaS.

O produto oferece dois sistemas contratáveis: Médico, Paciente ou ambos. Compartilham infraestrutura, com identidade empresarial e acessos delimitados. A operação é AI First: regras e estratégia configuradas permitem continuidade digital sem presença humana permanente. Reunião, visita, equipe própria ou rede comissionada são escolhas combináveis, não fases obrigatórias.

| Contratação | Atendimento externo | Trabalho interno |
|---|---|---|
| Médico | Consultora de Médicos | Copilot: gestor e representante |
| Paciente | Consultora de Pacientes | Copilot: gestor e despachante |
| Ambos | Duas Consultoras em WhatsApps distintos | Mesmo Copilot, três perfis internos |

**Confirmado:** para o cliente, três identidades de atendimento; por dentro, cinco perfis com contexto, manual e metas diferentes. Copilot é um só na experiência, adaptado a gestor, representante e despachante. O proprietário chama as identidades de “três números”; tecnicamente o terceiro canal é Telegram/Workspace, não necessariamente outro WhatsApp.

A Consultora empresarial de Médicos não é o futuro produto completo para o trabalho clínico do médico. Quem não tem receita pode ser encaminhado à rede médica Minerva, inicialmente uma médica parceira. Existência dessa relação não garante prescrição: avaliação e prescrição pertencem à profissional.

### 1.2 CEBD/W

| Componente | Responsabilidade | Local de desenvolvimento |
|---|---|---|
| C — Comunicação | Recebe intenção, conversa e comunica resultados | Codex; inicialmente n8n |
| E — Execução | Prepara dados e realiza tarefas por ferramentas/código/workflows | Codex; inicialmente n8n |
| B — Cérebro | Coleta, relaciona e consolida dados e contexto | Codex |
| D — Dados | Persistência, recuperação, consistência e autorização | Codex; Obsidian + PostgreSQL |
| W — Workspace | Visualizações e interação humana | Replit |

`C → E → B → W` descreve responsabilidades; não exige uma chamada LLM por letra nem que o registro original espere a consolidação. D sustenta as etapas. O Cérebro fornece contexto a C/E antes e durante a execução.

C também controla W por MCPWeb: abrir, selecionar, filtrar e organizar visualizações. Operação de negócio continua sujeita à autorização e à execução no backend.

**Decisão atual:** começar os agentes no n8n. Não exigir O separado, Habilidades MCP formalizadas ou PaperClip na primeira versão. Na arquitetura Neurum original, O e E ficariam no PaperClip/Hermes e H no n8n; capacidades validadas poderão ser extraídas depois para Habilidades Neurum. Habilidade não é Skill de instruções. Estrutura atual do repositório Neurum e compatibilidades não foram inspecionadas.

## 2. Contexto: fonte, consolidação e apresentação

### 2.1 Três representações relacionadas

| Representação | Conteúdo | Uso |
|---|---|---|
| Fonte bruta | Mensagem, áudio, documento, resultado de pesquisa, evento externo, relato | Evidência original, conferência e reprocessamento |
| Consolidado para IA | Fatos, estado, memória, relações, pendências e referências | Atender/executar com continuidade e contexto pertinente |
| Apresentação humana | Ficha contextual, coleção, conversa, indicador, análise e wiki | Compreender e trabalhar, com aprofundamento por links |

Não são três cópias completas independentes. Consolidar pode extrair campos, atualizar relações, produzir síntese ou calcular um resultado; não é apenas resumir texto.

### 2.2 Contexto orientado à finalidade

**Confirmado:** página/ficha mostra primeiro o necessário à tarefa, já contextualizado, com análise e sugestões do Copilot e links para aprofundar. A perspectiva muda conforme perfil e tarefa; não criar uma pessoa duplicada para cada visualização.

**Proposta de composição de contexto:**

1. Empresa, módulos contratados, identidade e permissões verificadas.
2. Intenção atual e objetivo da etapa/tarefa.
3. Fatos/estado atuais obtidos por consulta exata.
4. Memória consolidada relevante e conversa recente necessária.
5. Manual publicado e variante atribuída.
6. Conhecimento pertinente, com fontes e versões.
7. Ferramentas autorizadas e referências para leitura adicional.

Buscar identidade/permissão/pagamento/etapa por registros exatos; não decidir esses estados por similaridade RAG. Usar recuperação textual/semântica para documentos e evidências. Links precisam ser resolvíveis por ferramenta e autorizados, não apenas texto decorativo.

### 2.3 Separação epistemológica

Conservar a distinção entre fato confirmado, relato de pessoa, inferência, análise, sugestão e decisão autorizada. Uma análise pode ser persistida, mas continua análise, com origem e data. Não promover observação isolada a conhecimento científico ou configuração automaticamente.

O índice de leitura/vetorial é derivado e reconstruível. Uma correção factual deve afetar as representações e ações dependentes, preservando a história e a origem da correção. Não reescrever a fonte original para fazê-la concordar com a síntese.

### 2.4 Pacotes de referência

Os códigos abaixo reduzem repetição nos contratos das etapas. São agrupamentos lógicos; não exigem tabelas ou arquivos de mesmo nome.

| Código | Conteúdo | Referência/origem |
|---|---|---|
| CTX-IDENTIDADE | Empresa, pessoa, vínculo, canais, perfil, módulos e permissões | Cadastro/vínculos verificados |
| CTX-ESTADO | Etapa, transições, pendências, responsáveis e ações futuras | Eventos e estado operacional |
| CTX-MEMORIA | Preferências, histórico relevante, compromissos e correções | Consolidação de interações com fontes |
| CTX-EMPRESA | Marca, história, produtos, oferta, condições, equipe e processos | Cérebro empresarial publicado |
| CTX-MANUAL | Objetivo, instruções, limites, gatilhos, execuções e variante | Manual empresarial versionado |
| CTX-CONHECIMENTO | Ciência, legislação, cannabis e mercado pertinentes | Conhecimento comum autorizado e fontes |
| CTX-ATIVIDADES | Conversas, reuniões, visitas, documentos e eventos pertinentes | Registros originais e operacionais |
| CTX-OPERACAO | Agenda, estoque, pedido, pagamento ou envio atuais | Integrações e registros estruturados |

## 3. Entidades, jornadas e eventos

### 3.1 Empresa → pessoa → vínculo

**Confirmado:** a pessoa pode manter relações com mais de uma empresa, com histórico e contexto próprios. Compartilhar infraestrutura não permite compartilhar dados entre clientes indiscriminadamente.

**Proposta de entidades mínimas:** empresa; pessoa; identificador de canal; vínculo; definição de jornada; jornada do vínculo; etapa; evento; transição; conversa; atividade; tarefa; documento/fonte; consolidação; versão de manual; decisão; experimento/atribuição; pedido/pagamento/envio quando pertinente.

Vínculo externo de médico/paciente não concede login no W. Um identificador de contato pode localizar uma ficha, mas correspondências ambíguas ou acesso sensível exigem verificação adequada. Uma identidade global só pode ser relacionada entre contextos com critério, sem expor uma relação à outra.

### 3.2 Modelo de jornada

- **Definição:** etapas, objetivos e regras da empresa, com versão.
- **Jornada do vínculo:** percurso de um médico ou paciente naquela relação.
- **Estado atual:** situação vigente que orienta o próximo atendimento.
- **Evento:** acontecimento registrado com origem.
- **Transição:** mudança de estado autorizada por evento e regra.

Nem toda mensagem produz transição. Manifestação de interesse, agendamento e aceite são coisas diferentes. O C interpreta e pode propor ação; regras verificam se a evidência permite alterar estado.

A estratégia pertence ao ciclo da empresa; cada médico tem seu percurso. No paciente, a relação continua enquanto cada pedido possui pagamento/preparação/envio próprios. Não representar múltiplas compras simultâneas por um único estado que apague os demais.

### 3.3 Contrato proposto de evento

Campos mínimos: identificador, empresa, vínculo/recurso, tipo, ator/origem, momento ocorrido e momento recebido, referência à evidência, execução originadora e chave de deduplicação quando aplicável. Dados pessoais não precisam ser copiados para cada evento; usar referências autorizadas.

Transição registra: antes/depois, evento motivador, regra/versão, responsável e data. Execução registra: solicitante, operação, entrada validada, estado, resultado e falha. Reprocessar evento não duplica transição, cobrança, envio ou notificação.

## 4. Contratos compartilhados

### 4.1 Dúvidas

Qualquer etapa pode receber pergunta. Consultar contexto/manual/conhecimento e responder ou encaminhar. Salvar pergunta, fontes pertinentes e resultado; atualizar memória quando relevante. Só alterar etapa se surgir gatilho válido. Pergunta recorrente pode motivar proposta de FAQ, sem publicação automática.

### 4.2 Suporte humano

Registrar motivo, vínculo/recurso, responsável, prioridade/prazo conforme regras, contexto mínimo e situação. Encaminhamento pode usar canal externo escolhido pela empresa sem obrigar novo usuário W. Especificar quando IA aguarda, continua ou retoma para evitar respostas conflitantes.

### 4.3 Notificações

Notificações são transversais aos Consultores e ao Copilot, sobretudo pelo Telegram para a equipe. Separar acontecimento, tarefa e envio do aviso. Notificar não significa executar. Registrar origem, destinatário, canal, situação e ação vinculada; considerar entrega/leitura somente quando comprovadas pelo canal.

### 4.4 Correção, pausa e recusa

Registrar motivo, origem e impacto. Recusa interrompe comunicações incompatíveis. Pausa numa execução não encerra automaticamente toda a relação. Falha técnica não equivale a conclusão, recusa ou avanço. Regras detalhadas de pausa/encerramento ainda precisam de configuração.

### 4.5 Escrita e atualização

**Propostas:** persistir fonte/evento antes de consolidação demorada; escrever mudanças estruturadas com validação; preservar versões; controlar concorrência; permitir reprocessar B; identificar pendências de consolidação. Estado crítico recente deve estar disponível mesmo se o resumo ainda não foi atualizado.

## 5. Funil médico

### Visão de conjunto

`Estratégia da empresa → busca/qualificação → abordagem → coleta de dados → oportunidade/parceria → aceite/onboarding → parceria ativa`.

Reunião/visita é caminho opcional relacionado, não passagem obrigatória. A Consultora acompanha a jornada; E executa prospecção e tarefas. Relacionamento humano cabe ao representante; a Consultora sustenta atendimento, dúvidas e comunicações programadas.

### M0 — Estratégia do ciclo

**Confirmado:** plano de referência 500 novos médicos/mês, até 25 segmentações/mês e até 25 representantes cadastrados. Distribuição por percentuais: por exemplo, 10% neurologistas = 50; 20% São Paulo cidade = 100; 15% Brasília = 75; demais segmentos = 275. Isso não determina regiões obrigatórias. Segmento não é sinônimo de representante. Base anterior continua; 500 não é limite total de contatos.

- **Entrada:** gestor inicia ou altera estratégia pelo C Copilot Gestor.
- **Contexto:** CTX-IDENTIDADE, CTX-EMPRESA, resultados anteriores, equipe/territórios, capacidade e consumo do ciclo.
- **Manual:** planejamento de aquisição; filtros disponíveis; limites; forma de aprovação.
- **E:** `estrategia.preparar`, `estrategia.validar`, `estrategia.publicar`.
- **Fontes:** conversa do gestor e indicadores consultados.
- **Consolidado IA:** estratégia autorizada, segmentos, metas, prioridades e limites; não simples transcrição do pedido.
- **D/B:** versão, percentuais, quantidades, estado rascunho/publicado, autorizador e execução vinculada.
- **W:** pizza central, segmentos laterais, capacidade restante, metas/progresso separados e quantidade de segmentos usados.
- **Gatilho de liberação:** gestor autoriza a versão executável. Estratégia não é etapa individual de cada médico.
- **Continuidade/exceções:** ajustar rascunho, resolver percentuais/quantidades; preservar realização ao alterar plano; não redistribuir saldo silenciosamente.
- **Pendente:** momento de consumo, arredondamento, ciclo, saldo, contagem/substituição de segmentações e tratamento de segmentos insuficientes. Inicialmente filtros separados; combinações/custo diferenciado ficam fora até definição.
- **Aceite técnico:** configuração inválida não inicia busca; metas inteiras coerentes; versão autorizada identificável.

### M1 — Busca e qualificação inicial

- **Entrada:** execução autorizada de um segmento.
- **Objetivo:** encontrar candidatos adequados e preparar a abordagem.
- **Contexto:** estratégia, meta/saldo, base existente e CTX-EMPRESA.
- **Manual:** fontes permitidas, critérios de inclusão/exclusão e dados necessários. Critérios finais ainda pendentes.
- **E:** `medico.pesquisar`, `medico.verificar_duplicidade`, `medico.qualificar`, `ficha.atualizar`.
- **Fontes:** resultados do Google Maps e Perplexity, páginas e registros encontrados. Provedores/APIs e acesso precisam ser verificados.
- **Consolidado IA:** identificação profissional disponível, especialidade/localidade, contato, adequação ao segmento e informações pertinentes à abordagem. Distinguir encontrado, inferido e confirmado.
- **D/B:** candidato/pessoa/vínculo quando apropriado, fontes, qualidade/pendências, origem, decisão de qualificação e consumo conforme regra aprovada.
- **W:** novos médicos incorporados na coleção Pessoas; ficha inicial com origem e situação. Busca com mapa, lista bruta de candidatos e pesquisa permanecem internas à Minerva, fora da página Estratégia do cliente.
- **Gatilho de saída:** qualificação atendida e contato apto à abordagem conforme regras do canal.
- **Continuidade/exceções:** procurar até meta/limite, registrar resultado parcial; candidato sem contato ou evidência fica pendente/descartado com motivo; sobreposição de segmentos não pode gerar contagem duplicada indevida.
- **Aceite técnico:** resultados têm fontes; duplicidade é tratada; inferência não é apresentada como dado confirmado.

### M2 — Abordagem personalizada

- **Entrada:** médico qualificado e contato liberado para abordagem.
- **Objetivo:** estabelecer conversa pertinente sobre a oportunidade.
- **Contexto:** ficha inicial, CTX-EMPRESA, CTX-ESTADO, contato anterior e preferências/restrições.
- **Manual:** apresentação, linguagem, cadência, limites, horários e condições de parada.
- **E:** `mensagem.preparar`, `mensagem.enviar`, `continuidade.programar`.
- **Fontes:** contexto de pesquisa, mensagem enviada/recebida e resultado do canal.
- **Consolidado IA:** o que foi apresentado, resposta/ausência, restrições e próxima ação.
- **D/B:** mensagens, tentativas, identificadores externos, situação de envio e ação futura.
- **W:** conversa e atividades; ficha mostra situação de contato.
- **Gatilho de saída:** resposta que permita continuar a qualificação; não apenas confirmação de entrega.
- **Continuidade/exceções:** revalidar etapa antes de contato programado; cancelar sequência incompatível após resposta/recusa; falha de envio não é abordagem concluída. Personalização não exige ocultar automação nem contornar controles do WhatsApp.
- **Pendente:** provedor, templates/permissões aplicáveis, intervalos, tentativas, horários e regras de parada.
- **Aceite técnico:** eventos repetidos não duplicam envio; recusa interrompe; histórico permite saber o que efetivamente saiu.

### M3 — Coleta de dados / inscrição

- **Entrada:** conversa permite conhecer/qualificar o profissional.
- **Objetivo:** completar a ficha por diálogo e compreender o perfil.
- **Contexto:** ficha, CTX-MEMORIA, conversa e dados já conhecidos.
- **Manual:** informações necessárias, perguntas naturais, correções e critérios de suficiência.
- **E:** `ficha.consultar`, `ficha.atualizar`, `pendencia.registrar`.
- **Fontes:** respostas e materiais do médico.
- **Consolidado IA:** dados confirmados/corrigidos, interesses, necessidades, preferências e lacunas.
- **D/B:** fatos com origem, alterações, memória pertinente, pendências e estado.
- **W:** ficha enriquecida; não expor todos os campos internos como formulário obrigatório.
- **Gatilho de saída:** informações suficientes para apresentar a parceria, conforme manual. Diálogo pode alternar esclarecimento e apresentação, sem repetição mecânica de etapas.
- **Continuidade/exceções:** não perguntar novamente o que já foi confirmado; ambiguidades devem ser esclarecidas; não criar relações globais por correspondência insegura.
- **Pendente:** mínimo obrigatório e verificação profissional.
- **Aceite técnico:** retorno do médico preserva contexto e correções prevalecem sobre dados antigos.

### M4 — Apresentação da oportunidade e parceria

- **Entrada:** contexto suficiente para apresentação pertinente.
- **Objetivo:** explicar oportunidade no mercado de cannabis e a parceria daquela empresa, esclarecer objeções e desenvolver o aceite.
- **Contexto:** interesses/perfil, CTX-EMPRESA, CTX-CONHECIMENTO, histórico e manual/variante.
- **Manual:** proposta, condições, argumentos, limites, materiais e encaminhamentos. Não inventar comissão, benefícios ou resultados.
- **E:** `conteudo.recuperar`, `material.enviar`, `encontro.solicitar`, `parceria.registrar_aceite` quando houver evidência.
- **Fontes:** diálogo, materiais apresentados e manifestações do médico.
- **Consolidado IA:** proposta/versão conhecida pelo médico, dúvidas, objeções, interesse, compromissos e próxima ação.
- **D/B:** eventos distintos de interesse, solicitação de encontro e aceite; variante aplicada; fontes das respostas.
- **W:** ficha contextual e conversa; funil representa o evento real.
- **Gatilho de saída:** aceite verificável → M6; encontro desejado → M5, sem transformar encontro em requisito universal.
- **Continuidade/exceções:** dúvida não reinicia cadastro; pedido fora do escopo é encaminhado; não confundir comentário positivo com aceite.
- **Pendente:** oferta real, critério de aceite e documentação da parceria.
- **Aceite técnico:** responde com fontes pertinentes e não apresenta sugestão como condição contratada.

### M5 — Reunião ou visita, atividade opcional

- **Entrada:** solicitação/aceite de encontro pelo médico, representante ou fluxo autorizado.
- **Objetivo:** acrescentar atendimento humano quando pertinente.
- **Contexto:** ficha, pendências, propósito, responsável, disponibilidade/localização e manual humano.
- **E:** `encontro.agendar`, `encontro.reagendar`, `rota.preparar`, `atividade.registrar`, `notificacao.enviar`.
- **Fontes:** mensagens, calendário, relato do representante, registro de visita e outros materiais disponíveis.
- **Consolidado IA:** contexto preparatório; depois, resultado, compromissos, objeções e próximos passos. Não presumir gravação ou transcrição existente.
- **D/B:** atividade com estado solicitado/agendado/realizado/cancelado/não realizado; agenda, responsável e resultado.
- **W:** reunião, rota, ficha preparatória e tarefas relacionadas.
- **Gatilho:** realização não determina por si só aceite; resultado pode gerar aceite, manter negociação ou pausar. A atividade pode ocorrer também após parceria ativa.
- **Continuidade/exceções:** conflito de agenda, cancelamento e ausência precisam de tratamento; não inventar agendamento se calendário falhar.
- **Pendente:** integração de agenda/mapa, atribuição, confirmação e registro humano.
- **Aceite técnico:** resultado do representante chega ao próximo atendimento da Consultora; não obriga reunião para todos.

### M6 — Aceite e onboarding

- **Entrada:** aceite registrado com evidência e regra aplicável.
- **Objetivo:** explicar procedimentos, condições, benefícios e como encaminhar pacientes.
- **Contexto:** aceite, oferta acordada, representante, manual de onboarding, materiais e destino do encaminhamento.
- **E:** `parceria.registrar_aceite`, `onboarding.entregar`, `encaminhamento.preparar_link`, `pendencia.registrar`.
- **Fontes:** manifestação de aceite, orientações enviadas e respostas.
- **Consolidado IA:** o que foi aceito, explicado e ficou pendente; forma de operar a parceria.
- **D/B:** evidência/versão, orientações e materiais, link, conclusão/pendências e responsável.
- **W:** situação da parceria e onboarding; acesso a materiais e histórico.
- **Gatilho de saída:** critérios definidos de onboarding atendidos.
- **Continuidade/exceções:** resolver pendências e dúvidas; destino de pacientes pode ser externo quando só o sistema Médico foi contratado.
- **Pendente:** condições, kit, aceite e conclusão reais da empresa. Não inventar.
- **Aceite técnico:** destino correto; entrega de mensagem isolada não presume compreensão quando regra exigir confirmação.

### M7 — Parceria ativa e continuidade

- **Entrada:** onboarding concluído.
- **Objetivo:** atendimento disponível, conteúdos programados e encaminhamentos; representante aprofunda relacionamento humano.
- **Contexto:** memória da relação, condições vigentes, preferências, pendências, conteúdos e manual de continuidade.
- **E:** `conteudo.programar`, `material.enviar`, `suporte.encaminhar`, `encaminhamento.registrar`.
- **Fontes:** conversas, atividade humana, conteúdos e encaminhamentos identificáveis.
- **Consolidado IA:** contexto atual da parceria, compromissos, necessidades e próximos passos.
- **D/B:** atividades, preferências, encaminhamentos e mudanças de situação. Não compartilhar com médico conteúdo do paciente sem autorização.
- **W:** carteira, ficha contextual, histórico e indicadores disponíveis.
- **Gatilho de saída:** nenhum encerramento obrigatório; pausa/encerramento dependem de evento e regra definidos.
- **Continuidade/exceções:** um médico encaminha vários pacientes e continua ativo. Não atribuir pedidos/receita externa sem dados e autorização para isso.
- **Aceite técnico:** encaminhamento não reinicia jornada; recusas/preferências de conteúdo são respeitadas.

## 6. Funil paciente

### Visão de conjunto

`Acolhimento → [consulta, se não houver receita] → receita/produto → documentação aplicável → pedido/pagamento → preparação/envio → entrega → acompanhamento`.

Quem já tem receita/documentação segue após conferência sem refazer etapas. O futuro sistema clínico completo não é pré-requisito. Agendamento/pagamento da consulta da médica parceira ainda precisam ser definidos.

### P1 — Acolhimento e qualificação

- **Entrada:** primeiro contato ou retorno, por encaminhamento/campanha/outro canal identificado.
- **Objetivo:** reconhecer pessoa, origem, empresa, necessidade e situação da receita.
- **Contexto:** CTX-IDENTIDADE, ficha/memória existentes, referência de origem e manual de acolhimento.
- **E:** `pessoa.identificar`, `ficha.atualizar`, `origem.registrar`, `documento.receber`.
- **Fontes:** conversa e parâmetros de encaminhamento quando disponíveis.
- **Consolidado IA:** identificação, vínculo, necessidade, receita disponível ou ausente e pendências.
- **D/B:** pessoa/vínculo, origem, fatos, conversa e estado.
- **W:** paciente na coleção; ficha contextual, conversa e pendências conforme acesso.
- **Gatilho de saída:** sem receita → P2; receita recebida → P3. Dizer que possui receita não equivale ao recebimento.
- **Continuidade/exceções:** acolher sem repetir dados; resolver identidade/origem ambíguas.
- **Pendente:** dados mínimos e regras de identificação.
- **Aceite técnico:** retorno não cria pessoa duplicada; origem não concede acesso irrestrito a terceiro.

### P2 — Consulta quando necessária

- **Entrada:** paciente sem receita precisa de avaliação.
- **Objetivo:** encaminhar à rede médica Minerva, inicialmente uma médica parceira.
- **Contexto:** necessidade, situação da receita, profissional disponível, instruções de encaminhamento e permissões.
- **E:** `consulta.encaminhar`; agenda/pagamento somente após integração e regra definidas.
- **Fontes:** encaminhamento, dados de agenda disponíveis e retorno do paciente/profissional.
- **Consolidado IA:** responsável, situação, pendências e necessidade de aguardar prescrição.
- **D/B:** encaminhamento e seu acompanhamento; registrar apenas dados clínicos necessários/autorizados.
- **W:** situação da consulta e tarefa de continuidade.
- **Gatilho de saída:** receita recebida → P3. Consulta realizada sem prescrição não libera compra.
- **Continuidade/exceções:** ausência, reagendamento ou não prescrição não devem ser convertidos em receita fictícia. Produto eventualmente prescrito é decisão profissional.
- **Pendente:** como agendar, cobrar, confirmar e receber retorno; destino quando não houver prescrição.
- **Aceite técnico:** fluxo funciona sem exigir futuro produto médico e sem prometer prescrição.

### P3 — Receita e identificação do produto

- **Entrada:** documento de prescrição recebido.
- **Objetivo:** extrair/conferir informações necessárias e identificar o produto prescrito.
- **Contexto:** fonte original, ficha, catálogo, manual de conferência e requisitos aplicáveis.
- **E:** `documento.extrair`, `receita.conferir`, `produto.identificar`, `pendencia.registrar`, `suporte.encaminhar`.
- **Fontes:** receita original e esclarecimentos autorizados.
- **Consolidado IA:** paciente, prescritor, produto, concentração, apresentação, quantidade, posologia e data quando presentes; qualidade da leitura e pendências. Extração não é validação automática.
- **D/B:** original com acesso restrito, campos, fonte por extração, resultado de conferência e correções.
- **W:** documento/dados permitidos, produto identificado e pendências; despachante não recebe todo o contexto clínico por padrão.
- **Gatilho de saída:** critérios de conferência atendidos e produto identificado → P4 ou verificação de não aplicabilidade.
- **Continuidade/exceções:** ilegibilidade, conflito, produto ausente ou divergência exigem esclarecimento/encaminhamento; não substituir produto ou ajustar prescrição autonomamente.
- **Pendente:** validade e conferência por modalidade, campos mínimos e necessidade de revisão humana.
- **Aceite técnico:** distingue extraído/confirmado; campos ausentes não são inventados.

### P4 — Autorização e documentação

- **Entrada:** receita conferida e requisitos identificáveis.
- **Objetivo:** verificar documentos e orientar obtenção do que falta, incluindo Anvisa quando aplicável.
- **Contexto:** receita, modalidade de fornecimento, documentos existentes e manual administrativo/regulatório atualizado.
- **E:** `documentacao.verificar`, `orientacao.entregar`, `documento.receber`, `pendencia.registrar`.
- **Fontes:** documentos, protocolo, autorização e mensagens.
- **Consolidado IA:** requisitos, situação, validade conhecida, pendências e próxima orientação.
- **D/B:** requisitos e evidências, resultado de conferência, autorização ou não aplicabilidade com fundamento.
- **W:** checklist e pendências, não um rótulo de aprovação inferido da conversa.
- **Gatilho de saída:** documentação atendida ou etapa não aplicável conforme regra → P5.
- **Continuidade/exceções:** protocolo não é autorização; documento válido existente não é solicitado de novo. Não presumir API de Anvisa ou solicitar credenciais gov.br em conversa.
- **Pendente:** modalidade real por empresa, normas/requisitos atuais e procedimento de conferência.
- **Aceite técnico:** caminho aplicável documentado; nenhuma alegação de aprovação sem evidência.

### P5 — Pedido e pagamento

- **Entrada:** requisitos atendidos e produto disponível para confirmação de compra.
- **Objetivo:** confirmar itens/condições, criar pedido e obter confirmação de pagamento.
- **Contexto:** produto, estoque, preço/condições, documentação, endereço e autorização operacional.
- **E:** `pedido.preparar`, `pedido.confirmar`, `pagamento.iniciar`, `pagamento.consultar`.
- **Fontes:** confirmações do paciente, pedido e eventos verificáveis do pagamento.
- **Consolidado IA:** pedido, valor, itens, endereço, pendências e situação exata.
- **D/B:** valores/condições no momento da compra, referências de pagamento e histórico; evitar cobrança duplicada.
- **W:** ficha do pedido, itens, pagamento e pendências.
- **Gatilho de saída:** pagamento confirmado e demais requisitos de liberação atendidos → P6.
- **Continuidade/exceções:** link enviado ou relato “paguei” não equivale a pagamento confirmado. Falha/expiração/cancelamento têm estado próprio. Regra de reserva de estoque ainda deve ser definida.
- **Pendente:** gateway, preço/frete, disponibilidade, cancelamento/reembolso e reserva.
- **Aceite técnico:** webhook repetido não duplica pedido/cobrança; valor confiável não é calculado livremente pelo LLM.

### P6 — Preparação e envio

- **Entrada:** pedido liberado.
- **Objetivo:** acionar despachante e acompanhar preparação/expedição.
- **Contexto:** pedido, requisitos cumpridos, estoque, endereço, responsável e manual operacional.
- **E:** `pedido.liberar`, `tarefa.criar`, `estoque.movimentar`, `envio.registrar`, `notificacao.enviar`.
- **Fontes:** ações do despachante, sistema logístico e movimentos registrados.
- **Consolidado IA:** situação, responsável, impedimentos e identificação do envio.
- **D/B:** preparação, movimentos, despacho, transportador e rastreio quando disponível.
- **W:** fila operacional, ficha do pedido e envio; sem exposição desnecessária de saúde.
- **Gatilho de saída:** despacho registrado com identificação aceita pelo procedimento → P7.
- **Continuidade/exceções:** embalado não significa enviado; falta de produto/endereço precisa de resolução. Movimentações concorrentes exigem consistência.
- **Pendente:** logística real, responsáveis, momentos de reserva/baixa e prova de despacho.
- **Aceite técnico:** falha logística não confirma envio; ação repetida não baixa estoque duas vezes.

### P7 — Em entrega

- **Entrada:** despacho confirmado.
- **Objetivo:** informar andamento e resolver ocorrências.
- **Contexto:** envio, rastreamento, endereço, histórico e manual logístico.
- **E:** `envio.consultar`, `suporte.encaminhar`, `entrega.registrar`, `notificacao.enviar`.
- **Fontes:** eventos do transportador, ações do responsável e relatos do paciente.
- **Consolidado IA:** última situação comprovada, ocorrência, previsão quando disponível e próxima ação.
- **D/B:** histórico de transporte e origem da confirmação de entrega.
- **W:** envio, ocorrências e pendências.
- **Gatilho de saída:** entrega confirmada por fonte aceita → P8 para o acompanhamento correspondente.
- **Continuidade/exceções:** previsão vencida não confirma entrega; atraso/devolução/extravio exigem fluxo de ocorrência, não transição automática para concluído.
- **Pendente:** integração, fontes aceitas e resolução de divergência entre paciente e transportador.
- **Aceite técnico:** histórico rastreável; confirmação não apaga ocorrência conflitante.

### P8 — Acompanhamento e continuidade

- **Entrada:** entrega confirmada e/ou momento programado pertinente ao acompanhamento. Suporte permanece possível antes disso.
- **Objetivo:** conhecer experiência, coletar relatos previstos sobre tratamento, encaminhar questões e identificar necessidades futuras.
- **Contexto:** histórico, pedidos, preferências, respostas anteriores e roteiro autorizado de acompanhamento.
- **E:** `acompanhamento.programar`, `mensagem.enviar`, `ficha.atualizar`, `suporte.encaminhar`, `pedido.preparar` quando solicitado.
- **Fontes:** respostas, dúvidas, relatos e novas solicitações.
- **Consolidado IA:** experiência, satisfação, relatos atribuídos, pendências e próxima ação. Não transformar relato em conclusão clínica ou evidência validada.
- **D/B:** dados previstos, encaminhamentos e preferência de contato, com escopo adequado.
- **W:** ficha contextual, acompanhamento e indicadores definidos; análises não devem expor relatos indevidos.
- **Gatilho:** nova compra cria outro ciclo de pedido, reavaliando requisitos necessários; não apaga jornada/histórico anterior.
- **Continuidade/exceções:** questões clínicas seguem à profissional; não diagnosticar, ajustar dose ou prometer resultado; frequência respeita configuração e preferências.
- **Pendente:** perguntas, frequência, finalidade dos dados, critérios de encaminhamento e eventual pesquisa futura.
- **Aceite técnico:** vários pedidos coexistem sem sobrescrever história e relatos não viram diagnóstico automático.

## 7. Copilot e manuais humanos

### 7.1 Entrada e autorização

**Confirmado:** no momento zero, gestor inclui usuário; cria-se cadastro e vínculo. Depois o Copilot reconhece o perfil e ajuda em quatro tarefas recorrentes. Não colocar usuários internos num funil linear.

| Perfil | Quatro responsabilidades | Contexto prioritário |
|---|---|---|
| Gestor | Estratégia; equipe; análise; aprimoramento | Resultados, configurações, decisões, tarefas e pessoas autorizadas |
| Representante | Reuniões; visitas; suporte; relacionamento | Carteira, compromisso atual, memória, agenda e manual humano |
| Despachante | Pagamento; pedido; entrega; estoque | Estado operacional e pendências, sem acesso clínico irrestrito |

O Copilot consulta dados, oferece interpretação/sugestões, controla W e executa solicitações autorizadas por E. Dúvidas, suporte e notificações são transversais.

### 7.2 Mudanças solicitadas pela equipe

**Confirmado:** representante/despachante podem solicitar mudança de regra/manual; o Copilot pode perguntar ao gestor por notificação.

**Contrato proposto:** solicitante → proposta com conteúdo antes/depois, motivo e impacto → notificação ao gestor → aprovação/rejeição/ajuste → E aplica versão aprovada → B consolida → resultado ao solicitante.

Aprovação vale para proposta específica; mudança posterior precisa de reavaliação. Atualização operacional permitida (visita realizada, envio registrado) não exige aprovação do gestor só por alterar informação. Definir fronteira de cada permissão.

### 7.3 Ficha contextual e análise

Ao preparar reunião, representante vê o necessário: fatos, compromissos, interesses e sugestões, com referências para aprofundar. Gestor vê resultados, dificuldades e decisões pertinentes. Despachante vê contexto operacional autorizado.

Análise deve indicar evidências e limites; sugestão não é decisão. Registrar razões reais das escolhas, não inventar justificativa retrospectiva a partir do padrão atual.

## 8. Cérebro modificável e experimentos

### 8.1 Conteúdo

Base comum Minerva: conhecimento científico/jurídico e outros domínios autorizados, mantidos pela Minerva. Empresa: identidade, produtos, manuais, processos, equipe, estratégia, FAQs e rotinas. Memória da operação cresce com acontecimentos e consolidação.

Fontes brutas permanecem identificáveis. Página wiki é representação navegável do consolidado; o W inteiro contém outras visualizações da mesma operação, não tudo precisa ser uma página wiki editável.

### 8.2 Alteração e publicação

**Proposta:** rascunho → revisão/autorização quando exigida → publicação versionada → atualização dos índices → efeito nos atendimentos seguintes conforme política. Definir como tratar conversas em andamento. Não deixar modelo editar permissões centrais ou conhecimento comum por pedido de usuário externo.

Base empresarial reutilizável pode receber atualizações Minerva; não sobrescrever personalizações sem reconciliação.

### 8.3 Experimentos como variações de configuração

**Confirmado:** configuração estabelece padrão; experimento usa dois ou mais padrões para comparar resultados. Mesma base de configuração, com variantes e distribuição.

**Registro proposto:** questão/hipótese, etapa, indicador e sua definição, variantes/manuais, elegibilidade, atribuição, período, resultados, análise, decisão do gestor e padrão resultante.

`Indicador → teste → resultado → análise → decisão → padrão publicado` deve ser navegável. Não atribuir causalidade ou declarar vencedor sem critério/amostra adequados. Atribuição não muda arbitrariamente a cada mensagem. Política final do experimento é pendente.

## 9. Catálogo inicial de execuções

Nomes conceituais para desenho, não endpoints implementados nem Habilidades MCP já publicadas. Cada operação deve declarar entrada, autorização, resultado, falhas e comportamento em repetição.

| Família | Entradas essenciais | Resultado esperado |
|---|---|---|
| Identificação/ficha | Canal verificado, referência de pessoa/vínculo e alteração permitida | Correspondência ou ambiguidade; ficha atualizada com proveniência |
| Estratégia | Ciclo, segmentos, metas e versão | Rascunho validado ou publicação autorizada |
| Pesquisa/qualificação | Segmento, limite, critérios e base existente | Candidatos com fontes, decisão e pendências |
| Recuperação de conteúdo | Escopo autorizado, intenção, referência/consulta e versão | Trechos/dados pertinentes com fonte, ou ausência explícita |
| Comunicação | Destinatário resolvido, conteúdo permitido e chave de execução | Referência de envio, situação real ou falha |
| Agenda/rota | Participantes, propósito, disponibilidade/localização | Reserva/rota confirmada pela ferramenta, ou pendência |
| Parceria/onboarding | Evidência, condições e versão aplicável | Registro de aceite/orientações e pendências |
| Documentos | Arquivo privado, tipo e vínculo | Extração com origem, qualidade e resultado de conferência separado |
| Pedido/pagamento | Itens/valores confiáveis, comprador e requisitos | Pedido/referência de pagamento e situação verificável |
| Estoque/envio | Pedido autorizado, movimento e evidência operacional | Alteração transacional ou falha; identificação de envio |
| Suporte/tarefa/notificação | Motivo, recurso, destinatário e prioridade/prazo definidos | Caso/tarefa/envio rastreável |
| Consolidação | Referências a fatos novos, estado e versão anterior | Atualização contextual e relações, ou nenhuma alteração necessária |
| Publicação | Proposta, versão base e autorização | Nova versão, efeito e referências preservadas |
| Controle W | Sessão, visualização, recurso/filtro permitido | Tela aberta/atualizada; não execução empresarial implícita |

Empresa e permissões vêm do sistema, não de parâmetro livre escolhido pelo LLM. Credenciais são resolvidas por conexão empresarial no servidor, fora de prompts e Git.

## 10. Obsidian, PostgreSQL e arquivos

### 10.1 Referências principais propostas

| Conteúdo | Referência principal |
|---|---|
| Manuais, identidade, conhecimento, memória narrativa, decisões | Markdown/Obsidian com IDs/metadados/versionamento |
| Identidades, vínculos, acesso, estados, eventos, mensagens, capacidade | PostgreSQL |
| Pedidos/pagamentos/movimentos de estoque/envios | PostgreSQL e integrações verificadas |
| Arquivos originais grandes ou sensíveis | Armazenamento privado com referências e acesso controlado |
| Busca textual/vetorial e índices de visualização | Derivados reconstruíveis, filtrados por autorização |
| Ficha humana e pacote de contexto | Composição das referências acima |

Não duplicar duas fontes editáveis para o mesmo estado. A escrita da consolidação precisa de versão-base para evitar sobrescrever atualizações concorrentes. Corrigir fatos não apaga evidência histórica.

### 10.2 Metadados documentais propostos

Identificador estável; empresa/escopo; tipo; assunto/vínculo quando aplicável; estado editorial; versão; atualização; fontes; relações; regras de acesso. Não colocar segredos em propriedades. A autorização é aplicada pelo serviço, não apenas por pastas no vault.

### 10.3 Isolamento e recuperação

Aplicar filtro de empresa/perfil/finalidade antes de recuperar e entregar conteúdo ao modelo. Não confiar em instrução “ignore outra empresa”. Acesso a link/documento também verifica escopo.

Obsidian é a representação documental; não pressupor aplicativo desktop aberto no servidor. Um serviço lê/escreve/indexa os arquivos e oferece operações ao n8n/W.

## 11. Contrato funcional do Workspace

**Confirmado:** W será feito no Replit; backend/CEBD pelo Codex. Mesmo repositório GitHub foi proposto, conexão real ainda não verificada. Contrato de dados deve preceder integrações para evitar dois sistemas incompatíveis.

| Perspectiva | Função |
|---|---|
| Estratégia | Distribuição de créditos, pizza e segmentações; busca com mapa/candidatos é interna da Minerva |
| Pessoas | Coleção filtrável, lista/galeria/quadro e ficha contextual do item |
| Conversas | Comunicação real e intervenção/encaminhamento |
| Indicadores/análises | Funil, metas, atividade e interpretação fundamentada |
| Reuniões/visitas | Preparação, agenda, rota, realização e resultados |
| Pedidos/catálogo | Operação comercial/logística autorizada |
| Cérebro/wiki | Contexto consolidado, fontes, manuais, decisões e alterações autorizadas |
| Notificações | Eventos/tarefas relevantes e ações correspondentes |

Coleção → item → relações é um visualizador reutilizável. Mesma ficha não exige recadastro ao ser aberta por campanha, conversa ou agenda. Até quatro páginas centrais podem coexistir; detalhes abrem em nova área contextual. Regras visuais completas serão documento derivado para Replit.

A ficha abre o necessário à tarefa: o que saber, o que ocorreu, análise/sugestões e próxima ação; aprofundamentos levam a registros reais e autorizados. Mostrar data de atualização e distinguir contexto consolidado de novo evento ainda não incorporado.

Exemplo: `Coleção de médicos → ficha → conversa → reunião`. Copilot pode montar a apresentação por MCPWeb. A API precisa oferecer IDs, estado de execução e resultados reais; mock, pendente, falha e concluído não são equivalentes.

## 12. Construção modular e validação

### Correções de navegação confirmadas

A página do cliente anteriormente chamada Prospecção passa a **Estratégia**: distribuição dos créditos e segmentações. Pesquisa com mapa e candidatos é interna à Minerva. Médicos, atendimentos e resultados surgem em Pessoas, Conversas e Indicadores, respectivamente. Fichas e Catálogo/Estoque são páginas contextuais, não entradas obrigatórias do menu. Ver [especificação do Workspace](workspace-especificacao-funcional.md).

### 12.1 Sequência proposta

| Módulo | Construir | Evidência de aceite |
|---|---|---|
| 0 — Acesso/inventário | Inspecionar n8n/Hostinger/repositórios, sem sobrescrever | Conexões e capacidades verificadas; estado existente registrado |
| 1 — Identidade/contexto | Empresa/pessoa/vínculo; manual e contexto mínimo | Duas relações não misturam dados; perfil resolve acesso |
| 2 — Atendimento/evento | C de teste, registro e B/D, regra de transição | Conversa contínua; evento válido avança; sem gatilho não avança |
| 3 — Percurso médico | M3/M4/M6/M7 com dados fictícios | Aceite e onboarding verificáveis, continuidade preservada |
| 4 — Aquisição | Estratégia e pesquisa/qualificação, depois canal/cadência | Metas, fontes, duplicidade e limites controlados |
| 5 — Percurso paciente | P1/P2/P3/P4 com procedimentos confirmados | Bifurcação receita, conferência e pendências funcionam |
| 6 — Pedido/logística | P5/P6/P7/P8 e Copilot operacional | Pagamento confiável, envio e recompra sem duplicação |
| 7 — W integrado | Contratos, visualizações e controle da tela | Mesmos registros nas perspectivas; autorização no backend |
| 8 — Aprimoramento | Variantes, análises, decisão e publicação | Padrão rastreável até resultados e autorização |

Frontend pode trabalhar em paralelo com contratos e mocks identificados. Não é necessário aguardar todos os módulos para integrar uma cadeia completa. Não ativar mensagens/cobranças reais para demonstrar apenas infraestrutura.

### 12.2 Cenários essenciais

- Médico/paciente retornam sem repetição de perguntas já respondidas.
- Correção prevalece sobre informação antiga, com histórico.
- Evento repetido não duplica execução, transição ou aviso.
- Silêncio/entrega de mensagem não viram interesse/aceite.
- Médico pode converter sem reunião e permanecer ativo após encaminhar.
- Paciente com receita pula consulta; consulta sem receita não libera pedido.
- Receita ilegível gera pendência; produto não é substituído pela IA.
- Protocolo Anvisa não é autorização; pagamento relatado não é confirmado.
- Envio embalado não é despachado; previsão não é prova de entrega.
- Vários pedidos coexistem sem sobrescrever a jornada contínua.
- Suporte não apaga etapa; recusa interrompe ação incompatível.
- Mudança de manual tem versão/autorização e aprovação específica.
- Recuperação/documento/execução não atravessam escopo de empresa/perfil.
- Falha de B preserva fonte/evento e permite reprocessamento.
- Análise do Copilot cita evidência; padrão aponta decisão real do gestor.
- W diferencia mock, andamento, falha e resultado confirmado.

## 13. Pendências e retomada

### 13.1 O que não foi comprovado

Ainda não foram verificados: acesso administrativo n8n/Hostinger, inventário de workflows, configuração do servidor, provedores contratados, credenciais, vault existente, repositório Neurum, conexão Replit ou runtime do backend. Não existe evidência aqui de agentes criados, pagamentos, deploy ou envio real.

### 13.2 Pendências prioritárias

1. Dados empresariais reais, oferta e condições da parceria.
2. Qualificação mínima e evidência de aceite/onboarding.
3. Contabilização de médicos, ciclo e regras de segmentos.
4. WhatsApp/Telegram, cadência, autorizações e suporte.
5. Agenda e encaminhamento da médica parceira.
6. Modalidade de fornecimento, documentação e conferência atuais.
7. Gateway, logística, reserva/baixa de estoque e cancelamentos.
8. Atualização de memória, publicação/versionamento e conversas em curso.
9. Autenticação, retenção, exclusão/exportação e governança dos dados.
10. Contratos do frontend e MCPWeb; Home ainda tem versões históricas divergentes.

### 13.3 Instruções de retomada para desenvolvimento

Ler esta página e mudanças posteriores; verificar estado do checkout e instruções locais; preservar trabalho existente. Não pedir de novo informação já fornecida sem antes consultar documentação e configuração disponível. Não solicitar senhas/tokens em chat nem salvar segredos em repositório. Verificar capacidades reais antes de escolher interfaces técnicas. Separar teste fictício, sandbox e produção nos relatórios.

Este documento autoriza compreensão e planejamento do que foi solicitado, não demonstra uma integração funcionando. Aprovação de uma proposta comercial histórica não equivale a autorização atual para enviar mensagens reais a terceiros.

### 13.4 Fontes de contexto

Apresentação `Minerva_Empresa_ Neurum.pdf`; exportações `MINERVA - PRODUTO ENXUTO interface`, `Criar apresentação PDF`, `MINERVA`, `Criar infográfico Minerva` e `Mapeamento da Jornada!`; e correções do proprietário nesta conversa. Anexos apenas citados dentro de exportações não equivalem a anexos recebidos. Conteúdo regulatório e preços de fornecedores citados historicamente não foram revalidados.

**Próxima ação concreta recomendada:** preencher os manuais empresariais mínimos e definir gatilhos verificáveis de uma cadeia curta, depois implementá-la no n8n com empresa e interlocutores fictícios, preservando os contratos de contexto/dados que alimentarão W.
