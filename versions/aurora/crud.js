'use strict';
// Fictional workspace records. Persistence is restricted to this browser/origin.
(() => {
 const key='minerva-aurora-crud-v1';
 const documents=brain.map(([id,ic,title,description,version])=>({id,title,description,version,content:''}));
 const appointments=relationshipActivities.map(a=>({...a,title:a.summary,date:'2026-11-03T09:00',result:''}));
 const collections={people:allPeople,campaigns,tasks,orders:allOrders,products,documents,appointments};
 const labels={people:'Pessoas',campaigns:'Campanhas',tasks:'Tarefas',orders:'Pedidos',products:'Produtos',documents:'Documentos',appointments:'Agenda'};
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
 function allowed(name,r){
  if(state.role==='gestor')return true;
  if(name==='tasks')return !r||r.owner===currentProfile().initials;
  if(name==='appointments'&&state.role==='representante')return !r||r.owner===currentProfile().name;
  return false;
 }
 function visible(name){return collections[name].filter(r=>allowed(name,r));}
 const action=(name,id='',text='Gerenciar registros')=>`<button class="btn" data-crud="${name}" data-record="${esc(id)}">${esc(text)}</button>`;
 render=function(){
  sync();originalRender();
  const [route,id]=state.route.split('/');
  const name={pessoas:'people',campanhas:'campaigns',tarefas:'tasks',pedidos:'orders',catalogo:'products',estoque:'products',produto:'products',cerebro:'documents',reunioes:'appointments',visitas:'appointments'}[route]||(state.route==='gestao/equipe'?'people':null);
  if(!name||!allowed(name)||!canOpen(state.route))return;
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
 meetings=id=>agenda('Reunião',id);visits=id=>agenda('Visita',id);
 const fields={
  people:[['name','Nome'],['type','Tipo',['Médico','Paciente','Colaborador']],['specialty','Especialidade / contexto'],['city','Cidade'],['stage','Etapa'],['owner','Responsável'],['employeeRole','Função na equipe',['Gestor','Representante','Despachante']]],
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
  return {people:{type:'Médico',specialty:'Não informado',city:'Não informada',stage:'Cadastro demonstrativo',owner:'Não atribuído',color:'#445f83',milestones:[]},campaigns:{topic:'Público não definido',status:'Planejada',leads:0,talks:0,meetings:0,color:'#335e9c',icon:'campaign'},tasks:{stage:'A fazer',owner:currentProfile().initials},orders:{payment:'Aguardando',status:'Aguardando pagamento',tracking:'',assignee:'Diego Souza',price:'R$ 0,00'},products:{qty:0,price:'R$ 0,00'},documents:{version:'Rascunho'},appointments:{kind:state.route.startsWith('visitas')?'Visita':'Reunião',status:'Planejada',owner:currentProfile().name,date:'',result:''}}[name];
 }
 function input(name,field,record){
  const [k,label,type]=field,value=record[k]??'',required=!['tracking','result','employeeRole','description'].includes(k);
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
   if(allOrders.some(o=>o.person===r.id)||appointments.some(a=>a.person===r.id))return 'Esta pessoa tem pedidos ou atividades vinculados. Remova ou reatribua esses registros antes de excluir.';
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
