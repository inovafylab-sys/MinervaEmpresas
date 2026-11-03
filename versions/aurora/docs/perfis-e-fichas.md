# Perfis, coleções e duas fichas distintas

## Duas representações, sem espelhar o contexto interno

A ficha de atendimento da IA é um recurso interno da operação Minerva/CEBD. Organiza o contexto necessário para atender: referências autorizadas de identidade, estado da jornada, fatos e fontes, memória pertinente, manuais, decisões e permissões das ferramentas. Sua disponibilidade é controlada pela Minerva. Não é uma tela do Workspace da empresa, não deve ser enviada ao navegador do cliente e não é liberada automaticamente ao gestor.

A ficha do usuário é uma projeção de trabalho com finalidade própria. Coleção e ficha usam a mesma identidade do recurso, mas não copiam todo o contexto da IA. O gestor vê toda a operação empresarial autorizada; o representante vê sua carteira e atividades; o despachante vê somente o necessário à logística atribuída. Nenhum desses perfis recebe prompts, contexto de recuperação, raciocínio privado, credenciais, notas internas da Minerva ou prontuário universal.

| Representação | Quem acessa | Conteúdo e finalidade |
| --- | --- | --- |
| Contexto de atendimento da IA | Operação interna Minerva e agentes autorizados | Estado, memória pertinente, fontes, referências de manuais e limites de execução; acesso por tarefa e empresa |
| Ficha de gestão | Gestor | Relação empresarial, etapa, responsável, pendências, atividades e pedidos autorizados; coordenação e acompanhamento |
| Ficha de relacionamento | Representante atribuído | Contexto de parceria, contatos autorizados, reuniões, visitas, suporte e próximos passos; sem pedidos universais, dados clínicos ou estratégia empresarial |
| Ficha operacional | Despachante atribuído | Identificação mínima, pedidos atribuídos, verificação de requisitos operacionais, preparação, envio e rastreio; sem memória clínica, contexto terapêutico ou estratégia |

Gestor ter acesso a tudo significa toda a operação empresarial, dentro da finalidade e autorização; não o contexto interno da IA ou dados clínicos sem necessidade.

## Contrato de integração proposto

O backend resolve empresa, usuário, perfil e atribuições a partir da sessão autenticada. O cliente não concede permissão por `role` em query string ou corpo da requisição.

- `GET /api/session`: identidade verificada (id, nome, URL de foto), empresa, papel e capacidades atribuídas pelo servidor.
- `GET /api/workspace/people?view=gallery&...`: resumo mínimo autorizado, filtros disponíveis e total do escopo. Deve filtrar antes de contar e paginar.
- `GET /api/workspace/people/:id`: união discriminada `view: management | relationship | operations`, com campos específicos; um id de outra carteira é negado no servidor.
- `GET /api/workspace/metrics`: métricas e definições calculadas na mesma população autorizada. Gestor: toda a operação; representante: carteira/encontros/parcerias; despachante: pedidos/preparação/envio/pagamento operacional.
- `GET /api/workspace/journeys`: quadros de pessoas com estado autorizado. Não é a lista de tarefas e não permite avançar etapa sem evidência/regra.
- Recurso interno separado, por exemplo `GET /internal/agent-context/:relationshipId`: contexto para atendimento por agente autorizado, restrito ao serviço/operação Minerva. Não deve compartilhar o DTO público, integrar o bundle frontend ou ser acessível por sessão de usuário cliente.

São contratos propostos; nenhum desses endpoints está implementado nesta versão estática. O contexto privado da IA não é incluído nos fixtures desta interface. Não basta retornar todos os campos e esconder com CSS.

## Navegação por perfil

- Gestor: todas as páginas empresariais, pessoas e indicadores da operação, gestão da equipe, estratégia, campanhas, pedidos e estoque.
- Representante: início, indicadores da própria carteira, pessoas atribuídas, conversas correspondentes, reuniões, visitas, quadros de médicos, manuais pertinentes e preferências próprias. Sem estratégia, campanhas, pedidos, estoque ou administração da empresa.
- Despachante: início, indicadores de pedidos atribuídos, contatos operacionais correspondentes, conversas de suporte, quadros operacionais de pessoas, pedidos, pagamentos, envio, catálogo, estoque, manual pertinente e preferências próprias. Sem reuniões, visitas, estratégia, campanhas ou administração da empresa.

Tarefas fica separado de Quadros e mostra o trabalho atribuído à função; o gestor acompanha todas as tarefas. Busca, links diretos, notificações e comandos do Copilot respeitam a mesma delimitação de apresentação. Trocar a prévia de perfil limpa seleção, filtros, diálogos e histórico do Copilot. A aplicação contém somente dados fictícios; o seletor de demonstração não é autenticação ou barreira de segurança.

## Coleção versus item

Pessoas abre por padrão em galeria. Galeria, lista e visualização compacta compartilham busca e filtros combináveis por tipo, especialidade/contexto, cidade, etapa e responsável. Pré-visualizar mantém a pessoa na coleção com resumo rápido. Abrir ficha navega para uma página de item, com contexto e relações adequados à função. Quadros usa as mesmas pessoas, agrupadas por etapa; o cartão abre a mesma ficha.

## Identidade Google

O cabeçalho está preparado para nome e foto por `window.MinervaSession.setVerifiedIdentity({name, picture})`. A integração deve chamar o adaptador depois que o backend verificar a sessão Google. O adaptador só apresenta identidade; não valida token, autentica usuário nem atribui papel. `clearIdentity()` remove a imagem. URL da foto requer HTTPS e possui fallback para iniciais.

Não há OAuth Google configurado no repositório. Para ativar login real serão necessários o provedor e callback do backend, client ID público, origem autorizada e associação de usuário/empresa/papel no servidor. Segredo de cliente, quando aplicável, fica exclusivamente no servidor; nunca no bundle ou em chat. Não usar um JWT apenas decodificado como prova de identidade. A URL da foto exige acesso de rede ao destino fornecido pelo provedor.

## Painel empresarial, funis e equipe

Indicadores do gestor resume aquisição médica, jornada do paciente, campanhas, operação de pedidos e desempenho de representantes/despachantes. Os dois funis representam pessoas únicas de uma mesma coorte que alcançaram marcos, e não a ocupação atual das colunas do quadro.

- Médico: identificado → qualificado → abordado → dados confirmados → proposta apresentada → parceria aceita → onboarding concluído → parceria ativa → encaminhamento de pacientes.
- Paciente: encaminhado → acolhido → receita recebida → documentação recebida → pedido criado → pagamento confirmado → preparação → despacho → entrega confirmada → acompanhamento iniciado.
- Conversão por etapa: quantidade que alcançou o marco dividida pela quantidade da etapa anterior, na mesma coorte e filtro de origem. Sem denominador, mostra “—”. A entrada não é apresentada como conversão.
- Reuniões/visitas e consulta/regularização condicionais ficam explicadas fora da cadeia obrigatória. Receber documentos não os valida; consulta não é necessária para quem já chega com receita. Aceite, pagamento, despacho e entrega exigem eventos próprios.
- A demonstração usa marcos fictícios explícitos ligados aos mesmos médicos e pacientes das fichas. Ana tem mais de um pedido: um entregue, outro enviado e um em preparação. Isso não triplica a contagem de pacientes. Os quatro pedidos demonstrativos incluem o pedido de Pedro atribuído a Camila Rocha.
- O filtro de campanha usa a atribuição de origem dos mesmos registros em funis e tabela. A atribuição não é prova de causalidade. CAC, ROI e margem ficam sem estimativas porque não há custos integrados.
- Os cartões de equipe apresentam o escopo global do colaborador no ciclo, independentemente do filtro comercial da empresa. A ficha individual do representante contém carteira, funil e atividades; a do despachante contém pedidos atribuídos, preparação, despacho, entrega e pendências de pagamento. Abrir uma etapa do funil do representante preserva sua carteira.
- As fichas dos colaboradores são os registros de tipo Colaborador da coleção Pessoas, acessíveis também por Gestão → Equipe e pelos indicadores. Não são novos cadastros duplicados. Permanecem restritas à prévia de gestor neste frontend; o backend deverá impor a autorização.

A prévia de Pessoas é um popup não modal por hover ou foco. Clique/toque também abre o popup; o botão explícito leva à ficha completa. Mover o ponteiro para o popup permite usar os links. Escape, fechar, rolagem ou troca de perfil encerram a prévia. Filtros e visualização permanecem na coleção ao retornar do item.
