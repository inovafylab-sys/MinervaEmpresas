"""Visit consent/region eligibility and the unified role dashboard."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1040},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE)
 def go(route):
  page.goto(f'{BASE}/#{route}');page.wait_for_function('(r)=>state.route===r',arg=route)
 expect(page.locator('#navigation [data-nav=inicio]')).to_have_count(1)
 expect(page.locator('#navigation [data-nav=indicadores]')).to_have_count(0)
 expect(page.locator('main h1')).to_have_text('Painel do gestor')
 expect(page.locator('.company-funnel')).to_have_count(2)
 page.locator('[data-dashboard-tab=Operação]').click()
 expect(page.locator('#route-supervision')).to_be_visible()
 go('visitas');expect(page.locator('[data-route-new]')).to_be_disabled()
 for doctor,region in [('marina','Centro SP'),('juliana','Centro SP'),('rafael','Campinas')]:
  go('pessoas/'+doctor);page.locator('.crud-toolbar [data-crud]').click()
  page.locator('[name=region]').fill(region)
  page.locator('[name=visitConsent]').select_option('Aceitou receber visitas')
  page.locator('#crud-form button[type=submit]').click()
 page.locator('#profile-select').select_option('representante')
 go('visitas');expect(page.locator('#visit-region option[value="Centro SP"]')).to_have_count(1)
 expect(page.locator('#visit-region option[value=Campinas]')).to_have_count(0)
 page.locator('[data-route-new]').click()
 expect(page.locator('[name=doctor]')).to_have_count(2)
 page.locator('[name=title]').fill('Rota SP teste');page.locator('[name=date]').fill('2026-11-04')
 page.locator('[name=doctor][value=marina]').check();page.locator('[name=doctor][value=juliana]').check()
 page.locator('[data-route-up="1"]').click()
 expect(page.locator('[data-stop]').first).to_have_attribute('data-stop','juliana')
 page.locator('#visit-route-form button[type=submit]').click();page.reload()
 # Role resets to manager on reload; the local saved route remains visible.
 expect(page.locator('.route-card')).to_contain_text('Rota SP teste')
 page.locator('[data-route-progress]').click();go('inicio');page.locator('[data-dashboard-tab=Operação]').click()
 expect(page.locator('#route-supervision')).to_contain_text('Em andamento')
 expect(page.locator('#route-supervision')).to_contain_text('Localização: não conectada')
 page.locator('#profile-select').select_option('despachante')
 expect(page.locator('main h1')).to_have_text('Painel do despachante')
 expect(page.locator('#route-supervision')).to_have_count(0)
 assert not errors,errors
 print('PASS: unified dashboard, role sections, visit consent, regional scope, ordered stops, persistence, simulated supervision')
 b.close()
