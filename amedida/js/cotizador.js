/* ==========================================================================
   METALES DECORADOS — Cotizador avanzado (Plan A Medida)

   Que hace:   reune la informacion del proyecto en 4 pasos y arma un mensaje
               ordenado de WhatsApp.
   Que NO hace: no calcula precios, no confirma disponibilidad, no promete
               fechas de entrega. Eso lo define el taller.
   ========================================================================== */

const CZ = { paso:0, datos:{} };

const CZ_TIPOS = [
  { v:'Portón',              i:'M3 20h18M5 20V8l7-4 7 4v12M9 20v-6M15 20v-6' },
  { v:'Puerta principal',    i:'M6 21V4a1 1 0 011-1h10a1 1 0 011 1v17M6 21h12M14 12h.01' },
  { v:'Reja',                i:'M4 4v16M9 4v16M15 4v16M20 4v16M4 9h16M4 15h16' },
  { v:'Barandas o pasamanos', i:'M3 17L21 7M6 19v-6M11 16v-6M16 13v-6' },
  { v:'Decoración',          i:'M12 3v4M12 21v-4M8 7h8l-1.5 6h-5L8 7zM10 17h4' },
  { v:'Otro proyecto',       i:'M12 5v14M5 12h14' }
];

/* Etiquetas en ingles para los tipos de proyecto. El valor guardado (v) se
   mantiene siempre en espanol para no romper el cruce con TIPO_POR_CAT en
   main.js; solo cambia lo que se muestra en pantalla. */
const CZ_TIPO_EN = {
  'Portón':'Gate', 'Puerta principal':'Front door', 'Reja':'Window bars',
  'Barandas o pasamanos':'Railings or handrails', 'Decoración':'Decor', 'Otro proyecto':'Other project'
};
function czTipoTx(v){ return (idioma === 'en' && CZ_TIPO_EN[v]) ? CZ_TIPO_EN[v] : v; }

const CZ_PASOS = ['Proyecto','Detalles','Descripción','Contacto'];
const CZ_PASOS_EN = ['Project','Details','Description','Contact'];

/* Diccionario de textos de interfaz del cotizador */
const CZ_I18N = {
  es:{
    p0h:'¿Qué necesitás fabricar?', p0hint:'Elegí la opción más cercana. Si no aparece, marcá «Otro proyecto».',
    p0err:'Seleccioná una opción para continuar.', continuar:'Continuar',

    p1h:'Contanos algunos detalles',
    p1refPre:'Referencia del catálogo: ', p1refPost:'. Con esto el taller entiende el tamaño y el contexto del trabajo.',
    p1hintNoRef:'Con esto el taller entiende el tamaño y el contexto del trabajo.',
    p1lugarLbl:'¿Para qué tipo de lugar es?',
    lugarCasa:'Casa', lugarNegocio:'Negocio', lugarOtro:'Otro',
    zonaLbl:'Zona o ubicación', zonaPh:'Ej: Guadalupe, San José',
    medLbl:'Medidas aproximadas', medPh:'Ej: 3 m x 2 m', medHint:'Si no las tenés, dejalo en blanco.',
    p1err:'Indicanos al menos la zona.', atras:'Atrás',

    p2h:'Contanos sobre el proyecto', p2hint:'Entre más detalle, más precisa puede ser la respuesta del taller.',
    descLbl:'Descripción', descPh:'Ej: portón para entrada de casa, con puerta peatonal a un lado. Me gusta el estilo del proyecto que vi en la página.',
    fotosLbl:'Tengo fotografías del espacio o imágenes de referencia',
    fotosHint:'Las fotos se adjuntan directamente en el chat de WhatsApp al finalizar.',
    p2err:'Escribí una descripción breve del proyecto.',

    p3h:'¿Cómo te contactamos?', p3hint:'Solo lo necesario para responderte.',
    nomLbl:'Nombre', nomPh:'Tu nombre', telLbl:'Teléfono', telPh:'8888-8888',
    p3err:'Necesitamos tu nombre y un teléfono.', solicitar:'Solicitar cotización',

    finH:'Tu solicitud está lista', finHint:'Así la va a recibir Metales Decorados. Revisala y enviala por WhatsApp.',
    finWa:'Continuar por WhatsApp', finCorregir:'Corregir datos',
    finNota:'Esta solicitud no confirma precio, disponibilidad ni fecha de entrega. El taller responde con la cotización.',

    mHola:'Hola, quisiera solicitar una cotización.', mProyecto:'Proyecto', mReferencia:'Referencia: el proyecto «',
    mReferenciaPost:'» del catálogo', mLugar:'Tipo de lugar', mZona:'Zona', mMedidas:'Medidas aproximadas',
    mDesc:'Descripción', mFotos:'Tengo fotografías de referencia.', mNombre:'Mi nombre', mTel:'Teléfono',
    mFinal:'Envío esta solicitud desde la página web.'
  },
  en:{
    p0h:'What do you need built?', p0hint:'Choose the closest option. If it isn’t listed, pick “Other project”.',
    p0err:'Select an option to continue.', continuar:'Continue',

    p1h:'Tell us a few details',
    p1refPre:'Catalogue reference: ', p1refPost:'. This helps the workshop understand the size and context of the work.',
    p1hintNoRef:'This helps the workshop understand the size and context of the work.',
    p1lugarLbl:'What kind of place is it for?',
    lugarCasa:'Home', lugarNegocio:'Business', lugarOtro:'Other',
    zonaLbl:'Area or location', zonaPh:'E.g.: Guadalupe, San José',
    medLbl:'Approximate measurements', medPh:'E.g.: 3 m x 2 m', medHint:'If you don’t have them, leave this blank.',
    p1err:'Please tell us at least the area.', atras:'Back',

    p2h:'Tell us about the project', p2hint:'The more detail, the more precise the workshop’s reply can be.',
    descLbl:'Description', descPh:'E.g.: gate for a house entrance, with a pedestrian door on one side. I like the style of the project I saw on the page.',
    fotosLbl:'I have photos of the space or reference images',
    fotosHint:'Photos are attached directly in the WhatsApp chat at the end.',
    p2err:'Write a short description of the project.',

    p3h:'How can we contact you?', p3hint:'Only what’s needed to get back to you.',
    nomLbl:'Name', nomPh:'Your name', telLbl:'Phone', telPh:'8888-8888',
    p3err:'We need your name and a phone number.', solicitar:'Request quote',

    finH:'Your request is ready', finHint:'This is how Metales Decorados will receive it. Review it and send it on WhatsApp.',
    finWa:'Continue on WhatsApp', finCorregir:'Edit details',
    finNota:'This request does not confirm price, availability or a delivery date. The workshop replies with the quote.',

    mHola:'Hello, I would like to request a quote.', mProyecto:'Project', mReferencia:'Reference: the project “',
    mReferenciaPost:'” from the catalogue', mLugar:'Type of place', mZona:'Area', mMedidas:'Approximate measurements',
    mDesc:'Description', mFotos:'I have reference photos.', mNombre:'My name', mTel:'Phone',
    mFinal:'I’m sending this request from the website.'
  }
};
function ct(k){ return (idioma === 'en' ? CZ_I18N.en[k] : CZ_I18N.es[k]); }

/* Escapa lo que escribe el visitante antes de volver a ponerlo en el HTML:
   una comilla (por ejemplo, medidas en pulgadas: 2" x 4") cortaria el value */
function czEsc(v){
  return String(v || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

function czIcono(d){
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
         'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
}

/* --------------------------------------------------------------------------
   PASOS
   -------------------------------------------------------------------------- */
function czPaso0(){
  return '<div class="wz-step">' +
    '<h3>' + ct('p0h') + '</h3>' +
    '<p class="hint">' + ct('p0hint') + '</p>' +
    '<div class="chips">' +
      CZ_TIPOS.map(function(ti){
        return '<button type="button" class="chip' + (CZ.datos.tipo === ti.v ? ' is-on' : '') +
               '" data-tipo="' + ti.v + '">' + czIcono(ti.i) + czTipoTx(ti.v) + '</button>';
      }).join('') +
    '</div>' +
    '<div class="wz-err" id="wz-err" hidden>' + ct('p0err') + '</div>' +
    '<div class="wz-nav"><button type="button" class="btn btn--primary" data-next>' + ct('continuar') + '</button></div>' +
  '</div>';
}

function czPaso1(){
  const lugares = [
    { v:'Casa', tx:ct('lugarCasa') }, { v:'Negocio', tx:ct('lugarNegocio') }, { v:'Otro', tx:ct('lugarOtro') }
  ];
  return '<div class="wz-step">' +
    '<h3>' + ct('p1h') + '</h3>' +
    '<p class="hint">' +
      (CZ.datos.ref ? ct('p1refPre') + '<b>«' + czEsc(CZ.datos.ref) + '»</b>' + ct('p1refPost') : ct('p1hintNoRef')) +
    '</p>' +

    '<div class="field">' +
      '<label>' + ct('p1lugarLbl') + '</label>' +
      '<div class="chips" style="grid-template-columns:repeat(auto-fit,minmax(110px,1fr))">' +
        lugares.map(function(l){
          return '<button type="button" class="chip' + (CZ.datos.lugar === l.v ? ' is-on' : '') +
                 '" data-lugar="' + l.v + '">' + l.tx + '</button>';
        }).join('') +
      '</div>' +
    '</div>' +

    '<div class="form-grid">' +
      '<div class="field">' +
        '<label for="cz-zona">' + ct('zonaLbl') + ' <i>*</i></label>' +
        '<input class="input" id="cz-zona" placeholder="' + ct('zonaPh') + '" value="' + czEsc(CZ.datos.zona) + '">' +
      '</div>' +
      '<div class="field">' +
        '<label for="cz-med">' + ct('medLbl') + '</label>' +
        '<input class="input" id="cz-med" placeholder="' + ct('medPh') + '" value="' + czEsc(CZ.datos.medidas) + '">' +
        '<p class="hint">' + ct('medHint') + '</p>' +
      '</div>' +
    '</div>' +

    '<div class="wz-err" id="wz-err" hidden>' + ct('p1err') + '</div>' +
    '<div class="wz-nav">' +
      '<button type="button" class="btn btn--ghost" data-prev>' + ct('atras') + '</button>' +
      '<button type="button" class="btn btn--primary" data-next>' + ct('continuar') + '</button>' +
    '</div>' +
  '</div>';
}

function czPaso2(){
  return '<div class="wz-step">' +
    '<h3>' + ct('p2h') + '</h3>' +
    '<p class="hint">' + ct('p2hint') + '</p>' +

    '<div class="field">' +
      '<label for="cz-desc">' + ct('descLbl') + ' <i>*</i></label>' +
      '<textarea class="textarea" id="cz-desc" placeholder="' + ct('descPh') + '">' + czEsc(CZ.datos.desc) + '</textarea>' +
    '</div>' +

    '<div class="field">' +
      '<label class="check"><input type="checkbox" id="cz-fotos"' + (CZ.datos.fotos ? ' checked' : '') + '> ' +
      '<span>' + ct('fotosLbl') + '</span></label>' +
      '<p class="hint">' + ct('fotosHint') + '</p>' +
    '</div>' +

    '<div class="wz-err" id="wz-err" hidden>' + ct('p2err') + '</div>' +
    '<div class="wz-nav">' +
      '<button type="button" class="btn btn--ghost" data-prev>' + ct('atras') + '</button>' +
      '<button type="button" class="btn btn--primary" data-next>' + ct('continuar') + '</button>' +
    '</div>' +
  '</div>';
}

function czPaso3(){
  return '<div class="wz-step">' +
    '<h3>' + ct('p3h') + '</h3>' +
    '<p class="hint">' + ct('p3hint') + '</p>' +

    '<div class="form-grid">' +
      '<div class="field">' +
        '<label for="cz-nom">' + ct('nomLbl') + ' <i>*</i></label>' +
        '<input class="input" id="cz-nom" placeholder="' + ct('nomPh') + '" value="' + czEsc(CZ.datos.nombre) + '">' +
      '</div>' +
      '<div class="field">' +
        '<label for="cz-tel">' + ct('telLbl') + ' <i>*</i></label>' +
        '<input class="input" id="cz-tel" type="tel" placeholder="' + ct('telPh') + '" value="' + czEsc(CZ.datos.tel) + '">' +
      '</div>' +
    '</div>' +

    '<div class="wz-err" id="wz-err" hidden>' + ct('p3err') + '</div>' +
    '<div class="wz-nav">' +
      '<button type="button" class="btn btn--ghost" data-prev>' + ct('atras') + '</button>' +
      '<button type="button" class="btn btn--primary" data-next>' + ct('solicitar') + '</button>' +
    '</div>' +
  '</div>';
}

/* --------------------------------------------------------------------------
   MENSAJE FINAL DE WHATSAPP
   -------------------------------------------------------------------------- */
function czMensaje(){
  const d = CZ.datos;
  let m = ct('mHola') + '\n\n';
  m += ct('mProyecto') + ': ' + czTipoTx(d.tipo) + '\n';
  if (d.ref)     m += ct('mReferencia') + d.ref + ct('mReferenciaPost') + '\n';
  if (d.lugar)   m += ct('mLugar') + ': ' + d.lugar + '\n';
  if (d.zona)    m += ct('mZona') + ': ' + d.zona + '\n';
  if (d.medidas) m += ct('mMedidas') + ': ' + d.medidas + '\n';
  m += ct('mDesc') + ': ' + d.desc + '\n\n';
  if (d.fotos)   m += ct('mFotos') + '\n\n';
  m += ct('mNombre') + ': ' + d.nombre + '\n';
  m += ct('mTel') + ': ' + d.tel + '\n\n';
  m += ct('mFinal');
  return m;
}

function czFinal(){
  const msg = czMensaje();
  return '<div class="wz-step wz-done">' +
    '<div class="wz-done__ok">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12.5l5.5 5.5L20 7"/></svg>' +
    '</div>' +
    '<h3>' + ct('finH') + '</h3>' +
    '<p class="hint">' + ct('finHint') + '</p>' +
    '<div class="wz-resumen">' + czEsc(msg) + '</div>' +
    '<a class="btn btn--wa btn--block" id="cz-wa" target="_blank" rel="noopener">' + ct('finWa') + '</a>' +
    '<button type="button" class="btn btn--ghost btn--block btn--sm" data-prev style="margin-top:10px">' + ct('finCorregir') + '</button>' +
    '<p class="hint" style="margin-top:16px">' + ct('finNota') + '</p>' +
  '</div>';
}

/* --------------------------------------------------------------------------
   MOTOR DEL COTIZADOR
   -------------------------------------------------------------------------- */
function czGuardar(){
  const g = function(id){ const e = document.getElementById(id); return e ? e.value.trim() : ''; };
  if (CZ.paso === 1){
    CZ.datos.zona = g('cz-zona');
    CZ.datos.medidas = g('cz-med');
  }
  if (CZ.paso === 2){
    CZ.datos.desc = g('cz-desc');
    const c = document.getElementById('cz-fotos');
    CZ.datos.fotos = c ? c.checked : false;
  }
  if (CZ.paso === 3){
    CZ.datos.nombre = g('cz-nom');
    CZ.datos.tel = g('cz-tel');
  }
}

function czValido(){
  if (CZ.paso === 0) return !!CZ.datos.tipo;
  if (CZ.paso === 1) return !!CZ.datos.zona;
  if (CZ.paso === 2) return !!CZ.datos.desc;
  if (CZ.paso === 3) return !!CZ.datos.nombre && !!CZ.datos.tel;
  return true;
}

function czPintar(){
  const form = document.getElementById('wz-form');
  const vistas = [czPaso0, czPaso1, czPaso2, czPaso3, czFinal];
  form.innerHTML = vistas[CZ.paso]();

  /* Barra de progreso y pasos */
  const pasos = (idioma === 'en') ? CZ_PASOS_EN : CZ_PASOS;
  const total = pasos.length;
  const pct = Math.min(100, ((CZ.paso + 1) / total) * 100);
  document.getElementById('wz-bar').style.width = pct + '%';
  document.getElementById('wz-dots').innerHTML = pasos.map(function(p, i){
    const cls = i === CZ.paso ? 'is-on' : (i < CZ.paso ? 'is-done' : '');
    return '<span class="' + cls + '">' + (i+1) + '. ' + p + '</span>';
  }).join('');

  /* Selecciones */
  form.querySelectorAll('[data-tipo]').forEach(function(b){
    b.addEventListener('click', function(){
      CZ.datos.tipo = b.dataset.tipo;
      form.querySelectorAll('[data-tipo]').forEach(function(x){ x.classList.remove('is-on'); });
      b.classList.add('is-on');
      const err = document.getElementById('wz-err'); if (err) err.hidden = true;
    });
  });
  form.querySelectorAll('[data-lugar]').forEach(function(b){
    b.addEventListener('click', function(){
      CZ.datos.lugar = b.dataset.lugar;
      form.querySelectorAll('[data-lugar]').forEach(function(x){ x.classList.remove('is-on'); });
      b.classList.add('is-on');
    });
  });

  /* Navegacion */
  const next = form.querySelector('[data-next]');
  if (next) next.addEventListener('click', function(){
    czGuardar();
    if (!czValido()){
      const err = document.getElementById('wz-err');
      if (err) err.hidden = false;
      return;
    }
    CZ.paso++;
    czPintar();
    document.getElementById('wizard').scrollIntoView({ behavior:'smooth', block:'center' });
  });

  form.querySelectorAll('[data-prev]').forEach(function(b){
    b.addEventListener('click', function(){
      if (CZ.paso > 0){ CZ.paso--; czPintar(); }
    });
  });

  /* Enlace final */
  const wa = document.getElementById('cz-wa');
  if (wa) wa.href = waLink(czMensaje());

  /* NOTA DE IMPLEMENTACION
     En produccion, al llegar al paso final se envia tambien una copia de la
     solicitud al correo del negocio, para que quede registro aunque el
     visitante no pulse WhatsApp.
     Requiere correo del cliente: [PENDIENTE CONFIRMAR CON CLIENTE] */
}

/* Permite que el catalogo o el asistente precarguen el tipo de proyecto
   y, opcionalmente, el proyecto del catalogo que se tomo como referencia */
function czPrecargar(tipo, ref){
  CZ.datos.tipo = tipo;
  CZ.datos.ref = ref || '';
  CZ.paso = 1;
  czPintar();
}

document.addEventListener('DOMContentLoaded', function(){
  if (document.getElementById('wz-form')) czPintar();
});
