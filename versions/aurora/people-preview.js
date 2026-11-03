'use strict';

// Nonmodal hover card; identity always resolves from the current profile's collection.
let personPopup = null;
let personPopupAnchor = null;
let personPopupTimer = null;
let personPopupOpenTimer = null;
let suppressPreviewFocus = false;
let personPopupPinned = false;
let personPopupShownAt = 0;
function hidePersonPopup() {
  personPopupPinned=false;
  clearTimeout(personPopupTimer);
  clearTimeout(personPopupOpenTimer);
  if(personPopupAnchor)personPopupAnchor.setAttribute('aria-expanded','false');
  personPopupAnchor=null;
  if(personPopup){personPopup.hidden=true;personPopup.replaceChildren();}
}
function showPersonPopup(id,anchor,pin=false) {
  clearTimeout(personPopupTimer);
  clearTimeout(personPopupOpenTimer);
  const person=people.find(p=>p.id===id);
  if(!person||!anchor?.isConnected)return;
  if(!personPopup){
    personPopup=document.createElement('aside');
    personPopup.id='person-hover-preview';personPopup.className='person-hover-preview glass';
    personPopup.setAttribute('role','dialog');personPopup.setAttribute('aria-label','Prévia da pessoa');
    personPopup.setAttribute('aria-modal','false');
    personPopup.addEventListener('pointerenter',()=>clearTimeout(personPopupTimer));
    personPopup.addEventListener('pointerleave',()=>schedulePopupClose());
    document.body.append(personPopup);
  }
  if(personPopupAnchor&&personPopupAnchor!==anchor)personPopupAnchor.setAttribute('aria-expanded','false');
  personPopupPinned=pin;personPopupShownAt=performance.now();
  personPopupAnchor=anchor;
  anchor.setAttribute('aria-expanded','true');
  personPopup.innerHTML=`<div class="dialog-top"><span class="eyebrow">PRÉVIA · ${esc(person.type)}</span><button class="icon-button" data-dismiss-preview aria-label="Fechar prévia">×</button></div>${personSummary(person)}<p class="funnel-caption">${person.type==='Colaborador'?'Perfil, atribuições e indicadores estão na ficha do colaborador.':state.role==='despachante'?'Contexto operacional dos pedidos atribuídos.':'Abra a ficha para atividades, relações e contexto de trabalho.'}</p>${btn(person.type==='Colaborador'?'Abrir ficha e indicadores':'Abrir ficha completa',`pessoas/${person.id}`,true)}`;
  personPopup.hidden=false;
  const rect=anchor.getBoundingClientRect();const width=Math.min(360,innerWidth-24);
  personPopup.style.width=`${width}px`;
  const measuredHeight=personPopup.getBoundingClientRect().height;
  let left=rect.right+12;
  if(left+width>innerWidth-12)left=rect.left-width-12;
  if(left<12)left=Math.max(12,(innerWidth-width)/2);
  let top=Math.max(88,Math.min(rect.top,innerHeight-measuredHeight-18));
  if(innerWidth<600)top=Math.max(85,Math.min(rect.bottom+10,innerHeight-measuredHeight-20));
  personPopup.style.left=`${left}px`;personPopup.style.top=`${top}px`;
}
function schedulePopupClose(){if(personPopupPinned)return;clearTimeout(personPopupTimer);personPopupTimer=setTimeout(hidePersonPopup,180);}
function previewTarget(element){return element instanceof Element?element.closest('[data-preview],[data-person-preview]'):null;}
document.addEventListener('pointerover',event=>{
  if(event.pointerType==='touch')return;
  if(personPopup?.contains(event.target)){clearTimeout(personPopupTimer);return;}
  const anchor=previewTarget(event.target);if(!anchor)return;
  const id=anchor.dataset.preview||anchor.dataset.personPreview;
  clearTimeout(personPopupTimer);clearTimeout(personPopupOpenTimer);
  personPopupOpenTimer=setTimeout(()=>showPersonPopup(id,anchor),180);
});
document.addEventListener('pointerout',event=>{
  const anchor=previewTarget(event.target);if(!anchor)return;
  if(anchor.contains(event.relatedTarget)||personPopup?.contains(event.relatedTarget))return;
  clearTimeout(personPopupOpenTimer);schedulePopupClose();
});
document.addEventListener('focusin',event=>{
  if(suppressPreviewFocus)return;
  if(personPopup?.contains(event.target)){clearTimeout(personPopupTimer);return;}
  const anchor=previewTarget(event.target);
  if(anchor)showPersonPopup(anchor.dataset.preview||anchor.dataset.personPreview,anchor);
  else hidePersonPopup();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&personPopup&&!personPopup.hidden){
    const anchor=personPopupAnchor;hidePersonPopup();
    if(anchor?.matches('button')){suppressPreviewFocus=true;anchor.focus({preventScroll:true});suppressPreviewFocus=false;}
    event.stopImmediatePropagation();
  }
},true);
document.addEventListener('pointerdown',event=>{
  if(personPopup&&!personPopup.hidden&&!personPopup.contains(event.target)&&!personPopupAnchor?.contains(event.target))hidePersonPopup();
});
window.addEventListener('resize',hidePersonPopup);
window.addEventListener('scroll',event=>{if(performance.now()-personPopupShownAt<250)return;if(!(event.target instanceof Node)||!personPopup?.contains(event.target))hidePersonPopup();},true);
