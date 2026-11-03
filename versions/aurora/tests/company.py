"""Company funnel arithmetic, drilldowns, team dossiers and nonmodal preview behavior."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MINERVA_CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1040},reduced_motion='reduce')
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE)
 def go(route):
  page.goto(f'{BASE}/#{route}')
  page.wait_for_function('(r)=>state.route===r',arg=route)
 go('indicadores')
 expect(page.locator('.company-funnel')).to_have_count(2)
 expect(page.locator('.company-funnel').nth(0).locator('.funnel-stage')).to_have_count(9)
 expect(page.locator('.company-funnel').nth(1).locator('.funnel-stage')).to_have_count(10)
 assert page.locator('.company-funnel').nth(0).locator('[data-stage=accepted]').get_attribute('data-count')=='1'
 assert '50%' in page.locator('.company-funnel').nth(0).locator('[data-stage=accepted]').inner_text()
 # 1 accepted / 2 proposals, distinct from 1 / 4 total doctors.
 assert page.locator('.company-funnel').nth(0).locator('[data-stage=accepted]').get_attribute('data-denominator')=='2'
 counts=page.evaluate('funnelRows(companyScope().doctors,medicalStages).map(r=>r.count)')
 assert counts==[4,4,3,2,2,1,1,1,1],counts
 assert page.evaluate('companyScope().patients.length')==2
 assert page.evaluate('companyScope().orders.length')==4
 assert page.evaluate("funnelRows(companyScope().patients,patientStages).find(r=>r.key==='paid').rate")==50
 assert 'R$ 1.167,00' in page.locator('main').inner_text().replace('\xa0',' ')
 page.locator('.company-funnel').first.locator('[data-stage=accepted]').click()
 page.wait_for_url('**/#funil-medicos/accepted')
 expect(page.locator('main .person-preview-card')).to_have_count(1)
 assert 'Marina' in page.locator('main').inner_text()
 go('indicadores')
 page.locator('#analytics-campaign').select_option('neurologia')
 assert page.locator('.company-funnel').first.locator('[data-stage=identified]').get_attribute('data-count')=='2'
 assert page.locator('.company-funnel').first.locator('[data-stage=accepted]').get_attribute('data-count')=='0'
 expect(page.locator('[data-campaign-result]')).to_have_count(1)
 assert 'Novos caminhos' in page.locator('[data-campaign-result]').inner_text()
 page.locator('#analytics-campaign').select_option('sono')
 assert '—' in page.locator('.funnel-rate').nth(1).inner_text()
 assert 'NaN' not in page.locator('main').inner_text()
 assert 'Infinity' not in page.locator('main').inner_text()
 page.locator('.company-funnel').first.locator('[data-stage=identified]').click()
 expect(page.locator('main .person-preview-card')).to_have_count(0)
 expect(page.get_by_text('Nenhuma pessoa alcançou este marco na coorte selecionada.')).to_be_visible()
 print('PASS: complete cumulative funnels; same-cohort conversions; campaign filtering; no-base state; populations match counts')
 go('gestao/equipe')
 expect(page.locator('main .person-preview-card')).to_have_count(5)
 page.locator('[data-nav="pessoas/equipe-ana"]').click()
 expect(page.locator('h1')).to_have_text('Ficha do colaborador')
 assert 'Ana Silva' in page.locator('.detail-top').inner_text()
 assert '50%' in page.locator('main').inner_text()
 assert 'Rafael' not in page.locator('main').inner_text()
 # An employee's funnel must not inherit the last company campaign filter (sono).
 page.locator('.company-funnel [data-stage=identified]').click()
 page.wait_for_url('**/#funil-medicos/identified/equipe-ana')
 expect(page.locator('main .person-preview-card')).to_have_count(2)
 assert 'Rafael' not in page.locator('main').inner_text()
 go('pessoas/equipe-bruno')
 assert 'Rafael' in page.locator('main').inner_text()
 assert 'Marina' not in page.locator('main').inner_text()
 go('pessoas/equipe-diego')
 assert '#1040' in page.locator('main').inner_text()
 assert '#1042' not in page.locator('main').inner_text()
 assert '50%' in page.locator('main').inner_text()
 go('pessoas/equipe-camila')
 assert '#1042' in page.locator('main').inner_text()
 assert '#1043' not in page.locator('main').inner_text()
 print('PASS: collaborator dossiers use assigned activities/orders; representative drilldowns retain employee scope')
 go('pessoas')
 page.locator('[data-facet=specialty]').select_option('Psiquiatria')
 card=page.locator('.person-preview-card').first
 card.hover()
 expect(page.locator('#person-hover-preview')).to_be_visible()
 assert page.url.endswith('#pessoas')
 expect(page.locator('.collection-preview')).to_have_count(0)
 page.locator('#person-hover-preview').hover()
 page.wait_for_timeout(220)
 expect(page.locator('#person-hover-preview')).to_be_visible()
 page.locator('#person-hover-preview [data-nav]').click()
 expect(page.locator('h1')).to_have_text('Ficha de gestão')
 expect(page.locator('#person-hover-preview')).to_be_hidden()
 page.locator('.back').click()
 expect(page.locator('[data-facet=specialty]')).to_have_value('Psiquiatria')
 page.mouse.move(1400,100)
 page.locator('[data-preview=marina]').focus()
 expect(page.locator('#person-hover-preview')).to_be_visible()
 page.keyboard.press('Escape')
 expect(page.locator('#person-hover-preview')).to_be_hidden()
 page.locator('[data-preview=marina]').click()
 expect(page.locator('#person-hover-preview')).to_be_visible()
 page.locator('#profile-select').select_option('despachante')
 expect(page.locator('#person-hover-preview')).to_be_hidden()
 for route in ['gestao/equipe','pessoas/equipe-ana','funil-medicos/identified','funil-pacientes/paid']:
  go(route)
  if route=='gestao/equipe':
   expect(page.locator('h1')).to_have_text('Meu perfil')
  else:
   expect(page.locator('h1')).to_have_text('Conteúdo fora do seu escopo')
 print('PASS: hover popup, pointer transfer, item navigation, keyboard Escape and profile-switch cleanup')
 page.locator('#profile-select').select_option('gestor')
 page.set_viewport_size({'width':390,'height':844})
 for route in ['indicadores','gestao/equipe','pessoas/equipe-ana','pessoas/equipe-diego']:
  go(route)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),route
 go('pessoas')
 page.locator('[data-preview=marina]').click()
 expect(page.locator('#person-hover-preview')).to_be_visible()
 box=page.locator('#person-hover-preview').bounding_box()
 assert box['x']>=0 and box['x']+box['width']<=390
 assert not errors,errors
 print('PASS: dashboard, collaborator dossiers and touch preview fit mobile without JavaScript errors')
 b.close()
