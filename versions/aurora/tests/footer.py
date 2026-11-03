"""Footer only at content end, inert icon previews and later editable safe URLs."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1366,'height':768},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE)
 def go(route):
  page.goto(BASE+'/#'+route);page.wait_for_function('(r)=>state.route===r',arg=route);page.evaluate('window.scrollTo(0,0)')
 for route in ['inicio','gestao/perfil']:
  go(route);footer=page.locator('.system-footer')
  assert footer.evaluate('(e)=>getComputedStyle(e).position')=='static'
  assert footer.bounding_box()['y']>=768
  page.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)')
  box=footer.bounding_box();assert box['y']>=0 and box['y']+box['height']<=768.5
  assert page.evaluate('Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<1')
 expect(page.locator('.footer-link-preview')).to_have_count(5)
 expect(page.locator('.footer-links a')).to_have_count(0)
 go('gestao');page.locator('[data-crud=footerLinks]').click()
 page.locator('.crud-records .list-row').filter(has_text='Instagram').locator('[data-crud]').click()
 page.locator('[name=title]').fill('Instagram institucional')
 # Empty URL is valid and stays noninteractive.
 page.locator('#crud-form button[type=submit]').click();page.reload()
 expect(page.locator('.footer-link-preview[aria-label^="Instagram institucional"]')).to_have_count(1)
 expect(page.locator('.footer-links a')).to_have_count(0)
 page.locator('[data-crud=footerLinks]').click();page.locator('.crud-records .list-row').filter(has_text='Instagram institucional').locator('[data-crud]').click()
 page.locator('[name=url]').fill('javascript:alert(1)');page.locator('#crud-form button[type=submit]').click()
 expect(page.locator('#crud-error')).to_contain_text('endereço')
 page.locator('[name=url]').fill('https://example.com/official');page.locator('#crud-form button[type=submit]').click()
 link=page.locator('.footer-links a[aria-label="Instagram institucional"]');expect(link).to_have_attribute('href','https://example.com/official')
 expect(link).to_have_attribute('rel','noopener noreferrer')
 page.reload();expect(link).to_have_attribute('href','https://example.com/official')
 for width,height in [(1366,768),(390,844)]:
  page.set_viewport_size({'width':width,'height':height});go('gestao/perfil')
  assert page.locator('.system-footer').bounding_box()['y']>=height
  assert page.locator('.sidebar').evaluate('(e)=>getComputedStyle(e).bottom')==('16px' if width>600 else '12px')
  page.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)')
  box=page.locator('.system-footer').bounding_box();assert box['y']+box['height']<=height+.5
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors
 print('PASS: footer at page end on long/short/mobile pages, no initial destinations, editable icons, safe URL validation/persistence and lowered rail')
 b.close()
