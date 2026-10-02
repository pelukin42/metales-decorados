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
const BOT_NO_SE_EN = 'I don’t have that information confirmed, but you can ask Metales Decorados ' +
                  'directly on WhatsApp.';
function botNoSeTx(){ return idioma === 'en' ? BOT_NO_SE_EN : BOT_NO_SE; }

/* Mapas de traduccion para las opciones que el visitante elige. El valor
   guardado en BOT.datos siempre queda en espanol (canonico); solo cambia
   la etiqueta que se muestra en pantalla y en el mensaje final. */
const BOT_TIPO_EN = { 'Portón':'Gate', 'Puerta principal':'Front door', 'Rejas':'Window bars',
  'Barandas':'Railings', 'Decoración':'Decor', 'Muebles':'Furniture', 'Lámparas':'Lamps',
  'Escaleras':'Stairs', 'Chimeneas':'Fireplaces', 'Otro':'Other' };
const BOT_LUGAR_EN = { 'Casa':'Home', 'Negocio':'Business', 'Otro':'Other' };
function botTipoTx(v){ return (idioma === 'en' && BOT_TIPO_EN[v]) ? BOT_TIPO_EN[v] : v; }
function botLugarTx(v){ return (idioma === 'en' && BOT_LUGAR_EN[v]) ? BOT_LUGAR_EN[v] : v; }

/* Diccionario de textos del asistente */
const BOT_T = {
  es:{
    hdrTitulo:'Asistente virtual', hdrSub:'Metales Decorados · respuesta automática',
    placeholder:'Escribí tu respuesta...', legal:'Soy un asistente virtual. No confirmo precios, plazos ni disponibilidad: eso lo hace directamente Metales Decorados.',
    saludo1:'Hola, soy el <b>asistente virtual de Metales Decorados</b>. Puedo ayudarte a preparar tu consulta para que el taller te responda más rápido.',
    saludo2:'¿En qué te ayudo?',
    opCotizar:'Quiero cotizar un proyecto', opPregunta:'Tengo una pregunta', opVerTrabajos:'Quiero ver los trabajos',
    quePregunta:'Perfecto. <b>¿Qué necesitás realizar?</b>',
    lugarPregunta:'¿Es para una <b>casa</b>, un <b>negocio</b> u otro tipo de proyecto?',
    zonaPregunta:'<b>¿En qué zona se realizaría?</b> Con el cantón o el barrio es suficiente.', zonaPh:'Ej: Guadalupe, San José',
    medidasPregunta:'<b>¿Tenés medidas aproximadas?</b> No importa si son estimadas.',
    medidasSi:'Sí, las escribo', medidasPh:'Ej: 3 m x 2 m', medidasNo:'No las tengo todavía',
    detallePregunta:'<b>¿Querés contarnos un poco sobre el proyecto?</b> Cualquier detalle ayuda: el estilo que te gusta, dónde va, para qué lo necesitás.',
    detallePh:'Contanos brevemente...',
    fotosPregunta:'Última cosa: <b>¿tenés fotografías o imágenes de referencia?</b>',
    fotosSi:'Sí, tengo fotos', fotosNo:'No por ahora',
    cerrarListo:'Listo. Esto es lo que tengo de tu proyecto:',
    rProyecto:'Proyecto', rLugar:'Tipo de lugar', rZona:'Zona', rMedidas:'Medidas aproximadas',
    rDesc:'Descripción', rReferencias:'Referencias', rTieneFotos:'tiene fotografías para enviar',
    cerrarTx1:'Perfecto. Puedo preparar esta información para que la envíes directamente a Metales Decorados por WhatsApp.',
    cerrarTx2:'Tené en cuenta que <b>no soy quien cotiza</b>: el precio, los materiales y los tiempos los confirma el taller cuando reciba tu mensaje.',
    continuarWa:'Continuar por WhatsApp', empezarDeNuevo:'Empezar de nuevo',
    mHola:'Hola, quisiera solicitar una cotización.', mProyecto:'Proyecto', mLugar:'Tipo de lugar',
    mZona:'Zona', mMedidas:'Medidas aproximadas', mDesc:'Descripción', mFotos:'Tengo fotografías de referencia.',
    mFinal:'Preparé esta consulta con el asistente de la página web.',
    faqIntro:'Claro. Estas son las consultas más comunes:', faqOtra:'Otra pregunta', faqCotizar:'Quiero cotizar',
    faqWa:'Hablar por WhatsApp', faqWaMsg:'Hola, tengo una consulta sobre un proyecto en metal. La vi en su página web.',
    faqNoEsta:'Mi pregunta no está acá', faqAyuda:'¿Te ayudo con algo más?',
    noSeWa:'Escribir por WhatsApp', noSeWaMsg:'Hola, tengo una consulta que no aparece en la página web y quisiera preguntarles directamente.',
    volverInicio:'Volver al inicio',
    verTrabajosTx:'Te llevo al catálogo de proyectos. Podés filtrarlo por tipo de trabajo y desde cada ficha pedir una cotización de algo similar.',
    verTrabajosTengoP:'Tengo una pregunta'
  },
  en:{
    hdrTitulo:'Virtual assistant', hdrSub:'Metales Decorados · automatic reply',
    placeholder:'Type your answer...', legal:'I am a virtual assistant. I do not confirm prices, timelines or availability: that is handled directly by Metales Decorados.',
    saludo1:'Hi, I’m the <b>virtual assistant for Metales Decorados</b>. I can help you prepare your request so the workshop can reply faster.',
    saludo2:'How can I help you?',
    opCotizar:'I want to quote a project', opPregunta:'I have a question', opVerTrabajos:'I want to see the work',
    quePregunta:'Great. <b>What do you need built?</b>',
    lugarPregunta:'Is it for a <b>home</b>, a <b>business</b>, or another kind of project?',
    zonaPregunta:'<b>What area would it be in?</b> The canton or neighborhood is enough.', zonaPh:'E.g.: Guadalupe, San José',
    medidasPregunta:'<b>Do you have approximate measurements?</b> It’s fine if they’re just estimates.',
    medidasSi:'Yes, I’ll type them', medidasPh:'E.g.: 3 m x 2 m', medidasNo:'I don’t have them yet',
    detallePregunta:'<b>Want to tell us a bit about the project?</b> Any detail helps: the style you like, where it goes, what you need it for.',
    detallePh:'Tell us briefly...',
    fotosPregunta:'Last thing: <b>do you have photos or reference images?</b>',
    fotosSi:'Yes, I have photos', fotosNo:'Not for now',
    cerrarListo:'Done. Here’s what I have for your project:',
    rProyecto:'Project', rLugar:'Type of place', rZona:'Area', rMedidas:'Approximate measurements',
    rDesc:'Description', rReferencias:'References', rTieneFotos:'has photos to send',
    cerrarTx1:'Great. I can prepare this information so you can send it directly to Metales Decorados on WhatsApp.',
    cerrarTx2:'Keep in mind that <b>I’m not the one who quotes</b>: the price, materials and timelines are confirmed by the workshop once they receive your message.',
    continuarWa:'Continue on WhatsApp', empezarDeNuevo:'Start over',
    mHola:'Hello, I would like to request a quote.', mProyecto:'Project', mLugar:'Type of place',
    mZona:'Area', mMedidas:'Approximate measurements', mDesc:'Description', mFotos:'I have reference photos.',
    mFinal:'I prepared this request with the website assistant.',
    faqIntro:'Sure. Here are the most common questions:', faqOtra:'Another question', faqCotizar:'I want a quote',
    faqWa:'Talk on WhatsApp', faqWaMsg:'Hi, I have a question about a metal project. I saw it on your website.',
    faqNoEsta:'My question isn’t here', faqAyuda:'Can I help you with anything else?',
    noSeWa:'Write on WhatsApp', noSeWaMsg:'Hi, I have a question that isn’t on the website and I’d like to ask directly.',
    volverInicio:'Back to start',
    verTrabajosTx:'I’ll take you to the project catalogue. You can filter it by type of work and request a quote for something similar from any project sheet.',
    verTrabajosTengoP:'I have a question'
  }
};
function bt(k){ return (idioma === 'en' ? BOT_T.en[k] : BOT_T.es[k]); }

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES QUE EL ASISTENTE SI PUEDE RESPONDER
   Solo contienen informacion confirmada. Todo lo demas usa BOT_NO_SE.
   -------------------------------------------------------------------------- */
const BOT_FAQ = [
  { p:'¿Qué trabajos hacen?',
    r:'Metales Decorados fabrica <b>portones, puertas principales, rejas y barandas</b>, ' +
      'además de <b>decoración</b> en metal, como lámparas y piezas caladas. También proyectos a medida.',
    en:{ p:'What work do you do?',
      r:'Metales Decorados makes <b>gates, front doors, window bars and railings</b>, ' +
        'as well as metal <b>decor</b> like lamps and cut-out pieces. Also custom projects.' } },

  { p:'¿Hacen trabajos personalizados?',
    r:'Sí. La mayor parte del trabajo se fabrica a la medida, según el espacio y el diseño ' +
      'que necesita cada cliente. Podés enviar una foto o una referencia de lo que tenés en mente.',
    en:{ p:'Do you do custom work?',
      r:'Yes. Most of the work is custom-built, based on the space and design each client needs. ' +
        'You can send a photo or a reference of what you have in mind.' } },

  { p:'¿Dónde están ubicados?',
    r:'El taller está en <b>Guadalupe, Goicoechea, San José</b>. ' +
      'La dirección exacta y el horario los confirma directamente el taller por WhatsApp.',
    en:{ p:'Where are you located?',
      r:'The workshop is in <b>Guadalupe, Goicoechea, San José</b>. ' +
        'The exact address and business hours are confirmed directly by the workshop on WhatsApp.' } },

  { p:'¿Qué necesitan para cotizar?',
    r:'Ayuda mucho saber: <b>qué tipo de trabajo</b> necesitás, <b>la zona</b>, ' +
      '<b>medidas aproximadas</b> (aunque sean estimadas) y, si tenés, una <b>fotografía</b> ' +
      'del espacio o una imagen de referencia.',
    en:{ p:'What do you need to prepare a quote?',
      r:'It helps a lot to know: <b>what type of work</b> you need, <b>the area</b>, ' +
        '<b>approximate measurements</b> (even if estimated) and, if you have one, a <b>photo</b> ' +
        'of the space or a reference image.' } },

  { p:'¿Cuánto cuesta?',
    r:'No manejo precios. Cada trabajo se cotiza según el diseño, el tamaño y los materiales, ' +
      'así que el precio lo define directamente Metales Decorados.<br><br>' +
      'Lo que sí puedo hacer es tomar los datos de tu proyecto para que te respondan con una ' +
      'cotización lo antes posible.',
    en:{ p:'How much does it cost?',
      r:'I don’t handle prices. Each job is quoted based on the design, size and materials, ' +
        'so the price is set directly by Metales Decorados.<br><br>' +
        'What I can do is take down your project details so they can get back to you with a quote as soon as possible.' } },

  { p:'¿Cuánto tardan?',
    r:'No tengo tiempos de entrega confirmados, y prefiero no darte una fecha que no pueda ' +
      'garantizar. Eso lo confirma el taller según el trabajo.<br><br>' + BOT_NO_SE,
    en:{ p:'How long does it take?',
      r:'I don’t have confirmed delivery times, and I’d rather not give you a date I can’t guarantee. ' +
        'That is confirmed by the workshop depending on the job.<br><br>' + BOT_NO_SE_EN } }
];
function faqCampo(f, campo){ return (idioma === 'en' && f.en && f.en[campo] != null) ? f.en[campo] : f[campo]; }

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
      '<b>' + bt('hdrTitulo') + '</b>' +
      '<small>' + bt('hdrSub') + '</small>' +
    '</div>' +
    '<button class="bot__x" id="bot-x" aria-label="Cerrar asistente">&times;</button>' +
  '</div>' +
  '<div class="bot__log" id="bot-log"></div>' +
  '<div class="bot__foot">' +
    '<div class="bot__ops" id="bot-ops"></div>' +
    '<div class="bot__in" id="bot-in" hidden>' +
      '<input type="text" id="bot-tx" placeholder="' + bt('placeholder') + '" autocomplete="off">' +
      '<button id="bot-send" aria-label="Enviar">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
      '</button>' +
    '</div>' +
    '<p class="bot__legal">' + bt('legal') + '</p>' +
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
  BOT.paso = 'inicio';
  botEscribiendo(500, function(){
    botDecir(bt('saludo1'));
    botEscribiendo(600, function(){
      botDecir(bt('saludo2'));
      botOpciones([
        { t:bt('opCotizar'), fn:botQue },
        { t:bt('opPregunta'), fn:botPreguntas },
        { t:bt('opVerTrabajos'), fn:botVerTrabajos }
      ]);
    });
  });
}

function botQue(){
  BOT.paso = 'que';
  botEscribiendo(450, function(){
    botDecir(bt('quePregunta'));
    botOpciones(
      ['Portón','Puerta principal','Rejas','Barandas','Decoración','Muebles','Lámparas','Escaleras','Chimeneas','Otro']
        .map(function(v){
          return { t:botTipoTx(v), fn:function(){ BOT.datos.tipo = v; botLugar(); } };
        })
    );
  });
}

function botLugar(){
  BOT.paso = 'lugar';
  botEscribiendo(450, function(){
    botDecir(bt('lugarPregunta'));
    botOpciones(
      ['Casa','Negocio','Otro'].map(function(v){
        return { t:botLugarTx(v), fn:function(){ BOT.datos.lugar = v; botZona(); } };
      })
    );
  });
}

function botZona(){
  BOT.paso = 'zona';
  botEscribiendo(450, function(){
    botDecir(bt('zonaPregunta'));
    botPedirTexto(function(v){
      BOT.datos.zona = v;
      botMedidas();
    }, bt('zonaPh'));
  });
}

function botMedidas(){
  BOT.paso = 'medidas';
  botEscribiendo(450, function(){
    botDecir(bt('medidasPregunta'));
    botOpciones([
      { t:bt('medidasSi'), eco:false, fn:function(){
          botPedirTexto(function(v){ BOT.datos.medidas = v; botDetalle(); }, bt('medidasPh'));
        } },
      { t:bt('medidasNo'), fn:function(){ BOT.datos.medidas = ''; botDetalle(); } }
    ]);
  });
}

function botDetalle(){
  BOT.paso = 'detalle';
  botEscribiendo(450, function(){
    botDecir(bt('detallePregunta'));
    botPedirTexto(function(v){
      BOT.datos.desc = v;
      botFotos();
    }, bt('detallePh'));
  });
}

function botFotos(){
  BOT.paso = 'fotos';
  botEscribiendo(400, function(){
    botDecir(bt('fotosPregunta'));
    botOpciones([
      { t:bt('fotosSi'),  fn:function(){ BOT.datos.fotos = true;  botCerrar(); } },
      { t:bt('fotosNo'),  fn:function(){ BOT.datos.fotos = false; botCerrar(); } }
    ]);
  });
}

/* Cierre: entrega la informacion. Nunca confirma la cotizacion. */
function botCerrar(){
  BOT.paso = 'cerrar';
  botEscribiendo(700, function(){
    const d = BOT.datos;

    botDecir(bt('cerrarListo'));

    let resumen = '<b>' + bt('rProyecto') + ':</b> ' + botTipoTx(d.tipo) + '<br>';
    if (d.lugar)   resumen += '<b>' + bt('rLugar') + ':</b> ' + botLugarTx(d.lugar) + '<br>';
    if (d.zona)    resumen += '<b>' + bt('rZona') + ':</b> ' + botEsc(d.zona) + '<br>';
    if (d.medidas) resumen += '<b>' + bt('rMedidas') + ':</b> ' + botEsc(d.medidas) + '<br>';
    if (d.desc)    resumen += '<b>' + bt('rDesc') + ':</b> ' + botEsc(d.desc) + '<br>';
    if (d.fotos)   resumen += '<b>' + bt('rReferencias') + ':</b> ' + bt('rTieneFotos');
    botNota(resumen);

    botEscribiendo(600, function(){
      botDecir(bt('cerrarTx1'));
      botDecir(bt('cerrarTx2'));

      botOpciones([
        { t:bt('continuarWa'), wa:waLink(botMensaje()) },
        { t:bt('empezarDeNuevo'), eco:false, fn:function(){
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
  let m = bt('mHola') + '\n\n';
  m += bt('mProyecto') + ': ' + (d.tipo ? botTipoTx(d.tipo) : '') + '\n';
  if (d.lugar)   m += bt('mLugar') + ': ' + botLugarTx(d.lugar) + '\n';
  if (d.zona)    m += bt('mZona') + ': ' + d.zona + '\n';
  if (d.medidas) m += bt('mMedidas') + ': ' + d.medidas + '\n';
  if (d.desc)    m += bt('mDesc') + ': ' + d.desc + '\n';
  m += '\n';
  if (d.fotos)   m += bt('mFotos') + '\n\n';
  m += bt('mFinal');
  return m;
}

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES
   -------------------------------------------------------------------------- */
function botPreguntas(){
  BOT.paso = 'preguntas';
  botEscribiendo(400, function(){
    botDecir(bt('faqIntro'));
    const ops = BOT_FAQ.map(function(f){
      return { t:faqCampo(f, 'p'), fn:function(){
        botEscribiendo(500, function(){
          botDecir(faqCampo(f, 'r'));
          botEscribiendo(400, function(){
            botDecir(bt('faqAyuda'));
            botOpciones([
              { t:bt('faqOtra'),  eco:false, fn:botPreguntas },
              { t:bt('faqCotizar'), fn:botQue },
              { t:bt('faqWa'),    wa:waLink(bt('faqWaMsg')) }
            ]);
          });
        });
      } };
    });
    ops.push({ t:bt('faqNoEsta'), eco:false, fn:botNoSe });
    botOpciones(ops);
  });
}

/* Comportamiento obligatorio ante lo que no sabe */
function botNoSe(){
  BOT.paso = 'noSe';
  botEscribiendo(500, function(){
    botDecir(botNoSeTx());
    botOpciones([
      { t:bt('noSeWa'), wa:waLink(bt('noSeWaMsg')) },
      { t:bt('volverInicio'), eco:false, fn:function(){
          document.getElementById('bot-log').innerHTML = '';
          botInicio();
        } }
    ]);
  });
}

function botVerTrabajos(){
  BOT.paso = 'verTrabajos';
  botEscribiendo(400, function(){
    botDecir(bt('verTrabajosTx'));
    const cat = document.getElementById('catalogo');
    if (cat) cat.scrollIntoView({ behavior:'smooth' });
    botOpciones([
      { t:bt('faqCotizar'), fn:botQue },
      { t:bt('verTrabajosTengoP'), eco:false, fn:botPreguntas }
    ]);
  });
}

/* --------------------------------------------------------------------------
   CAMBIO DE IDIOMA CON EL CHAT ABIERTO
   Vuelve a mostrar el paso actual en el nuevo idioma, sin perder los datos
   que el visitante ya escribio (siguen guardados en BOT.datos).
   -------------------------------------------------------------------------- */
const BOT_STEP_FN = {
  inicio:botInicio, que:botQue, lugar:botLugar, zona:botZona, medidas:botMedidas,
  detalle:botDetalle, fotos:botFotos, cerrar:botCerrar, preguntas:botPreguntas,
  noSe:botNoSe, verTrabajos:botVerTrabajos
};

function botRepintar(){
  const caja = document.getElementById('bot');
  if (!BOT.abierto || !caja || caja.hidden) return;
  caja.innerHTML = botHTML();
  document.getElementById('bot-x').addEventListener('click', botCerrarVentana);
  const fn = BOT_STEP_FN[BOT.paso] || botInicio;
  fn();
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

/* Abre el asistente y entra directo al flujo pedido ("cotizar" o "preguntas"), como si la
   persona hubiera tocado esa opcion del saludo (el saludo y la presentacion como asistente
   virtual se muestran igual). Lo usa la guia de ayuda (js/guia.js). */
function botAbrirEn(ruta){
  const yaAbierto = BOT.abierto;
  botAbrir();
  if (yaAbierto) return;                       // ya habia una conversacion: no se la interrumpe
  const indice = (ruta === 'preguntas') ? 1 : 0;
  let intentos = 0;
  const espera = setInterval(function(){
    const op = document.querySelectorAll('#bot-ops .bot__op')[indice];
    if (op && BOT.paso === 'inicio'){ clearInterval(espera); op.click(); }
    else if (++intentos > 40){ clearInterval(espera); }
  }, 150);
}

function botCerrarVentana(){
  document.getElementById('bot').hidden = true;
  document.getElementById('bot-btn').hidden = false;
}

document.addEventListener('DOMContentLoaded', function(){
  const b = document.getElementById('bot-btn');
  if (b) b.addEventListener('click', botAbrir);
});
