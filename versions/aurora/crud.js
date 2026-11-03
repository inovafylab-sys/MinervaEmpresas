'use strict';
// Fictional workspace records. Persistence is restricted to this browser/origin.
(() => {
 const key='minerva-aurora-crud-v1';
 const documents=brain.map(([id,ic,title,description,version])=>({id,title,description,version,content:''}));
 const appointments=relationshipActivities.map(a=>({...a,title:a.summary,date:'2026-11-03T09:00',result:''}));
 const routes=[],experiments=[],hypotheses=[],standards=[];
 const companyProfile=[{id:'company',name:'Aurora Cannabis',legalName:'',companyId:'',email:'',phone:'',city:'',address:'',website:'',timezone:'America/Sao_Paulo'}];
 const suppliedLimit=window.MinervaSubscription?.maxSegments;
 const subscription=Object.freeze({maxSegments:Number.isSafeInteger(suppliedLimit)&&suppliedLimit>=0?suppliedLimit:25});
 const footerLinks=[
  {id:'footer-site',title:'Site',icon:'site',url:''},
  {id:'footer-instagram',title:'Instagram',icon:'instagram',url:''},
  {id:'footer-linkedin',title:'LinkedIn',icon:'linkedin',url:''},
  {id:'footer-whatsapp',title:'WhatsApp',icon:'whatsapp',url:''},
  {id:'footer-email',title:'E-mail',icon:'email',url:''}
 ];
 const companyRules=[{id:'rules',title:'Regras da operação',monthlyCapacity:500,defaultOwner:'Ana Silva',visitHours:'09:00–18:00',orderInstructions:'',supportInstructions:''}];
 const collections={people:allPeople,campaigns,tasks,orders:allOrders,products,documents,appointments,routes,experiments,hypotheses,standards,companyProfile,companyRules,footerLinks};
 const labels={people:'Pessoas',campaigns:'Campanhas',tasks:'Tarefas',orders:'Pedidos',products:'Produtos',documents:'Documentos',appointments:'Agenda',experiments:'Experimentos',hypotheses:'Hipóteses',standards:'Padrões demonstrativos',companyProfile:'Dados da empresa',companyRules:'Regras da operação',footerLinks:'Links do rodapé'};
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
  documents.forEach(d=>{if(d.id==='decisoes'&&d.title==='Decisões e experimentos')d.title='Decisões e versões';});
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
  try{localStorage.setItem(key,JSON.stringify({version:1,...collections,distribution:saved.distribution,segments:saved.segments}));storageError=false;return true;}
  catch{storageError=true;toast('Não foi possível salvar neste navegador. As alterações só duram nesta aba.');return false;}
 }
 persist=()=>{store();};
 function safeFooterUrl(value){
  const raw=String(value||'').trim();if(!raw||/[\u0000-\u001f\u007f]/.test(raw))return null;
  if(/^#[a-z0-9][a-z0-9/_%.-]*$/i.test(raw))return raw;
  if(/^mailto:[^\s@?]+@[^\s@?]+\.[^\s@?]+$/i.test(raw)||/^tel:\+?\d{6,18}$/.test(raw))return raw;
  try{const url=new URL(raw);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null;}catch{return null;}
 }
 function footerIcon(name){
  if(name==='apresentacao')return icon('orbit');if(name==='documento')return icon('file');if(name==='link')return icon('link');
  const drawings={
   site:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
   instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/>',
   linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7m0-10v.2M11 17v-7m0 3c0-4 6-4 6 0v4"/>',
   whatsapp:'<path d="M4.2 17.8 3 21l3.7-1A9 9 0 1 0 4.2 17.8Z"/><path d="M8 7c-3 2 4 10 8 8l-2-3-2 1-2-2 1-2Z"/>',
   email:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
   telefone:'<path d="M6 3h4l1 5-3 2c1 3 3 5 6 6l2-3 5 1v4c0 7-18-1-18-11 0-2 1-4 3-4Z"/>',
   suporte:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.5 5.5 3.7 3.7m5.6 5.6 3.7 3.7m0-13-3.7 3.7m-5.6 5.6-3.7 3.7"/>',
   github:'<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.3-1.6-1-2 4-.5 7-2 7-6 0-1.5-.5-2.7-1.5-3.7.2-1.1.1-2.2-.4-3.3-1.5-.2-3.3.8-4.1 1.3a14 14 0 0 0-6 0C8.2 3.8 6.4 2.8 4.9 3c-.5 1.1-.6 2.2-.4 3.3C3.5 7.3 3 8.5 3 10c0 4 3 5.5 7 6-.7.4-1 1-1 2v4"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawings[name]||drawings.site}</svg>`;
 }
 function renderFooter(){
  const footer=document.querySelector('.system-footer');
  const links=footerLinks.map(r=>({...r,href:safeFooterUrl(r.url)})).filter(r=>!r.href||!r.href.startsWith('#')||canOpen(r.href.slice(1)));
  footer.innerHTML=`<div class="footer-brand"><strong>MINERVA <span>×</span> NEURUM</strong><small>${esc(companyProfile[0]?.name||'')}</small></div><nav class="footer-links" aria-label="Links da Minerva">${links.map(r=>r.href?`<a href="${esc(r.href)}" aria-label="${esc(r.title)}" title="${esc(r.title)}" ${r.href.startsWith('#')?'':'target="_blank" rel="noopener noreferrer"'}>${footerIcon(r.icon)}</a>`:`<span class="footer-link-preview" role="img" aria-label="${esc(r.title)} — endereço não definido" title="${esc(r.title)}">${footerIcon(r.icon)}</span>`).join('')}</nav>`;
 }

 const originalRender=render, originalBrainDetail=brainDetail;
 const originalIndicators=indicators;
 const originalContextual=contextual;
 contextual=function(type,id){return type==='aprimoramento'?notFound():originalContextual(type,id);};
 let activeMetric='',detailReturnFocus=null;
 function metricInfo(metric){
  const [kind,key]=metric.split('/'),stages=kind==='medicos'?medicalStages:patientStages;
  const index=stages.findIndex(([id])=>id===key);if(index<0)return null;
  const records=kind==='medicos'?companyScope().doctors:companyScope().patients;
  const rows=funnelRows(records,stages);return {kind,key,index,label:stages[index][1],row:rows[index],entry:rows[0].count};
 }
 function closeDetail(restore=true){
  document.getElementById('indicator-detail')?.remove();document.body.classList.remove('indicator-open');
  if(restore&&detailReturnFocus?.isConnected)detailReturnFocus.focus();activeMetric='';
 }
 function showDetail(metric,focus=true){
  if(state.role!=='gestor')return;const m=metricInfo(metric);if(!m)return;
  const old=document.getElementById('indicator-detail');if(!old)detailReturnFocus=document.activeElement;activeMetric=metric;
  const d=old||document.createElement('aside');d.id='indicator-detail';d.setAttribute('role','dialog');d.setAttribute('aria-label','Detalhe do indicador');
  d.innerHTML=`<header class="indicator-detail-header"><div><small>${m.kind==='medicos'?'Médicos':'Pacientes'}</small><h2>${esc(m.label)}</h2></div><button class="icon-button" data-close-indicator aria-label="Fechar detalhe do indicador">×</button></header><div id="indicator-detail-content"><div class="grid two growth-metrics"><div><small>Pessoas nesta etapa</small><strong>${m.row.count}</strong></div><div><small>Conversão anterior</small><strong>${m.row.previous===null?'Entrada':formatRate(m.row.rate)}</strong></div><div><small>Desde a entrada</small><strong>${formatRate(rateValue(m.row.count,m.entry))}</strong></div><div><small>Base anterior</small><strong>${m.row.previous??'—'}</strong></div></div><p>Mesma coorte, pessoas únicas e marcos alcançados. ${m.row.previous===null?'Esta etapa define a entrada.':`${Math.max(0,m.row.previous-m.row.count)} pessoas ainda não têm este marco registrado.`}</p><p>Comparação com períodos anteriores: ainda sem histórico disponível.</p><button class="btn" data-nav="funil-${m.kind}/${m.key}" data-close-indicator>Ver pessoas desta etapa</button></div>`;
  if(!old)document.body.append(d);document.body.classList.add('indicator-open');if(focus)d.querySelector('[data-close-indicator]').focus();
 }
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.indicator){e.preventDefault();e.stopImmediatePropagation();showDetail(b.dataset.indicator);}
  if(b.hasAttribute('data-close-indicator'))closeDetail();
 },true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]'))closeDetail();});
 window.addEventListener('hashchange',()=>closeDetail(false));
 function routeSupervision(){
  const scoped=routes.filter(r=>state.role==='gestor'||r.owner===currentProfile().name);
  const active=scoped.filter(r=>r.phase==='Em andamento');
  const stopped=scoped.filter(r=>r.phase==='Concluída');
  return `<section class="card mt" id="route-supervision">${sectionHead(state.role==='gestor'?'Supervisão de rotas e localização':'Minhas rotas de visitas','Abrir rotas','visitas')}<p class="funnel-caption">Demonstração local. Posições GPS não são recebidas de outros dispositivos. O compartilhamento real será vinculado ao início e encerramento da rota.</p><div class="grid three">${[['Rotas planejadas',scoped.length],['Em andamento · simulação',active.length],['Concluídas · simulação',stopped.length]].map(([label,value])=>`<div><small>${label}</small><div class="metric-value">${value}</div></div>`).join('')}</div><div class="mt">${scoped.map(r=>`<div class="list-row"><span class="grow"><strong>${esc(r.owner)} · ${esc(r.title)}</strong><small>${esc(r.region)} · ${(r.stops||[]).length} paradas · ${Math.min(r.completedStops||0,(r.stops||[]).length)} concluídas</small><small>Última atualização da simulação: ${r.updatedAt?esc(new Date(r.updatedAt).toLocaleString('pt-BR')):'Sem atualização'} · Localização: não conectada</small></span>${pill(r.phase||'Planejada')}${btn('Ver rota','visitas')}</div>`).join('')||'<p>Nenhuma rota registrada. O acompanhamento aparecerá aqui quando houver rotas.</p>'}</div></section>`;
 }
 function attentionBlocks(){
  const ownTasks=tasks.filter(t=>state.role==='gestor'||t.owner===currentProfile().initials);
  const pending=orders.filter(o=>o.payment==='Aguardando');
  const schedule=appointments.filter(a=>state.role==='gestor'||a.owner===currentProfile().name).filter(a=>!['Realizada','Cancelada'].includes(a.status));
  const tasksOpen=ownTasks.filter(t=>t.stage!=='Concluído');
  const warnings=state.role==='representante'?schedule.filter(a=>!a.result).map(a=>[a.title,'reunioes']):pending.map(o=>['Pedido #'+o.id+' aguarda pagamento','pedidos/'+o.id]);
  return `<div class="dashboard-attention"><section class="card" data-dashboard-area="avisos">${sectionHead('Avisos','Ver notificações','notificacoes')}${warnings.slice(0,3).map(([title,route])=>`<button class="dashboard-line" data-nav="${route}"><span class="attention-dot"></span><span>${esc(title)}</span>${icon('arrow')}</button>`).join('')||'<p class="dashboard-empty">Nenhum aviso prioritário nos registros atuais.</p>'}</section><section class="card" data-dashboard-area="tarefas">${sectionHead(state.role==='gestor'?'Tarefas da equipe':'Minhas tarefas','Abrir','tarefas')}<small>${tasksOpen.length} pendentes</small>${tasksOpen.slice(0,3).map(t=>`<button class="dashboard-line" data-task="${tasks.indexOf(t)}"><span>${esc(t.title)}</span>${pill(t.stage)}</button>`).join('')||'<p class="dashboard-empty">Nenhuma tarefa pendente.</p>'}</section><section class="card" data-dashboard-area="atividades">${sectionHead('Atividades e agenda','Ver agenda','reunioes')}${schedule.slice(0,3).map(a=>`<button class="dashboard-line" data-nav="${a.kind==='Visita'?'visitas':'reunioes'}"><span><strong>${esc(a.title)}</strong><small>${esc(a.date.replace('T',' '))} · ${esc(a.owner)}</small></span>${pill(a.kind)}</button>`).join('')||'<p class="dashboard-empty">Nenhuma atividade agendada para este perfil.</p>'}</section></div>`;
 }
 function dashboardTasks(){const own=tasks.filter(t=>state.role==='gestor'||t.owner===currentProfile().initials);return `<section class="card mt" id="dashboard-tasks">${sectionHead(state.role==='gestor'?'Trabalho da equipe':'Minhas tarefas','Abrir tarefas','tarefas')}<div class="grid four">${['A fazer','Em andamento','Em revisão','Concluído'].map(stage=>`<div><small>${stage}</small><div class="metric-value">${own.filter(t=>t.stage===stage).length}</div></div>`).join('')}</div></section>`;}
 indicators=function(){
  const name=companyProfile[0]?.name||'Minha empresa';
  const title=state.role==='gestor'?'Painel do gestor':`Painel do ${currentProfile().label.toLowerCase()}`;
  const head=heading(title,esc(name)+' · '+esc(currentProfile().scope));
  if(state.role!=='gestor'){
   return head+scopedMetricsHtml()+attentionBlocks()+(state.role==='representante'?`<section class="card mt" data-dashboard-area="carteira">${sectionHead('Minha carteira','Ver pessoas','pessoas')}${people.slice(0,5).map(p=>`<button class="dashboard-line" data-nav="pessoas/${p.id}"><span>${esc(p.name)}</span>${pill(p.stage)}</button>`).join('')}</section>`+routeSupervision():`<section class="card mt" data-dashboard-area="pedidos">${sectionHead('Fila de pedidos atribuídos','Abrir pedidos','pedidos')}${orders.map(o=>`<button class="dashboard-line" data-nav="pedidos/${o.id}"><span>#${o.id} · ${esc(o.product)}</span>${pill(o.status)}</button>`).join('')}<div class="actions mt">${btn('Catálogo','catalogo')}${btn('Estoque','estoque')}</div></section>`)+dashboardTasks();
  }
  const template=document.createElement('div');template.innerHTML=originalIndicators();
  const logistics=[...template.querySelectorAll('section')].find(el=>el.querySelector('h2')?.textContent==='Pedidos, pagamento e logística');
  const funnel=`<section class="funnel-frame" data-dashboard-area="jornadas"><header class="funnel-frame-header"><div><h2>Comercial · médicos e pacientes</h2><small>Etapas e conversões da mesma coorte · demonstração</small></div><label>Origem<select id="analytics-campaign" aria-label="Campanha dos indicadores"><option value="all">Todas as campanhas</option>${campaigns.map(c=>`<option value="${c.id}" ${(state.analyticsCampaign||'all')===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label></header>${template.querySelector('.company-funnels').outerHTML}</section>`;
  return head+`<div data-dashboard-area="resumo">${template.querySelector('.grid.four').outerHTML}</div>`+attentionBlocks()+funnel+`<div data-dashboard-area="campanhas">${campaignResultsTable()}</div><div data-dashboard-area="logistica">${logistics?.outerHTML||''}</div><div data-dashboard-area="equipe">${teamPerformance()}</div>`+routeSupervision()+dashboardTasks();
 };
 const legacySegmentNames=['Neurologia','São Paulo · capital','Psiquiatria','Outros segmentos'];
 const segmentPercent=value=>Number(value).toLocaleString('pt-BR',{maximumFractionDigits:2});
 function segmentPoints(raw){
  const value=String(raw).trim();if(!/^\d+(?:\.\d{1,2})?$/.test(value))return null;
  const [whole,fraction='']=value.split('.');const points=Number(whole)*100+Number(fraction.padEnd(2,'0'));
  return Number.isSafeInteger(points)&&points>0&&points<=10000?points:null;
 }
 function getSegments(){
  if(!Array.isArray(saved.segments))saved.segments=(saved.distribution||[30,25,25,20]).map((percent,i)=>({id:uid(),name:legacySegmentNames[i]||`Segmentação ${i+1}`,percent}));
  return saved.segments;
 }
 function strategyPie(records,total,remaining,capacity){
  const colors=['#82adff','#72d5b1','#b89aef','#e2bd78'];let offset=0;
  const slices=records.map((r,i)=>({name:r.name,percent:(segmentPoints(r.percent)||0)/100,color:colors[i]||`hsl(${Math.round(i*137.508)%360} 60% 65%)`}));
  if(remaining>0)slices.push({name:'Ainda não distribuído',percent:remaining/100,color:'#43536c'});
  const arcs=slices.filter(r=>r.percent>0).map(r=>{const arc=`<circle cx="110" cy="110" r="82" fill="none" stroke="${r.color}" stroke-width="38" pathLength="100" stroke-dasharray="${r.percent} ${100-r.percent}" stroke-dashoffset="${-offset}" transform="rotate(-90 110 110)" tabindex="0" role="img" aria-label="${esc(r.name)}: ${segmentPercent(r.percent)}%"><title>${esc(r.name)} · ${segmentPercent(r.percent)}%</title></circle>`;offset+=r.percent;return arc;}).join('');
  return `<section class="card strategy-chart-card" aria-label="Gráfico de distribuição">${sectionHead('Distribuição da capacidade')}<div class="strategy-pie-wrap"><svg class="strategy-pie" viewBox="0 0 220 220" aria-label="Gráfico em pizza: ${segmentPercent(total/100)}% distribuído e ${segmentPercent(remaining/100)}% disponível">${arcs}<text x="110" y="107" text-anchor="middle" class="strategy-pie-value">${capacity}</text><text x="110" y="127" text-anchor="middle" class="strategy-pie-caption">médicos / ciclo</text></svg></div><div class="strategy-pie-legend">${slices.map(r=>`<div><span class="strategy-swatch" style="--slice-color:${r.color}"></span><span>${esc(r.name)}</span><strong>${segmentPercent(r.percent)}%</strong></div>`).join('')}</div></section>`;
 }
 strategy=function(){
  const capacity=companyRules[0]?.monthlyCapacity??500,records=getSegments(),total=records.reduce((sum,r)=>sum+(segmentPoints(r.percent)||0),0),remaining=Math.max(0,10000-total);
  return heading('Distribuição comercial',`${capacity} novos médicos por ciclo · até ${subscription.maxSegments} segmentações no plano atual.`,`<button class="btn primary" data-edit="strategy">${icon('target')} Ajustar distribuição</button>`)+
   `<div class="grid three segment-overview"><section class="card"><small>Distribuído</small><div class="metric-value">${segmentPercent(total/100)}%</div></section><section class="card"><small>Disponível</small><div class="metric-value">${segmentPercent(remaining/100)}%</div></section><section class="card"><small>Segmentações do plano</small><div class="metric-value">${records.length} / ${subscription.maxSegments}</div></section></div><div class="strategy-layout mt">${strategyPie(records,total,remaining,capacity)}<section class="card" id="strategy-distribution">${sectionHead(total===10000?'Distribuição completa':'Distribuição em rascunho')}<p class="funnel-caption">${total===10000?'100% da capacidade distribuída.':`Ainda há ${segmentPercent(remaining/100)}% para distribuir.`} Dados demonstrativos, salvos neste navegador.</p>${records.map(r=>`<div class="segment-summary"><div class="metric-label"><button data-nav="segmento/${encodeURIComponent(r.name)}">${esc(r.name)} ↗</button><span>${segmentPercent(r.percent)}% · ${Math.round(Number(r.percent)*capacity/100)} médicos</span></div><div class="progress" style="--progress:${Number(r.percent)||0}%"><i></i></div></div>`).join('')||'<p>Nenhuma segmentação definida.</p>'}${records.length>subscription.maxSegments?notice('A distribuição excede o limite do plano atual. Edite as segmentações para adequá-la.'):''}</section></div>`;
 };
 function segmentRow(record={id:uid(),name:'',percent:''}){
  return `<div class="segment-row" data-segment-id="${esc(record.id||uid())}"><label>Segmentação<input name="segment-name" maxlength="120" placeholder="Adicionar segmentação" value="${esc(record.name)}"></label><label>Percentual (%)<input name="segment-percent" type="number" min="0.01" max="100" step="0.01" inputmode="decimal" placeholder="0" value="${esc(record.percent)}"></label><button class="icon-button" type="button" data-remove-segment aria-label="Remover segmentação">×</button></div>`;
 }
 function segmentRows(form){return [...form.querySelectorAll('.segment-row')].map(el=>({el,id:el.dataset.segmentId,name:el.querySelector('[name=segment-name]').value.trim(),raw:el.querySelector('[name=segment-percent]').value}));}
 function updateSegmentEditor(){
  const form=document.getElementById('distribution-form');if(!form)return;
  const rows=segmentRows(form),filled=rows.filter(r=>r.name||r.raw),empty=rows.filter(r=>!r.name&&!r.raw),total=filled.reduce((n,r)=>n+(segmentPoints(r.raw)||0),0),room=total<10000&&filled.length<subscription.maxSegments;
  if(room){if(!empty.length)form.querySelector('#segment-rows').insertAdjacentHTML('beforeend',segmentRow());else empty.slice(1).forEach(r=>r.el.remove());}
  else empty.forEach(r=>r.el.remove());
  document.getElementById('segment-total').textContent=segmentPercent(total/100)+'%';
  document.getElementById('segment-remaining').textContent=segmentPercent(Math.max(0,10000-total)/100)+'%';
  document.getElementById('segment-count').textContent=filled.length+' / '+subscription.maxSegments;
  document.getElementById('segment-open-note').textContent=total>10000?'A distribuição ultrapassa 100%. Reduza os percentuais.':total===10000?'100% distribuído. Para adicionar uma segmentação, libere percentual em uma existente.':filled.length>=subscription.maxSegments?`Limite de ${subscription.maxSegments} segmentações atingido. Distribua o percentual restante entre as existentes ou remova uma delas.`:'A linha em aberto permanece disponível enquanto houver percentual e vagas no plano.';
  document.getElementById('distribution-error').textContent=total>10000?'A soma não pode ultrapassar 100%.':'';
 }
 function openSegmentEditor(){
  if(state.role!=='gestor')return toast('Ação fora do escopo.');
  const d=closeDialog();
  d.innerHTML=`<form id="distribution-form"><div class="dialog-top"><strong>Ajustar distribuição</strong><button class="icon-button" type="button" data-close-editor aria-label="Fechar">×</button></div><p class="segment-plan-note">Plano atual: até ${subscription.maxSegments} segmentações. Você pode salvar uma distribuição parcial como rascunho.</p><div class="segment-editor-totals" aria-live="polite"><span>Distribuído<strong id="segment-total"></strong></span><span>Restante<strong id="segment-remaining"></strong></span><span>Segmentações<strong id="segment-count"></strong></span></div><div id="segment-rows">${getSegments().map(segmentRow).join('')}</div><p id="segment-open-note" class="segment-plan-note"></p><p id="distribution-error" role="alert"></p><div class="actions"><button class="btn primary" type="submit">Salvar distribuição</button><button class="btn" type="button" data-close-editor>Cancelar</button></div></form>`;
  updateSegmentEditor();d.showModal();
 }
 document.addEventListener('input',e=>{if(e.target.closest('#distribution-form'))updateSegmentEditor();});
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-remove-segment]');if(!button)return;
  const form=button.closest('form');button.closest('.segment-row').remove();updateSegmentEditor();form.querySelector('.segment-row:last-child input')?.focus();
 });
 document.addEventListener('submit',e=>{
  if(e.target.id!=='distribution-form')return;e.preventDefault();e.stopImmediatePropagation();if(state.role!=='gestor')return;
  const rows=segmentRows(e.target).filter(r=>r.name||r.raw),error=message=>document.getElementById('distribution-error').textContent=message;
  if(rows.length>subscription.maxSegments)return error(`O plano permite no máximo ${subscription.maxSegments} segmentações.`);
  if(rows.some(r=>!r.name||segmentPoints(r.raw)===null))return error('Preencha nome e percentual entre 0,01% e 100%, com até duas casas decimais, ou remova a linha incompleta.');
  const names=rows.map(r=>r.name.replace(/\s+/g,' ').normalize('NFC').toLocaleLowerCase('pt-BR'));
  if(new Set(names).size!==names.length)return error('Use nomes diferentes para cada segmentação.');
  const total=rows.reduce((sum,r)=>sum+segmentPoints(r.raw),0);if(total>10000)return error('A soma não pode ultrapassar 100%.');
  saved.segments=rows.map(r=>({id:r.id,name:r.name,percent:segmentPoints(r.raw)/100}));saved.distribution=saved.segments.map(r=>r.percent);
  const persisted=store();closeDialog();render();toast(persisted?(total===10000?'Distribuição completa salva neste navegador.':'Rascunho salvo. Há percentual disponível para distribuir.'):'Alteração temporária: armazenamento indisponível.');
 },true);
 const personalManagement=management;
 window.MinervaWorkspaceName=()=>companyProfile[0]?.name||'Minha empresa';
 management=function(){
  if(state.role!=='gestor'||['gestao/perfil','gestao/preferencias'].includes(state.route))return personalManagement();
  if(state.route==='gestao/equipe')return teamCollection();
  const company=companyProfile[0],rules=companyRules[0];
  const configCard=(title,description,buttons)=>`<section class="card config-card"><h2>${title}</h2><p>${description}</p><div class="actions">${buttons}</div></section>`;
  return heading('Configurações da empresa','Cadastros, regras e conteúdo editáveis em um só lugar.')+`<div class="settings-banner"><span>${esc(company.name)}</span><small>Alterações desta versão são salvas neste navegador.</small></div><div class="grid two config-grid">`+
   configCard('Empresa','Identidade, contatos, endereço, site e links do rodapé.',action('companyProfile','company','Editar dados da empresa')+action('footerLinks','','Editar links do rodapé'))+
   configCard('Comercial e atendimento',`Capacidade mensal: ${esc(rules.monthlyCapacity)} médicos. Limite do plano: ${subscription.maxSegments} segmentações. Responsável padrão e orientações da operação.`,action('companyRules','rules','Editar regras')+btn('Distribuição e segmentos','estrategia')+action('campaigns','','Gerenciar campanhas'))+
   configCard('Equipe e responsabilidades','Cadastro de colaboradores, função e responsáveis pelas carteiras e pedidos.',btn('Ver equipe','gestao/equipe')+'<button class="btn" data-new-employee>Novo colaborador</button>'+action('people','','Gerenciar pessoas'))+
   configCard('Catálogo e estoque','Produtos, apresentações, preços e saldos demonstrativos.',action('products','','Editar produtos')+btn('Ver estoque','estoque'))+
   configCard('Pedidos e agenda','Responsáveis, estados operacionais, rastreio e atividades agendadas.',action('orders','','Gerenciar pedidos')+action('appointments','','Gerenciar agenda')+btn('Rotas e aceites','visitas'))+
   configCard('Cérebro e materiais','Identidade, manuais e documentos de referência da empresa.',action('documents','','Editar documentos')+btn('Abrir Cérebro','cerebro'))+
   configCard('Preferências pessoais','Idioma da interface e acessibilidade do usuário.',btn('Minhas preferências','gestao/preferencias'))+
   configCard('Conexões e acesso','Canais, login e permissões reais ainda não estão conectados. Não é possível ativá-los nesta demonstração.','<span class="pill gray">Integração pendente</span>')+'</div>';
 };
 document.addEventListener('click',e=>{
  if(!e.target.closest('[data-new-employee]'))return;if(state.role!=='gestor')return;
  edit('people','');const form=document.getElementById('crud-form');form.elements.type.value='Colaborador';form.elements.employeeRole.value='Representante';form.elements.specialty.value='Representante';form.elements.owner.value='Gestão da empresa';form.elements.stage.value='Ativo na demo';
 });
 function allowed(name,r){
  if(['experiments','hypotheses','standards'].includes(name))return false;
  if(state.role==='gestor')return true;
  if(name==='tasks')return !r||r.owner===currentProfile().initials;
  if((name==='appointments'||name==='routes')&&state.role==='representante')return !r||r.owner===currentProfile().name;
  return false;
 }
 function visible(name){return collections[name].filter(r=>allowed(name,r));}
 const action=(name,id='',text='Gerenciar registros')=>`<button class="btn" data-crud="${name}" data-record="${esc(id)}">${esc(text)}</button>`;
 render=function(){
  sync();originalRender();renderFooter();
  if(document.getElementById('indicator-detail')){if(state.role!=='gestor')closeDetail(false);else showDetail(activeMetric,false);}
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
  footerLinks:[['title','Nome do link'],['icon','Ícone',[['site','Site'],['instagram','Instagram'],['linkedin','LinkedIn'],['whatsapp','WhatsApp'],['email','E-mail'],['telefone','Telefone'],['github','GitHub'],['suporte','Suporte'],['documento','Documento'],['apresentacao','Apresentação'],['link','Link']]],['url','Endereço do link (opcional)']],
  companyProfile:[['name','Nome da empresa'],['legalName','Razão social'],['companyId','CNPJ'],['email','E-mail','email'],['phone','Telefone'],['city','Cidade'],['address','Endereço'],['website','Site'],['timezone','Fuso horário',['America/Sao_Paulo','America/Manaus','America/Recife','America/Fortaleza','America/Belem','America/Rio_Branco']]],
  companyRules:[['title','Nome das regras'],['monthlyCapacity','Capacidade mensal de aquisição','number'],['defaultOwner','Responsável comercial padrão'],['visitHours','Horário para visitas'],['orderInstructions','Orientações para pedidos','textarea'],['supportInstructions','Orientações de atendimento','textarea']],
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
  if(name==='companyProfile')return edit(name,'company');
  if(name==='companyRules')return edit(name,'rules');
  const d=closeDialog();
  d.innerHTML=`<div class="dialog-top"><strong>${labels[name]}</strong><button class="icon-button" data-close-editor aria-label="Fechar">×</button></div><p>Registros de demonstração salvos neste navegador.</p><button class="btn primary" data-crud-new="${name}">Novo registro</button><div class="crud-records">${visible(name).map(r=>`<div class="list-row"><span class="grow"><strong>${esc(r.name||r.title||'#'+r.id)}</strong><small>${esc(r.stage||r.status||r.description||r.presentation||r.url||'')}</small></span>${action(name,r.id,'Editar')}<button class="btn" data-crud-delete="${name}" data-record="${esc(r.id)}">Excluir</button></div>`).join('')||'<p class="mt">Nenhum registro.</p>'}</div>`;d.showModal();
 }
 function defaults(name){
  return {footerLinks:{icon:'link'},people:{type:'Médico',specialty:'Não informado',city:'Não informada',stage:'Cadastro demonstrativo',owner:companyRules[0]?.defaultOwner||'Não atribuído',color:'#445f83',milestones:[]},campaigns:{topic:'Público não definido',status:'Planejada',leads:0,talks:0,meetings:0,color:'#335e9c',icon:'campaign'},tasks:{stage:'A fazer',owner:currentProfile().initials},orders:{payment:'Aguardando',status:'Aguardando pagamento',tracking:'',assignee:'Diego Souza',price:'R$ 0,00'},products:{qty:0,price:'R$ 0,00'},documents:{version:'Rascunho'},appointments:{kind:state.route.startsWith('visitas')?'Visita':'Reunião',status:'Planejada',owner:currentProfile().name,date:'',result:''}}[name];
 }
 function input(name,field,record){
  const [k,label,type]=field,value=record[k]??'',required=!(name==='footerLinks'&&k==='url')&&!(name==='companyProfile'&&!['name','timezone'].includes(k))&&!(name==='companyRules'&&!['title','monthlyCapacity'].includes(k))&&!['tracking','result','employeeRole','description','region','notes','evidence','since'].includes(k);
  let options=Array.isArray(type)?type:null;
  if(type==='person'||type==='contact')options=(type==='person'?allPeople.filter(p=>p.type==='Paciente'):people.filter(p=>p.type!=='Colaborador')).map(p=>[p.id,p.name]);
  if(type==='product')options=products.map(p=>[p.name,p.name]);
  if(name==='appointments'&&k==='owner'&&state.role!=='gestor')options=[currentProfile().name];
  if(name==='tasks'&&k==='owner'&&state.role!=='gestor')options=[currentProfile().initials];
  let control;
  if(options)control=`<select name="${k}" ${required?'required':''}>${options.map(o=>{const [v,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${v===value?'selected':''}>${esc(t)}</option>`}).join('')}</select>`;
  else if(type==='textarea')control=`<textarea name="${k}" rows="5" maxlength="20000" ${required?'required':''}>${esc(value)}</textarea>`;
  else control=`<input name="${k}" type="${type==='number'?'number':type==='datetime-local'?'datetime-local':type==='email'?'email':'text'}" ${type==='number'?'min="0" step="1"':''} maxlength="300" value="${esc(value)}" ${required?'required':''}>`;
  return `<label>${label}${control}</label>`;
 }
 function edit(name,id){
  const found=collections[name].find(r=>r.id===id);if(!allowed(name,found))return toast('Registro fora do escopo.');
  const r=found||defaults(name),d=closeDialog();
  d.innerHTML=`<form id="crud-form" data-collection="${name}" data-record="${esc(id||'')}"><div class="dialog-top"><strong>${found?'Editar':'Criar'} · ${labels[name]}</strong><button type="button" class="icon-button" data-close-editor aria-label="Fechar">×</button></div><p>Dados fictícios · salvos apenas neste navegador.</p>${fields[name].map(f=>input(name,f,r)).join('')}<p id="crud-error" role="alert"></p><div class="actions"><button class="btn primary" type="submit">Salvar registro</button><button class="btn" type="button" ${['companyProfile','companyRules'].includes(name)?'data-close-editor':`data-crud="${name}"`}>Cancelar</button>${found&&!['companyProfile','companyRules'].includes(name)?`<button class="btn" type="button" data-crud-delete="${name}" data-record="${esc(id)}">Excluir</button>`:''}</div></form>`;d.showModal();
 }
 function dependency(name,r){
  if(['companyProfile','companyRules'].includes(name))return 'A configuração principal pode ser editada, mas não excluída.';
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
  if(b.dataset.edit==='strategy'){e.preventDefault();e.stopImmediatePropagation();openSegmentEditor();return;}
  if(b.dataset.task!==undefined||legacy[b.dataset.edit]){
   e.preventDefault();e.stopImmediatePropagation();
   name=b.dataset.task!==undefined?'tasks':legacy[b.dataset.edit];
   const id=b.dataset.task!==undefined?tasks[Number(b.dataset.task)]?.id:b.dataset.edit==='campaign-edit'?state.route.split('/')[1]:'';
   edit(name,id);
  }
 },true);
 document.addEventListener('submit',e=>{

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
  if(name==='footerLinks'&&values.url&&!safeFooterUrl(values.url))return fail('Informe um endereço HTTP/HTTPS, e-mail (mailto:), telefone (tel:) ou página interna (#).');
  const r={...(existing||defaults(name)),...values,id:id||uid()};
  if(name==='products')r.qty=Number(r.qty);
  if(name==='companyRules'){if(!Number.isSafeInteger(Number(r.monthlyCapacity))||Number(r.monthlyCapacity)<0)return fail('Informe uma capacidade inteira igual ou maior que zero.');r.monthlyCapacity=Number(r.monthlyCapacity);}
  if(name==='people'){
   if(r.type==='Colaborador')r.specialty=r.employeeRole;
   r.initials=r.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
   if(existing?.type==='Paciente'&&r.type!=='Paciente'&&allOrders.some(o=>o.person===r.id))return fail('Pessoa vinculada a pedidos precisa continuar como paciente.');
   if(existing&&existing.name!==r.name){allPeople.forEach(p=>{if(p.owner===existing.name)p.owner=r.name;});allOrders.forEach(o=>{if(o.assignee===existing.name)o.assignee=r.name;});appointments.forEach(a=>{if(a.owner===existing.name)a.owner=r.name;});tasks.forEach(t=>{if(existing.type==='Colaborador'&&t.owner===existing.initials)t.owner=r.initials;});}
  }
  if(name==='products'&&existing&&existing.name!==r.name)allOrders.forEach(o=>{if(o.product===existing.name)o.product=r.name;});
  existing?Object.assign(existing,r):arr.push(r);
  const persisted=store();closeDialog();render();toast(persisted?'Registro salvo neste navegador.':'Alteração temporária: não foi possível persistir.');
 },true);
 // Preserve a previous strategy selection without letting task saves erase it.
 try{const stored=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(stored?.distribution))saved.distribution=stored.distribution;if(Array.isArray(stored?.segments))saved.segments=stored.segments;}catch{}
 sync();render();
})();
