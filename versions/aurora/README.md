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

- Visão geral e Indicadores.
- Estratégia, distribuição validada em 100% e segmentação contextual.
- Campanhas, filtros, criação local e ficha da campanha.
- Pessoas com galeria, lista e visualização compacta; busca e filtros combináveis por tipo, especialidade/contexto, cidade, etapa e responsável; prévia na coleção e ficha individual. Filtros são preservados no retorno da ficha.
- Conversas com composição de mensagens explicitamente não enviadas.
- Reuniões, calendário demonstrativo, preparação e registro de resultado.
- Visitas, mapa conceitual, roteiro e registro de resultado.
- Quadros de pessoas por jornada, reutilizando os registros de Pessoas e a mesma ficha.
- Tarefas em página própria, com criação, alteração de estado e persistência local; tarefas atribuídas conforme o perfil.
- Pedidos, ficha, detalhe de pagamento, envio, catálogo, produto, estoque e movimentos.
- Prévias de catálogo e pagamento do paciente, acessíveis pela busca global.
- Cérebro: identidade, manuais, conhecimento, memória, decisões, fontes e versões.
- Gestão: empresa, equipe, permissões explicativas, conexões, plano e preferências.
- Notificações e proposta de aprovação.
- Apresentação do sistema em oito etapas, orientada pelo material Neurum.

Apenas uma página ocupa a área principal. Fichas substituem a página principal e têm navegação de retorno. O Copilot é aberto pelo cabeçalho e permanece ao lado da página no desktop; em telas pequenas usa painel sobreposto. O menu mantém altura fixa e expande por hover ou foco do teclado. Busca global: botão no cabeçalho ou Ctrl/Cmd+K. A preferência do dispositivo por movimento reduzido é respeitada.

## Limites reais

Esta entrega é uma versão navegável de frontend com dados fictícios sinalizados. Há três prévias de perfil: Gestor, Representante e Despachante. Cada prévia delimita menus, indicadores, pessoas, pedidos, tarefas, busca e fichas na demonstração. Gestor acompanha a operação empresarial; representante trabalha sua carteira; despachante recebe contatos operacionais e pedidos atribuídos. Não há autenticação ou autorização de servidor, IA real, API CEBD, WhatsApp, Telegram, calendário, checkout, envio ou prospecção conectados. O seletor é uma ferramenta de revisão da interface, não um controle de segurança. Catálogo e checkout do paciente são prévias de apresentação e não devem ser usados para dados reais.

O Copilot é um demonstrador determinístico de navegação: entende comandos como “abra os pedidos”, abre a página e explica o contexto. Não executa ações externas e não usa LLM.

Tarefas persistem no armazenamento deste navegador. Pessoas, campanhas, mensagens, distribuição e demais registros locais duram somente a sessão. Registros de reunião, visita e propostas são apresentados em um comprovante local, sem alterar jornadas ou calendário. Dados clínicos, confirmação de pagamento e regras comerciais não são inferidos pelo frontend. O backend deverá fornecer identidade, autorização, validações e evidências antes de qualquer uso operacional.

## Validação

```bash
node --check app.js
# Em outro terminal, com o servidor acima ativo:
python tests/smoke.py
python tests/profiles.py
```

O teste requer o pacote Python Playwright e Chromium. Use `MINERVA_CHROMIUM` para definir outro caminho de navegador e `MINERVA_TEST_URL` para outra origem. Não são dependências da aplicação.

O teste de smoke percorre as 44 rotas principais e contextuais, valida página única, busca, filtros e estado vazio, criação segura de pessoa, persistência e edição de tarefas, soma da estratégia, navegação do Copilot, mensagens não enviadas, seis abas de Gestão, oito slides, hover do menu e ausência de overflow de página no mobile. A suíte adicional de perfis valida as três prévias, contagens por população, restrições de apresentação em links diretos/busca/Copilot, separação de Quadros/Tarefas, filtros compartilhados entre visualizações, retorno à coleção e adaptador de nome/foto da sessão. Essas verificações não substituem testes de autorização do futuro backend. Capturas de revisão são produzidas em `/tmp` e as capturas selecionadas estão em `preview/`.

## Referências

Documentação em `../../docs/produto` e PDF Minerva Empresa — Neurum fornecido pelo proprietário. As definições atuais do proprietário prevalecem: identidade tech como inspiração, uma página por vez e botão do Copilot no cabeçalho.

## Fichas humanas e contexto da IA

A ficha de gestão, a ficha de relacionamento e a ficha operacional são apresentações diferentes para finalidades humanas. O contexto privado de atendimento da IA pertence à operação Minerva e não é incluído nos fixtures nem retornado por uma página de usuário. O contrato proposto, a matriz de perfis e a ligação futura ao Google estão em [Perfis e fichas](docs/perfis-e-fichas.md).

O cabeçalho aceita nome e foto por um adaptador de apresentação, depois de uma sessão validada pelo backend. Login Google real ainda não está configurado. O adaptador não atribui papel nem verifica token.
