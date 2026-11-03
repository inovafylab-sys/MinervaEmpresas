'use strict';
// Fictional workspace records. Persistence is restricted to this browser/origin.
(() => {
 const key='minerva-aurora-crud-v1';
 const documents=brain.map(([id,ic,title,description,version])=>({id,title,description,version,content:''}));
 const appointments=relationshipActivities.map(a=>({...a,title:a.summary,date:'2026-11-03T09:00',result:''}));
 const routes=[],experiments=[],hypotheses=[],standards=[];
 const collections={people:allPeople,campaigns,tasks,orders:allOrders,products,documents,appointments,routes,experiments,hypotheses,standards};
 const labels={people:'Pessoas',campaigns:'Campanhas',tasks:'Tarefas',orders:'Pedidos',products:'Produtos',documents:'Documentos',appointments:'Agenda',experiments:'Experimentos',hypotheses:'Hipóteses',standards:'Padrões demonstrativos'};
 const uid=()=>`demo-${crypto.randomUUID()}`;
 let storageError=false;
 try {
  const stored=JSON.parse(localStorage.getItem(key)||'null');
  if(stored?.version===1)for(const [name,arr] of Object.entries(collections)){
   if(Array.isArray(stored[name])&&stored[name].every(x=>x&&typeof x==='object'&&!Array.isArray(x)&&typeof x.id==='string'))arr.splice(0,arr.length,...stored[name]);
  }
 }catch{storageError=true;}
 Object.values(collections).forEach(arr=>arr.forEach(r=>{r.id=r.id||uid();}));
 function sync(){
  employeeSeeds.splice(0,employeeSeeds.length,...allPeople.filter(p=>p.type==='Colaborador').map(p=>({...p,role:p.employeeRole||p.specialty})));
  relationshipActivities.splice(0,relationshipActivities.length,...appointments.map(a=>({...a,summary:a.title})));
  brain.splice(0,brain.length,...documents.map(d=>[d.id,'file',d.title,d.description,d.version]));
  allOrders.forEach(o=>{
   o.amount=Number(String(o.price).replace(/[^0-9,]/g,'').replace(',','.'))||0;
   o.prepared=['Em preparação','Enviado','Entregue'].includes(o.status);o.shipped=['Enviado','Entregue'].includes(o.status);o.delivered=o.status==='Entregue';
  });
 }
 function store(){
  sync();
  try{localStorage.setItem(key,JSON.stringify({version:1,...collections,distribution:saved.distribution}));storageError=false;return true;}
  catch{storageError=true;toast('Não foi possível salvar neste navegador. As alterações só duram nesta aba.');return false;}
 }
 persist=()=>{store();};
 const originalRender=render, originalBrainDetail=brainDetail;
 const originalIndicators=indicators;
 const originalContextual=contextual;
 const metricOptions=[...medicalStages.map(([id,label])=>['medicos/'+id,'Médicos · '+label]),...patientStages.map(([id,label])=>['pacientes/'+id,'Pacientes · '+label])];
 contextual=function(type,id){
  if(type!=='aprimoramento')return originalContextual(type,id);
  if(state.role!=='gestor')return notFound();
  const stage=state.route.split('/')[2],metric=id+'/'+stage,stages=id==='medicos'?medicalStages:patientStages;
  const definition=stages.find(([key])=>key===stage);if(!definition)return notFound();
  const records=id==='medicos'?companyScope().doctors:companyScope().patients;
  const row=funnelRows(records,stages).find(r=>r.key===stage);
  const related=experiments.filter(e=>e.metric===metric);
  return heading('Aprimoramento · '+definition[1],(id==='medicos'?'Jornada de médicos':'Jornada de pacientes')+' · configurações, hipóteses e testes relacionados ao indicador.')+btn('Voltar ao painel','inicio')+`<section class="card mt"><h2>Indicador e população</h2><div class="grid three"><div><small>Pessoas nesta etapa</small><div class="metric-value">${row.count}</div></div><div><small>Conversão da etapa anterior</small><div class="metric-value">${row.previous===null?'Entrada':formatRate(row.rate)}</div></div><div><small>Base anterior</small><div class="metric-value">${row.previous??'—'}</div></div></div><p>Coorte de demonstração. A configuração é uma hipótese de influência; a relação com o indicador não comprova efeito causal.</p></section><section class="card mt"><h2>Configurações e experimentos associados</h2><div class="actions"><button class="btn primary" data-crud-new="experiments">Novo experimento</button><button class="btn" data-crud="experiments">Gerenciar experimentos</button></div>${related.map(e=>`<article class="route-card"><h3>${esc(e.title)}</h3>${pill(e.status)}<p><strong>Configuração proposta:</strong> ${esc(e.setting)}</p><p><strong>Hipótese:</strong> ${esc(e.hypothesis)}</p><p><strong>Controle:</strong> ${esc(e.control)}</p><p><strong>Variante:</strong> ${esc(e.variant)}</p><p><strong>População e período:</strong> ${esc(e.population)}</p><p><strong>Evidências / observações:</strong> ${esc(e.notes||'Ainda não registradas. Sem conclusão de ganho.')}</p><button class="btn" data-crud="experiments" data-record="${esc(e.id)}">Editar experimento</button></article>`).join('')||'<p class="mt">Nenhum teste registrado para esta etapa. Comece descrevendo a configuração, hipótese, controle, variante, população e período. Nenhuma configuração será aplicada aos agentes.</p>'}</section>`;
 };
 function routeSupervision(){
  const scoped=routes.filter(r=>state.role==='gestor'||r.owner===currentProfile().name);
  const active=scoped.filter(r=>r.phase==='Em andamento');
  const stopped=scoped.filter(r=>r.phase==='Concluída');
  return `<section class="card mt" id="route-supervision">${sectionHead(state.role==='gestor'?'Supervisão de rotas e localização':'Minhas rotas de visitas','Abrir rotas','visitas')}<p class="funnel-caption">Demonstração local. Posições GPS não são recebidas de outros dispositivos. O compartilhamento real será vinculado ao início e encerramento da rota.</p><div class="grid three">${[['Rotas planejadas',scoped.length],['Em andamento · simulação',active.length],['Concluídas · simulação',stopped.length]].map(([label,value])=>`<div><small>${label}</small><div class="metric-value">${value}</div></div>`).join('')}</div><div class="mt">${scoped.map(r=>`<div class="list-row"><span class="grow"><strong>${esc(r.owner)} · ${esc(r.title)}</strong><small>${esc(r.region)} · ${(r.stops||[]).length} paradas · ${Math.min(r.completedStops||0,(r.stops||[]).length)} concluídas</small><small>Última atualização da simulação: ${r.updatedAt?esc(new Date(r.updatedAt).toLocaleString('pt-BR')):'Sem atualização'} · Localização: não conectada</small></span>${pill(r.phase||'Planejada')}${btn('Ver rota','visitas')}</div>`).join('')||'<p>Nenhuma rota registrada. O acompanhamento aparecerá aqui quando houver rotas.</p>'}</div></section>`;
 }
 let dashboardTab='Indicadores',activeMetric='',detailTab='Análise',detailReturnFocus=null;
 const dashboardTabs=['Indicadores','Análises e hipóteses','Experimentos','Configuração atual','Operação'];
 const detailTabs=['Análise','Hipóteses','Experimentos','Padrão atual'];
 function metricInfo(metric){
  const [kind,key]=metric.split('/'),stages=kind==='medicos'?medicalStages:patientStages;
  const index=stages.findIndex(([id])=>id===key);if(index<0)return null;
  const records=kind==='medicos'?companyScope().doctors:companyScope().patients;
  const rows=funnelRows(records,stages);
  return {metric,kind,key,index,label:stages[index][1],row:rows[index],rows,entry:rows[0].count};
 }
 function metricPicker(){return `<label class="growth-filter">Etapa do funil<select id="growth-metric"><option value="">Todas as etapas</option>${metricOptions.map(([v,t])=>`<option value="${v}" ${v===state.growthFilter?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;}
 const metricTitle=metric=>metricOptions.find(([id])=>id===metric)?.[1]||metric;
 function analysisBlock(metric){
  const m=metricInfo(metric);if(!m)return '';
  const {row,entry}=m;
  return `<div class="notice">Leitura demonstrativa dos dados · IA não conectada</div><div class="grid two growth-metrics"><div><small>Pessoas nesta etapa</small><strong>${row.count}</strong></div><div><small>Conversão anterior</small><strong>${row.previous===null?'Entrada':formatRate(row.rate)}</strong></div><div><small>Desde a entrada</small><strong>${formatRate(rateValue(row.count,entry))}</strong></div><div><small>Comparação no tempo</small><strong>Sem histórico</strong></div></div><h3>O que os registros mostram</h3><p>${row.previous===null?`Esta etapa define a entrada da coorte: ${entry} pessoas.`:`${row.count} de ${row.previous} pessoas da etapa anterior chegaram até aqui. ${Math.max(0,row.previous-row.count)} ainda não têm este marco registrado.`} Na entrada da jornada são ${entry} pessoas únicas.</p><h3>O que ainda não podemos concluir</h3><p>Sem coortes históricas comparáveis, não sabemos se esta taxa melhorou ou piorou. Os volumes são fictícios e pequenos; diferenças não comprovam uma causa.</p><h3>Próxima investigação</h3><p>Compare períodos com a mesma definição de público e janela de conversão. Segmente por origem e verifique atrasos de registro antes de propor uma mudança.</p><button class="btn" data-nav="funil-${m.kind}/${m.key}" data-close-indicator>Ver pessoas desta etapa</button>`;
 }
 function recordCards(name,metric=''){
  const matches=collections[name].filter(r=>!metric||r.metric===metric);
  return matches.map(r=>`<article class="growth-record"><small>${esc(metricTitle(r.metric))}</small><h3>${esc(r.title)}</h3>${pill(r.status||r.version||'Rascunho','gray')}${name==='experiments'?`<p><strong>Hipótese:</strong> ${esc(r.hypothesis)}</p><p><strong>Controle:</strong> ${esc(r.control)}</p><p><strong>Variante:</strong> ${esc(r.variant)}</p><p><strong>População e período:</strong> ${esc(r.population)}</p><p><strong>Evidências:</strong> ${esc(r.notes||'Sem evidências registradas. Nenhum vencedor declarado.')}</p>`:name==='hypotheses'?`<p>${esc(r.hypothesis)}</p><p><strong>Solução proposta:</strong> ${esc(r.solution)}</p><p><strong>Evidências:</strong> ${esc(r.evidence||'Ainda não registradas.')}</p>`:`<p style="white-space:pre-wrap">${esc(r.setting)}</p><p><strong>Versão:</strong> ${esc(r.version)} · <strong>Desde:</strong> ${esc(r.since||'Não definido')}</p><p>${esc(r.notes||'Registro local de referência; não configura agentes.')}</p>`}<button class="btn" data-crud="${name}" data-record="${esc(r.id)}">Editar registro</button></article>`).join('')||`<div class="growth-empty"><h3>${name==='experiments'?'Nenhum experimento registrado':name==='hypotheses'?'Nenhuma hipótese registrada':'Padrão de operação ainda não conectado'}</h3><p>${name==='standards'?'Registre a configuração de referência e sua versão para desenhar o fluxo. Salvar aqui não aplica alterações aos agentes.':'Crie um registro ligado à etapa do funil. Hipóteses e soluções propostas não são resultados comprovados.'}</p></div>`;
 }
 function collectionSection(name,metric=''){
  const title={hypotheses:'Hipóteses e soluções a testar',experiments:'Experimentos relacionados',standards:'Configuração de referência'}[name];
  return `<div class="section-head"><h3>${title}</h3><button class="btn primary" data-crud-new="${name}">Novo registro</button></div>${recordCards(name,metric)}`;
 }
 function detailContent(){
  if(detailTab==='Análise')return analysisBlock(activeMetric);
  return collectionSection({'Hipóteses':'hypotheses','Experimentos':'experiments','Padrão atual':'standards'}[detailTab],activeMetric);
 }
 function closeDetail(restoreFocus=true){
  const d=document.getElementById('indicator-detail');if(!d)return;
  d.remove();document.body.classList.remove('indicator-open');
  if(restoreFocus&&detailReturnFocus?.isConnected)detailReturnFocus.focus();activeMetric='';
 }
 function showDetail(metric,tab='Análise',focus=true){
  if(state.role!=='gestor'||!metricInfo(metric))return;
  const old=document.getElementById('indicator-detail');if(!old)detailReturnFocus=document.activeElement;
  activeMetric=metric;detailTab=tab;
  const d=old||document.createElement('aside');d.id='indicator-detail';d.setAttribute('role','dialog');d.setAttribute('aria-label','Detalhe do indicador');d.setAttribute('aria-modal','false');
  d.innerHTML=`<header class="indicator-detail-header"><div><small>${metricInfo(metric).kind==='medicos'?'Jornada de médicos':'Jornada de pacientes'}</small><h2>${esc(metricInfo(metric).label)}</h2></div><button class="icon-button" data-close-indicator aria-label="Fechar detalhe do indicador">×</button></header><div class="growth-tabs" role="tablist" aria-label="Detalhes da etapa">${detailTabs.map(t=>`<button role="tab" aria-selected="${t===tab}" tabindex="${t===tab?0:-1}" data-detail-tab="${t}" id="detail-tab-${detailTabs.indexOf(t)}" aria-controls="indicator-detail-content">${t}</button>`).join('')}</div><div id="indicator-detail-content" role="tabpanel" aria-labelledby="detail-tab-${detailTabs.indexOf(tab)}">${detailContent()}</div>`;
  if(!old)document.body.append(d);document.body.classList.add('indicator-open');
  if(focus)d.querySelector('[aria-selected=true]').focus();
 }
 indicators=function(){
  const full=originalIndicators();
  if(state.role!=='gestor'){
   const ownTasks=tasks.filter(t=>t.owner===currentProfile().initials);
   return full+(state.role==='representante'?routeSupervision():'')+`<section class="card mt" id="dashboard-tasks">${sectionHead('Minhas tarefas','Abrir tarefas','tarefas')}<p>${ownTasks.filter(t=>t.stage!=='Concluído').length} tarefas pendentes</p></section>`;
  }
  const template=document.createElement('div');template.innerHTML=full;
  const head=template.querySelector('.page-heading').outerHTML;
  const nav=`<div class="growth-tabs dashboard-tabs" role="tablist" aria-label="Guias do painel">${dashboardTabs.map((t,i)=>`<button role="tab" tabindex="${t===dashboardTab?0:-1}" aria-selected="${t===dashboardTab}" data-dashboard-tab="${t}" id="dashboard-tab-${i}" aria-controls="dashboard-content">${t}</button>`).join('')}</div>`;
  let content='';
  if(dashboardTab==='Indicadores')content=template.querySelector('.company-toolbar').outerHTML+template.querySelector('.grid.four').outerHTML+`<p class="funnel-caption mt">Médicos e pacientes percorrem jornadas relacionadas pelo encaminhamento. Compare etapas dentro da mesma coorte. Clique para analisar e aprimorar uma etapa.</p>`+template.querySelector('.company-funnels').outerHTML;
  else if(dashboardTab==='Operação'){
   const ownTasks=tasks;content=[...template.children].filter(el=>el.matches('section')).map(el=>el.outerHTML).join('')+routeSupervision()+`<section class="card mt" id="dashboard-tasks">${sectionHead('Trabalho da equipe','Abrir tarefas','tarefas')}<div class="grid four">${['A fazer','Em andamento','Em revisão','Concluído'].map(stage=>`<div><small>${stage}</small><div class="metric-value">${ownTasks.filter(t=>t.stage===stage).length}</div></div>`).join('')}</div></section>`;
  }else if(dashboardTab==='Análises e hipóteses'){
   const metrics=metricOptions.filter(([id])=>!state.growthFilter||id===state.growthFilter);
   content=notice('Análises ilustrativas calculadas localmente. IA e comparação histórica ainda não estão conectadas.')+metricPicker()+`<div class="grid two mt">${metrics.map(([metric,title])=>{const m=metricInfo(metric);return `<article class="card"><small>${m.kind==='medicos'?'Médicos':'Pacientes'}</small><h2>${esc(title.split(' · ')[1])}</h2><p>${m.row.count} pessoas · ${m.row.previous===null?'entrada da jornada':formatRate(m.row.rate)+' da etapa anterior'}</p><p class="funnel-caption">Sem histórico comparável para concluir melhora ou piora.</p><button class="btn" data-indicator="${metric}">Abrir análise da etapa</button></article>`;}).join('')}</div><section class="card mt">${collectionSection('hypotheses',state.growthFilter||'')}</section>`;
  }else content=notice(dashboardTab==='Experimentos'?'Planejamento de testes demonstrativos. Nenhum teste é executado nem variante aplicada automaticamente.':'Padrões de referência da demonstração. A configuração real dos agentes ainda não está conectada.')+metricPicker()+`<section class="card mt">${collectionSection(dashboardTab==='Experimentos'?'experiments':'standards',state.growthFilter||'')}</section>`;
  return head+nav+`<div id="dashboard-content" role="tabpanel" aria-labelledby="dashboard-tab-${dashboardTabs.indexOf(dashboardTab)}">${content}</div>`;
 };
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.dashboardTab){dashboardTab=b.dataset.dashboardTab;closeDetail(false);render();document.querySelector(`[data-dashboard-tab="${dashboardTab}"]`)?.focus();}
  if(b.dataset.indicator){e.preventDefault();e.stopImmediatePropagation();showDetail(b.dataset.indicator);}
  if(b.dataset.detailTab)showDetail(activeMetric,b.dataset.detailTab);
  if(b.hasAttribute('data-close-indicator'))closeDetail();
 },true);
 document.addEventListener('change',e=>{if(e.target.id==='growth-metric'){state.growthFilter=e.target.value;render();}});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!document.querySelector('dialog[open]'))closeDetail();
  const tab=e.target.closest('[role=tab]');if(!tab)return;
  if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
   const buttons=[...tab.parentElement.querySelectorAll('[role=tab]')];const i=buttons.indexOf(tab);
   const index=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
   e.preventDefault();buttons[index].click();
  }
 });
 window.addEventListener('hashchange',()=>closeDetail(false));
 function allowed(name,r){
  if(state.role==='gestor')return true;
  if(name==='tasks')return !r||r.owner===currentProfile().initials;
  if((name==='appointments'||name==='routes')&&state.role==='representante')return !r||r.owner===currentProfile().name;
  return false;
 }
 function visible(name){return collections[name].filter(r=>allowed(name,r));}
 const action=(name,id='',text='Gerenciar registros')=>`<button class="btn" data-crud="${name}" data-record="${esc(id)}">${esc(text)}</button>`;
 render=function(){
  sync();originalRender();
  if(document.getElementById('indicator-detail')){if(state.role!=='gestor')closeDetail(false);else showDetail(activeMetric,detailTab,false);}
  const [route,id]=state.route.split('/');
  const name={pessoas:'people',campanhas:'campaigns',tarefas:'tasks',pedidos:'orders',catalogo:'products',estoque:'products',produto:'products',cerebro:'documents',reunioes:'appointments',visitas:'appointments'}[route]||(state.route==='gestao/equipe'?'people':null);
  if(!name||!allowed(name)||!canOpen(state.route)||route==='visitas')return;
  const row=document.createElement('div');row.className='actions crud-toolbar';
  row.innerHTML=action(name,collections[name].some(r=>r.id===id)?id:'',id&&collections[name].some(r=>r.id===id)?'Editar registro':`Gerenciar ${labels[name].toLowerCase()}`);
  if(!id)row.innerHTML+=`<button class="btn primary" data-crud-new="${name}">${icon('plus')} Novo registro</button>`;
  const hint=document.createElement('small');hint.textContent=storageError?'Persistência indisponível: alterações temporárias nesta aba.':'Demonstração · alterações salvas só neste navegador.';row.append(hint);
  document.querySelector('main .page-heading')?.after(row);
 };
 brainDetail=function(id){
  const d=documents.find(x=>x.id===id);if(!d)return notFound();if(!d.content)return originalBrainDetail(id);
  return heading(esc(d.title),esc(d.description))+`<button class="back" data-nav="cerebro">${icon('back')} Cérebro</button><article class="card document"><span class="pill">${esc(d.version)}</span><p style="white-space:pre-wrap">${esc(d.content)}</p></article>`;
 };
 function agenda(kind,id){
  const entries=appointments.filter(a=>a.kind===kind&&allowed('appointments',a));
  const record=id?entries.find(a=>a.id===id||a.person===id):null;
  if(id&&record)return heading(esc(record.title),kind+' · demonstração')+`<button class="back" data-nav="${kind==='Reunião'?'reunioes':'visitas'}">Voltar à agenda</button><section class="card"><p>${esc(allPeople.find(p=>p.id===record.person)?.name||'Sem pessoa vinculada')} · ${esc(record.date.replace('T',' '))}</p><p>${esc(record.owner)} · ${esc(record.status)}</p><p style="white-space:pre-wrap">${esc(record.result||'Resultado ainda não registrado.')}</p>${action('appointments',record.id,'Editar ou registrar resultado')}</section>`;
  return heading(kind==='Reunião'?'Reuniões':'Visitas','Agenda demonstrativa. Não sincroniza calendários nem envia convites.')+`<section class="card">${entries.map(a=>`<div class="list-row"><span class="grow"><strong>${esc(a.title)}</strong><small>${esc(a.date.replace('T',' '))} · ${esc(allPeople.find(p=>p.id===a.person)?.name||'Sem pessoa')} · ${esc(a.owner)}</small></span>${pill(a.status)}${action('appointments',a.id,'Abrir registro')}</div>`).join('')||'<p>Nenhum registro.</p>'}</section>`;
 }
 meetings=id=>agenda('Reunião',id);
 const accepted='Aceitou receber visitas';
 const regionOf=p=>(p.region||p.city||'').trim();
 const eligible=p=>p.type==='Médico'&&p.visitConsent===accepted;
 let chosenRegion='';
 const eligibleForRegion=region=>people.filter(p=>eligible(p)&&regionOf(p)===region);
 function routeStop(p,i){return `<div class="list-row"><span class="num">${i+1}</span><span class="grow"><strong>${esc(p?.name||'Médico indisponível')}</strong><small>${esc(p?.city||'')} · ${esc(p?.owner||'')}</small></span></div>`;}
 visits=function(){
  const regions=[...new Set(people.filter(eligible).map(regionOf).filter(Boolean))].sort();
  if(!regions.includes(chosenRegion))chosenRegion=regions[0]||'';
  const eligibleDoctors=eligibleForRegion(chosenRegion);
  const savedRoutes=routes.filter(r=>allowed('routes',r));
  return heading('Rotas de visitas','Planeje visitas com aceite registrado, agrupadas pela região de atendimento.')+
   notice('Roteiro demonstrativo com sequência manual. Não calcula distância, trânsito ou caminho e não envia confirmação aos médicos.')+
   `<section class="card"><h2>Médicos disponíveis na região</h2><label class="route-region">Região / cidade<select id="visit-region"><option value="">Selecione a região</option>${regions.map(r=>`<option value="${esc(r)}" ${r===chosenRegion?'selected':''}>${esc(r)}</option>`).join('')}</select></label><p class="mt">${eligibleDoctors.length} médicos com aceite para receber visitas nesta região.</p>${eligibleDoctors.map((p,i)=>routeStop(p,i)).join('')||'<p>Nenhum médico elegível. Na ficha da pessoa, registre o aceite e a região antes de montar a rota.</p>'}<div class="actions mt"><button class="btn primary" data-route-new ${eligibleDoctors.length?'':'disabled'}>Montar rota nesta região</button>${state.role==='gestor'?btn('Gerenciar médicos e aceites','pessoas'):btn('Ver minha carteira','pessoas')}</div></section>`+
   `<section class="card mt"><h2>Rotas planejadas</h2>${savedRoutes.map(r=>{
    const stops=(r.stops||[]).map(id=>allPeople.find(p=>p.id===id));
    const invalid=stops.some(p=>!p||!eligible(p)||regionOf(p)!==r.region||!people.some(x=>x.id===p.id));
    return `<article class="route-card"><h3>${esc(r.title)}</h3><p>${esc(r.region)} · ${esc(r.date||'Data não definida')} · ${esc(r.owner)}</p>${invalid?notice('Revisar rota: uma parada perdeu o aceite, mudou de região ou saiu da sua carteira.'):pill('Paradas elegíveis','green')}${stops.map(routeStop).join('')}<div class="actions mt">${!invalid&&r.phase!=='Concluída'?`<button class="btn primary" data-route-progress="${esc(r.id)}">${r.phase==='Em andamento'?'Simular conclusão da próxima parada':'Simular início da rota'}</button>`:''}<button class="btn" data-route-edit="${esc(r.id)}">Editar rota e paradas</button><button class="btn" data-route-delete="${esc(r.id)}">Excluir rota</button></div></article>`;
   }).join('')||'<p>Nenhuma rota criada neste navegador.</p>'}</section>`;
 };
 function routeEditor(id='',draft=null){
  const existing=routes.find(r=>r.id===id);
  if(existing&&!allowed('routes',existing))return;
  const r=draft||existing||{title:'',region:chosenRegion,date:'',owner:currentProfile().name,stops:[]};
  const candidates=eligibleForRegion(r.region);
  const stops=(r.stops||[]).filter(id=>candidates.some(p=>p.id===id));
  const d=closeDialog();
  d.innerHTML=`<form id="visit-route-form" data-record="${esc(id)}"><div class="dialog-top"><strong>${existing?'Editar':'Montar'} rota de visitas</strong><button type="button" class="icon-button" data-close-editor aria-label="Fechar">×</button></div><p>${esc(r.region)} · apenas médicos com aceite registrado. Horários devem ser combinados separadamente.</p><label>Nome da rota<input name="title" required maxlength="150" value="${esc(r.title)}"></label><label>Data<input name="date" type="date" required value="${esc(r.date)}"></label><input type="hidden" name="region" value="${esc(r.region)}"><label>Responsável<input name="owner" required maxlength="150" value="${esc(r.owner)}" ${state.role==='representante'?'readonly':''}></label><h3>Selecionar médicos</h3>${candidates.map(p=>`<label class="route-doctor"><input type="checkbox" name="doctor" value="${esc(p.id)}" ${stops.includes(p.id)?'checked':''}>${esc(p.name)} · ${esc(p.city)}</label>`).join('')||'<p>Nenhum médico elegível nesta região.</p>'}<h3 class="mt">Sequência das paradas</h3><div id="route-stop-order">${stops.map((id,i)=>`<div class="list-row" data-stop="${esc(id)}"><span class="grow">${esc(candidates.find(p=>p.id===id).name)}</span><button type="button" class="btn" data-route-up="${i}" ${i===0?'disabled':''} aria-label="Mover parada para cima">↑</button><button type="button" class="btn" data-route-down="${i}" ${i===stops.length-1?'disabled':''} aria-label="Mover parada para baixo">↓</button></div>`).join('')||'<p>Selecione pelo menos um médico.</p>'}</div><p id="route-error" role="alert"></p><button type="submit" class="btn primary">Salvar rota neste navegador</button></form>`;
  d.showModal();
 }
 function routeDraft(form){return {title:form.elements.title.value,region:form.elements.region.value,date:form.elements.date.value,owner:form.elements.owner.value,stops:[...form.querySelectorAll('[data-stop]')].map(el=>el.dataset.stop)};}
 document.addEventListener('change',e=>{
  if(e.target.id==='visit-region'){chosenRegion=e.target.value;render();}
  if(e.target.name==='doctor'&&e.target.closest('#visit-route-form')){
   const form=e.target.form,r=routeDraft(form),id=e.target.value;
   r.stops=e.target.checked?[...r.stops,id]:r.stops.filter(x=>x!==id);routeEditor(form.dataset.record,r);
  }
 });
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(!['routeNew','routeEdit','routeDelete','routeConfirm','routeUp','routeDown','routeProgress'].some(k=>Object.hasOwn(b.dataset,k)))return;
  e.preventDefault();e.stopImmediatePropagation();
  if(!allowed('routes'))return;
  if(Object.hasOwn(b.dataset,'routeProgress')){
   const r=routes.find(r=>r.id===b.dataset.routeProgress);if(!r||!allowed('routes',r))return;
   if(r.stops.some(id=>!eligibleForRegion(r.region).some(p=>p.id===id)))return toast('Revise os aceites e a região antes de iniciar.');
   if(r.phase!=='Em andamento'){r.phase='Em andamento';r.completedStops=0;}else{r.completedStops=Math.min((r.completedStops||0)+1,r.stops.length);if(r.completedStops===r.stops.length)r.phase='Concluída';}
   r.updatedAt=new Date().toISOString();store();render();
  }else if(Object.hasOwn(b.dataset,'routeNew'))routeEditor();
  else if(Object.hasOwn(b.dataset,'routeEdit'))routeEditor(b.dataset.routeEdit);
  else if(Object.hasOwn(b.dataset,'routeUp')||Object.hasOwn(b.dataset,'routeDown')){
   const form=b.closest('form'),r=routeDraft(form),i=Number(b.dataset.routeUp??b.dataset.routeDown),j=i+(b.dataset.routeUp!==undefined?-1:1);
   if(j>=0&&j<r.stops.length){[r.stops[i],r.stops[j]]=[r.stops[j],r.stops[i]];routeEditor(form.dataset.record,r);}
  }else if(Object.hasOwn(b.dataset,'routeDelete')){
   const r=routes.find(r=>r.id===b.dataset.routeDelete);if(!r||!allowed('routes',r))return;
   const d=closeDialog();d.innerHTML=`<h2>Excluir rota?</h2><p>${esc(r.title)}</p><div class="actions"><button class="btn primary" data-route-confirm="${esc(r.id)}">Confirmar exclusão</button><button class="btn" data-close-editor>Cancelar</button></div>`;d.showModal();
  }else{
   const i=routes.findIndex(r=>r.id===b.dataset.routeConfirm&&allowed('routes',r));if(i>=0){routes.splice(i,1);store();closeDialog();render();}
  }
 },true);
 document.addEventListener('submit',e=>{
  if(e.target.id!=='visit-route-form')return;
  e.preventDefault();e.stopImmediatePropagation();const form=e.target,r=routeDraft(form),existing=routes.find(x=>x.id===form.dataset.record);
  if(!allowed('routes',existing))return;
  if(!r.stops.length||r.stops.some(id=>!eligibleForRegion(r.region).some(p=>p.id===id))){document.getElementById('route-error').textContent='Selecione médicos com aceite registrado nesta região.';return;}
  if(!r.title.trim()||!r.owner.trim()||!r.date){document.getElementById('route-error').textContent='Preencha nome, responsável e data.';return;}
  if(state.role==='representante')r.owner=currentProfile().name;
  if(existing)Object.assign(existing,r,{phase:'Planejada',completedStops:0,updatedAt:new Date().toISOString()});else routes.push({...r,id:uid(),phase:'Planejada',completedStops:0});
  const persisted=store();closeDialog();render();toast(persisted?'Rota salva neste navegador.':'Rota temporária: armazenamento indisponível.');
 },true);
 const fields={
  hypotheses:[['title','Nome da hipótese'],['metric','Indicador',metricOptions],['hypothesis','Possível causa','textarea'],['solution','Solução proposta','textarea'],['evidence','Evidências disponíveis','textarea']],
  standards:[['title','Nome do padrão'],['metric','Indicador',metricOptions],['setting','Configuração de referência','textarea'],['version','Versão'],['since','Desde quando'],['notes','Observações','textarea']],
  experiments:[['title','Nome do experimento'],['metric','Indicador',metricOptions],['setting','Configuração relacionada','textarea'],['hypothesis','Hipótese','textarea'],['control','Controle / configuração atual','textarea'],['variant','Variante / configuração proposta','textarea'],['population','População e período de teste','textarea'],['status','Situação',['Rascunho','Planejado','Em teste (simulação)','Encerrado (simulação)']],['notes','Evidências e observações','textarea']],
  people:[['name','Nome'],['type','Tipo',['Médico','Paciente','Colaborador']],['specialty','Especialidade / contexto'],['city','Cidade'],['region','Região de visitas'],['visitConsent','Aceite para visitas',['Não informado','Aceitou receber visitas','Não deseja visitas']],['stage','Etapa'],['owner','Responsável'],['employeeRole','Função na equipe',['Gestor','Representante','Despachante']]],
  campaigns:[['name','Nome'],['topic','Público / tema'],['status','Situação',['Planejada','Em andamento','Concluída']]],
  tasks:[['title','Título'],['stage','Situação',['A fazer','Em andamento','Em revisão','Concluído']],['owner','Responsável (iniciais)']],
  orders:[['person','Paciente','person'],['product','Produto','product'],['price','Valor (R$)'],['payment','Pagamento',['Aguardando','Confirmado']],['status','Operação',['Aguardando pagamento','Em preparação','Enviado','Entregue','Cancelado']],['tracking','Rastreio'],['assignee','Despachante']],
  products:[['name','Nome'],['presentation','Apresentação'],['price','Preço (R$)'],['qty','Saldo demonstrativo','number']],
  documents:[['title','Título'],['description','Descrição'],['version','Versão'],['content','Conteúdo','textarea']],
  appointments:[['title','Título'],['kind','Tipo',['Reunião','Visita']],['person','Pessoa','contact'],['date','Data e hora','datetime-local'],['owner','Responsável'],['status','Situação',['Planejada','Agendada','Realizada','Cancelada']],['result','Resultado','textarea']]
 };
 function closeDialog(){const d=document.getElementById('editor');if(d.open)d.close();return d;}
 function list(name){
  const d=closeDialog();
  d.innerHTML=`<div class="dialog-top"><strong>${labels[name]}</strong><button class="icon-button" data-close-editor aria-label="Fechar">×</button></div><p>Registros de demonstração salvos neste navegador.</p><button class="btn primary" data-crud-new="${name}">Novo registro</button><div class="crud-records">${visible(name).map(r=>`<div class="list-row"><span class="grow"><strong>${esc(r.name||r.title||'#'+r.id)}</strong><small>${esc(r.stage||r.status||r.description||r.presentation||'')}</small></span>${action(name,r.id,'Editar')}<button class="btn" data-crud-delete="${name}" data-record="${esc(r.id)}">Excluir</button></div>`).join('')||'<p class="mt">Nenhum registro.</p>'}</div>`;d.showModal();
 }
 function defaults(name){
  const selectedMetric=activeMetric||state.growthFilter||(state.route.startsWith('aprimoramento/')?state.route.split('/').slice(1).join('/'):'medicos/identified');
  return {hypotheses:{metric:selectedMetric},standards:{metric:selectedMetric,version:'Rascunho'},experiments:{status:'Rascunho',metric:selectedMetric},people:{type:'Médico',specialty:'Não informado',city:'Não informada',stage:'Cadastro demonstrativo',owner:'Não atribuído',color:'#445f83',milestones:[]},campaigns:{topic:'Público não definido',status:'Planejada',leads:0,talks:0,meetings:0,color:'#335e9c',icon:'campaign'},tasks:{stage:'A fazer',owner:currentProfile().initials},orders:{payment:'Aguardando',status:'Aguardando pagamento',tracking:'',assignee:'Diego Souza',price:'R$ 0,00'},products:{qty:0,price:'R$ 0,00'},documents:{version:'Rascunho'},appointments:{kind:state.route.startsWith('visitas')?'Visita':'Reunião',status:'Planejada',owner:currentProfile().name,date:'',result:''}}[name];
 }
 function input(name,field,record){
  const [k,label,type]=field,value=record[k]??'',required=!['tracking','result','employeeRole','description','region','notes','evidence','since'].includes(k);
  let options=Array.isArray(type)?type:null;
  if(type==='person'||type==='contact')options=(type==='person'?allPeople.filter(p=>p.type==='Paciente'):people.filter(p=>p.type!=='Colaborador')).map(p=>[p.id,p.name]);
  if(type==='product')options=products.map(p=>[p.name,p.name]);
  if(name==='appointments'&&k==='owner'&&state.role!=='gestor')options=[currentProfile().name];
  if(name==='tasks'&&k==='owner'&&state.role!=='gestor')options=[currentProfile().initials];
  let control;
  if(options)control=`<select name="${k}" ${required?'required':''}>${options.map(o=>{const [v,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${v===value?'selected':''}>${esc(t)}</option>`}).join('')}</select>`;
  else if(type==='textarea')control=`<textarea name="${k}" rows="5" maxlength="20000" ${required?'required':''}>${esc(value)}</textarea>`;
  else control=`<input name="${k}" type="${type==='number'?'number':type==='datetime-local'?'datetime-local':'text'}" ${type==='number'?'min="0" step="1"':''} maxlength="300" value="${esc(value)}" ${required?'required':''}>`;
  return `<label>${label}${control}</label>`;
 }
 function edit(name,id){
  const found=collections[name].find(r=>r.id===id);if(!allowed(name,found))return toast('Registro fora do escopo.');
  const r=found||defaults(name),d=closeDialog();
  d.innerHTML=`<form id="crud-form" data-collection="${name}" data-record="${esc(id||'')}"><div class="dialog-top"><strong>${found?'Editar':'Criar'} · ${labels[name]}</strong><button type="button" class="icon-button" data-close-editor aria-label="Fechar">×</button></div><p>Dados fictícios · salvos apenas neste navegador.</p>${fields[name].map(f=>input(name,f,r)).join('')}<p id="crud-error" role="alert"></p><div class="actions"><button class="btn primary" type="submit">Salvar registro</button><button class="btn" type="button" data-crud="${name}">Cancelar</button>${found?`<button class="btn" type="button" data-crud-delete="${name}" data-record="${esc(id)}">Excluir</button>`:''}</div></form>`;d.showModal();
 }
 function dependency(name,r){
  if(name==='people'){
   if(allOrders.some(o=>o.person===r.id)||appointments.some(a=>a.person===r.id)||routes.some(a=>a.stops?.includes(r.id)))return 'Esta pessoa tem pedidos ou atividades vinculados. Remova ou reatribua esses registros antes de excluir.';
   if(r.type==='Colaborador'&&(allPeople.some(p=>p.id!==r.id&&p.owner===r.name)||allOrders.some(o=>o.assignee===r.name)||tasks.some(t=>t.owner===r.initials)))return 'Este colaborador tem registros atribuídos. Reatribua-os antes de excluir.';
  }
  if(name==='products'&&allOrders.some(o=>o.product===r.name))return 'Produto vinculado a pedidos. Remova ou altere esses vínculos antes de excluir.';
  if(name==='campaigns'&&allPeople.some(p=>p.campaignId===r.id))return 'Campanha vinculada a pessoas. Preserve o registro enquanto houver vínculos.';
  return '';
 }
 function remove(name,id){
  const r=collections[name].find(x=>x.id===id);if(!r||!allowed(name,r))return;
  const error=dependency(name,r);if(error)return toast(error);
  const d=closeDialog();d.innerHTML=`<div class="dialog-top"><strong>Excluir registro?</strong><button class="icon-button" data-close-editor aria-label="Fechar">×</button></div><p>${esc(r.name||r.title||'#'+r.id)}</p><p>Esta ação remove o registro desta demonstração no navegador.</p><div class="actions"><button class="btn primary" data-crud-confirm="${name}" data-record="${esc(id)}">Confirmar exclusão</button>${action(name,id,'Cancelar')}</div>`;d.showModal();
 }
 const legacy={person:'people',campaign:'campaigns',task:'tasks',meeting:'appointments',visit:'appointments','campaign-edit':'campaigns','task-edit':'tasks'};
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  let name=b.dataset.crud||b.dataset.crudNew||b.dataset.crudDelete||b.dataset.crudConfirm;
  if(name){
   e.preventDefault();e.stopImmediatePropagation();if(!collections[name]||!allowed(name))return;
   const id=b.dataset.record||'';
   if(b.hasAttribute('data-crud-new'))edit(name,'');
   else if(b.hasAttribute('data-crud-delete'))remove(name,id);
   else if(b.hasAttribute('data-crud-confirm')){
    const i=collections[name].findIndex(r=>r.id===id);
    if(i>=0&&allowed(name,collections[name][i])&&!dependency(name,collections[name][i])){collections[name].splice(i,1);store();render();list(name);}
   }else id?edit(name,id):list(name);
   return;
  }
  if(b.id==='reset-demo'){
   e.preventDefault();e.stopImmediatePropagation();localStorage.removeItem('minerva-aurora-demo');localStorage.removeItem(key);location.reload();return;
  }
  if(b.dataset.edit==='strategy')return;
  if(b.dataset.task!==undefined||legacy[b.dataset.edit]){
   e.preventDefault();e.stopImmediatePropagation();
   name=b.dataset.task!==undefined?'tasks':legacy[b.dataset.edit];
   const id=b.dataset.task!==undefined?tasks[Number(b.dataset.task)]?.id:b.dataset.edit==='campaign-edit'?state.route.split('/')[1]:'';
   edit(name,id);
  }
 },true);
 document.addEventListener('submit',e=>{
  if(e.target.id==='editor-form'&&e.target.dataset.kind==='strategy')setTimeout(()=>store(),0);
  if(e.target.id!=='crud-form')return;
  e.preventDefault();e.stopImmediatePropagation();
  const form=e.target,name=form.dataset.collection,id=form.dataset.record,arr=collections[name],existing=arr.find(r=>r.id===id);
  if(!allowed(name,existing))return;
  const values=Object.fromEntries(new FormData(form));Object.keys(values).forEach(k=>values[k]=values[k].trim());
  const fail=msg=>document.getElementById('crud-error').textContent=msg;
  if(!values.name&&!values.title&&name!=='orders')return fail('Preencha o nome ou título.');
  if(name==='products'&&(!Number.isSafeInteger(Number(values.qty))||Number(values.qty)<0))return fail('Informe um saldo inteiro igual ou maior que zero.');
  if(['products','orders'].includes(name)&&!/^R?\$?\s*\d+(?:\.\d{3})*(?:,\d{2})?$/.test(values.price))return fail('Informe um valor como R$ 389,00.');
  if(name==='orders'&&(!allPeople.some(p=>p.id===values.person&&p.type==='Paciente')||!products.some(p=>p.name===values.product)))return fail('Selecione paciente e produto válidos.');
  if(name==='appointments'&&!people.some(p=>p.id===values.person))return fail('Selecione uma pessoa do seu escopo.');
  const r={...(existing||defaults(name)),...values,id:id||uid()};
  if(name==='products')r.qty=Number(r.qty);
  if(name==='people'){
   r.initials=r.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
   if(existing?.type==='Paciente'&&r.type!=='Paciente'&&allOrders.some(o=>o.person===r.id))return fail('Pessoa vinculada a pedidos precisa continuar como paciente.');
   if(existing&&existing.name!==r.name){allPeople.forEach(p=>{if(p.owner===existing.name)p.owner=r.name;});allOrders.forEach(o=>{if(o.assignee===existing.name)o.assignee=r.name;});appointments.forEach(a=>{if(a.owner===existing.name)a.owner=r.name;});tasks.forEach(t=>{if(existing.type==='Colaborador'&&t.owner===existing.initials)t.owner=r.initials;});}
  }
  if(name==='products'&&existing&&existing.name!==r.name)allOrders.forEach(o=>{if(o.product===existing.name)o.product=r.name;});
  existing?Object.assign(existing,r):arr.push(r);
  const persisted=store();closeDialog();render();toast(persisted?'Registro salvo neste navegador.':'Alteração temporária: não foi possível persistir.');
 },true);
 // Preserve a previous strategy selection without letting task saves erase it.
 try{const stored=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(stored?.distribution))saved.distribution=stored.distribution;}catch{}
 sync();render();
})();
