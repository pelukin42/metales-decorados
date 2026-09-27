/* ==========================================================================
   METALES DECORADOS — Asistente virtual (Plan A Medida)

   REGLAS DEL ASISTENTE (implementadas, no decorativas):
   - Se presenta SIEMPRE como asistente virtual. Nunca simula ser una persona.
   - NO inventa precios.
   - NO promete fechas de entrega.
   - NO confirma disponibilidad.
   - NO inventa materiales, garantias ni coberturas.
   - NO cierra una cotizacion ni dice que una solicitud fue aceptada.
   - Cuando no tiene una respuesta confirmada, lo dice y deriva a WhatsApp.

   Su unico objetivo es que, cuando el prospecto llegue a WhatsApp, el taller
   ya sepa que quiere, donde esta, que necesita y las medidas aproximadas.
   ========================================================================== */

const BOT = {
  abierto:false,
  paso:'inicio',
  datos:{},
  escribiendo:false
};

/* Frase obligatoria cuando no hay informacion confirmada */
const BOT_NO_SE = 'No tengo esa información confirmada, pero podés consultarla directamente ' +
                  'con Metales Decorados por WhatsApp.';

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES QUE EL ASISTENTE SI PUEDE RESPONDER
   Solo contienen informacion confirmada. Todo lo demas usa BOT_NO_SE.
   -------------------------------------------------------------------------- */
const BOT_FAQ = [
  { p:'¿Qué trabajos hacen?',
    r:'Metales Decorados fabrica <b>portones, puertas principales, rejas y barandas</b>, ' +
      'además de <b>decoración</b> en metal, como lámparas y piezas caladas. También proyectos a medida.' },

  { p:'¿Hacen trabajos personalizados?',
    r:'Sí. La mayor parte del trabajo se fabrica a la medida, según el espacio y el diseño ' +
      'que necesita cada cliente. Podés enviar una foto o una referencia de lo que tenés en mente.' },

  { p:'¿Dónde están ubicados?',
    r:'El taller está en <b>Guadalupe, Goicoechea, San José</b>. ' +
      'La dirección exacta y el horario los confirma directamente el taller por WhatsApp.' },

  { p:'¿Qué necesitan para cotizar?',
    r:'Ayuda mucho saber: <b>qué tipo de trabajo</b> necesitás, <b>la zona</b>, ' +
      '<b>medidas aproximadas</b> (aunque sean estimadas) y, si tenés, una <b>fotografía</b> ' +
      'del espacio o una imagen de referencia.' },

  { p:'¿Cuánto cuesta?',
    r:'No manejo precios. Cada trabajo se cotiza según el diseño, el tamaño y los materiales, ' +
      'así que el precio lo define directamente Metales Decorados.<br><br>' +
      'Lo que sí puedo hacer es tomar los datos de tu proyecto para que te respondan con una ' +
      'cotización lo antes posible.' },

  { p:'¿Cuánto tardan?',
    r:'No tengo tiempos de entrega confirmados, y prefiero no darte una fecha que no pueda ' +
      'garantizar. Eso lo confirma el taller según el trabajo.<br><br>' + BOT_NO_SE }
];

/* --------------------------------------------------------------------------
   ESTRUCTURA
   -------------------------------------------------------------------------- */
function botHTML(){
  return '' +
  '<div class="bot__hdr">' +
    '<div class="bot__av">' +
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<rect x="3" y="7" width="18" height="12" rx="4"/><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none"/>' +
      '<circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M12 7V4M9 4h6"/></svg>' +
    '</div>' +
    '<div class="bot__id">' +
      '<b>Asistente virtual</b>' +
      '<small>Metales Decorados · respuesta automática</small>' +
    '</div>' +
    '<button class="bot__x" id="bot-x" aria-label="Cerrar asistente">&times;</button>' +
  '</div>' +
  '<div class="bot__log" id="bot-log"></div>' +
  '<div class="bot__foot">' +
    '<div class="bot__ops" id="bot-ops"></div>' +
    '<div class="bot__in" id="bot-in" hidden>' +
      '<input type="text" id="bot-tx" placeholder="Escribí tu respuesta..." autocomplete="off">' +
      '<button id="bot-send" aria-label="Enviar">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
      '</button>' +
    '</div>' +
    '<p class="bot__legal">Soy un asistente virtual. No confirmo precios, plazos ni disponibilidad: ' +
    'eso lo hace directamente Metales Decorados.</p>' +
  '</div>';
}

/* --------------------------------------------------------------------------
   MENSAJES
   -------------------------------------------------------------------------- */
function botDecir(html, quien){
  const log = document.getElementById('bot-log');
  const d = document.createElement('div');
  d.className = 'msg msg--' + (quien || 'bot');
  d.innerHTML = html;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

function botNota(html){ botDecir(html, 'nota'); }

/* Lo que escribe el visitante se muestra como texto, nunca como HTML */
function botEsc(v){
  return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function botEscribiendo(ms, luego){
  const log = document.getElementById('bot-log');
  const t = document.createElement('div');
  t.className = 'bot__typing';
  t.innerHTML = '<i></i><i></i><i></i>';
  log.appendChild(t);
  log.scrollTop = log.scrollHeight;
  setTimeout(function(){ t.remove(); luego(); }, ms);
}

function botOpciones(lista){
  const ops = document.getElementById('bot-ops');
  ops.innerHTML = '';
  document.getElementById('bot-in').hidden = true;

  lista.forEach(function(o){
    const b = document.createElement('button');
    b.className = 'bot__op' + (o.wa ? ' bot__op--wa' : '');
    b.textContent = o.t;
    b.addEventListener('click', function(){
      if (o.wa){ window.open(o.wa, '_blank', 'noopener'); return; }
      if (o.eco !== false) botDecir(o.t, 'yo');
      ops.innerHTML = '';
      o.fn();
    });
    ops.appendChild(b);
  });
}

function botPedirTexto(luego, placeholder){
  const ops = document.getElementById('bot-ops');
  ops.innerHTML = '';
  const zona = document.getElementById('bot-in');
  const inp = document.getElementById('bot-tx');
  zona.hidden = false;
  inp.placeholder = placeholder || 'Escribí tu respuesta...';
  inp.value = '';
  inp.focus();

  const enviar = function(){
    const v = inp.value.trim();
    if (!v) return;
    botDecir(botEsc(v), 'yo');
    inp.value = '';
    zona.hidden = true;
    luego(v);
  };

  const send = document.getElementById('bot-send');
  const nuevo = send.cloneNode(true);          // limpia escuchas anteriores
  send.parentNode.replaceChild(nuevo, send);
  nuevo.addEventListener('click', enviar);

  inp.onkeydown = function(e){ if (e.key === 'Enter'){ e.preventDefault(); enviar(); } };
}

/* --------------------------------------------------------------------------
   FLUJO DE PRECOTIZACION
   -------------------------------------------------------------------------- */
function botInicio(){
  botEscribiendo(500, function(){
    botDecir('Hola, soy el <b>asistente virtual de Metales Decorados</b>. ' +
             'Puedo ayudarte a preparar tu consulta para que el taller te responda más rápido.');
    botEscribiendo(600, function(){
      botDecir('¿En qué te ayudo?');
      botOpciones([
        { t:'Quiero cotizar un proyecto', fn:botQue },
        { t:'Tengo una pregunta',         fn:botPreguntas },
        { t:'Quiero ver los trabajos',    fn:botVerTrabajos }
      ]);
    });
  });
}

function botQue(){
  botEscribiendo(450, function(){
    botDecir('Perfecto. <b>¿Qué necesitás realizar?</b>');
    botOpciones(
      ['Portón','Puerta principal','Rejas','Barandas','Decoración','Otro']
        .map(function(v){
          return { t:v, fn:function(){ BOT.datos.tipo = v; botLugar(); } };
        })
    );
  });
}

function botLugar(){
  botEscribiendo(450, function(){
    botDecir('¿Es para una <b>casa</b>, un <b>negocio</b> u otro tipo de proyecto?');
    botOpciones(
      ['Casa','Negocio','Otro'].map(function(v){
        return { t:v, fn:function(){ BOT.datos.lugar = v; botZona(); } };
      })
    );
  });
}

function botZona(){
  botEscribiendo(450, function(){
    botDecir('<b>¿En qué zona se realizaría?</b> Con el cantón o el barrio es suficiente.');
    botPedirTexto(function(v){
      BOT.datos.zona = v;
      botMedidas();
    }, 'Ej: Guadalupe, San José');
  });
}

function botMedidas(){
  botEscribiendo(450, function(){
    botDecir('<b>¿Tenés medidas aproximadas?</b> No importa si son estimadas.');
    botOpciones([
      { t:'Sí, las escribo', eco:false, fn:function(){
          botPedirTexto(function(v){ BOT.datos.medidas = v; botDetalle(); }, 'Ej: 3 m x 2 m');
        } },
      { t:'No las tengo todavía', fn:function(){ BOT.datos.medidas = ''; botDetalle(); } }
    ]);
  });
}

function botDetalle(){
  botEscribiendo(450, function(){
    botDecir('<b>¿Querés contarnos un poco sobre el proyecto?</b> ' +
             'Cualquier detalle ayuda: el estilo que te gusta, dónde va, para qué lo necesitás.');
    botPedirTexto(function(v){
      BOT.datos.desc = v;
      botFotos();
    }, 'Contanos brevemente...');
  });
}

function botFotos(){
  botEscribiendo(400, function(){
    botDecir('Última cosa: <b>¿tenés fotografías o imágenes de referencia?</b>');
    botOpciones([
      { t:'Sí, tengo fotos',  fn:function(){ BOT.datos.fotos = true;  botCerrar(); } },
      { t:'No por ahora',     fn:function(){ BOT.datos.fotos = false; botCerrar(); } }
    ]);
  });
}

/* Cierre: entrega la informacion. Nunca confirma la cotizacion. */
function botCerrar(){
  botEscribiendo(700, function(){
    const d = BOT.datos;

    botDecir('Listo. Esto es lo que tengo de tu proyecto:');

    let resumen = '<b>Proyecto:</b> ' + d.tipo + '<br>';
    if (d.lugar)   resumen += '<b>Tipo de lugar:</b> ' + d.lugar + '<br>';
    if (d.zona)    resumen += '<b>Zona:</b> ' + botEsc(d.zona) + '<br>';
    if (d.medidas) resumen += '<b>Medidas aproximadas:</b> ' + botEsc(d.medidas) + '<br>';
    if (d.desc)    resumen += '<b>Descripción:</b> ' + botEsc(d.desc) + '<br>';
    if (d.fotos)   resumen += '<b>Referencias:</b> tiene fotografías para enviar';
    botNota(resumen);

    botEscribiendo(600, function(){
      botDecir('Perfecto. Puedo preparar esta información para que la envíes directamente a ' +
               'Metales Decorados por WhatsApp.');
      botDecir('Tené en cuenta que <b>no soy quien cotiza</b>: el precio, los materiales y los ' +
               'tiempos los confirma el taller cuando reciba tu mensaje.');

      botOpciones([
        { t:'Continuar por WhatsApp', wa:waLink(botMensaje()) },
        { t:'Empezar de nuevo', eco:false, fn:function(){
            BOT.datos = {};
            document.getElementById('bot-log').innerHTML = '';
            botInicio();
          } }
      ]);
    });
  });
}

function botMensaje(){
  const d = BOT.datos;
  let m = 'Hola, quisiera solicitar una cotización.\n\n';
  m += 'Proyecto: ' + (d.tipo || '') + '\n';
  if (d.lugar)   m += 'Tipo de lugar: ' + d.lugar + '\n';
  if (d.zona)    m += 'Zona: ' + d.zona + '\n';
  if (d.medidas) m += 'Medidas aproximadas: ' + d.medidas + '\n';
  if (d.desc)    m += 'Descripción: ' + d.desc + '\n';
  m += '\n';
  if (d.fotos)   m += 'Tengo fotografías de referencia.\n\n';
  m += 'Preparé esta consulta con el asistente de la página web.';
  return m;
}

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES
   -------------------------------------------------------------------------- */
function botPreguntas(){
  botEscribiendo(400, function(){
    botDecir('Claro. Estas son las consultas más comunes:');
    const ops = BOT_FAQ.map(function(f){
      return { t:f.p, fn:function(){
        botEscribiendo(500, function(){
          botDecir(f.r);
          botEscribiendo(400, function(){
            botDecir('¿Te ayudo con algo más?');
            botOpciones([
              { t:'Otra pregunta',          eco:false, fn:botPreguntas },
              { t:'Quiero cotizar',         fn:botQue },
              { t:'Hablar por WhatsApp',    wa:waLink('Hola, tengo una consulta sobre un proyecto en metal. La vi en su página web.') }
            ]);
          });
        });
      } };
    });
    ops.push({ t:'Mi pregunta no está acá', eco:false, fn:botNoSe });
    botOpciones(ops);
  });
}

/* Comportamiento obligatorio ante lo que no sabe */
function botNoSe(){
  botEscribiendo(500, function(){
    botDecir(BOT_NO_SE);
    botOpciones([
      { t:'Escribir por WhatsApp', wa:waLink('Hola, tengo una consulta que no aparece en la página web y quisiera preguntarles directamente.') },
      { t:'Volver al inicio', eco:false, fn:function(){
          document.getElementById('bot-log').innerHTML = '';
          botInicio();
        } }
    ]);
  });
}

function botVerTrabajos(){
  botEscribiendo(400, function(){
    botDecir('Te llevo al catálogo de proyectos. Podés filtrarlo por tipo de trabajo ' +
             'y desde cada ficha pedir una cotización de algo similar.');
    const cat = document.getElementById('catalogo');
    if (cat) cat.scrollIntoView({ behavior:'smooth' });
    botOpciones([
      { t:'Quiero cotizar', fn:botQue },
      { t:'Tengo una pregunta', eco:false, fn:botPreguntas }
    ]);
  });
}

/* --------------------------------------------------------------------------
   APERTURA / CIERRE
   -------------------------------------------------------------------------- */
function botAbrir(){
  const caja = document.getElementById('bot');
  caja.hidden = false;
  document.getElementById('bot-btn').hidden = true;

  if (!BOT.abierto){
    BOT.abierto = true;
    caja.innerHTML = botHTML();
    document.getElementById('bot-x').addEventListener('click', botCerrarVentana);
    botInicio();
  }
}

function botCerrarVentana(){
  document.getElementById('bot').hidden = true;
  document.getElementById('bot-btn').hidden = false;
}

document.addEventListener('DOMContentLoaded', function(){
  const b = document.getElementById('bot-btn');
  if (b) b.addEventListener('click', botAbrir);
});
