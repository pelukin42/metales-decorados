/* ==========================================================================
   METALES DECORADOS — Guia de ayuda ("wizard")

   Que hace:   si la persona lleva 30 segundos viendo la pagina y todavia no empezo
               nada (no abrio el asistente, no toco el cotizador, no escribio por
               WhatsApp), aparece una tarjeta chica que le pregunta que quiere hacer y
               la lleva al asistente virtual o al cotizador, segun lo que busque.
   Reglas:     una sola vez por visita; nunca tapa la pantalla (no es una ventana
               modal); se cierra con la X, con Esc o con "Ahora no". No inventa
               datos: no dice precios ni plazos.
   ========================================================================== */
(function(){
  const ESPERA_SEG   = 30;                 // segundos de pagina visible antes de aparecer
  const REINTENTO_S  = 10;                 // si en ese momento no conviene, se reintenta
  const CLAVE        = 'md-guia-vista';

  const G = {
    es:{
      eyebrow:'Guía rápida', cerrar:'Cerrar la guía',
      t1:'¿Querés que te ayudemos a empezar?',
      p1:'Llevás un rato por aquí. Contanos qué querés hacer y te llevamos al lugar indicado.',
      cotizar:'Quiero pedir una cotización',  cotizarSub:'Te mostramos las dos formas de hacerlo.',
      preguntar:'Tengo una pregunta',          preguntarSub:'El asistente virtual te responde.',
      ver:'Solo quiero ver trabajos',          verSub:'Te llevamos al catálogo.',
      t2:'¿Cómo preferís pedirla?',
      p2:'Las dos terminan en un mensaje ya armado para enviarlo por WhatsApp. Ninguna muestra precios: la cotización la prepara el taller.',
      asistente:'Hablar con el asistente',     asistenteSub:'Te hace preguntas cortas, una por una.',
      form:'Llenar el cotizador',              formSub:'Un formulario de 4 pasos, a tu ritmo.',
      atras:'‹ Atrás', ahoraNo:'Ahora no'
    },
    en:{
      eyebrow:'Quick guide', cerrar:'Close the guide',
      t1:'Want a hand getting started?',
      p1:'You’ve been here a little while. Tell us what you’d like to do and we’ll take you to the right place.',
      cotizar:'I want to request a quote',     cotizarSub:'We’ll show you the two ways to do it.',
      preguntar:'I have a question',            preguntarSub:'The virtual assistant will answer.',
      ver:'I just want to see your work',       verSub:'We’ll take you to the catalogue.',
      t2:'How would you like to request it?',
      p2:'Both end in a ready-made message to send by WhatsApp. Neither shows prices: the workshop prepares the quote.',
      asistente:'Talk to the assistant',       asistenteSub:'It asks short questions, one at a time.',
      form:'Fill in the quote form',           formSub:'A 4-step form, at your own pace.',
      atras:'‹ Back', ahoraNo:'Not now'
    }
  };
  function g(k){ return (G[(typeof idioma !== 'undefined' && idioma === 'en') ? 'en' : 'es'])[k]; }

  let activo = 0, cancelada = false, tarjeta = null, paso = 'inicio', reloj = null;

  /* ---- almacenamiento: puede no estar disponible (modo privado); la pagina funciona igual ---- */
  function yaVista(){ try { return sessionStorage.getItem(CLAVE) === '1'; } catch(e){ return false; } }
  function marcarVista(){ try { sessionStorage.setItem(CLAVE, '1'); } catch(e){} }

  /* ---- cuando la persona ya sabe como pedir cotizacion, la guia no hace falta ---- */
  function cancelar(){ cancelada = true; if (reloj){ clearInterval(reloj); reloj = null; } }

  function asistenteAbierto(){ return typeof BOT !== 'undefined' && BOT.abierto; }
  function cotizadorTocado(){ return typeof CZ !== 'undefined' && CZ.datos && Object.keys(CZ.datos).length > 0; }
  function seccionEnPantalla(id){
    const el = document.getElementById(id); if (!el) return false;
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    return r.top < vh * 0.7 && r.bottom > vh * 0.3;
  }
  function puedeMostrar(){
    if (cancelada || tarjeta || yaVista()) return false;
    if (asistenteAbierto() || cotizadorTocado()) return false;
    const modal = document.getElementById('modal');
    if (modal && !modal.hidden) return false;                       // mirando una ficha
    if (document.body.classList.contains('nav-open')) return false; // menu movil abierto
    if (seccionEnPantalla('cotizar') || seccionEnPantalla('contacto')) return false;  // ya esta donde hace falta
    return true;
  }

  /* ---- tarjeta ---- */
  function opcion(id, titulo, sub){
    return '<button type="button" class="guia__op" data-g="' + id + '"><b>' + titulo + '</b><small>' + sub + '</small></button>';
  }
  function pintar(){
    if (!tarjeta) return;
    let html = '<button type="button" class="guia__x" data-g="cerrar" aria-label="' + g('cerrar') + '">&times;</button>' +
               '<p class="eyebrow">' + g('eyebrow') + '</p>';
    if (paso === 'inicio'){
      html += '<h3 id="guia-t">' + g('t1') + '</h3><p>' + g('p1') + '</p><div class="guia__ops">' +
              opcion('cotizar',   g('cotizar'),   g('cotizarSub')) +
              opcion('preguntar', g('preguntar'), g('preguntarSub')) +
              opcion('ver',       g('ver'),       g('verSub')) +
              '</div><div class="guia__pie"><button type="button" data-g="cerrar">' + g('ahoraNo') + '</button></div>';
    } else {
      html += '<h3 id="guia-t">' + g('t2') + '</h3><p>' + g('p2') + '</p><div class="guia__ops">' +
              opcion('asistente', g('asistente'), g('asistenteSub')) +
              opcion('form',      g('form'),      g('formSub')) +
              '</div><div class="guia__pie"><button type="button" data-g="atras">' + g('atras') + '</button>' +
              '<button type="button" data-g="cerrar">' + g('ahoraNo') + '</button></div>';
    }
    tarjeta.innerHTML = html;
  }

  function cerrar(){
    if (!tarjeta) return;
    tarjeta.remove(); tarjeta = null;
    document.removeEventListener('keydown', alTeclear);
  }
  function alTeclear(e){ if (e.key === 'Escape') cerrar(); }

  function irA(id){
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();           // el desplazamiento suave lo da el CSS (scroll-behavior)
  }

  function accion(id){
    if (id === 'cerrar') return cerrar();
    if (id === 'atras'){ paso = 'inicio'; return pintar(); }
    if (id === 'cotizar'){ paso = 'cotizar'; return pintar(); }
    cerrar();
    if (id === 'asistente' && typeof botAbrirEn === 'function') return botAbrirEn('cotizar');
    if (id === 'preguntar' && typeof botAbrirEn === 'function') return botAbrirEn('preguntas');
    if (id === 'form') return irA('cotizar');
    if (id === 'ver')  return irA('catalogo');
  }

  function mostrar(){
    marcarVista();
    paso = 'inicio';
    tarjeta = document.createElement('div');
    tarjeta.className = 'guia';
    tarjeta.id = 'guia';
    tarjeta.setAttribute('role', 'dialog');
    tarjeta.setAttribute('aria-live', 'polite');
    tarjeta.setAttribute('aria-labelledby', 'guia-t');
    tarjeta.addEventListener('click', function(e){
      const b = e.target.closest('[data-g]');
      if (b) accion(b.dataset.g);
    });
    document.body.appendChild(tarjeta);
    pintar();
    document.addEventListener('keydown', alTeclear);
  }

  /* El cambio de idioma vuelve a pintar la tarjeta si esta abierta */
  window.guiaRepintar = pintar;

  /* ---- reloj: cuenta solo el tiempo en que la pagina esta a la vista ---- */
  function arrancar(){
    if (yaVista()) return;

    // Todo lo que muestre que la persona ya sabe como seguir cancela la guia
    document.addEventListener('click', function(e){
      if (e.target.closest && e.target.closest('#bot-btn, #bot, [data-wa], a[href="#cotizar"], #wz-form')) cancelar();
    }, true);
    document.addEventListener('input', function(e){
      if (e.target.closest && e.target.closest('#wz-form')) cancelar();
    }, true);

    reloj = setInterval(function(){
      if (document.visibilityState !== 'visible') return;
      activo++;
      if (activo < ESPERA_SEG) return;
      if (puedeMostrar()){ clearInterval(reloj); reloj = null; mostrar(); }
      else if (cancelada || yaVista()){ clearInterval(reloj); reloj = null; }
      else activo = ESPERA_SEG - REINTENTO_S;     // ahora no conviene: se vuelve a intentar en unos segundos
    }, 1000);
  }

  document.addEventListener('DOMContentLoaded', arrancar);
})();
