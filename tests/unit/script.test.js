/**
 * @jest-environment jsdom
 */

const { createComponent } = require('./script');

describe('createComponent', () => {
  test('debe crear un elemento H1 correctamente', () => {
    document.body.innerHTML = '<div id="canvas"></div>';
    const element = createComponent('h1');

    // Verificamos el tagName y la clase
    expect(element.tagName).toBe('H1');
    expect(element.classList.contains('canvas-element')).toBe(true);

    // Verificamos el contenido de texto, ignorando el botón de eliminar
    // El texto del H1 es el primer nodo de texto dentro del elemento
    const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    expect(textNode.textContent).toBe('Título Principal');

    // Verificamos que el botón de eliminar exista
    const deleteBtn = element.querySelector('.delete-btn');
    expect(deleteBtn).not.toBeNull();
    expect(deleteBtn.textContent).toBe('×');
  });
});
