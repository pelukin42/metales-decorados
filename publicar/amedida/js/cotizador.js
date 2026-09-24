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
  { v:'Pasamanos o baranda', i:'M3 17L21 7M6 19v-6M11 16v-6M16 13v-6' },
  { v:'Decoración',          i:'M12 3v4M12 21v-4M8 7h8l-1.5 6h-5L8 7zM10 17h4' },
  { v:'Otro proyecto',       i:'M12 5v14M5 12h14' }
];

const CZ_PASOS = ['Proyecto','Detalles','Descripción','Contacto'];

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
    '<h3>¿Qué necesitás fabricar?</h3>' +
    '<p class="hint">Elegí la opción más cercana. Si no aparece, marcá «Otro proyecto».</p>' +
    '<div class="chips">' +
      CZ_TIPOS.map(function(t){
        return '<button type="button" class="chip' + (CZ.datos.tipo === t.v ? ' is-on' : '') +
               '" data-tipo="' + t.v + '">' + czIcono(t.i) + t.v + '</button>';
      }).join('') +
    '</div>' +
    '<div class="wz-err" id="wz-err" hidden>Seleccioná una opción para continuar.</div>' +
    '<div class="wz-nav"><button type="button" class="btn btn--primary" data-next>Continuar</button></div>' +
  '</div>';
}

function czPaso1(){
  return '<div class="wz-step">' +
    '<h3>Contanos algunos detalles</h3>' +
    '<p class="hint">' +
      (CZ.datos.ref ? 'Referencia del catálogo: <b>«' + czEsc(CZ.datos.ref) + '»</b>. ' : '') +
      'Con esto el taller entiende el tamaño y el contexto del trabajo.</p>' +

    '<div class="field">' +
      '<label>¿Para qué tipo de lugar es?</label>' +
      '<div class="chips" style="grid-template-columns:repeat(auto-fit,minmax(110px,1fr))">' +
        ['Casa','Negocio','Otro'].map(function(v){
          return '<button type="button" class="chip' + (CZ.datos.lugar === v ? ' is-on' : '') +
                 '" data-lugar="' + v + '">' + v + '</button>';
        }).join('') +
      '</div>' +
    '</div>' +

    '<div class="form-grid">' +
      '<div class="field">' +
        '<label for="cz-zona">Zona o ubicación <i>*</i></label>' +
        '<input class="input" id="cz-zona" placeholder="Ej: Guadalupe, San José" value="' + czEsc(CZ.datos.zona) + '">' +
      '</div>' +
      '<div class="field">' +
        '<label for="cz-med">Medidas aproximadas</label>' +
        '<input class="input" id="cz-med" placeholder="Ej: 3 m x 2 m" value="' + czEsc(CZ.datos.medidas) + '">' +
        '<p class="hint">Si no las tenés, dejalo en blanco.</p>' +
      '</div>' +
    '</div>' +

    '<div class="wz-err" id="wz-err" hidden>Indicanos al menos la zona.</div>' +
    '<div class="wz-nav">' +
      '<button type="button" class="btn btn--ghost" data-prev>Atrás</button>' +
      '<button type="button" class="btn btn--primary" data-next>Continuar</button>' +
    '</div>' +
  '</div>';
}

function czPaso2(){
  return '<div class="wz-step">' +
    '<h3>Contanos sobre el proyecto</h3>' +
    '<p class="hint">Entre más detalle, más precisa puede ser la respuesta del taller.</p>' +

    '<div class="field">' +
      '<label for="cz-desc">Descripción <i>*</i></label>' +
      '<textarea class="textarea" id="cz-desc" placeholder="Ej: portón para entrada de casa, con puerta peatonal a un lado. Me gusta el estilo del proyecto que vi en la página.">' + czEsc(CZ.datos.desc) + '</textarea>' +
    '</div>' +

    '<div class="field">' +
      '<label class="check"><input type="checkbox" id="cz-fotos"' + (CZ.datos.fotos ? ' checked' : '') + '> ' +
      '<span>Tengo fotografías del espacio o imágenes de referencia</span></label>' +
      '<p class="hint">Las fotos se adjuntan directamente en el chat de WhatsApp al finalizar.</p>' +
    '</div>' +

    '<div class="wz-err" id="wz-err" hidden>Escribí una descripción breve del proyecto.</div>' +
    '<div class="wz-nav">' +
      '<button type="button" class="btn btn--ghost" data-prev>Atrás</button>' +
      '<button type="button" class="btn btn--primary" data-next>Continuar</button>' +
    '</div>' +
  '</div>';
}

function czPaso3(){
  return '<div class="wz-step">' +
    '<h3>¿Cómo te contactamos?</h3>' +
    '<p class="hint">Solo lo necesario para responderte.</p>' +

    '<div class="form-grid">' +
      '<div class="field">' +
        '<label for="cz-nom">Nombre <i>*</i></label>' +
        '<input class="input" id="cz-nom" placeholder="Tu nombre" value="' + czEsc(CZ.datos.nombre) + '">' +
      '</div>' +
      '<div class="field">' +
        '<label for="cz-tel">Teléfono <i>*</i></label>' +
        '<input class="input" id="cz-tel" type="tel" placeholder="8888-8888" value="' + czEsc(CZ.datos.tel) + '">' +
      '</div>' +
    '</div>' +

    '<div class="wz-err" id="wz-err" hidden>Necesitamos tu nombre y un teléfono.</div>' +
    '<div class="wz-nav">' +
      '<button type="button" class="btn btn--ghost" data-prev>Atrás</button>' +
      '<button type="button" class="btn btn--primary" data-next>Solicitar cotización</button>' +
    '</div>' +
  '</div>';
}

/* --------------------------------------------------------------------------
   MENSAJE FINAL DE WHATSAPP
   -------------------------------------------------------------------------- */
function czMensaje(){
  const d = CZ.datos;
  let m = 'Hola, quisiera solicitar una cotización.\n\n';
  m += 'Proyecto: ' + d.tipo + '\n';
  if (d.ref)     m += 'Referencia: el proyecto «' + d.ref + '» del catálogo\n';
  if (d.lugar)   m += 'Tipo de lugar: ' + d.lugar + '\n';
  if (d.zona)    m += 'Zona: ' + d.zona + '\n';
  if (d.medidas) m += 'Medidas aproximadas: ' + d.medidas + '\n';
  m += 'Descripción: ' + d.desc + '\n\n';
  if (d.fotos)   m += 'Tengo fotografías de referencia.\n\n';
  m += 'Mi nombre: ' + d.nombre + '\n';
  m += 'Teléfono: ' + d.tel + '\n\n';
  m += 'Envío esta solicitud desde la página web.';
  return m;
}

function czFinal(){
  const msg = czMensaje();
  return '<div class="wz-step wz-done">' +
    '<div class="wz-done__ok">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12.5l5.5 5.5L20 7"/></svg>' +
    '</div>' +
    '<h3>Tu solicitud está lista</h3>' +
    '<p class="hint">Así la va a recibir Metales Decorados. Revisala y enviala por WhatsApp.</p>' +
    '<div class="wz-resumen">' + czEsc(msg) + '</div>' +
    '<a class="btn btn--wa btn--block" id="cz-wa" target="_blank" rel="noopener">Continuar por WhatsApp</a>' +
    '<button type="button" class="btn btn--ghost btn--block btn--sm" data-prev style="margin-top:10px">Corregir datos</button>' +
    '<p class="hint" style="margin-top:16px">Esta solicitud no confirma precio, disponibilidad ni fecha de entrega. ' +
    'El taller responde con la cotización.</p>' +
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
  const total = CZ_PASOS.length;
  const pct = Math.min(100, ((CZ.paso + 1) / total) * 100);
  document.getElementById('wz-bar').style.width = pct + '%';
  document.getElementById('wz-dots').innerHTML = CZ_PASOS.map(function(p, i){
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
