"""Functional checks of demo scopes and collection/item behavior, not backend authorization."""
import os
from playwright.sync_api import sync_playwright, expect

BASE=os.environ.get('MINERVA_TEST_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('MINERVA_CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE)
    def go(route):
        page.goto(f'{BASE}/#{route}')
        page.wait_for_function('(r)=>state.route===r',arg=route)
    def role(value):
        page.locator('#profile-select').select_option(value)
        page.wait_for_function('(r)=>state.role===r && document.querySelector("h1").textContent.startsWith("Olá")',arg=value)
    def menu(route):
        return page.locator(f'#navigation [data-nav="{route}"]')

    go('pessoas')
    expect(page.locator('.person-preview-card')).to_have_count(11)
    page.locator('[data-facet=city]').select_option('São Paulo, SP')
    page.locator('[data-facet=specialty]').select_option('Psiquiatria')
    expect(page.locator('.person-preview-card')).to_have_count(1)
    page.locator('[data-preview=marina]').click()
    expect(page.locator('#person-hover-preview')).to_be_visible()
    assert page.url.endswith('#pessoas')
    page.locator('#person-hover-preview [data-nav="pessoas/marina"]').click()
    page.wait_for_url('**/#pessoas/marina')
    expect(page.locator('h1')).to_have_text('Ficha de gestão')
    page.locator('.back').click()
    page.wait_for_url('**/#pessoas')
    expect(page.locator('[data-facet=city]')).to_have_value('São Paulo, SP')
    expect(page.locator('.person-preview-card')).to_have_count(1)
    page.locator('[data-view=Lista]').click()
    expect(page.locator('tbody tr')).to_have_count(1)
    page.locator('[data-view=Compacta]').click()
    expect(page.locator('.compact-people .person-preview-card')).to_have_count(1)
    page.locator('[data-clear-facets]').click()
    expect(page.locator('.person-preview-card')).to_have_count(11)
    print('PASS: gallery/list/compact share combined filters; preview stays in collection; item has own page; return preserves filters')

    go('quadros')
    assert page.locator('[data-task]').count()==0
    expect(page.locator('.person-board-card')).to_have_count(4)
    page.locator('[data-journey=Paciente]').click()
    expect(page.locator('.person-board-card')).to_have_count(2)
    page.locator('.person-board-card').first.click()
    expect(page.locator('h1')).to_have_text('Ficha de gestão')
    go('tarefas')
    expect(page.locator('h1')).to_have_text('Tarefas')
    assert page.locator('[data-task]').count()==5
    assert page.locator('.person-board-card').count()==0
    print('PASS: Quadros represents people and Tarefas represents team work')

    role('representante')
    expect(menu('estrategia')).to_be_hidden()
    expect(menu('campanhas')).to_be_hidden()
    expect(menu('pedidos')).to_be_hidden()
    expect(menu('reunioes')).to_be_visible()
    go('pessoas')
    expect(page.locator('.person-preview-card')).to_have_count(2)
    assert 'Dra. Marina Costa' in page.locator('main').inner_text()
    assert 'Rafael' not in page.locator('main').inner_text()
    assert 'Ana Souza' not in page.locator('main').inner_text()
    page.locator('[data-nav="pessoas/marina"]').first.click()
    expect(page.locator('h1')).to_have_text('Ficha de relacionamento')
    for route in ['pedidos','estrategia','pessoas/rafael','pessoas/ana','conversas/rafael','cerebro/memoria']:
        go(route)
        expect(page.locator('h1')).to_have_text('Conteúdo fora do seu escopo')
    go('indicadores')
    expect(page.locator('.metric-value').first).to_have_text('2')
    assert 'Pedidos atribuídos' not in page.locator('main').inner_text()
    go('reunioes')
    assert 'Juliana' in page.locator('main').inner_text()
    assert 'Rafael' not in page.locator('main').inner_text()
    page.locator('#search-open').click()
    page.locator('#search-input').fill('Rafael')
    expect(page.locator('#search-results button')).to_have_count(0)
    page.keyboard.press('Escape')
    page.locator('#copilot-toggle').click()
    page.locator('#copilot-input').fill('abra os pedidos')
    page.locator('#copilot-form button').click()
    assert '#pedidos' not in page.url
    assert 'Abri Pedidos' not in page.locator('#copilot-history').inner_text()
    go('tarefas')
    assert page.locator('[data-task]').count()==2
    print('PASS: representative has own people/meetings/tasks/metrics; unrelated pages, direct links, search and Copilot navigation are excluded')

    role('despachante')
    assert 'Abri' not in page.locator('#copilot-history').inner_text()
    expect(menu('reunioes')).to_be_hidden()
    expect(menu('visitas')).to_be_hidden()
    expect(menu('pedidos')).to_be_visible()
    go('indicadores')
    expect(page.locator('.metric-value').first).to_have_text('3')
    assert 'Médicos da minha carteira' not in page.locator('main').inner_text()
    go('pedidos')
    assert '1043' in page.locator('main').inner_text()
    assert '1041' in page.locator('main').inner_text()
    assert '1042' not in page.locator('main').inner_text()
    go('pessoas')
    expect(page.locator('.person-preview-card')).to_have_count(1)
    assert 'Contato operacional' in page.locator('main').inner_text()
    assert 'Encaminhada' not in page.locator('main').inner_text()
    assert 'Dra. Marina' not in page.locator('main').inner_text()
    page.locator('[data-nav="pessoas/ana"]').click()
    expect(page.locator('h1')).to_have_text('Ficha operacional')
    assert '1043' in page.locator('main').inner_text()
    for route in ['pedidos/1042','pessoas/pedro','pessoas/marina','reunioes','gestao/empresa','cerebro/manual-paciente']:
        go(route)
        if route!='gestao/empresa':
            expect(page.locator('h1')).to_have_text('Conteúdo fora do seu escopo')
    go('conversas/ana')
    assert 'Suporte' in page.locator('main').inner_text() or 'suporte' in page.locator('main').inner_text()
    assert 'proposta de parceria' not in page.locator('main').inner_text()
    go('gestao')
    expect(page.locator('h1')).to_have_text('Meu perfil')
    expect(page.locator('[data-tab]')).to_have_count(0)
    print('PASS: dispatcher sees assigned orders and minimal operational contacts, logistical support and own preferences')

    role('gestor')
    go('pessoas')
    expect(page.locator('.person-preview-card')).to_have_count(11)
    for route in ['estrategia','campanhas','pedidos','reunioes','visitas','tarefas','quadros']:
        expect(menu(route)).to_be_visible()
    # Identity rendering is separate from authentication and assignment. Mock image locally, never call Google.
    page.route('https://lh3.googleusercontent.com/test-avatar',lambda route:route.fulfill(status=200,content_type='image/svg+xml',body='<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="blue"/></svg>'))
    page.evaluate("MinervaSession.setVerifiedIdentity({name:'Usuário Google',picture:'https://lh3.googleusercontent.com/test-avatar'})")
    expect(page.locator('.profile img')).to_have_attribute('alt','Usuário Google')
    assert page.evaluate('state.role')=='gestor'
    assert page.evaluate("(()=>{try{MinervaSession.setVerifiedIdentity({name:'X',picture:'javascript:alert(1)'});return false}catch{return true}})()")
    page.evaluate('MinervaSession.clearIdentity()')
    expect(page.locator('.profile img')).to_have_count(0)
    print('PASS: manager restores full business scope; identity/photo adapter changes presentation without assigning role')

    page.set_viewport_size({'width':390,'height':844})
    for profile in ['gestor','representante','despachante']:
        role(profile)
        for route in ['inicio','pessoas','quadros','tarefas','indicadores']:
            go(route)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(profile,route)
    assert not errors,errors
    print('PASS: all three profiles work on mobile, without JavaScript errors')
    browser.close()
