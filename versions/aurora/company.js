'use strict';

// Explicit fictional milestones: conversions use reached milestones, never current card position.
const medicalStages = [
  ['identified', 'Identificados'], ['qualified', 'Qualificados'],
  ['approached', 'Abordados'], ['profile', 'Dados confirmados'],
  ['proposal', 'Proposta apresentada'], ['accepted', 'Parceria aceita'],
  ['onboarded', 'Onboarding concluído'], ['active', 'Parceria ativa'],
  ['referred', 'Encaminharam pacientes']
];
const patientStages = [
  ['referred', 'Encaminhados'], ['welcomed', 'Acolhidos'],
  ['prescription', 'Receita recebida'], ['documents', 'Documentação recebida'],
  ['ordered', 'Pedido criado'], ['paid', 'Pagamento confirmado'],
  ['prepared', 'Pedido preparado'], ['shipped', 'Pedido despachado'],
  ['delivered', 'Entrega confirmada'], ['followup', 'Acompanhamento iniciado']
];
const employeeSeeds = [
  {id:'equipe-alex', name:'Alex Costa', initials:'AC', role:'Gestor'},
  {id:'equipe-ana', name:'Ana Silva', initials:'AS', role:'Representante'},
  {id:'equipe-bruno', name:'Bruno Costa', initials:'BC', role:'Representante'},
  {id:'equipe-diego', name:'Diego Souza', initials:'DS', role:'Despachante'},
  {id:'equipe-camila', name:'Camila Rocha', initials:'CR', role:'Despachante'}
];
const relationshipActivities = [
  {id:'a1', person:'marina', owner:'Ana Silva', kind:'Reunião', status:'Realizada', summary:'Apresentação da parceria'},
  {id:'a2', person:'juliana', owner:'Ana Silva', kind:'Reunião', status:'Agendada', summary:'Apresentação e dúvidas da parceria'},
  {id:'a3', person:'marina', owner:'Ana Silva', kind:'Visita', status:'Realizada', summary:'Continuidade do relacionamento'},
  {id:'a4', person:'juliana', owner:'Ana Silva', kind:'Visita', status:'Planejada', summary:'Entrega de materiais institucionais'},
  {id:'a5', person:'rafael', owner:'Bruno Costa', kind:'Reunião', status:'Realizada', summary:'Conversa de apresentação'},
  {id:'a6', person:'carlos', owner:'Bruno Costa', kind:'Visita', status:'Planejada', summary:'Conhecer o contexto profissional'}
];

function initializeCompanyDemo() {
  const medicalReached={marina:9,juliana:5,rafael:3,carlos:2};
  allPeople.forEach(person => {
    if(person.type==='Médico') {
      person.campaignId=['marina','juliana'].includes(person.id)?'ansiedade':'neurologia';
      person.milestones=medicalStages.slice(0,medicalReached[person.id]||0).map(([key])=>key);
    } else if(person.type==='Paciente') {
      person.campaignId=person.id==='ana'?'ansiedade':'neurologia';
      person.milestones=patientStages.slice(0,person.id==='ana'?10:5).map(([key])=>key);
    }
  });
  allOrders.find(o=>o.id==='1042').assignee='Camila Rocha';
  allOrders.push({id:'1040',person:'ana',product:'Óleo CBD 5% · 30 ml',price:'R$ 389,00',payment:'Confirmado',status:'Entregue',tracking:'DEMO000000040BR',assignee:'Diego Souza'});
  allOrders.forEach(order=>{
    order.amount=Number(order.price.replace(/[^0-9,]/g,'').replace(',','.'));
    order.prepared=['Em preparação','Enviado','Entregue'].includes(order.status);
    order.shipped=['Enviado','Entregue'].includes(order.status);
    order.delivered=order.status==='Entregue';
  });
  employeeSeeds.forEach(employee=>allPeople.push({...employee,type:'Colaborador',employeeRole:employee.role,specialty:employee.role,city:'Brasil · equipe demonstrativa',stage:'Ativo na demo',owner:'Gestão da empresa'}));
  // Campaign cards and campaign details use the same records as the company dashboard.
  campaigns.forEach(campaign=>{
    const doctors=allPeople.filter(p=>p.type==='Médico'&&p.campaignId===campaign.id);
    campaign.leads=doctors.length;
    campaign.talks=doctors.filter(p=>p.milestones.includes('approached')).length;
    campaign.meetings=relationshipActivities.filter(a=>a.kind==='Reunião'&&doctors.some(p=>p.id===a.person)).length;
  });
}
function reachedCount(records,key){return records.filter(record=>record.milestones?.includes(key)).length;}
function rateValue(numerator,denominator){return denominator>0?numerator/denominator*100:null;}
function formatRate(value){return value===null?'—':`${value.toLocaleString('pt-BR',{maximumFractionDigits:1})}%`;}
function money(value){return value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function companyScope(campaignId=state.analyticsCampaign||'all') {
  const matches=p=>campaignId==='all'||p.campaignId===campaignId;
  const doctors=allPeople.filter(p=>p.type==='Médico'&&matches(p));
  const patients=allPeople.filter(p=>p.type==='Paciente'&&matches(p));
  const scopeOrders=allOrders.filter(o=>patients.some(p=>p.id===o.person));
  return {doctors,patients,orders:scopeOrders};
}
function funnelRows(records,stages) {
  return stages.map(([key,label],index)=>{
    const count=reachedCount(records,key);
    const previous=index?reachedCount(records,stages[index-1][0]):null;
    return {key,label,count,previous,rate:previous===null?null:rateValue(count,previous),totalRate:rateValue(count,records.length)};
  });
}
function companyMetric(label,value,description,ic='chart',route='') {
  const tag=route?'button':'div';
  return `<${tag} class="card company-kpi" ${route?`data-nav="${route}"`:''}><div class="metric-label">${label}${icon(ic)}</div><div class="metric-value">${value}</div><small>${description}</small></${tag}>`;
}
function funnelCard(kind,records,stages,employeeId='') {
  const title=kind==='medicos'?'Funil de médicos':'Funil de pacientes';
  const rows=funnelRows(records,stages);
  return `<section class="card company-funnel">${sectionHead(title)}<p class="funnel-caption">${records.length} ${kind==='medicos'?'médicos':'pacientes'} únicos na coorte · marcos alcançados</p><div class="funnel-column-labels"><span>Etapa / pessoas</span><span>Conversão¹</span></div>${rows.map((row,index)=>`<button class="funnel-stage" data-nav="funil-${kind}/${row.key}${employeeId?`/${employeeId}`:''}" data-stage="${row.key}" data-count="${row.count}" data-denominator="${row.previous??''}"><div class="funnel-stage-top"><span><i>${String(index+1).padStart(2,'0')}</i>${row.label}</span><strong>${row.count}</strong><span class="funnel-rate" title="${index?(row.previous?`${row.count} ÷ ${row.previous} da etapa anterior`:'Sem base na etapa anterior'):'Entrada da coorte'}">${index?formatRate(row.rate):'Entrada'}</span></div><div class="funnel-track"><span style="width:${row.totalRate||0}%"></span></div></button>`).join('')}<p class="funnel-footnote">¹ Pessoas que alcançaram a etapa ÷ pessoas da etapa anterior, na mesma coorte. Uma pessoa pode ter vários pedidos. Clique para ver a população.</p></section>`;
}
function campaignResultsTable() {
  const selected=state.analyticsCampaign||'all';
  const list=campaigns.filter(c=>selected==='all'||c.id===selected);
  return `<section class="card mt">${sectionHead('Campanhas e origens','Explorar campanhas','campanhas')}<p class="funnel-caption">Mesma atribuição de origem dos funis. Encaminhamento não comprova causalidade da campanha.</p><div class="table-wrap"><table class="campaign-performance"><thead><tr><th>Campanha</th><th>Médicos</th><th>Abordados</th><th>Parcerias</th><th>Conversão²</th><th>Pacientes</th><th>Pedidos</th><th>Recebido</th></tr></thead><tbody>${list.map(c=>{
    const scoped=companyScope(c.id);const accepted=reachedCount(scoped.doctors,'accepted');const paid=scoped.orders.filter(o=>o.payment==='Confirmado').reduce((sum,o)=>sum+o.amount,0);
    return `<tr data-campaign-result="${c.id}"><td><button class="table-link" data-nav="campanhas/${c.id}"><strong>${esc(c.name)}</strong><br><small>${esc(c.topic)}</small></button></td><td>${scoped.doctors.length}</td><td>${reachedCount(scoped.doctors,'approached')}</td><td>${accepted}</td><td>${formatRate(rateValue(accepted,scoped.doctors.length))}</td><td>${scoped.patients.length}</td><td>${scoped.orders.length}</td><td>${money(paid)}</td></tr>`;
  }).join('')}</tbody></table></div><p class="funnel-footnote">² Parcerias aceitas ÷ médicos identificados da campanha. Valores fictícios. Investimento, CAC, margem e ROI aguardam dados de custos; não foram estimados.</p></section>`;
}
function representativeStats(employee) {
  const doctors=allPeople.filter(p=>p.type==='Médico'&&p.owner===employee.name);
  const activities=relationshipActivities.filter(a=>a.owner===employee.name);
  const accepted=reachedCount(doctors,'accepted');
  return {doctors,activities,accepted,conversion:rateValue(accepted,doctors.length),meetings:activities.filter(a=>a.kind==='Reunião'&&a.status==='Realizada').length,visits:activities.filter(a=>a.kind==='Visita'&&a.status==='Realizada').length};
}
function dispatcherStats(employee) {
  const scopeOrders=allOrders.filter(o=>o.assignee===employee.name);
  return {orders:scopeOrders,pending:scopeOrders.filter(o=>o.payment==='Aguardando').length,preparing:scopeOrders.filter(o=>o.status==='Em preparação').length,shipped:scopeOrders.filter(o=>o.shipped).length,delivered:scopeOrders.filter(o=>o.delivered).length};
}
function teamPerformance() {
  return `<section class="card mt">${sectionHead('Equipe e desempenho','Ver equipe','gestao/equipe')}<div class="team-performance-grid">${employeeSeeds.filter(e=>e.role!=='Gestor').map(employee=>{
    const rep=employee.role==='Representante';const metrics=rep?representativeStats(employee):dispatcherStats(employee);
    return `<button class="team-performance-card" data-nav="pessoas/${employee.id}"><div class="person-card-summary">${avatar(employee)}<div><h3>${esc(employee.name)}</h3><small>${employee.role}</small></div></div><div class="team-mini-metrics">${rep?`<span><strong>${metrics.doctors.length}</strong>médicos na carteira</span><span><strong>${formatRate(metrics.conversion)}</strong>parcerias / carteira</span><span><strong>${metrics.meetings}</strong>reuniões realizadas</span>`:`<span><strong>${metrics.orders.length}</strong>pedidos atribuídos</span><span><strong>${metrics.shipped}</strong>despachados</span><span><strong>${metrics.delivered}</strong>entregues</span>`}</div><span class="page-link">Abrir ficha do colaborador ${icon('arrow')}</span></button>`;
  }).join('')}</div><p class="funnel-footnote">Visão global da equipe no ciclo demonstrativo. O filtro de campanha atua nos funis e resultados comerciais; não altera a atribuição dos colaboradores.</p></section>`;
}
function companyDashboard() {
  const scoped=companyScope();
  const accepted=reachedCount(scoped.doctors,'accepted');
  const confirmed=scoped.orders.filter(o=>o.payment==='Confirmado');
  const paid=confirmed.reduce((sum,o)=>sum+o.amount,0);
  return heading('Indicadores','Toda a empresa em uma visão: aquisição, relacionamentos, pacientes e operação.',btn('Equipe e desempenho','gestao/equipe',false,'people'))+
    `<div class="company-toolbar card"><div><span class="pill">Novembro · coorte demonstrativa</span><p class="funnel-caption">Registros fictícios relacionados entre pessoas, campanhas e pedidos.</p></div><label>Campanha de origem<select id="analytics-campaign" aria-label="Campanha dos indicadores"><option value="all">Todas as campanhas</option>${campaigns.map(c=>`<option value="${c.id}" ${(state.analyticsCampaign||'all')===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label></div>`+
    `<div class="grid four mt">${companyMetric('Médicos identificados',scoped.doctors.length,'Coorte selecionada','people','funil-medicos/identified')}${companyMetric('Parcerias aceitas',accepted,`${formatRate(rateValue(accepted,scoped.doctors.length))} dos médicos identificados`,'link','funil-medicos/accepted')}${companyMetric('Pacientes acolhidos',reachedCount(scoped.patients,'welcomed'),'Pessoas únicas, não número de pedidos','chat','funil-pacientes/welcomed')}${companyMetric('Recebido na operação',money(paid),`${confirmed.length} pedidos com pagamento confirmado · demo`,'box','pedidos')}</div>`+
    `<div class="grid two company-funnels mt">${funnelCard('medicos',scoped.doctors,medicalStages)}${funnelCard('pacientes',scoped.patients,patientStages)}</div>`+
    `<section class="card mt">${sectionHead('Encontros humanos e caminhos condicionais')}<div class="grid three"><div><h3>Reuniões e visitas</h3><p class="funnel-caption">Apoiam a parceria quando fazem sentido. Não são passos obrigatórios entre proposta e aceite.</p><div class="actions">${pill(`${relationshipActivities.filter(a=>scoped.doctors.some(p=>p.id===a.person)&&a.kind==='Reunião'&&a.status==='Realizada').length} reuniões realizadas`)}${pill(`${relationshipActivities.filter(a=>scoped.doctors.some(p=>p.id===a.person)&&a.kind==='Visita'&&a.status==='Realizada').length} visitas realizadas`)}</div></div><div><h3>Consulta médica</h3><p class="funnel-caption">Caminho para quem precisa de avaliação. Os exemplos desta coorte chegaram com receita; a consulta não é pré-requisito universal.</p></div><div><h3>Requisitos regulatórios</h3><p class="funnel-caption">Aplicabilidade e autorização exigem regra e fonte próprias. Receber um documento não confirma sua validade ou autorização.</p></div></div></section>`+
    campaignResultsTable()+
    `<section class="card mt">${sectionHead('Pedidos, pagamento e logística','Abrir operação','pedidos')}<div class="grid four">${[['Pedidos do período',scoped.orders.length],['Aguardando pagamento',scoped.orders.filter(o=>o.payment==='Aguardando').length],['Em preparação',scoped.orders.filter(o=>o.status==='Em preparação').length],['Entregas confirmadas',scoped.orders.filter(o=>o.delivered).length]].map(([label,value])=>`<div><small>${label}</small><div class="metric-value">${value}</div></div>`).join('')}</div><p class="funnel-footnote">Pedidos são registros distintos; o funil de pacientes conta cada pessoa uma vez por marco. Recebido não significa lucro. Estoque não é baixado por estes indicadores.</p></section>`+teamPerformance();
}
function funnelPopulation(kind,key) {
  const stages=kind==='medicos'?medicalStages:patientStages;
  const stage=stages.find(([value])=>value===key);if(!stage)return notFound();
  const employeeId=state.route.split('/')[2];const employee=employeeSeeds.find(e=>e.id===employeeId);
  const scoped=companyScope(employee?'all':undefined);const records=(kind==='medicos'?scoped.doctors:scoped.patients).filter(p=>(!employee||p.owner===employee.name)&&p.milestones?.includes(key));
  return heading(stage[1],`${records.length} ${kind==='medicos'?'médicos':'pacientes'} que alcançaram o marco · coorte demonstrativa`)+
    `<button class="back" data-nav="indicadores">${icon('back')} Voltar aos indicadores</button><div class="notice">Esta população representa marcos alcançados, não apenas a etapa atual. ${employee?`Carteira: ${esc(employee.name)}.`:`Campanha: ${esc(campaigns.find(c=>c.id===state.analyticsCampaign)?.name||'Todas')}.`}</div><div class="grid three">${records.map(p=>`<article class="card person-preview-card">${personSummary(p)}<div class="mt">${btn('Abrir ficha',`pessoas/${p.id}`)}</div></article>`).join('')}</div>${records.length?'':'<div class="empty">Nenhuma pessoa alcançou este marco na coorte selecionada.</div>'}`;
}
function teamCollection() {
  return heading('Equipe','Representantes e despachantes com contexto e indicadores próprios.')+
    `<button class="back" data-nav="gestao">${icon('back')} Gestão</button><div class="grid three">${employeeSeeds.map(employee=>`<article class="card person-preview-card"><div class="person-card-summary">${avatar(employee)}<div><h2>${esc(employee.name)}</h2><small>${employee.role}</small></div></div>${pill('Ativo na demo','green')}<div class="mt">${btn('Abrir ficha e indicadores',`pessoas/${employee.id}`)}</div></article>`).join('')}</div>`;
}
function collaboratorDetail(id) {
  const employee=employeeSeeds.find(e=>e.id===id);if(!employee)return notFound();
  const rep=employee.role==='Representante';const dispatch=employee.role==='Despachante';
  const stats=rep?representativeStats(employee):dispatch?dispatcherStats(employee):null;
  const metrics=rep?[
    ['Médicos na carteira',stats.doctors.length,'Registros atribuídos','people'],
    ['Parcerias aceitas',stats.accepted,`${formatRate(stats.conversion)} da carteira identificada`,'link'],
    ['Reuniões realizadas',stats.meetings,'Atividades com resultado registrado','calendar'],
    ['Visitas realizadas',stats.visits,'Atividades com resultado registrado','pin']
  ]:dispatch?[
    ['Pedidos atribuídos',stats.orders.length,'Escopo operacional','box'],
    ['Em preparação',stats.preparing,'Situação atual dos pedidos','layers'],
    ['Despachados',stats.shipped,'Inclui os que já foram entregues','pin'],
    ['Entregues',stats.delivered,`${formatRate(rateValue(stats.delivered,stats.shipped))} dos despachados`,'check']
  ]:[];
  return heading('Ficha do colaborador',`${employee.role} · visão de acompanhamento do gestor`)+
    `<button class="back" data-nav="gestao/equipe">${icon('back')} Equipe</button><section class="card"><div class="detail-top">${avatar(employee)}<div><h2>${esc(employee.name)}</h2><p class="subtitle">${employee.role} · ativo na demonstração</p></div></div><div class="detail-grid"><div><small>Responsabilidade</small><strong>${rep?'Reuniões, visitas, suporte e relacionamento':dispatch?'Pagamento, preparação, envio e estoque':'Estratégia, equipe, análise e aprimoramento'}</strong></div><div><small>Escopo</small><strong>${rep?'Carteira atribuída':dispatch?'Pedidos e operação atribuídos':'Toda a operação empresarial'}</strong></div><div><small>Período dos indicadores</small><strong>Ciclo demonstrativo · novembro</strong></div></div></section>`+
    (metrics.length?`<div class="grid four mt">${metrics.map(([label,value,description,i])=>companyMetric(label,value,description,i)).join('')}</div>`:'')+
    (rep?`<div class="grid two mt">${funnelCard('medicos',stats.doctors,medicalStages,employee.id)}<section class="card">${sectionHead('Agenda e atividades do representante')}${stats.activities.map(activity=>`<div class="list-row"><span class="tiny-icon">${icon(activity.kind==='Reunião'?'calendar':'pin')}</span><span class="grow"><strong>${activity.kind} · ${esc(allPeople.find(p=>p.id===activity.person)?.name||'Pessoa')}</strong><small>${esc(activity.summary)}</small></span>${pill(activity.status)}</div>`).join('')}</section></div><section class="card mt">${sectionHead('Carteira atribuída')}${stats.doctors.map(person=>`<button class="list-row" data-nav="pessoas/${person.id}">${avatar(person)}<span class="grow"><strong>${esc(person.name)}</strong><small>${esc(person.specialty)} · ${esc(person.stage)}</small></span>${icon('arrow')}</button>`).join('')}</section>`:dispatch?`<section class="card mt">${sectionHead('Fila de pedidos atribuídos')}<div class="table-wrap"><table><thead><tr><th>Pedido</th><th>Paciente</th><th>Pagamento</th><th>Operação</th></tr></thead><tbody>${stats.orders.map(order=>`<tr><td><button class="table-link" data-nav="pedidos/${order.id}">#${order.id}</button></td><td><button class="table-link" data-nav="pessoas/${order.person}">${esc(allPeople.find(p=>p.id===order.person)?.name||'Pessoa')}</button></td><td>${pill(order.payment)}</td><td>${pill(order.status)}</td></tr>`).join('')}</tbody></table></div><p class="funnel-footnote">${stats.pending} pedidos aguardando pagamento. Entregas no prazo, tempo médio e movimentações de estoque dependem de eventos e datas ainda não integrados.</p></section>`:`<section class="card mt"><p>O desempenho empresarial é acompanhado no painel completo.</p>${btn('Ver indicadores da empresa','indicadores')}</section>`)+
    `<section class="card mt">${sectionHead('Tarefas atribuídas')}${tasks.filter(task=>task.owner===employee.initials).map(task=>`<div class="list-row"><span class="grow"><strong>${esc(task.title)}</strong><small>Trabalho da equipe, separado da jornada das pessoas</small></span>${pill(task.stage)}</div>`).join('')||'<p class="funnel-caption">Nenhuma tarefa atribuída na demonstração.</p>'}</section>`;
}

// Analytics state changes do not alter access, business events or person stages.
document.addEventListener('change',event=>{
  if(event.target.id==='analytics-campaign'){
    state.analyticsCampaign=event.target.value;
    render();
  }
});
