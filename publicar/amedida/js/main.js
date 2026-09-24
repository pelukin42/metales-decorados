/* ==========================================================================
   METALES DECORADOS — Plan A Medida
   Servicios, catalogo por categoria, ficha de proyecto y version bilingue
   ========================================================================== */

/* ==========================================================================
   INTERRUPTOR DE CORTE LASER
   PENDIENTE DE CONFIRMACION CON EL CLIENTE.
   La biografia publica de @metales_decorados01 menciona "corte cnc laser",
   pero NO se publica como servicio comercial mientras el propietario no lo
   confirme. Cuando lo confirme: cambiar a true y llenar los textos.
   ========================================================================== */
const MD_LASER = false;

/* --------------------------------------------------------------------------
   SERVICIOS
   Solo lo confirmado por el cliente y por la biografia publica del negocio.
   -------------------------------------------------------------------------- */
const SERVICIOS = [
  {
    id:'portones', tag:'Portones', titulo:'Portones',
    img:'servicio-portones.jpg', ph:'Portón destacado',
    texto:'Portones de entrada fabricados a la medida del acceso: batientes, corredizos o de diseño propio, en hierro forjado y otros acabados.',
    cta:'Cotizar un proyecto similar',
    wa:'Hola, vi la sección de portones en su página web y quisiera cotizar un portón similar.'
  },
  {
    id:'puertas', tag:'Puertas', titulo:'Puertas principales',
    img:'servicio-puertas.jpg', ph:'Puerta principal — foto frontal',
    texto:'Puertas de acceso trabajadas pieza por pieza, pensadas para dar carácter a la fachada sin renunciar a la seguridad.',
    cta:'Cotizar un proyecto similar',
    wa:'Hola, vi la sección de puertas principales en su página web y me gustaría cotizar una puerta.'
  },
  {
    id:'rejas', tag:'Rejas', titulo:'Rejas',
    img:'servicio-rejas.jpg', ph:'Rejas de ventana o protección',
    texto:'Rejas para ventanas, puertas y cerramientos, con la posibilidad de trabajar diseños que acompañen la línea de la casa.',
    cta:'Solicitar cotización',
    wa:'Hola, vi la sección de rejas en su página web y quisiera solicitar una cotización.'
  },
  {
    id:'pasamanos', tag:'Pasamanos', titulo:'Pasamanos y barandas',
    img:'servicio-pasamanos.jpg', ph:'Pasamanos de escalera o baranda',
    texto:'Pasamanos de escalera, barandas de balcón y de terraza, ajustados al espacio y al estilo del proyecto.',
    cta:'Solicitar cotización',
    wa:'Hola, vi la sección de pasamanos en su página web y quisiera cotizar uno para mi proyecto.'
  },
  {
    id:'decoracion', tag:'Decoración', titulo:'Decoración en metal',
    img:'servicio-decoracion.jpg', ph:'Lámpara, candelabro o pieza decorativa',
    texto:'Lámparas, candelabros y piezas decorativas. El metal como parte del diseño del ambiente, no solo como estructura.',
    cta:'Cotizar un proyecto similar',
    wa:'Hola, vi la sección de decoración en metal en su página web y quisiera consultar por una pieza.'
  }
];

const FLECHA = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function pintarServicios(){
  const cont = document.getElementById('servicios-grid');
  if (!cont) return;

  let html = SERVICIOS.map(function(s, i){
    return '<article class="card rv" data-delay="' + ((i % 3) * 70) + '">' +
      '<div class="card__media">' +
        '<span class="tag">' + s.tag + '</span>' +
        '<img src="img/' + s.img + '" alt="' + s.titulo + ' — Metales Decorados" loading="lazy" data-ph="' + s.ph + '">' +
      '</div>' +
      '<div class="card__body">' +
        '<h3>' + s.titulo + '</h3>' +
        '<p>' + s.texto + '</p>' +
        '<a class="card__link" data-wa="' + s.wa + '">' + s.cta + FLECHA + '</a>' +
      '</div></article>';
  }).join('');

  /* Tarjeta de proyectos a medida */
  html += '<article class="card card--feature rv">' +
    '<div class="card__body" style="padding:34px 30px">' +
      '<div class="rule"></div>' +
      '<h3 class="h-md">¿Tenés una idea en mente?</h3>' +
      '<p>Si lo que necesitás no está en esta lista, se puede fabricar igual. Envianos fotografías, una referencia o contanos qué tenés pensado.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">' +
        '<a class="btn btn--primary btn--sm" href="#cotizar">Cotizar mi proyecto</a>' +
        '<a class="btn btn--ghost btn--sm" data-wa="Hola, tengo una idea de un proyecto en metal a medida y me gustaría contarles de qué se trata.">WhatsApp</a>' +
      '</div>' +
    '</div></article>';

  cont.innerHTML = html;

  if (MD_LASER) document.getElementById('bloque-laser').hidden = false;
}

/* ==========================================================================
   CATALOGO DE PROYECTOS
   Estructura lista. Cada proyecto se completa con informacion y fotografias
   reales de Metales Decorados. Los campos marcados como PENDIENTE no se
   inventan: se confirman con el cliente antes de publicar.
   ========================================================================== */
const CATEGORIAS = ['Todos','Portones','Puertas','Rejas','Pasamanos','Decoración','Proyectos especiales'];

/* Las fotografias provienen de las publicaciones reales de @metales_decorados01.
   Las descripciones se apoyan en los pies de foto que el propio negocio publico.
   Lo que no consta en la publicacion queda como PENDIENTE, no se deduce. */
const PROYECTOS = [
  { id:'p01', cat:'Portones',   titulo:'Portón de entrada en hierro forjado',
    resumen:'Portón de dos hojas para acceso vehicular, con remate superior curvo y trabajo de forja.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'Tres Ríos',
    fotos:['proyecto-01-a.jpg','proyecto-01-b.jpg'] },

  { id:'p02', cat:'Portones',   titulo:'Portón vehicular corredizo',
    resumen:'Portón corredizo en hierro forjado, con zócalo de lámina trabajada y remate de lanzas.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'PENDIENTE',
    fotos:['proyecto-02-a.jpg'] },

  { id:'p03', cat:'Portones',   titulo:'Portón de dos hojas con puerta peatonal',
    resumen:'Portón de dos hojas en hierro forjado con puerta peatonal integrada al centro.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'PENDIENTE',
    fotos:['proyecto-03-a.jpg'] },

  { id:'p04', cat:'Rejas',      titulo:'Portón y rejas en hierro forjado',
    resumen:'Conjunto de portón, puerta peatonal y rejas de cerramiento para una misma propiedad.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'Garita, Alajuela',
    fotos:['proyecto-04-a.jpg'] },

  { id:'p05', cat:'Puertas',    titulo:'Puerta principal con diseño calado',
    resumen:'Puerta principal con diseño de pavo real calado en lámina, sobre estructura metálica.',
    tipo:'Fabricación a medida', material:'Lámina de hierro', ubicacion:'PENDIENTE',
    fotos:['proyecto-05-a.jpg'] },

  { id:'p06', cat:'Puertas',    titulo:'Puertas principales en lámina decorada',
    resumen:'Serie de puertas principales en lámina decorada con vidrio abatible, en distintos diseños y acabados.',
    tipo:'Fabricación a medida', material:'Lámina de hierro y vidrio', ubicacion:'PENDIENTE',
    fotos:['proyecto-06-a.jpg','proyecto-06-b.jpg','proyecto-06-c.jpg','proyecto-06-d.jpg'] },

  { id:'p07', cat:'Puertas',    titulo:'Puerta principal en hierro forjado con vidrio',
    resumen:'Puerta doble de acceso con arco superior y trabajo de forja sobre vidrio.',
    tipo:'Fabricación a medida', material:'Hierro forjado y vidrio', ubicacion:'PENDIENTE',
    fotos:['proyecto-07-a.jpg'] },

  { id:'p08', cat:'Pasamanos',  titulo:'Baranda de escalera interna',
    resumen:'Baranda de diseño para escalera de peldaños de madera, fabricada a la medida del tramo.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-08-a.jpg'] },

  { id:'p09', cat:'Decoración', titulo:'Paneles decorativos y lámparas',
    resumen:'Paneles calados en distintos motivos y lámparas fabricadas en el taller.',
    tipo:'Piezas decorativas', material:'PENDIENTE', ubicacion:'Taller, Guadalupe',
    fotos:['proyecto-09-a.jpg'] },

  /* Categoria confirmada por el negocio, pendiente de fotografia.
     Se deja visible para mostrar donde entran las fotos que falten. */
  { id:'p11', cat:'Proyectos especiales', titulo:'Proyecto personalizado',
    resumen:'Trabajos desarrollados a partir de una idea o referencia del cliente.',
    tipo:'Proyecto a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:[] }
];

let filtroActivo = 'Todos';

function pintarFiltros(){
  const cont = document.getElementById('filtros');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(function(c){
    const n = c === 'Todos' ? PROYECTOS.length : PROYECTOS.filter(function(p){ return p.cat === c; }).length;
    return '<button class="filtro' + (c === filtroActivo ? ' is-on' : '') + '" data-cat="' + c + '" role="tab">' +
             c + '<span>' + n + '</span></button>';
  }).join('');

  cont.querySelectorAll('.filtro').forEach(function(b){
    b.addEventListener('click', function(){ aplicarFiltro(b.dataset.cat); });
  });
}

function aplicarFiltro(cat){
  filtroActivo = cat;
  document.querySelectorAll('.filtro').forEach(function(b){
    b.classList.toggle('is-on', b.dataset.cat === cat);
  });
  pintarCatalogo();
}

function pintarCatalogo(){
  const cont = document.getElementById('cat');
  if (!cont) return;

  const lista = filtroActivo === 'Todos'
    ? PROYECTOS
    : PROYECTOS.filter(function(p){ return p.cat === filtroActivo; });

  document.getElementById('cat-vacio').hidden = lista.length > 0;

  cont.innerHTML = lista.map(function(p, i){
    const hayFotos = p.fotos.length > 0;
    const portada = hayFotos ? p.fotos[0] : (p.id + '-a.jpg');
    const contador = hayFotos
      ? p.fotos.length + (p.fotos.length === 1 ? ' foto' : ' fotos')
      : 'Fotos pendientes';

    return '<button class="proj rv" data-delay="' + ((i % 3) * 60) + '" data-id="' + p.id + '" ' +
             'aria-label="Ver ficha de ' + p.titulo + '">' +
      '<div class="proj__media">' +
        '<span class="tag">' + p.cat + '</span>' +
        '<span class="proj__n">' + contador + '</span>' +
        '<img src="img/' + portada + '" alt="' + p.titulo + ' — Metales Decorados" loading="lazy" ' +
             'data-ph="' + p.titulo + '">' +
      '</div>' +
      '<div class="proj__body">' +
        '<span class="proj__meta">' + p.tipo + '</span>' +
        '<h3>' + p.titulo + '</h3>' +
        '<p>' + p.resumen + '</p>' +
        '<span class="proj__ver">Ver ficha del proyecto' + FLECHA + '</span>' +
      '</div></button>';
  }).join('');

  cont.querySelectorAll('.proj').forEach(function(b){
    b.addEventListener('click', function(){ abrirFicha(b.dataset.id); });
  });

  initPlaceholders();
  initReveal();
}

/* --------------------------------------------------------------------------
   FICHA DE PROYECTO
   En produccion cada ficha puede tener su propia URL (por ejemplo
   /proyectos/porton-de-entrada-residencial) para SEO. Aqui se muestra
   en ventana para la propuesta.
   -------------------------------------------------------------------------- */
function dato(v){
  return v === 'PENDIENTE'
    ? '<span class="pend">PENDIENTE CONFIRMAR</span>'
    : v;
}

function abrirFicha(id){
  const p = PROYECTOS.find(function(x){ return x.id === id; });
  if (!p) return;

  /* Comillas angulares: una comilla doble cortaria el atributo data-wa */
  const wa = 'Hola, vi el proyecto «' + p.titulo + '» (' + p.cat + ') en su página web ' +
             'y quisiera cotizar algo similar para mi espacio.';

  const hayFotos = p.fotos.length > 0;
  const portada = hayFotos ? p.fotos[0] : (p.id + '-a.jpg');

  document.getElementById('modal-body').innerHTML =
    '<div class="ficha__hero">' +
      '<img src="img/' + portada + '" alt="' + p.titulo + '" data-ph="' + p.titulo + ' — foto principal">' +
    '</div>' +
    '<div class="ficha__body">' +
      '<p class="ficha__cat">' + p.cat + '</p>' +
      '<h2 id="modal-t">' + p.titulo + '</h2>' +
      '<p class="ficha__desc">' + p.resumen + '</p>' +
      '<div class="ficha__datos">' +
        '<div><b>Tipo de trabajo</b><span>' + dato(p.tipo) + '</span></div>' +
        '<div><b>Material</b><span>' + dato(p.material) + '</span></div>' +
        '<div><b>Ubicación</b><span>' + dato(p.ubicacion) + '</span></div>' +
      '</div>' +
      (p.fotos.length > 1
        ? '<div class="ficha__fotos">' +
            p.fotos.map(function(f, i){
              return '<div><img src="img/' + f + '" alt="' + p.titulo + ' ' + (i+1) + '" data-ph="Foto ' + (i+1) + '"></div>';
            }).join('') +
          '</div>'
        : '') +
      '<div class="ficha__btns">' +
        '<a class="btn btn--primary" href="#cotizar" data-cerrar>Quiero algo similar</a>' +
        '<a class="btn btn--wa" data-wa="' + wa.replace(/"/g, '&quot;') + '">Consultar por WhatsApp</a>' +
      '</div>' +
    '</div>';

  const m = document.getElementById('modal');
  m.hidden = false;
  document.body.style.overflow = 'hidden';
  initPlaceholders();
  initWhatsApp();

  /* "Quiero algo similar": cierra la ficha y abre el cotizador con el tipo de
     trabajo y el proyecto de referencia ya cargados */
  m.querySelectorAll('[data-cerrar]').forEach(function(el){
    el.addEventListener('click', function(){
      cerrarFicha();
      if (typeof czPrecargar === 'function') czPrecargar(TIPO_POR_CAT[p.cat] || 'Otro proyecto', p.titulo);
    });
  });
}

/* Tipo del cotizador que corresponde a cada categoria del catalogo */
const TIPO_POR_CAT = {
  'Portones':'Portón', 'Puertas':'Puerta principal', 'Rejas':'Reja',
  'Pasamanos':'Pasamanos o baranda', 'Decoración':'Decoración',
  'Proyectos especiales':'Otro proyecto'
};

function cerrarFicha(){
  document.getElementById('modal').hidden = true;
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   VERSION BILINGUE (incluida en el Plan A Medida)
   Diccionario de los textos de interfaz. La traduccion completa de todos los
   contenidos se realiza con el cliente durante la produccion.
   -------------------------------------------------------------------------- */
const I18N = {
  en:{
    nav1:'Services', nav2:'Portfolio', nav3:'Reviews', nav4:'FAQ', nav5:'Get a quote', nav6:'Contact',
    cta1:'Quote my project', cta2:'See our work', scroll:'Scroll',
    heroEyebrow:'Metalwork shop · Guadalupe, Goicoechea',
    heroA:'We turn metal into', heroB:'projects built to your measure',
    heroSub:'Custom gates, front doors, railings, handrails and one-off metal projects.',
    sv0:'What we build', sv1:'One workshop, many kinds of project',
    sv2:'From securing an entrance to the piece that defines a living room. Everything is built to each client’s measurements and design.',
    pf0:'Portfolio', pf1:'Project catalogue',
    pf2:'Work organised by type. Open any project to see the full record and request a quote for something similar.',
    ctaB1:'Saw something you like?', ctaB2:'Tell us which piece caught your eye and we will prepare a quote for something similar in your space.',
    fq0:'Frequently asked questions', fq1:'Before you write to us',
    cz0:'Quote', cz1:'Tell us what you need built',
    cz2:'Four short steps. At the end we assemble a clear message so the workshop can reply quickly.',
    ct0:'Contact', ct1:'Let’s talk about your project'
  }
};

let idioma = 'es';
const ORIGINAL = {};

function cambiarIdioma(lang){
  idioma = lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    const k = el.dataset.i18n;
    if (!(k in ORIGINAL)) ORIGINAL[k] = el.textContent;
    el.textContent = (lang === 'es') ? ORIGINAL[k] : (I18N.en[k] || ORIGINAL[k]);
  });
  document.documentElement.lang = (lang === 'es') ? 'es-CR' : 'en';
  document.querySelectorAll('.lang__b').forEach(function(b){
    b.classList.toggle('is-on', b.dataset.lang === lang);
  });
}

/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  pintarServicios();
  pintarFiltros();
  pintarCatalogo();
  initPlaceholders();
  initWhatsApp();
  initReveal();

  /* Guarda los textos originales en espanol */
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    ORIGINAL[el.dataset.i18n] = el.textContent;
  });
  document.querySelectorAll('.lang__b').forEach(function(b){
    b.addEventListener('click', function(){ cambiarIdioma(b.dataset.lang); });
  });

  /* Enlaces del pie que filtran el catalogo */
  document.querySelectorAll('[data-cat]').forEach(function(a){
    if (a.classList.contains('filtro')) return;
    a.addEventListener('click', function(){ aplicarFiltro(a.dataset.cat); });
  });

  /* Cierre de la ficha */
  document.getElementById('modal-x').addEventListener('click', cerrarFicha);
  document.getElementById('modal').addEventListener('click', function(e){
    if (e.target.id === 'modal') cerrarFicha();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !document.getElementById('modal').hidden) cerrarFicha();
  });
});
