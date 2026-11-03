"""Plan-dependent segment slots, remaining percentage, drafts, precision and persistence."""
from playwright.sync_api import sync_playwright,expect
import os
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
KEY='minerva-aurora-crud-v1'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1366,'height':768},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/#estrategia')
 def open_form():page.locator('[data-edit=strategy]').click()
 def seed(records=None,distribution=None):
  page.evaluate('([key,records,distribution])=>{localStorage.setItem(key,JSON.stringify({version:1,...(records===null?{}:{segments:records}),...(distribution===null?{}:{distribution})}));}',[KEY,records,distribution]);page.reload()
 open_form();expect(page.locator('#segment-total')).to_have_text('100%');expect(page.locator('.segment-row')).to_have_count(4)
 page.locator('[name=segment-percent]').first.fill('20')
 expect(page.locator('#segment-remaining')).to_have_text('10%');expect(page.locator('.segment-row')).to_have_count(5)
 page.locator('[name=segment-name]').nth(4).fill('Novo público')
 page.locator('[name=segment-percent]').nth(4).fill('10')
 expect(page.locator('.segment-row')).to_have_count(5);expect(page.locator('#segment-total')).to_have_text('100%')
 page.locator('[name=segment-percent]').nth(4).fill('5')
 expect(page.locator('.segment-row')).to_have_count(6)
 page.locator('#distribution-form button[type=submit]').click();page.reload()
 expect(page.locator('main')).to_contain_text('95%');expect(page.locator('#strategy-distribution')).to_contain_text('Novo público')
 open_form();expect(page.locator('.segment-row')).to_have_count(6)
 page.locator('[name=segment-name]').nth(5).fill('NEUROLOGIA');page.locator('[name=segment-percent]').nth(5).fill('5')
 page.locator('#distribution-form button[type=submit]').click();expect(page.locator('#distribution-error')).to_contain_text('nomes diferentes')
 page.locator('[name=segment-name]').nth(5).fill('Outra região')
 page.locator('[name=segment-percent]').first.fill('20.01')
 page.locator('#distribution-form button[type=submit]').click();expect(page.locator('#distribution-error')).to_contain_text('100%')
 page.locator('[name=segment-percent]').first.fill('20');page.locator('#distribution-form button[type=submit]').click()
 # Decimal totals must be exact: 33.33 + 33.33 + 33.34 = 100.
 seed([{'id':str(i),'name':'Grupo '+str(i),'percent':v} for i,v in enumerate([33.33,33.33,33.34])])
 open_form();expect(page.locator('#segment-total')).to_have_text('100%');expect(page.locator('.segment-row')).to_have_count(3)
 page.locator('[data-close-editor]').first.click()
 # 25 named segments close the open slot even below 100%; removal restores it.
 seed([{'id':str(i),'name':'Grupo '+str(i),'percent':1} for i in range(25)])
 open_form();expect(page.locator('#segment-count')).to_have_text('25 / 25');expect(page.locator('.segment-row')).to_have_count(25)
 expect(page.locator('#segment-open-note')).to_contain_text('Limite de 25')
 page.locator('[data-remove-segment]').last.click();expect(page.locator('#segment-count')).to_have_text('24 / 25')
 expect(page.locator('.segment-row')).to_have_count(25)
 expect(page.locator('[name=segment-name]').last).to_have_value('')
 page.locator('[name=segment-name]').last.fill('Novo grupo');page.locator('[name=segment-percent]').last.fill('1')
 expect(page.locator('.segment-row')).to_have_count(25)
 page.locator('#distribution-form button[type=submit]').click();page.reload();expect(page.locator('main')).to_contain_text('25 / 25')
 page.set_viewport_size({'width':390,'height':844});open_form()
 box=page.locator('#distribution-form button[type=submit]').bounding_box();assert box['y']+box['height']<=844
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.locator('[data-close-editor]').first.click()
 # Previous four-value distributions migrate without dropping their values.
 seed(None,[40,20,20,20]);open_form();expect(page.locator('[name=segment-percent]').first).to_have_value('40')
 page.close()
 # Same editor, a different subscription limit supplied by the application.
 page=b.new_page(reduced_motion='reduce');page.add_init_script('window.MinervaSubscription={maxSegments:2}')
 page.goto(BASE+'/#estrategia');page.evaluate('(key)=>localStorage.setItem(key,JSON.stringify({version:1,segments:[{id:"a",name:"Primeiro",percent:20}]}))',KEY);page.reload()
 page.locator('[data-edit=strategy]').click();expect(page.locator('#segment-count')).to_have_text('1 / 2');expect(page.locator('.segment-row')).to_have_count(2)
 page.locator('[name=segment-name]').last.fill('Segundo');page.locator('[name=segment-percent]').last.fill('20')
 expect(page.locator('.segment-row')).to_have_count(2);expect(page.locator('#segment-open-note')).to_contain_text('Limite de 2')
 assert not errors,errors
 print('PASS: open slot until 100% or plan cap, 25-segment limit, other-plan limit, decimals, duplicate/overflow validation, drafts/reload, legacy migration and mobile form')
 b.close()
