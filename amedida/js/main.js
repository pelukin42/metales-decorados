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
    wa:'Hola, vi la sección de portones en su página web y quisiera cotizar un portón similar.',
    en:{
      tag:'Gates', titulo:'Gates', ph:'Featured gate',
      texto:'Entrance gates custom-built for your access: swing, sliding or your own design, in wrought iron and other finishes.',
      cta:'Quote a similar project',
      wa:'Hi, I saw the gates section on your website and would like a quote for a similar gate.'
    }
  },
  {
    id:'puertas', tag:'Puertas', titulo:'Puertas principales',
    img:'servicio-puertas.jpg', ph:'Puerta principal — foto frontal',
    texto:'Puertas de acceso trabajadas pieza por pieza, pensadas para dar carácter a la fachada sin renunciar a la seguridad.',
    cta:'Cotizar un proyecto similar',
    wa:'Hola, vi la sección de puertas principales en su página web y me gustaría cotizar una puerta.',
    en:{
      tag:'Front doors', titulo:'Front doors', ph:'Front door — front view',
      texto:'Front doors crafted piece by piece, designed to give your façade character without giving up security.',
      cta:'Quote a similar project',
      wa:'Hi, I saw the front doors section on your website and would like a quote for a door.'
    }
  },
  {
    id:'rejas', tag:'Rejas', titulo:'Rejas',
    img:'servicio-rejas.jpg', ph:'Rejas de ventana o protección',
    texto:'Rejas para ventanas, puertas y cerramientos, con la posibilidad de trabajar diseños que acompañen la línea de la casa.',
    cta:'Solicitar cotización',
    wa:'Hola, vi la sección de rejas en su página web y quisiera solicitar una cotización.',
    en:{
      tag:'Window bars', titulo:'Window bars', ph:'Window or protection bars',
      texto:'Bars for windows, doors and enclosures, with the option of designs that match the style of the house.',
      cta:'Request a quote',
      wa:'Hi, I saw the window bars section on your website and would like to request a quote.'
    }
  },
  {
    id:'pasamanos', tag:'Barandas', titulo:'Barandas',
    img:'servicio-pasamanos.jpg', ph:'Baranda de escalera o pasamanos',
    texto:'Barandas de escalera, de balcón y de terraza, ajustadas al espacio y al estilo del proyecto.',
    cta:'Solicitar cotización',
    wa:'Hola, vi la sección de barandas en su página web y quisiera cotizar una para mi proyecto.',
    en:{
      tag:'Railings', titulo:'Railings', ph:'Stair railing or handrail',
      texto:'Stair, balcony and terrace railings, fitted to the space and style of the project.',
      cta:'Request a quote',
      wa:'Hi, I saw the railings section on your website and would like a quote for my project.'
    }
  },
  {
    id:'decoracion', tag:'Decoración', titulo:'Decoración en metal',
    img:'servicio-decoracion.jpg', ph:'Lámpara, candelabro o pieza decorativa',
    texto:'Lámparas, candelabros y piezas decorativas. El metal como parte del diseño del ambiente, no solo como estructura.',
    cta:'Cotizar un proyecto similar',
    wa:'Hola, vi la sección de decoración en metal en su página web y quisiera consultar por una pieza.',
    en:{
      tag:'Decor', titulo:'Metal decor', ph:'Lamp, chandelier or decorative piece',
      texto:'Lamps, chandeliers and decorative pieces. Metal as part of the room’s design, not just its structure.',
      cta:'Quote a similar project',
      wa:'Hi, I saw the metal decor section on your website and would like to ask about a piece.'
    }
  }
];

/* Devuelve el campo en espanol o ingles segun el idioma activo */
function t(es, en){
  return (idioma === 'en' && en != null) ? en : es;
}
function svCampo(s, campo){
  return (idioma === 'en' && s.en && s.en[campo] != null) ? s.en[campo] : s[campo];
}

const FLECHA = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function pintarServicios(){
  const cont = document.getElementById('servicios-grid');
  if (!cont) return;

  let html = SERVICIOS.map(function(s, i){
    const titulo = svCampo(s, 'titulo'), tag = svCampo(s, 'tag'),
          texto = svCampo(s, 'texto'), cta = svCampo(s, 'cta'), wa = svCampo(s, 'wa'),
          ph = svCampo(s, 'ph');
    return '<article class="card rv" data-delay="' + ((i % 3) * 70) + '">' +
      '<div class="card__media">' +
        '<span class="tag">' + tag + '</span>' +
        '<img src="img/' + s.img + '" alt="' + titulo + ' — Metales Decorados" loading="lazy" data-ph="' + ph + '">' +
      '</div>' +
      '<div class="card__body">' +
        '<h3>' + titulo + '</h3>' +
        '<p>' + texto + '</p>' +
        '<a class="card__link" data-wa="' + wa + '">' + cta + FLECHA + '</a>' +
      '</div></article>';
  }).join('');

  /* Tarjeta de proyectos a medida */
  html += '<article class="card card--feature rv">' +
    '<div class="card__body" style="padding:34px 30px">' +
      '<div class="rule"></div>' +
      '<h3 class="h-md">' + t('¿Tenés una idea en mente?', 'Have an idea in mind?') + '</h3>' +
      '<p>' + t('Si lo que necesitás no está en esta lista, se puede fabricar igual. Envianos fotografías, una referencia o contanos qué tenés pensado.',
                 'If what you need isn’t on this list, it can still be made. Send us photos, a reference or tell us what you have in mind.') + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">' +
        '<a class="btn btn--primary btn--sm" href="#cotizar">' + t('Cotizar mi proyecto', 'Quote my project') + '</a>' +
        '<a class="btn btn--ghost btn--sm" data-wa="' + t('Hola, tengo una idea de un proyecto en metal a medida y me gustaría contarles de qué se trata.',
                 'Hi, I have an idea for a custom metal project and would like to tell you about it.') + '">WhatsApp</a>' +
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
const CATEGORIAS = ['Todos','Portones','Puertas','Rejas','Barandas','Decoración','Muebles','Lámparas'];
const CAT_LABEL_EN = {
  'Todos':'All', 'Portones':'Gates', 'Puertas':'Front doors',
  'Rejas':'Window bars', 'Barandas':'Railings', 'Decoración':'Decor', 'Muebles':'Furniture', 'Lámparas':'Lamps'
};
function catLabel(c){ return t(c, CAT_LABEL_EN[c]); }

/* Las fotografias provienen de las publicaciones reales de @metales_decorados01.
   Las descripciones se apoyan en los pies de foto que el propio negocio publico.
   Lo que no consta en la publicacion queda como PENDIENTE, no se deduce. */
const PROYECTOS = [
  { id:'p01', cat:'Portones',   titulo:'Portón de entrada en hierro forjado',
    resumen:'Portón de dos hojas para acceso vehicular, con remate superior curvo y trabajo de forja.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'Tres Ríos',
    fotos:['proyecto-01-a.jpg','proyecto-01-b.jpg'],
    en:{ titulo:'Wrought iron entrance gate',
      resumen:'Two-leaf gate for vehicle access, with a curved top rail and forged ironwork.',
      tipo:'Custom fabrication', material:'Wrought iron', ubicacion:'Tres Ríos' } },

  { id:'p02', cat:'Portones',   titulo:'Portón vehicular corredizo',
    resumen:'Portón corredizo en hierro forjado, con zócalo de lámina trabajada y remate de lanzas.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'PENDIENTE',
    fotos:['proyecto-02-a.jpg'],
    en:{ titulo:'Sliding vehicle gate',
      resumen:'Sliding gate in wrought iron, with a worked sheet-metal base and spear-tip trim.',
      tipo:'Custom fabrication', material:'Wrought iron' } },

  { id:'p03', cat:'Portones',   titulo:'Portón de dos hojas con puerta peatonal',
    resumen:'Portón de dos hojas en hierro forjado con puerta peatonal integrada al centro.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'PENDIENTE',
    fotos:['proyecto-03-a.jpg'],
    en:{ titulo:'Two-leaf gate with pedestrian door',
      resumen:'Two-leaf wrought iron gate with a pedestrian door built into the center.',
      tipo:'Custom fabrication', material:'Wrought iron' } },

  { id:'p04', cat:'Rejas',      titulo:'Portón y rejas en hierro forjado',
    resumen:'Conjunto de portón, puerta peatonal y rejas de cerramiento para una misma propiedad.',
    tipo:'Fabricación a medida', material:'Hierro forjado', ubicacion:'Garita, Alajuela',
    fotos:['proyecto-04-a.jpg'],
    en:{ titulo:'Gate and window bars in wrought iron',
      resumen:'Set of gate, pedestrian door and enclosure bars for a single property.',
      tipo:'Custom fabrication', material:'Wrought iron', ubicacion:'Garita, Alajuela' } },

  { id:'p05', cat:'Puertas',    titulo:'Puerta principal con diseño calado',
    resumen:'Puerta principal con diseño de pavo real calado en lámina, sobre estructura metálica.',
    tipo:'Fabricación a medida', material:'Lámina de hierro', ubicacion:'PENDIENTE',
    fotos:['proyecto-05-a.jpg'],
    en:{ titulo:'Front door with cut-out design',
      resumen:'Front door with a peacock design cut into sheet metal, over a metal frame.',
      tipo:'Custom fabrication', material:'Iron sheet' } },

  { id:'p06', cat:'Puertas',    titulo:'Puertas principales en lámina decorada',
    resumen:'Serie de puertas principales en lámina decorada con vidrio abatible, en distintos diseños y acabados.',
    tipo:'Fabricación a medida', material:'Lámina de hierro y vidrio', ubicacion:'PENDIENTE',
    fotos:['proyecto-06-a.jpg','proyecto-06-b.jpg','proyecto-06-c.jpg','proyecto-06-d.jpg'],
    en:{ titulo:'Decorated sheet-metal front doors',
      resumen:'Series of front doors in decorated sheet metal with hinged glass, in different designs and finishes.',
      tipo:'Custom fabrication', material:'Iron sheet and glass' } },

  { id:'p07', cat:'Puertas',    titulo:'Puerta principal en hierro forjado con vidrio',
    resumen:'Puerta doble de acceso con arco superior y trabajo de forja sobre vidrio.',
    tipo:'Fabricación a medida', material:'Hierro forjado y vidrio', ubicacion:'PENDIENTE',
    fotos:['proyecto-07-a.jpg'],
    en:{ titulo:'Wrought iron front door with glass',
      resumen:'Double entry door with an arched top and forged ironwork over glass.',
      tipo:'Custom fabrication', material:'Wrought iron and glass' } },

  { id:'p08', cat:'Barandas',  titulo:'Baranda de escalera interna',
    resumen:'Baranda de diseño para escalera de peldaños de madera, fabricada a la medida del tramo.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-08-a.jpg'],
    en:{ titulo:'Interior stair railing',
      resumen:'Designed railing for a wooden staircase, custom-built to the length of the flight.',
      tipo:'Custom fabrication' } },

  { id:'p09', cat:'Decoración', titulo:'Paneles decorativos y lámparas',
    resumen:'Paneles calados en distintos motivos y lámparas fabricadas en el taller.',
    tipo:'Piezas decorativas', material:'PENDIENTE', ubicacion:'Taller, Guadalupe',
    fotos:['proyecto-09-a.jpg'],
    en:{ titulo:'Decorative panels and lamps',
      resumen:'Cut-out panels in different patterns and lamps made in the workshop.',
      tipo:'Decorative pieces', ubicacion:'Workshop, Guadalupe' } },

  { id:'p10', cat:'Rejas',      titulo:'Cerramiento con guardas rectas y remate de lanza',
    resumen:'Reja de cerramiento en hierro con guardas rectas y remate de lanza sobre pared de bloque.',
    tipo:'Fabricación a medida', material:'Hierro', ubicacion:'PENDIENTE',
    fotos:['proyecto-10-a.jpg'],
    en:{ titulo:'Enclosure with straight bars and spear trim',
      resumen:'Iron enclosure fence with straight bars and spear-tip trim over a block wall.',
      tipo:'Custom fabrication', material:'Iron' } },

  { id:'p12', cat:'Portones',   titulo:'Portón con cenefa geométrica calada',
    resumen:'Portón de dos hojas con panel calado de diseño geométrico y floral en dos ubicaciones distintas.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-12-a.jpg','proyecto-12-b.jpg'],
    en:{ titulo:'Gate with cut-out geometric trim',
      resumen:'Two-leaf gate with a cut-out geometric and floral panel, installed in two different locations.',
      tipo:'Custom fabrication' } },

  { id:'p13', cat:'Puertas',    titulo:'Puerta doble con diseño floral calado y vidrio',
    resumen:'Puerta doble de acceso con paneles laterales, diseño floral calado y vidrio esmerilado.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-13-a.jpg'],
    en:{ titulo:'Double door with cut-out floral design and glass',
      resumen:'Double entry door with side panels, cut-out floral design and frosted glass.',
      tipo:'Custom fabrication' } },

  { id:'p14', cat:'Barandas',  titulo:'Baranda con cenefa circular geométrica',
    resumen:'Baranda de mezanine con panel calado de círculos entrelazados, en interior residencial.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-14-a.jpg'],
    en:{ titulo:'Railing with circular geometric trim',
      resumen:'Mezzanine railing with a cut-out panel of interlocking circles, in a residential interior.',
      tipo:'Custom fabrication' } },

  { id:'p15', cat:'Portones',   titulo:'Portón con hojas de monstera caladas',
    resumen:'Portón corredizo con panel calado de hojas de monstera, instalado en dos proyectos distintos.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-15-a.jpg','proyecto-15-b.jpg'],
    en:{ titulo:'Gate with cut-out monstera leaves',
      resumen:'Sliding gate with a cut-out monstera leaf panel, installed on two different projects.',
      tipo:'Custom fabrication' } },

  { id:'p16', cat:'Rejas',      titulo:'Reja de ventana con guardas y detalle central',
    resumen:'Reja de ventana con guardas torneadas y motivo calado central, sobre marco curvo.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-16-a.jpg'],
    en:{ titulo:'Window bars with center detail',
      resumen:'Window bars with turned pickets and a cut-out center motif, over a curved frame.',
      tipo:'Custom fabrication' } },

  { id:'p17', cat:'Barandas',  titulo:'Baranda de escalera con vista de conjunto',
    resumen:'Baranda de escalera curva en forja, con remates ornamentales en cada tramo.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-17-a.jpg'],
    en:{ titulo:'Stair railing, full view',
      resumen:'Curved forged stair railing, with ornamental finials on each section.',
      tipo:'Custom fabrication' } },

  { id:'p18', cat:'Muebles',    titulo:'Comedor redondo con cuatro sillas',
    resumen:'Juego de comedor en hierro con mesa redonda y cuatro sillas de espaldar calado y asiento tejido, con detalles dorados.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'Taller, Guadalupe',
    fotos:['proyecto-18-a.jpg'],
    en:{ titulo:'Round dining set with four chairs',
      resumen:'Iron dining set with a round table and four chairs with slatted backs and woven seats, with gold-toned details.',
      tipo:'Custom fabrication', ubicacion:'Workshop, Guadalupe' } },

  { id:'p19', cat:'Muebles',    titulo:'Juego de mesa y sillas en blanco con forja decorativa',
    resumen:'Mesa redonda y cuatro sillas en hierro pintado de blanco, con espaldares y base de forja decorativa.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'Taller, Guadalupe',
    fotos:['proyecto-19-a.jpg'],
    en:{ titulo:'White table and chairs set with decorative scrollwork',
      resumen:'Round table and four chairs in white-painted iron, with decorative scrollwork on the backs and base.',
      tipo:'Custom fabrication', ubicacion:'Workshop, Guadalupe' } },

  { id:'p20', cat:'Muebles',    titulo:'Comedor redondo de terraza con sillas de asiento tejido',
    resumen:'Mesa redonda con tapa de acabado granulado y sillas de espaldar de franjas y asiento tejido, en una terraza.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-20-a.jpg'],
    en:{ titulo:'Round patio dining set with woven-seat chairs',
      resumen:'Round table with a speckled top and chairs with slatted backs and woven seats, on a patio.',
      tipo:'Custom fabrication' } },

  { id:'p21', cat:'Muebles',    titulo:'Comedor ovalado con sillas de forja y asiento tapizado',
    resumen:'Mesa ovalada con tapa de vidrio oscuro y sillas con brazos de forja y asiento tapizado.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-21-a.jpg'],
    en:{ titulo:'Oval dining set with scrolled iron chairs and upholstered seats',
      resumen:'Oval table with a dark glass top and armchairs in scrolled ironwork with upholstered seats.',
      tipo:'Custom fabrication' } },

  { id:'p22', cat:'Muebles',    titulo:'Mesa rectangular de vidrio con sillas en hierro',
    resumen:'Mesa rectangular con tapa de vidrio sobre base curva de hierro, con sillas de respaldo cuadriculado.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-22-a.jpg'],
    en:{ titulo:'Rectangular glass-top table with iron chairs',
      resumen:'Rectangular table with a glass top on a curved iron base, with grid-back chairs.',
      tipo:'Custom fabrication' } },

  { id:'p23', cat:'Lámparas',   titulo:'Lámpara colgante de forja con brazos en espiral',
    resumen:'Lámpara colgante en hierro forjado con base calada de volutas y brazos que sostienen los focos, acabado claro.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-23-a.jpg'],
    en:{ titulo:'Wrought iron pendant light with scrolled arms',
      resumen:'Wrought iron pendant light with a cut-out scrollwork base and arms holding the bulbs, in a light finish.',
      tipo:'Custom fabrication' } },

  { id:'p24', cat:'Lámparas',   titulo:'Lámparas colgantes doradas para salón',
    resumen:'Tres lámparas colgantes de brazos curvos con portavelas, en acabado dorado, instaladas en un salón de techo alto.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-24-a.jpg'],
    en:{ titulo:'Gold pendant lights for a hall',
      resumen:'Three pendant lights with curved arms and candle holders, in a gold finish, installed in a high-ceilinged hall.',
      tipo:'Custom fabrication' } },

  { id:'p25', cat:'Lámparas',   titulo:'Lámpara de forja negra para techo de madera',
    resumen:'Lámpara colgante en hierro forjado negro, con volutas y brazos con focos, sobre techo de vigas de madera.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-25-a.jpg'],
    en:{ titulo:'Black wrought iron light for a wood ceiling',
      resumen:'Black wrought iron pendant light with scrolls and bulb arms, under a timber-beam ceiling.',
      tipo:'Custom fabrication' } },

  { id:'p26', cat:'Lámparas',   titulo:'Farol de hierro con vidrio',
    resumen:'Farol colgante en hierro con puerta de vidrio y soporte con volutas, para pared o corredor.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-26-a.jpg'],
    en:{ titulo:'Iron lantern with glass',
      resumen:'Hanging iron lantern with a glass door and scrolled bracket, for a wall or corridor.',
      tipo:'Custom fabrication' } },

  { id:'p27', cat:'Lámparas',   titulo:'Lámpara colgante de brazos en espiral',
    resumen:'Lámpara colgante en hierro forjado con brazos en espiral y remates de volutas, en acabado claro envejecido.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-27-a.jpg'],
    en:{ titulo:'Pendant light with spiral arms',
      resumen:'Wrought iron pendant light with spiral arms and scroll finials, in an aged light finish.',
      tipo:'Custom fabrication' } },

  { id:'p28', cat:'Lámparas',   titulo:'Lámpara colgante de forja de gran formato',
    resumen:'Lámpara colgante de gran formato en hierro forjado negro, con aros, volutas y remates de hoja, bajo un techo de madera.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-28-a.jpg'],
    en:{ titulo:'Large-format wrought iron pendant light',
      resumen:'Large-format pendant light in black wrought iron, with rings, scrolls and leaf finials, under a wood ceiling.',
      tipo:'Custom fabrication' } },

  { id:'p29', cat:'Lámparas',   titulo:'Lámpara colgante de dos niveles con cenefa calada',
    resumen:'Lámpara colgante de dos niveles en hierro forjado, con aros calados con cenefa y brazos con portavelas, sobre una sala amplia.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-29-a.jpg'],
    en:{ titulo:'Two-tier pendant light with cut-out trim',
      resumen:'Two-tier wrought iron pendant light with patterned rings and candle-holder arms, over a large living room.',
      tipo:'Custom fabrication' } },

  { id:'p30', cat:'Lámparas',   titulo:'Lámparas colgantes de cadenas para techo abovedado',
    resumen:'Lámparas colgantes de forja con cadenas, aros calados y brazos con portavelas, instaladas bajo un techo abovedado de madera.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-30-a.jpg'],
    en:{ titulo:'Chain-hung pendant lights for a vaulted ceiling',
      resumen:'Wrought iron pendant lights with chains, patterned rings and candle-holder arms, installed under a vaulted wood ceiling.',
      tipo:'Custom fabrication' } },

  { id:'p31', cat:'Lámparas',   titulo:'Farol de pared con vidrio esmerilado',
    resumen:'Farol de pared en hierro negro con vidrio esmerilado y marco cuadriculado, instalado en el corredor de una casa.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-31-a.jpg'],
    en:{ titulo:'Wall lantern with frosted glass',
      resumen:'Wall lantern in black iron with frosted glass and a gridded frame, installed on a home corridor.',
      tipo:'Custom fabrication' } },

  { id:'p32', cat:'Lámparas',   titulo:'Farol de poste sobre columna de piedra',
    resumen:'Farol en hierro negro con vidrio esmerilado, montado sobre la columna de piedra de un acceso.',
    tipo:'Fabricación a medida', material:'PENDIENTE', ubicacion:'PENDIENTE',
    fotos:['proyecto-32-a.jpg'],
    en:{ titulo:'Post lantern on a stone column',
      resumen:'Lantern in black iron with frosted glass, mounted on the stone column of an entrance.',
      tipo:'Custom fabrication' } }
];
function pCampo(p, campo){
  const v = p[campo];
  if (v === 'PENDIENTE') return 'PENDIENTE';
  return (idioma === 'en' && p.en && p.en[campo] != null) ? p.en[campo] : v;
}

let filtroActivo = 'Todos';

function pintarFiltros(){
  const cont = document.getElementById('filtros');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(function(c){
    const n = c === 'Todos' ? PROYECTOS.length : PROYECTOS.filter(function(p){ return p.cat === c; }).length;
    return '<button class="filtro' + (c === filtroActivo ? ' is-on' : '') + '" data-cat="' + c + '" role="tab">' +
             catLabel(c) + '<span>' + n + '</span></button>';
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
    const titulo = pCampo(p, 'titulo'), resumen = pCampo(p, 'resumen'), tipo = pCampo(p, 'tipo');
    const contador = hayFotos
      ? p.fotos.length + (p.fotos.length === 1 ? t(' foto',' photo') : t(' fotos',' photos'))
      : t('Fotos pendientes','Photos pending');

    return '<button class="proj rv" data-delay="' + ((i % 3) * 60) + '" data-id="' + p.id + '" ' +
             'aria-label="' + t('Ver ficha de ', 'View project sheet for ') + titulo + '">' +
      '<div class="proj__media">' +
        '<span class="tag">' + catLabel(p.cat) + '</span>' +
        '<span class="proj__n">' + contador + '</span>' +
        '<img src="img/' + portada + '" alt="' + titulo + ' — Metales Decorados" loading="lazy" ' +
             'data-ph="' + titulo + '">' +
      '</div>' +
      '<div class="proj__body">' +
        '<span class="proj__meta">' + tipo + '</span>' +
        '<h3>' + titulo + '</h3>' +
        '<p>' + resumen + '</p>' +
        '<span class="proj__ver">' + t('Ver ficha del proyecto','View project sheet') + FLECHA + '</span>' +
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
    ? '<span class="pend">' + t('PENDIENTE CONFIRMAR', 'PENDING — TO CONFIRM') + '</span>'
    : v;
}

let fichaActual = null;

function abrirFicha(id){
  const p = PROYECTOS.find(function(x){ return x.id === id; });
  if (!p) return;
  fichaActual = id;

  const titulo = pCampo(p, 'titulo'), resumen = pCampo(p, 'resumen'), tipo = pCampo(p, 'tipo'),
        material = pCampo(p, 'material'), ubicacion = pCampo(p, 'ubicacion'), catTx = catLabel(p.cat);

  /* Comillas angulares: una comilla doble cortaria el atributo data-wa */
  const wa = t(
    'Hola, vi el proyecto «' + titulo + '» (' + catTx + ') en su página web y quisiera cotizar algo similar para mi espacio.',
    'Hi, I saw the project “' + titulo + '” (' + catTx + ') on your website and would like a quote for something similar for my space.'
  );

  const hayFotos = p.fotos.length > 0;
  const portada = hayFotos ? p.fotos[0] : (p.id + '-a.jpg');

  document.getElementById('modal-body').innerHTML =
    '<div class="ficha__hero">' +
      '<img src="img/' + portada + '" alt="' + titulo + '" data-ph="' + titulo + t(' — foto principal',' — main photo') + '">' +
    '</div>' +
    '<div class="ficha__body">' +
      '<p class="ficha__cat">' + catTx + '</p>' +
      '<h2 id="modal-t">' + titulo + '</h2>' +
      '<p class="ficha__desc">' + resumen + '</p>' +
      '<div class="ficha__datos">' +
        '<div><b>' + t('Tipo de trabajo','Type of work') + '</b><span>' + dato(tipo) + '</span></div>' +
        '<div><b>' + t('Material','Material') + '</b><span>' + dato(material) + '</span></div>' +
        '<div><b>' + t('Ubicación','Location') + '</b><span>' + dato(ubicacion) + '</span></div>' +
      '</div>' +
      (p.fotos.length > 1
        ? '<div class="ficha__fotos">' +
            p.fotos.map(function(f, i){
              return '<div><img src="img/' + f + '" alt="' + titulo + ' ' + (i+1) + '" data-ph="' + t('Foto ','Photo ') + (i+1) + '"></div>';
            }).join('') +
          '</div>'
        : '') +
      '<div class="ficha__btns">' +
        '<a class="btn btn--primary" href="#cotizar" data-cerrar>' + t('Quiero algo similar','I want something similar') + '</a>' +
        '<a class="btn btn--wa" data-wa="' + wa.replace(/"/g, '&quot;') + '">' + t('Consultar por WhatsApp','Ask on WhatsApp') + '</a>' +
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
  'Barandas':'Barandas o pasamanos', 'Decoración':'Decoración'
};

function cerrarFicha(){
  document.getElementById('modal').hidden = true;
  document.body.style.overflow = '';
  fichaActual = null;
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
    ct0:'Contact', ct1:'Let’s talk about your project',

    /* Barra de datos */
    strip1b:'Guadalupe, Goicoechea', strip1s:'San José, Costa Rica',
    strip2b:'Wrought iron and aluminum', strip2s:'Materials we work with',
    strip3b:'Quote by WhatsApp', strip3s:'+506 8850-9207',
    strip4b:'Custom fabrication', strip4s:'Every project is quoted based on its own design',

    /* Corte laser (bloque desactivado) */
    laserEyebrow:'Laser cutting', laserH:'Fiber laser cutting',
    laserMuted:'Materials, thicknesses, maximum sheet size, and whether the service is offered to third parties.',
    laserBtn:'Ask about this',

    /* Catalogo vacio / descarga */
    catVacio:'There are no projects in this category yet.',
    descargarCatalogo:'Download catalogue',

    /* Proyectos a medida */
    medidaEyebrow:'Custom projects', medidaH:'Have an idea in mind?',
    medidaP:'You don’t need to know anything about metalwork, or have a blueprint. With a photo of the space, a reference image, or a description of what you have in mind, we can already start working on a quote.',
    medidaStep1:'Tell us what you need and where it goes.',
    medidaStep2:'Send photos or references, if you have them.',
    medidaStep3:'Metales Decorados replies with the quote.',
    medidaWa:'Tell us on WhatsApp',

    /* Resenas */
    resEyebrow:'Reviews', resH:'Reviews on Google',
    resScore:'No Google Business<br>profile yet',
    resTx:'When the workshop has its Google Business profile, this block will show its real rating and reviews, with a button to leave a review. <b>No reviews written by third parties or fictitious testimonials are added.</b>',

    /* Preguntas frecuentes */
    faqLede:'If your question isn’t here, the virtual assistant in the corner can help, or connect you directly to WhatsApp.',
    faqQ1:'Do you do custom work?',
    faqA1:'Yes. Most of the work is custom-built, based on the space, measurements and design each client needs.',
    faqQ2:'How can I request a quote?',
    faqA2:'You can fill out the quote form on this page, talk to the virtual assistant, or write directly on WhatsApp at <span data-md="telefono">+506 8850-9207</span>.',
    faqQ3:'What information do you need to quote?',
    faqA3:'Type of work, the area where it would be installed, approximate measurements (even if estimated), and, if you have one, a photo of the space or a reference image of the style you want.',
    faqQ4:'Can I send a reference photo?',
    faqA4:'Yes, and it’s the fastest way to move forward. Photos are attached directly in the WhatsApp chat.',
    faqQ5:'What materials do you work with?',
    faqA5:'According to the business’s public information, they mainly work with <b>wrought iron</b> and <b>aluminum</b>. The full detail of materials and finishes is <span class="pend">PENDING — TO CONFIRM WITH CLIENT</span>.',
    faqQ6:'What areas do you serve?',
    faqA6:'The workshop is in Guadalupe, Goicoechea, San José. The exact coverage area is <span class="pend">PENDING — TO CONFIRM WITH CLIENT</span>.',
    faqQ7:'Do you do installation?',
    faqQ8:'How long does a project take?',
    faqA8:'<span class="pend">PENDING — TO CONFIRM WITH CLIENT</span> Timelines depend on the type of work and are not published until confirmed with the workshop.',
    faqQ9:'Do you offer a warranty?',
    faqQ10:'What payment methods do you accept?',
    pendCliente:'PENDING — TO CONFIRM WITH CLIENT',

    /* Cotizar */
    czHint:'This quote form does not calculate prices or confirm availability. It gathers the project information so Metales Decorados can prepare the quote.',

    /* Contacto */
    contactCardH:'Metales Decorados',
    contactAddr:'Guadalupe, Goicoechea<br>San José, Costa Rica',
    contactPend:'PENDING TO CONFIRM',
    contactPendTx:'Business hours, exact address and email address',
    contactCall:'Call now',
    contactMapH:'Map pending',
    contactMapTx:'The Google map will be added once the workshop’s exact address is confirmed.',

    /* Footer */
    ftrDesc:'Fabrication of gates, doors, window bars, railings and metal decor, custom-built for each project.',
    ftrServicios:'Services', ftrPortones:'Gates', ftrPuertas:'Front doors', ftrRejas:'Window bars',
    ftrBarandas:'Railings', ftrDecoracion:'Metal decor',
    ftrContacto:'Contact', ftrCotizar:'Request a quote',
    ftrCopy:'Metales Decorados · Guadalupe, Goicoechea, San José.',

    heroPh:'Main photo — featured project, horizontal',
    laserPh:'Laser-cut piece',
    medidaPh:'Workshop or fabrication process photo — vertical'
  }
};

let idioma = 'es';
const ORIGINAL = {};

function cambiarIdioma(lang){
  idioma = lang;

  /* Textos estaticos marcados con data-i18n (se preserva el HTML interno,
     por ejemplo <b> o <span class="pend">, no solo el texto plano) */
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    const k = el.dataset.i18n;
    if (!(k in ORIGINAL)) ORIGINAL[k] = el.innerHTML;
    el.innerHTML = (lang === 'es') ? ORIGINAL[k] : (I18N.en[k] != null ? I18N.en[k] : ORIGINAL[k]);
  });
  document.documentElement.lang = (lang === 'es') ? 'es-CR' : 'en';
  document.querySelectorAll('.lang__b').forEach(function(b){
    b.classList.toggle('is-on', b.dataset.lang === lang);
  });

  /* Imagenes estaticas con marcador "Fotografia pendiente" traducible */
  document.querySelectorAll('img[data-i18n-ph]').forEach(function(img){
    const k = img.dataset.i18nPh;
    if (!(k in ORIGINAL)) ORIGINAL[k] = img.dataset.ph;
    img.dataset.ph = (lang === 'es') ? ORIGINAL[k] : (I18N.en[k] != null ? I18N.en[k] : ORIGINAL[k]);
    if (img.previousElementSibling && img.previousElementSibling.classList.contains('ph')){
      const span = img.previousElementSibling.querySelector('span');
      if (span) span.textContent = img.dataset.ph;
    }
  });

  /* Contenido generado por JS: se vuelve a pintar en el idioma activo */
  pintarServicios();
  pintarFiltros();
  pintarCatalogo();
  if (fichaActual) abrirFicha(fichaActual);
  if (typeof czPintar === 'function' && document.getElementById('wz-form')) czPintar();
  if (typeof botRepintar === 'function') botRepintar();
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
    ORIGINAL[el.dataset.i18n] = el.innerHTML;
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
