"""Complete funnel frame and circular, self-collapsing navigation."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(1366,768),(1440,900),(1280,720),(390,844)]:
  page=b.new_page(viewport={'width':w,'height':h},reduced_motion='reduce');page.goto(BASE)
  if w>900:
   frame=page.locator('.funnel-frame').bounding_box();assert frame['y']+frame['height']<h-30,(w,h,frame)
   a=page.locator('.funnel-medicos').bounding_box();z=page.locator('.funnel-pacientes').bounding_box();assert a['y']+a['height']<=z['y'] and abs(a['width']-z['width'])<2
  rail=page.locator('.sidebar');button=rail.locator('[data-nav=pessoas]')
  page.mouse.move(w-5,85)
  assert rail.locator('.nav-label').first.evaluate('(e)=>getComputedStyle(e).display')=='none'
  rect=rail.locator('svg').first.bounding_box();r=rail.bounding_box()
  assert rect['x']>=r['x'] and rect['x']+rect['width']<=r['x']+r['width']
  assert rail.locator('svg').first.evaluate('(e)=>getComputedStyle(e).borderRadius')=='50%'
  before=page.locator('main').bounding_box()['x'];rail.hover()
  assert page.locator('main').bounding_box()['x']>before+140
  button.click();expect(page.locator('main h1')).to_have_text('Pessoas')
  assert rail.bounding_box()['width']<=66
  assert page.locator('main').bounding_box()['x']==before
  page.mouse.move(w-5,85);rail.hover();assert rail.bounding_box()['width']>200
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth') if w>900 else True
  page.close();print(w,h,'frame and menu OK',flush=True)
 b.close()
