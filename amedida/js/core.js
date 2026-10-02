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
  // Mapa de Google (URL del iframe). Apunta a la ficha del negocio en Google Maps
  // ("Metales Decorados", taller de metalurgia, tel. +506 8850 9207; se identifica por su cid,
  // que no cambia aunque cambie el texto). mapaExacto = true porque el pin es el de esa ficha.
  // Si en algun momento se cambia por un mapa de la zona, poner mapaExacto en false: aparece
  // el rotulo "Zona del taller".
  mapsEmbed: 'https://www.google.com/maps?cid=17291793771946771893&hl=es&output=embed',
  mapaExacto: true,
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
   el evento "error" no llega a dispararse y el hueco quedaria vacio.

   Mientras la foto baja NO se lee "Fotografia pendiente" (parecia que faltaba): se ve
   un borroso de la propia foto (data-lqip) o un fondo liso. El texto aparece solo si la
   foto de verdad falla o no existe. */
function initPlaceholders(){
  document.querySelectorAll('img[data-ph]').forEach(function(img){
    if (img.dataset.phInit) return;
    img.dataset.phInit = '1';
    if (!img.parentNode) return;
    if (img.complete && img.naturalWidth > 0) return;      // ya estaba en cache: no hace falta marcador

    const box = document.createElement('div');
    box.className = 'ph ph--carga';
    const esEn = (typeof idioma !== 'undefined' && idioma === 'en');
    box.innerHTML = PH_ICON +
      '<b>' + (esEn ? 'Photo pending' : 'Fotografía pendiente') + '</b>' +
      '<span>' + (img.dataset.ph || (esEn ? 'Project photo' : 'Imagen del proyecto')) + '</span>';
    if (img.dataset.lqip){
      box.classList.add('ph--lqip');
      box.style.backgroundImage = 'url("' + img.dataset.lqip + '")';
      if (img.style.objectPosition) box.style.backgroundPosition = img.style.objectPosition;
    }
    /* Si la foto va dentro de un <picture>, el marcador va antes del <picture> */
    const ref = (img.parentNode.tagName === 'PICTURE') ? img.parentNode : img;
    ref.parentNode.insertBefore(box, ref);

    const listo = function(){
      box.classList.add('ph--fuera');                       // se desvanece y deja ver la foto
      setTimeout(function(){ box.remove(); }, 500);
      img.style.display = '';
    };
    const cargo = function(){ if (img.naturalWidth > 0) listo(); };
    const fallo = function(){
      /* Si falla la copia liviana (WebP) de un <picture>, se prueba con la foto
         original antes de dejar el marcador "Fotografia pendiente" */
      const pic = img.parentNode;
      if (pic && pic.tagName === 'PICTURE' && pic.querySelector('source')){
        const original = img.getAttribute('src');
        pic.querySelectorAll('source').forEach(function(s){ s.remove(); });
        img.removeAttribute('src');
        img.src = original;
        return;
      }
      img.style.display = 'none';
      box.classList.remove('ph--carga', 'ph--lqip');          // ahora si: "Fotografia pendiente"
      box.style.backgroundImage = '';
    };
    if (img.complete){
      if (img.naturalWidth > 0) listo();
      else if (img.currentSrc) fallo();                       // intento cargar y fallo
    }
    img.addEventListener('load', cargo);
    img.addEventListener('error', fallo);
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
  /* Mapa de Google: solo si hay URL en MD.mapsEmbed. loading="lazy" evita bajar el mapa
     (pesado) hasta que la persona llega al contacto. Si el mapa no apunta al lugar exacto del
     negocio (mapaExacto = false), un rotulo aclara que muestra la zona. */
  const caja = document.querySelector('.contact__map');
  if (caja && MD.mapsEmbed){
    caja.innerHTML =
      '<iframe src="' + MD.mapsEmbed + '" title="Mapa de Google: ' + MD.ciudad + '" ' +
        'loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
      (MD.mapaExacto ? '' :
        '<span class="contact__zona" data-i18n="contactMapZona">Zona del taller · Ubicación exacta por confirmar</span>');
  }
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
