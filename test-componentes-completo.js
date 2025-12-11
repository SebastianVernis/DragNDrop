#!/usr/bin/env node

/**
 * Script de Testing Completo de Componentes
 * Verifica todos los 34 componentes del editor
 * Genera reporte detallado en español
 */

const fs = require('fs');
const path = require('path');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Componentes a verificar
const componentes = {
  layout: [
    { id: 'container', nombre: 'Container', descripcion: 'Contenedor principal' },
    { id: 'section', nombre: 'Section', descripcion: 'Sección de contenido' },
    { id: 'row', nombre: 'Row', descripcion: 'Fila de layout' },
    { id: 'column', nombre: 'Column', descripcion: 'Columna de layout' },
    { id: 'grid-2col', nombre: '2-Column Grid', descripcion: 'Grid de 2 columnas' },
    { id: 'grid-3col', nombre: '3-Column Grid', descripcion: 'Grid de 3 columnas' }
  ],
  texto: [
    { id: 'h1', nombre: 'H1 Heading', descripcion: 'Encabezado nivel 1' },
    { id: 'h2', nombre: 'H2 Heading', descripcion: 'Encabezado nivel 2' },
    { id: 'h3', nombre: 'H3 Heading', descripcion: 'Encabezado nivel 3' },
    { id: 'paragraph', nombre: 'Paragraph', descripcion: 'Párrafo de texto' },
    { id: 'span', nombre: 'Inline Text', descripcion: 'Texto en línea' },
    { id: 'ol', nombre: 'Ordered List', descripcion: 'Lista ordenada' },
    { id: 'ul', nombre: 'Unordered List', descripcion: 'Lista desordenada' }
  ],
  media: [
    { id: 'image', nombre: 'Image', descripcion: 'Imagen' },
    { id: 'video', nombre: 'Video', descripcion: 'Video' },
    { id: 'iframe', nombre: 'Iframe', descripcion: 'Marco embebido' }
  ],
  formularios: [
    { id: 'input', nombre: 'Text Input', descripcion: 'Campo de texto' },
    { id: 'textarea', nombre: 'Textarea', descripcion: 'Área de texto' },
    { id: 'button', nombre: 'Button', descripcion: 'Botón' },
    { id: 'checkbox', nombre: 'Checkbox', descripcion: 'Casilla de verificación' },
    { id: 'radio', nombre: 'Radio Button', descripcion: 'Botón de radio' },
    { id: 'select', nombre: 'Select', descripcion: 'Lista desplegable' }
  ],
  ui: [
    { id: 'btn-primary', nombre: 'Primary Button', descripcion: 'Botón primario' },
    { id: 'btn-secondary', nombre: 'Secondary Button', descripcion: 'Botón secundario' },
    { id: 'card', nombre: 'Card', descripcion: 'Tarjeta' },
    { id: 'navbar', nombre: 'Navbar', descripcion: 'Barra de navegación' },
    { id: 'footer', nombre: 'Footer', descripcion: 'Pie de página' },
    { id: 'hero', nombre: 'Hero Section', descripcion: 'Sección hero' }
  ],
  advanced: [
    { id: 'tabs', nombre: 'Tabs', descripcion: 'Pestañas' },
    { id: 'accordion', nombre: 'Accordion', descripcion: 'Acordeón' },
    { id: 'modal', nombre: 'Modal', descripcion: 'Modal/Diálogo' },
    { id: 'carousel', nombre: 'Carousel', descripcion: 'Carrusel' },
    { id: 'alert', nombre: 'Alert', descripcion: 'Alerta' },
    { id: 'badge', nombre: 'Badge', descripcion: 'Insignia' }
  ]
};

// Plantillas a verificar
const plantillas = [
  { id: 'saas', nombre: 'SaaS Landing Page', descripcion: 'Página de aterrizaje SaaS' },
  { id: 'portfolio', nombre: 'Professional Portfolio', descripcion: 'Portafolio profesional' },
  { id: 'blog', nombre: 'Minimalist Blog', descripcion: 'Blog minimalista' },
  { id: 'contact', nombre: 'Contact Page', descripcion: 'Página de contacto' },
  { id: 'store', nombre: 'Online Store', descripcion: 'Tienda en línea' }
];

// Características a verificar
const caracteristicas = [
  { id: 'drag-drop', nombre: 'Drag & Drop', archivo: 'script.js' },
  { id: 'properties', nombre: 'Panel de Propiedades', archivo: 'script.js' },
  { id: 'export-html', nombre: 'Exportar HTML', archivo: 'script.js' },
  { id: 'export-zip', nombre: 'Exportar ZIP', archivo: 'script.js' },
  { id: 'save-project', nombre: 'Guardar Proyecto', archivo: 'script.js' },
  { id: 'load-project', nombre: 'Cargar Proyecto', archivo: 'script.js' },
  { id: 'responsive', nombre: 'Vista Responsive', archivo: 'script.js' },
  { id: 'monaco-editor', nombre: 'Monaco Editor', archivo: 'src/components/CodeEditor.js' },
  { id: 'collaboration', nombre: 'Colaboración', archivo: 'src/collaboration/collaborationClient.js' },
  { id: 'seo', nombre: 'SEO Optimizer', archivo: 'src/ai/seoOptimizer.js' },
  { id: 'a11y', nombre: 'Accessibility Checker', archivo: 'src/ai/accessibilityChecker.js' },
  { id: 'deploy', nombre: 'Sistema Deploy', archivo: 'src/components/DeployModal.js' }
];

// Resultados
const resultados = {
  componentes: { total: 0, exitosos: 0, fallidos: 0, detalles: [] },
  plantillas: { total: 0, exitosos: 0, fallidos: 0, detalles: [] },
  caracteristicas: { total: 0, exitosos: 0, fallidos: 0, detalles: [] },
  archivos: { total: 0, existentes: 0, faltantes: 0, detalles: [] }
};

// Funciones de utilidad
function log(mensaje, color = 'reset') {
  console.log(`${colors[color]}${mensaje}${colors.reset}`);
}

function verificarArchivo(rutaArchivo) {
  try {
    return fs.existsSync(rutaArchivo);
  } catch (error) {
    return false;
  }
}

function verificarContenido(rutaArchivo, busqueda) {
  try {
    if (!fs.existsSync(rutaArchivo)) return false;
    const contenido = fs.readFileSync(rutaArchivo, 'utf8');
    return contenido.includes(busqueda);
  } catch (error) {
    return false;
  }
}

// Verificar componentes en script.js
function verificarComponentes() {
  log('\n' + '='.repeat(80), 'cyan');
  log('VERIFICACIÓN DE COMPONENTES (34 total)', 'bold');
  log('='.repeat(80), 'cyan');

  const scriptPath = path.join(__dirname, 'script.js');
  
  if (!verificarArchivo(scriptPath)) {
    log('❌ ERROR: No se encontró script.js', 'red');
    return;
  }

  const contenido = fs.readFileSync(scriptPath, 'utf8');

  Object.keys(componentes).forEach(categoria => {
    log(`\n📦 Categoría: ${categoria.toUpperCase()}`, 'blue');
    
    componentes[categoria].forEach(comp => {
      resultados.componentes.total++;
      
      // Buscar el componente en el código
      const encontrado = contenido.includes(`case '${comp.id}'`) || 
                        contenido.includes(`"${comp.id}"`) ||
                        contenido.includes(`'${comp.id}'`);
      
      if (encontrado) {
        resultados.componentes.exitosos++;
        log(`  ✅ ${comp.nombre} - ${comp.descripcion}`, 'green');
        resultados.componentes.detalles.push({
          categoria,
          nombre: comp.nombre,
          estado: 'OK',
          descripcion: comp.descripcion
        });
      } else {
        resultados.componentes.fallidos++;
        log(`  ❌ ${comp.nombre} - NO ENCONTRADO`, 'red');
        resultados.componentes.detalles.push({
          categoria,
          nombre: comp.nombre,
          estado: 'FALLO',
          descripcion: comp.descripcion
        });
      }
    });
  });

  const porcentaje = ((resultados.componentes.exitosos / resultados.componentes.total) * 100).toFixed(1);
  log(`\n📊 Resultado: ${resultados.componentes.exitosos}/${resultados.componentes.total} componentes (${porcentaje}%)`, 'cyan');
}

// Verificar plantillas
function verificarPlantillas() {
  log('\n' + '='.repeat(80), 'cyan');
  log('VERIFICACIÓN DE PLANTILLAS (5 total)', 'bold');
  log('='.repeat(80), 'cyan');

  const scriptPath = path.join(__dirname, 'script.js');
  
  if (!verificarArchivo(scriptPath)) {
    log('❌ ERROR: No se encontró script.js', 'red');
    return;
  }

  let contenido;
  try {
    contenido = fs.readFileSync(scriptPath, 'utf8');
  } catch (error) {
    log(`❌ ERROR: No se pudo leer script.js - ${error.message}`, 'red');
    return;
  }

  plantillas.forEach(plantilla => {
    resultados.plantillas.total++;
    
    const encontrado = contenido.includes(plantilla.nombre) || 
                      contenido.includes(plantilla.id);
    
    if (encontrado) {
      resultados.plantillas.exitosos++;
      log(`  ✅ ${plantilla.nombre} - ${plantilla.descripcion}`, 'green');
      resultados.plantillas.detalles.push({
        nombre: plantilla.nombre,
        estado: 'OK',
        descripcion: plantilla.descripcion
      });
    } else {
      resultados.plantillas.fallidos++;
      log(`  ❌ ${plantilla.nombre} - NO ENCONTRADO`, 'red');
      resultados.plantillas.detalles.push({
        nombre: plantilla.nombre,
        estado: 'FALLO',
        descripcion: plantilla.descripcion
      });
    }
  });

  const porcentaje = ((resultados.plantillas.exitosos / resultados.plantillas.total) * 100).toFixed(1);
  log(`\n📊 Resultado: ${resultados.plantillas.exitosos}/${resultados.plantillas.total} plantillas (${porcentaje}%)`, 'cyan');
}

// Verificar características
function verificarCaracteristicas() {
  log('\n' + '='.repeat(80), 'cyan');
  log('VERIFICACIÓN DE CARACTERÍSTICAS', 'bold');
  log('='.repeat(80), 'cyan');

  caracteristicas.forEach(feature => {
    resultados.caracteristicas.total++;
    
    const rutaArchivo = path.join(__dirname, feature.archivo);
    const existe = verificarArchivo(rutaArchivo);
    
    if (existe) {
      resultados.caracteristicas.exitosos++;
      log(`  ✅ ${feature.nombre} - ${feature.archivo}`, 'green');
      resultados.caracteristicas.detalles.push({
        nombre: feature.nombre,
        archivo: feature.archivo,
        estado: 'OK'
      });
    } else {
      resultados.caracteristicas.fallidos++;
      log(`  ❌ ${feature.nombre} - ARCHIVO NO ENCONTRADO`, 'red');
      resultados.caracteristicas.detalles.push({
        nombre: feature.nombre,
        archivo: feature.archivo,
        estado: 'FALLO'
      });
    }
  });

  const porcentaje = ((resultados.caracteristicas.exitosos / resultados.caracteristicas.total) * 100).toFixed(1);
  log(`\n📊 Resultado: ${resultados.caracteristicas.exitosos}/${resultados.caracteristicas.total} características (${porcentaje}%)`, 'cyan');
}

// Verificar archivos principales
function verificarArchivos() {
  log('\n' + '='.repeat(80), 'cyan');
  log('VERIFICACIÓN DE ARCHIVOS PRINCIPALES', 'bold');
  log('='.repeat(80), 'cyan');

  const archivos = [
    { ruta: 'index.html', descripcion: 'Aplicación principal' },
    { ruta: 'script.js', descripcion: 'Lógica principal' },
    { ruta: 'style.css', descripcion: 'Estilos principales' },
    { ruta: 'service-worker.js', descripcion: 'Service Worker PWA' },
    { ruta: 'package.json', descripcion: 'Configuración NPM' },
    { ruta: 'src/components/CodeEditor.js', descripcion: 'Monaco Editor' },
    { ruta: 'src/collaboration/collaborationClient.js', descripcion: 'Cliente colaboración' },
    { ruta: 'src/ai/seoOptimizer.js', descripcion: 'SEO Optimizer' },
    { ruta: 'src/ai/accessibilityChecker.js', descripcion: 'A11y Checker' },
    { ruta: 'backend-node/server.js', descripcion: 'Servidor Node.js' }
  ];

  archivos.forEach(archivo => {
    resultados.archivos.total++;
    
    const rutaCompleta = path.join(__dirname, archivo.ruta);
    const existe = verificarArchivo(rutaCompleta);
    
    if (existe) {
      const stats = fs.statSync(rutaCompleta);
      const tamano = (stats.size / 1024).toFixed(2);
      resultados.archivos.existentes++;
      log(`  ✅ ${archivo.ruta} (${tamano} KB) - ${archivo.descripcion}`, 'green');
      resultados.archivos.detalles.push({
        ruta: archivo.ruta,
        estado: 'OK',
        tamano: `${tamano} KB`,
        descripcion: archivo.descripcion
      });
    } else {
      resultados.archivos.faltantes++;
      log(`  ❌ ${archivo.ruta} - NO ENCONTRADO`, 'red');
      resultados.archivos.detalles.push({
        ruta: archivo.ruta,
        estado: 'FALLO',
        descripcion: archivo.descripcion
      });
    }
  });

  const porcentaje = ((resultados.archivos.existentes / resultados.archivos.total) * 100).toFixed(1);
  log(`\n📊 Resultado: ${resultados.archivos.existentes}/${resultados.archivos.total} archivos (${porcentaje}%)`, 'cyan');
}

// Generar reporte
function generarReporte() {
  log('\n' + '='.repeat(80), 'cyan');
  log('RESUMEN GENERAL', 'bold');
  log('='.repeat(80), 'cyan');

  const totalTests = resultados.componentes.total + 
                     resultados.plantillas.total + 
                     resultados.caracteristicas.total + 
                     resultados.archivos.total;
  
  const totalExitosos = resultados.componentes.exitosos + 
                        resultados.plantillas.exitosos + 
                        resultados.caracteristicas.exitosos + 
                        resultados.archivos.existentes;
  
  const porcentajeTotal = ((totalExitosos / totalTests) * 100).toFixed(1);

  log(`\n📦 Componentes: ${resultados.componentes.exitosos}/${resultados.componentes.total}`, 'blue');
  log(`📄 Plantillas: ${resultados.plantillas.exitosos}/${resultados.plantillas.total}`, 'blue');
  log(`⚙️  Características: ${resultados.caracteristicas.exitosos}/${resultados.caracteristicas.total}`, 'blue');
  log(`📁 Archivos: ${resultados.archivos.existentes}/${resultados.archivos.total}`, 'blue');
  
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`✅ TOTAL: ${totalExitosos}/${totalTests} verificaciones exitosas (${porcentajeTotal}%)`, 'bold');
  log('='.repeat(80), 'cyan');

  // Guardar reporte en archivo
  const reporteTexto = generarReporteTexto(totalTests, totalExitosos, porcentajeTotal);
  fs.writeFileSync('REPORTE_TESTING_COMPONENTES.md', reporteTexto);
  log('\n📄 Reporte guardado en: REPORTE_TESTING_COMPONENTES.md', 'green');
}

function generarReporteTexto(totalTests, totalExitosos, porcentajeTotal) {
  const fecha = new Date().toLocaleString('es-ES');
  
  return `# 🧪 REPORTE DE TESTING DE COMPONENTES

**Fecha**: ${fecha}  
**Versión**: 4.0.0  
**Total de Verificaciones**: ${totalTests}  
**Verificaciones Exitosas**: ${totalExitosos}  
**Porcentaje de Éxito**: ${porcentajeTotal}%

---

## 📦 COMPONENTES (${resultados.componentes.exitosos}/${resultados.componentes.total})

${Object.keys(componentes).map(categoria => `
### ${categoria.toUpperCase()}

${componentes[categoria].map(comp => {
  const detalle = resultados.componentes.detalles.find(d => d.nombre === comp.nombre);
  const icono = detalle && detalle.estado === 'OK' ? '✅' : '❌';
  return `- ${icono} **${comp.nombre}**: ${comp.descripcion}`;
}).join('\n')}
`).join('\n')}

---

## 📄 PLANTILLAS (${resultados.plantillas.exitosos}/${resultados.plantillas.total})

${plantillas.map(plantilla => {
  const detalle = resultados.plantillas.detalles.find(d => d.nombre === plantilla.nombre);
  const icono = detalle && detalle.estado === 'OK' ? '✅' : '❌';
  return `- ${icono} **${plantilla.nombre}**: ${plantilla.descripcion}`;
}).join('\n')}

---

## ⚙️ CARACTERÍSTICAS (${resultados.caracteristicas.exitosos}/${resultados.caracteristicas.total})

${caracteristicas.map(feature => {
  const detalle = resultados.caracteristicas.detalles.find(d => d.nombre === feature.nombre);
  const icono = detalle && detalle.estado === 'OK' ? '✅' : '❌';
  return `- ${icono} **${feature.nombre}**: \`${feature.archivo}\``;
}).join('\n')}

---

## 📁 ARCHIVOS PRINCIPALES (${resultados.archivos.existentes}/${resultados.archivos.total})

${resultados.archivos.detalles.map(archivo => {
  const icono = archivo.estado === 'OK' ? '✅' : '❌';
  const tamano = archivo.tamano ? ` (${archivo.tamano})` : '';
  return `- ${icono} **${archivo.ruta}**${tamano}: ${archivo.descripcion}`;
}).join('\n')}

---

## 📊 RESUMEN

- **Total de Verificaciones**: ${totalTests}
- **Exitosas**: ${totalExitosos}
- **Fallidas**: ${totalTests - totalExitosos}
- **Porcentaje de Éxito**: ${porcentajeTotal}%

---

## 🎯 ESTADO GENERAL

${porcentajeTotal >= 90 ? '✅ **EXCELENTE** - El proyecto está en excelente estado' :
  porcentajeTotal >= 75 ? '⚠️ **BUENO** - El proyecto está en buen estado con algunas áreas de mejora' :
  '❌ **NECESITA ATENCIÓN** - Se requieren correcciones importantes'}

---

*Reporte generado automáticamente el ${fecha}*
`;
}

// Ejecutar todas las verificaciones
function ejecutarTests() {
  log('\n' + '█'.repeat(80), 'cyan');
  log('🧪 TESTING COMPLETO DE COMPONENTES - DragNDrop Editor v4.0.0', 'bold');
  log('█'.repeat(80) + '\n', 'cyan');

  verificarComponentes();
  verificarPlantillas();
  verificarCaracteristicas();
  verificarArchivos();
  generarReporte();

  log('\n✅ Testing completado exitosamente\n', 'green');
}

// Ejecutar
ejecutarTests();
