"""Page slide appears only during navigation and respects both motion preferences."""
import os
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1366,'height':768},reduced_motion='no-preference');page.goto(BASE)
 header=page.locator('.topbar').bounding_box()
 page.evaluate("navigate('pessoas')")
 page.wait_for_function("state.route==='pessoas' && document.querySelector('main').getAnimations().length>0")
 frames=page.locator('main').evaluate('(e)=>e.getAnimations()[0].effect.getKeyframes()')
 assert '12px' in frames[0]['transform'] and frames[-1]['transform']=='translateX(0px)',frames
 assert page.locator('.topbar').bounding_box()==header
 page.wait_for_function("document.querySelector('main').getAnimations().length===0")
 page.locator('[data-search]').fill('Marina')
 assert page.locator('main').evaluate('(e)=>e.getAnimations().length')==0
 page.emulate_media(reduced_motion='reduce');page.evaluate("navigate('campanhas')")
 page.wait_for_function("state.route==='campanhas'")
 assert page.locator('main').evaluate('(e)=>e.getAnimations().length')==0
 page.emulate_media(reduced_motion='no-preference');page.evaluate("navigate('gestao/preferencias')")
 page.locator('#user-reduce-motion').check();page.evaluate("navigate('pessoas')")
 page.wait_for_function("state.route==='pessoas'")
 assert page.locator('main').evaluate('(e)=>e.getAnimations().length')==0
 print('PASS: page-only slide, static header, no filter animation, OS and user reduced-motion preferences')
 b.close()
