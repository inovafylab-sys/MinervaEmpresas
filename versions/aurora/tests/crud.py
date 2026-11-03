"""Browser CRUD persistence, safe text rendering, linked-record guards and menu geometry."""
import os
from playwright.sync_api import sync_playwright, expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MINERVA_CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1040},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE)
 def go(route):
  page.goto(f'{BASE}/#{route}')
  page.wait_for_function('(r)=>state.route===r',arg=route)
 cases=[
  ('pessoas','people',{'name':'Teste CRUD pessoa','specialty':'Neurologia','city':'São Paulo','stage':'Em contato','owner':'Ana Silva'}),
  ('campanhas','campaigns',{'name':'Teste CRUD campanha','topic':'Tema de teste'}),
  ('tarefas','tasks',{'title':'Teste CRUD tarefa'}),
  ('catalogo','products',{'name':'Teste CRUD produto','presentation':'Demonstração','price':'R$ 10,00','qty':'3'}),
  ('pedidos','orders',{'price':'R$ 10,00'}),
  ('cerebro','documents',{'title':'Teste CRUD documento','content':'Texto de teste'}),
  ('reunioes','appointments',{'title':'Teste CRUD reunião','date':'2026-11-03T10:00'})
 ]
 for route,name,values in cases:
  go(route);page.locator(f'.crud-toolbar [data-crud-new="{name}"]').click()
  for field,value in values.items():page.locator(f'#crud-form [name="{field}"]').fill(value)
  page.locator('#crud-form button[type=submit]').click()
  expect(page.locator('#editor')).not_to_be_visible()
  page.reload()
  page.locator(f'.crud-toolbar [data-crud="{name}"]').click()
  record=page.locator('.crud-records .list-row').last
  record.locator('[data-crud]').click()
  field='price' if name=='orders' else 'name' if name in ['people','campaigns','products'] else 'title'
  updated='R$ 15,00' if name=='orders' else 'Registro editado '+name
  page.locator(f'#crud-form [name="{field}"]').fill(updated)
  page.locator('#crud-form button[type=submit]').click()
  page.reload();page.locator(f'.crud-toolbar [data-crud="{name}"]').click()
  record=page.locator('.crud-records .list-row').last
  record.locator('[data-crud]').click();expect(page.locator(f'#crud-form [name="{field}"]')).to_have_value(updated)
  page.locator('[data-crud-delete]').click();page.locator('[data-crud-confirm]').click()
  page.locator('[data-close-editor]').click()
  print(name,'create/edit/reload/delete OK')
 go('pessoas');page.locator('.crud-toolbar [data-crud=people]').click()
 page.locator('.crud-records .list-row').filter(has_text='Ana Souza').locator('[data-crud-delete]').click()
 expect(page.locator('[data-crud-confirm]')).to_have_count(0)
 expect(page.locator('#toast')).to_contain_text('pedidos ou atividades')
 page.locator('[data-close-editor]').click()
 # Product names are untrusted text, never HTML.
 go('catalogo');page.locator('.crud-toolbar [data-crud-new]').click()
 for k,v in {'name':'<img src=x onerror=alert(1)>','presentation':'Teste','price':'R$ 1,00'}.items():page.locator(f'#crud-form [name={k}]').fill(v)
 page.locator('#crud-form button[type=submit]').click()
 expect(page.locator('main img[src=x]')).to_have_count(0)
 expect(page.locator('main')).to_contain_text('<img src=x onerror=alert(1)>')
 for width in [1440,900,390]:
  page.set_viewport_size({'width':width,'height':1040});page.evaluate('document.activeElement.blur()');page.mouse.move(width-5,85)
  before=page.locator('main').bounding_box()['x'];page.locator('.sidebar').hover()
  after=page.locator('main').bounding_box()['x'];rail=page.locator('.sidebar').bounding_box()
  assert after>before+140 and after>=rail['x']+rail['width'],(width,before,after)
  page.mouse.move(width-5,85);page.locator('.sidebar button').first.focus()
  assert page.locator('main').bounding_box()['x']>=rail['x']+rail['width']
 assert not errors,errors
 print('Linked deletion, escaped text, menu hover/focus OK')
 b.close()
