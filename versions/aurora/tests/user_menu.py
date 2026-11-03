"""Avatar menu accessibility, role scope and personal preferences persistence."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1040},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE)
 avatar=page.locator('#user-menu-button');avatar.click()
 expect(avatar).to_have_attribute('aria-expanded','true')
 expect(page.locator('#user-menu')).to_contain_text('Alex Costa')
 expect(page.locator('#user-menu [data-account-link=gestao]')).to_be_visible()
 page.keyboard.press('End');expect(page.locator('#user-menu [data-account-link=gestao]')).to_be_focused()
 page.keyboard.press('Escape');expect(page.locator('#user-menu')).not_to_be_visible();expect(avatar).to_be_focused()
 avatar.press('ArrowDown');page.locator('[data-account-link="gestao/perfil"]').click()
 expect(page.locator('h1')).to_have_text('Meu perfil');expect(page.locator('#user-menu')).not_to_be_visible()
 avatar.click();page.locator('[data-account-link="gestao/preferencias"]').click()
 page.locator('#user-reduce-motion').check();page.reload();expect(page.locator('#user-reduce-motion')).to_be_checked()
 assert page.locator('html').evaluate('(e)=>e.classList.contains("user-reduced-motion")')
 page.locator('#profile-select').select_option('representante');avatar.click()
 expect(page.locator('#user-menu')).to_contain_text('Ana Silva')
 expect(page.locator('#user-menu [data-account-link=gestao]')).to_have_count(0)
 page.locator('[data-account-link="gestao/perfil"]').click();expect(page.locator('main')).to_contain_text('Minha carteira e atividades')
 page.set_viewport_size({'width':390,'height':844});avatar.click()
 box=page.locator('#user-menu').bounding_box();assert box['x']>=0 and box['x']+box['width']<=390
 page.mouse.click(5,500);expect(page.locator('#user-menu')).not_to_be_visible()
 assert not errors,errors
 print('PASS: avatar menu, keyboard/outside dismiss, role-aware account links, preferences persistence and mobile layout')
 b.close()
