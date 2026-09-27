/* ==========================================================================
   METALES DECORADOS — Nucleo compartido
   - Configuracion unica del negocio (un solo lugar que editar)
   - Constructor de enlaces de WhatsApp con mensaje contextual
   - Sistema de placeholders de fotografia (se auto-reemplaza al subir la foto)
   - Header, menu movil, animaciones de entrada
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) CONFIGURACION DEL NEGOCIO
   Todo dato real vive aqui. Nada de datos inventados repartidos por el HTML.
   -------------------------------------------------------------------------- */
const MD = {
  nombre: 'Metales Decorados',

  // CONFIRMADO por el cliente
  telefono: '+506 8850-9207',
  whatsapp: '50688509207',          // formato internacional sin signos
  ciudad: 'Guadalupe, Goicoechea',
  provincia: 'San José, Costa Rica',
  instagram: 'https://www.instagram.com/metales_decorados01/',

  // [PENDIENTE CONFIRMAR CON CLIENTE] — dejar vacio mientras no este confirmado.
  // Al llenarse, la seccion correspondiente aparece sola.
  email: '',                        // no inventar correo
  direccionExacta: '',              // ej: '150 m sur de ... , Barrio Pilar'
  horario: '',                      // ej: 'Lun a Vie 8:00 - 17:00'
  mapsEmbed: '',                    // URL de iframe de Google Maps
  googleBusiness: '',               // URL del perfil real de Google Business
  facebook: '',

  // Resenas de Google: el negocio todavia no tiene perfil de Google Business.
  // Al crearlo, anotar aqui la calificacion y el total reales. Nunca inventarlos.
  google: { rating: '', total: 0 }
};

/* --------------------------------------------------------------------------
   2) WHATSAPP — mensajes contextuales, nunca "Hola, quiero informacion"
   -------------------------------------------------------------------------- */
function waLink(mensaje){
  return 'https://wa.me/' + MD.whatsapp + '?text=' + encodeURIComponent(mensaje);
}

/* Cada enlace declara su propio contexto con data-wa="..." */
function initWhatsApp(){
  document.querySelectorAll('[data-wa]').forEach(function(el){
    el.setAttribute('href', waLink(el.dataset.wa));
    el.setAttribute('target','_blank');
    el.setAttribute('rel','noopener');
  });
}

/* --------------------------------------------------------------------------
   3) PLACEHOLDERS DE FOTOGRAFIA
   Cada <img data-ph="Porton - Proyecto 01" src="img/portones-01.jpg">
   muestra un marcador claramente identificado mientras la foto no exista.
   Cuando se sube "img/portones-01.jpg", la foto real aparece automaticamente
   sin tocar una sola linea de codigo.
   -------------------------------------------------------------------------- */
const PH_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5.5-5.5L7 19"/></svg>';

/* El marcador se dibuja por defecto DEBAJO de la imagen y se retira en cuanto
   la fotografia carga bien. Se hace en este orden a proposito: con
   loading="lazy" el navegador puede no intentar nunca la descarga, y entonces
   el evento "error" no llega a dispararse y el hueco quedaria vacio. */
function initPlaceholders(){
  document.querySelectorAll('img[data-ph]').forEach(function(img){
    if (img.dataset.phInit) return;
    img.dataset.phInit = '1';
    if (!img.parentNode) return;

    const box = document.createElement('div');
    box.className = 'ph';
    const esEn = (typeof idioma !== 'undefined' && idioma === 'en');
    box.innerHTML = PH_ICON +
      '<b>' + (esEn ? 'Photo pending' : 'Fotografía pendiente') + '</b>' +
      '<span>' + (img.dataset.ph || (esEn ? 'Project photo' : 'Imagen del proyecto')) + '</span>';
    img.parentNode.insertBefore(box, img);

    const cargo = function(){
      if (img.naturalWidth > 0){ box.remove(); img.style.display = ''; }
    };
    if (img.complete) { cargo(); }
    img.addEventListener('load', cargo);
    img.addEventListener('error', function(){ img.style.display = 'none'; });
  });
}

/* --------------------------------------------------------------------------
   4) HEADER / MENU / ANIMACIONES
   -------------------------------------------------------------------------- */
function initHeader(){
  const hdr = document.querySelector('.hdr');
  if (hdr){
    const onScroll = function(){ hdr.classList.toggle('is-stuck', window.scrollY > 24); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive:true });
  }
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav){
    burger.addEventListener('click', function(){
      const open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      document.body.classList.toggle('nav-open', open);
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('is-open'); burger.classList.remove('is-open');
        document.body.style.overflow = '';
        document.body.classList.remove('nav-open');
      });
    });
  }
}

function initReveal(){
  const items = document.querySelectorAll('.rv');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('in'); }); return;
  }
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){
        const d = e.target.dataset.delay || 0;
        setTimeout(function(){ e.target.classList.add('in'); }, d);
        io.unobserve(e.target);
      }
    });
  }, { threshold:.12, rootMargin:'0px 0px -60px 0px' });
  items.forEach(function(el){ io.observe(el); });
}

/* Rellena datos del negocio marcados con data-md="telefono" etc. */
function initDatos(){
  document.querySelectorAll('[data-md]').forEach(function(el){
    const v = MD[el.dataset.md];
    if (v) el.textContent = v;
  });
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', function(){
  initDatos();
  initWhatsApp();
  initPlaceholders();
  initHeader();
  initReveal();
});
