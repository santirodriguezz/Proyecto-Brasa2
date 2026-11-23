// js/main.js
import { platosBrasa } from './mockData.js';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. RENDERIZADO DINÁMICO Y FILTROS (index.html)
  // ==========================================
  const contenedorGrid = document.querySelector('.grid-platos');
  const inputBuscador = document.getElementById('q');
  const botonesFiltro = document.querySelectorAll('.filtros a');

  function renderizarPlatos(lista) {
    if (!contenedorGrid) return;
    contenedorGrid.innerHTML = '';

    if (lista.length === 0) {
      contenedorGrid.innerHTML = '<p class="muted" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No se encontraron platos.</p>';
      return;
    }

    lista.forEach(plato => {
      const article = document.createElement('article');
      article.className = 'plato';
      article.innerHTML = `
        <a href="detalle.html?id=${plato.id}"><img src="${plato.imagen}" alt="${plato.nombre}"></a>
        <div class="plato-cuerpo">
          <span class="eyebrow">${plato.categoria.toUpperCase()}</span>
          <h3>${plato.nombre}</h3>
          <p class="muted"><small>${plato.descripcion}</small></p>
          <div class="plato-pie">
            <span>${plato.precio.toFixed(2).replace('.', ',')} €</span>
            <a class="mas" href="detalle.html?id=${plato.id}" aria-label="Añadir ${plato.nombre}">+</a>
          </div>
        </div>
      `;
      contenedorGrid.appendChild(article);
    });
  }

  // Render inicial si estamos en el index
  if (contenedorGrid) {
    renderizarPlatos(platosBrasa);
  }

  // Buscador en tiempo real
  if (inputBuscador) {
    inputBuscador.addEventListener('input', (e) => {
      const texto = e.target.value.toLowerCase().trim();
      const filtrados = platosBrasa.filter(plato => 
        plato.nombre.toLowerCase().includes(texto) || 
        plato.descripcion.toLowerCase().includes(texto)
      );
      renderizarPlatos(filtrados);
    });
  }

  // Filtros por categoría
  if (botonesFiltro.length > 0) {
    botonesFiltro.forEach(boton => {
      boton.addEventListener('click', (e) => {
        e.preventDefault();
        botonesFiltro.forEach(b => b.removeAttribute('aria-current'));
        boton.setAttribute('aria-current', 'true');

        const categoriaSeleccionada = boton.textContent.toLowerCase().trim();

        if (categoriaSeleccionada === 'todos') {
          renderizarPlatos(platosBrasa);
        } else {
          const filtrados = platosBrasa.filter(p => p.categoria === categoriaSeleccionada);
          renderizarPlatos(filtrados);
        }
      });
    });
  }

  // ==========================================
  // 2. VALIDACIÓN AVANZADA DE FORMULARIOS (DOM)
  // ==========================================
  const formularios = document.querySelectorAll('form');
  formularios.forEach(form => {
    // Evitamos validación nativa HTML5 para mostrar nuestros propios errores en el DOM
    form.setAttribute('novalidate', true);

    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let formValido = true;

      inputs.forEach(input => {
        // Limpiar errores previos
        const errorPrevio = input.parentElement.querySelector('.error-msg');
        if (errorPrevio) errorPrevio.remove();

        if (!input.value.trim()) {
          formValido = false;
          input.style.borderColor = '#C5221F';
          
          const msg = document.createElement('small');
          msg.className = 'error-msg';
          msg.style.color = '#C5221F';
          msg.style.marginTop = '4px';
          msg.style.display = 'block';
          msg.textContent = 'Este campo es obligatorio.';
          input.parentElement.appendChild(msg);
        } else {
          input.style.borderColor = 'var(--borde)';
        }
      });

      if (!formValido) {
        e.preventDefault();
      }
    });
  });
});