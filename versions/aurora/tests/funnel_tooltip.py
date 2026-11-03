"""Hover details escape glass-card stacking and stay inside the visible viewport."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1366,600),(1366,768),(390,844)]:
  page=b.new_page(viewport={'width':width,'height':height},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE+'/#inicio')
  page.locator('.funnel-frame').evaluate('(e)=>{e.scrollIntoView();window.scrollBy(0,-84)}')
  stage=page.locator('.funnel-medicos [data-stage=profile]');stage.hover()
  tip=page.locator('#funnel-floating-tooltip');expect(tip).to_be_visible();expect(tip).to_contain_text('Dados confirmados')
  expect(stage).to_have_attribute('aria-describedby','funnel-floating-tooltip')
  assert tip.evaluate('(e)=>e.parentElement===document.body')
  box=tip.bounding_box();header=page.locator('.topbar').bounding_box()
  assert box['x']>=12 and box['x']+box['width']<=width-11
  assert box['y']>=header['y']+header['height']+7 and box['y']+box['height']<=height-11,(width,height,box)
  # Hit testing with pointer events temporarily enabled verifies the painted top layer.
  assert tip.evaluate('(e)=>{e.style.pointerEvents="auto";const r=e.getBoundingClientRect();const top=document.elementFromPoint(r.x+r.width/2,r.y+r.height-15);const ok=e===top||e.contains(top);e.style.pointerEvents="";return ok}')
  expect(page.locator('.funnel-stage-tooltip:visible')).to_have_count(0)
  if width==1366 and height==600:page.screenshot(path='/workspace/work/funnel-tooltip-fixed.png')
  page.mouse.move(width-5,80);expect(tip).not_to_be_visible()
  stage.focus();expect(tip).to_be_visible();page.keyboard.press('Escape');expect(tip).not_to_be_visible()
  page.locator('.funnel-pacientes [data-stage=followup]').hover();expect(tip).to_be_visible()
  box=tip.bounding_box();assert box['x']+box['width']<=width-11 and box['y']+box['height']<=height-11
  page.evaluate('window.scrollBy(0,20)')
  box=tip.bounding_box()
  if box:assert box['y']>=header['y']+header['height']+7 and box['y']+box['height']<=height-11
  stage.click();expect(page.locator('#indicator-detail')).to_be_visible();expect(tip).not_to_be_visible()
  assert not errors,errors
  page.close();print(width,height,'tooltip on top, clamped, keyboard/dismissal/detail OK',flush=True)
 b.close()
