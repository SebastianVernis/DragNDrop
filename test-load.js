const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar errores de consola
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}] ${msg.text()}`);
    }
  });
  
  // Capturar errores de página
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  // Capturar requests fallidos
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
  });
  
  // Rastrear requests pendientes
  const pendingRequests = new Set();
  
  page.on('request', request => {
    pendingRequests.add(request.url());
    console.log(`[REQUEST] ${request.url()}`);
  });
  
  page.on('response', response => {
    pendingRequests.delete(response.url());
    if (response.status() >= 400) {
      console.log(`[RESPONSE ERROR] ${response.url()} - Status: ${response.status()}`);
    }
  });
  
  try {
    console.log('Navegando a http://localhost:8080/index.html...');
    await page.goto('http://localhost:8080/index.html', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    console.log('✅ DOM cargado');
    
    // Esperar un poco para ver requests pendientes
    await page.waitForTimeout(5000);
    
    console.log('\n📋 Requests pendientes:');
    pendingRequests.forEach(url => console.log(`  - ${url}`));
    
    // Esperar un poco para ver si hay errores tardíos
    await page.waitForTimeout(3000);
    
    // Verificar si hay elementos clave en la página
    const toolbar = await page.$('.toolbar');
    const canvas = await page.$('#canvas');
    const componentPanel = await page.$('#component-panel');
    
    console.log('Elementos encontrados:');
    console.log('- Toolbar:', toolbar ? '✅' : '❌');
    console.log('- Canvas:', canvas ? '✅' : '❌');
    console.log('- Component Panel:', componentPanel ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Error al cargar la página:', error.message);
  } finally {
    await browser.close();
  }
})();
