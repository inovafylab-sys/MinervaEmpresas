"""Floating rail transparency, equal spacing, logo alignment and unchanged push behavior."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1366,768),(1280,720),(390,844)]:
  page=b.new_page(viewport={'width':width,'height':height},reduced_motion='reduce');page.goto(BASE)
  for role in ['gestor','representante','despachante']:
   page.locator('#profile-select').select_option(role)
   page.mouse.move(width-5,75)
   rail=page.locator('.sidebar')
   appearance=rail.evaluate('(e)=>{const s=getComputedStyle(e);return [s.backgroundColor,s.boxShadow,s.backdropFilter,s.borderWidth]}')
   assert appearance==['rgba(0, 0, 0, 0)','none','none','0px'],appearance
   circles=rail.locator('button:visible svg').evaluate_all('(els)=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,h:r.height}})')
   assert len(circles)>3
   assert max(c['x'] for c in circles)-min(c['x'] for c in circles)<.1
   gaps=[circles[i+1]['y']-c['y']-c['h'] for i,c in enumerate(circles[:-1])]
   assert max(gaps)-min(gaps)<.2,(width,role,gaps)
   r=rail.bounding_box();top=circles[0]['y']-circles[0]['h']/2-r['y'];bottom=r['y']+r['height']-circles[-1]['y']-circles[-1]['h']/2
   assert abs(top-gaps[0])<.2 and abs(bottom-gaps[0])<.2,(role,top,bottom,gaps)
   header=page.locator('.topbar').bounding_box()
   outer_top=circles[0]['y']-circles[0]['h']/2-header['y']-header['height']
   outer_bottom=height-circles[-1]['y']-circles[-1]['h']/2
   assert abs(outer_top-outer_bottom)<.2,(role,outer_top,outer_bottom)
   if width==1366 and role=='gestor':page.screenshot(path='/workspace/work/floating-menu-manager.png')
   logo=page.locator('.brand svg').bounding_box();assert abs(logo['x']+logo['width']/2-circles[0]['x'])<.2
   before=page.locator('main').bounding_box()['x'];rail.hover()
   assert page.locator('main').bounding_box()['x']>before+140
   expanded=rail.locator('button:visible svg').first.bounding_box()
   assert abs(expanded['x']+expanded['width']/2-circles[0]['x'])<.2
   assert rail.evaluate('(e)=>getComputedStyle(e).boxShadow')=='none'
   rail.locator('[data-nav=pessoas]').click();expect(page.locator('main h1')).to_have_text('Pessoas')
   assert rail.bounding_box()['width']<=66
   assert page.locator('main').bounding_box()['x']==before
  print(width,height,'all roles: floating/equal spacing/logo/push/collapse OK',flush=True)
  if width==1366:page.screenshot(path='/workspace/work/floating-menu.png')
  page.close()
 b.close()
