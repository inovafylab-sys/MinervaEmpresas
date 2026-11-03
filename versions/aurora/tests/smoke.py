"""Browser checks against a running local server; requires Playwright and Chromium."""
import os
from playwright.sync_api import sync_playwright

BASE = os.environ.get('MINERVA_TEST_URL', 'http://127.0.0.1:4173')
ROUTES = ['inicio','indicadores','estrategia','segmento/Neurologia','campanhas','campanhas/ansiedade','pessoas','pessoas/marina','pessoas/ana','atividades/marina','conversas','conversas/ana','reunioes','reunioes/juliana','visitas','visitas/marina','quadros','tarefas','pedidos','pedidos/1043','pagamento/1043','envio/1041','catalogo','estoque','produto/cbd5','movimentos/cbd5','catalogo-cliente','checkout/1043','cerebro','cerebro/identidade','cerebro/manual-medico','cerebro/manual-paciente','cerebro/manual-equipe','cerebro/conhecimento','cerebro/juridico','cerebro/memoria','cerebro/decisoes','cerebro/fontes','fontes','versoes/manual-medico','gestao','apresentacao','notificacoes','aprovacoes/manual']
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('MINERVA_CHROMIUM', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE)
    def go(route):
        page.goto(f'{BASE}/#{route}')
        page.wait_for_function('(r) => state.route === r', arg=route)
    for route in ROUTES:
        go(route)
        page.wait_for_function('(r) => document.title.includes("Minerva") && location.hash === "#" + r', arg=route)
        assert page.locator('main h1').count()==1, route
        assert page.locator('main').inner_text().strip(), route
        assert 'Página não encontrada' not in page.locator('h1').inner_text(), route
    print(f'PASS: {len(ROUTES)} routes render one primary page')
    go('pessoas')
    page.locator('[data-view=Lista]').click()
    page.locator('[data-search]').fill('Marina Costa')
    assert page.locator('tbody tr').count()==1
    page.locator('[data-search]').fill('inexistente')
    assert page.locator('tbody tr').count()==0
    page.get_by_role('button', name='Nova pessoa').click()
    page.locator('[name=name]').fill('<script>Teste Seguro</script>')
    page.locator('#crud-form button[type=submit]').click()
    page.locator('[data-search]').fill('Teste Seguro')
    assert page.locator('tbody tr').count()==1
    assert page.locator('tbody script').count()==0
    print('PASS: filtering, empty state, safe local creation')
    go('tarefas')
    page.get_by_role('button',name='Nova tarefa',exact=True).click()
    page.locator('[name=title]').fill('Tarefa de teste persistente')
    page.locator('#crud-form button[type=submit]').click()
    page.reload()
    page.get_by_text('Tarefa de teste persistente',exact=True).click()
    page.locator('[name=stage]').select_option('Concluído')
    page.locator('#crud-form button[type=submit]').click()
    assert 'Tarefa de teste persistente' in page.locator('.kanban-column').last.inner_text()
    print('PASS: task persistence and status editing')
    go('estrategia')
    page.get_by_role('button',name='Ajustar distribuição').click()
    page.locator('[name=segment0]').fill('50')
    page.locator('#editor-form button[type=submit]').click()
    assert '100%' in page.locator('#form-error').inner_text()
    page.locator('[name=segment3]').fill('0')
    page.locator('#editor-form button[type=submit]').click()
    go('inicio')
    go('estrategia')
    assert '50% · 250 médicos' in page.locator('#strategy-distribution').inner_text()
    print('PASS: strategy totals validation and session state')
    page.locator('#copilot-toggle').click()
    page.locator('#copilot-input').fill('abra os pedidos')
    page.locator('#copilot-form button').click()
    page.wait_for_url('**/#pedidos')
    assert page.locator('#copilot').is_visible()
    assert page.locator('main h1').count()==1
    assert 'Abri Pedidos' in page.locator('#copilot-history').inner_text()
    page.locator('#copilot-close').click()
    assert not page.locator('#copilot').is_visible()
    print('PASS: Copilot opens beside single page and handles navigation')
    page.locator('#search-open').click()
    page.locator('#search-input').fill('Marina')
    page.locator('#search-results button').click()
    page.wait_for_url('**/#pessoas/marina')
    assert not page.locator('#search-dialog').is_visible()
    print('PASS: global search opens linked resource')
    go('conversas/ana')
    page.locator('#conversation-form input').fill('Mensagem de demonstração')
    page.locator('#conversation-form button').click()
    assert 'não enviado' in page.locator('#message-thread .message').last.inner_text()
    print('PASS: conversation composer labels unsent message')
    go('gestao')
    assert page.locator('h1').inner_text()=='Configurações da empresa'
    assert page.locator('.config-card').count()==8
    go('apresentacao')
    for n in range(8):
        page.locator(f'.presentation-tabs [data-slide="{n}"]').click()
        assert f'{n+1:02d} / 08' in page.locator('.hero-note').inner_text()
    print('PASS: company settings hub and all presentation slides')
    go('inicio')
    page.locator('.sidebar').hover()
    page.wait_for_timeout(300)
    assert page.locator('.sidebar').bounding_box()['width']>200
    page.mouse.move(1200,300)
    page.set_viewport_size({'width':390,'height':844})
    for route in ['inicio','apresentacao','pessoas','pedidos','conversas','reunioes','quadros','cerebro']:
        go(route)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),route
    go('inicio')
    page.screenshot(path='/tmp/minerva-mobile.png',full_page=True)
    page.set_viewport_size({'width':1440,'height':1000})
    go('apresentacao')
    page.screenshot(path='/tmp/minerva-presentation.png',full_page=True)
    assert not errors,errors
    print('PASS: hover menu, mobile overflow, no JavaScript errors')
    browser.close()
