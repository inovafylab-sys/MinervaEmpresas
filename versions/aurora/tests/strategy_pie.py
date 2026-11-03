"""Strategy pie follows saved segment distribution, available capacity and custom names."""
from playwright.sync_api import sync_playwright,expect
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1366,'height':768},reduced_motion='reduce')
 page.goto('http://127.0.0.1:4173/#estrategia')
 expect(page.locator('.strategy-pie circle')).to_have_count(4)
 expect(page.locator('.strategy-pie-legend')).to_contain_text('Neurologia')
 assert sum(float(x) for x in page.locator('.strategy-pie circle').evaluate_all('(els)=>els.map(e=>e.getAttribute("stroke-dasharray").split(" ")[0])'))==100
 page.locator('[data-edit=strategy]').click();page.locator('[name=segment-percent]').first.fill('20');page.locator('#distribution-form button[type=submit]').click()
 expect(page.locator('.strategy-pie circle')).to_have_count(5)
 expect(page.locator('.strategy-pie-legend')).to_contain_text('Ainda não distribuído')
 expect(page.locator('.strategy-pie')).to_have_attribute('aria-label','Gráfico em pizza: 90% distribuído e 10% disponível')
 page.reload();expect(page.locator('.strategy-pie')).to_have_attribute('aria-label','Gráfico em pizza: 90% distribuído e 10% disponível')
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS: restored pie, matching slices/legend, remaining percentage, reload and mobile')
 b.close()
