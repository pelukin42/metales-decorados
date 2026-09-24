/* ==========================================================================
   METALES DECORADOS — Plan Profesional
   Galeria de portafolio (hasta 25 fotos) + formulario de cotizacion -> WhatsApp
   ========================================================================== */

/* --------------------------------------------------------------------------
   GALERIA
   Cada entrada apunta a un archivo dentro de /img. Mientras el archivo no
   exista, se muestra un marcador identificado. Al subir la foto con ese
   nombre, aparece sola.
   Limite del Plan Profesional: 25 fotografias.
   -------------------------------------------------------------------------- */
const GALERIA = [
  { f:'galeria-01.jpg', t:'Portón de entrada en hierro forjado',       c:'Portones',   size:'w' },
  { f:'galeria-02.jpg', t:'Puerta principal con diseño calado',        c:'Puertas'                },
  { f:'galeria-03.jpg', t:'Baranda de escalera interna',               c:'Pasamanos',  size:'h' },
  { f:'galeria-04.jpg', t:'Portón y rejas en hierro forjado',          c:'Rejas'                  },
  { f:'galeria-05.jpg', t:'Paneles decorativos y lámparas',            c:'Decoración'             },
  { f:'galeria-06.jpg', t:'Portón vehicular corredizo',                c:'Portones',   size:'w' },
  { f:'galeria-07.jpg', t:'Puerta principal en hierro forjado',        c:'Puertas'                },
  { f:'galeria-08.jpg', t:'Portón de dos hojas con puerta peatonal',   c:'Portones'               },
  { f:'galeria-09.jpg', t:'Puerta en lámina decorada',                 c:'Puertas'                },
  { f:'galeria-10.jpg', t:'Puerta con diseño floral calado',           c:'Puertas',    size:'h' },
  { f:'galeria-11.jpg', t:'Puerta doble en lámina decorada',           c:'Puertas'                },
  { f:'galeria-12.jpg', t:'Detalle de puerta con greca',               c:'Detalle'                },
  { f:'galeria-13.jpg', t:'Portón de acceso residencial',              c:'Portones'               }
];

function pintarGaleria(){
  const cont = document.getElementById('gal');
  if (!cont) return;

  cont.innerHTML = GALERIA.map(function(g, i){
    const mod = g.size === 'w' ? ' gal__i--w' : (g.size === 'h' ? ' gal__i--h' : '');
    return '<figure class="gal__i' + mod + ' rv" data-i="' + i + '" role="button" tabindex="0" ' +
             'aria-label="Ver ' + g.t + '">' +
             '<img src="img/' + g.f + '" alt="' + g.t + ' — Metales Decorados" loading="lazy" ' +
                  'data-ph="' + g.t + ' (' + g.f + ')">' +
             '<figcaption>' + g.t + ' · ' + g.c + '</figcaption>' +
           '</figure>';
  }).join('');

  cont.querySelectorAll('.gal__i').forEach(function(el){
    el.addEventListener('click', function(){ abrirVisor(+el.dataset.i); });
    el.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirVisor(+el.dataset.i); }
    });
  });
}

/* Visor de imagen */
function abrirVisor(i){
  const g = GALERIA[i];
  const lb = document.getElementById('lb');
  const box = document.getElementById('lb-box');
  box.innerHTML =
    '<img src="img/' + g.f + '" alt="' + g.t + '" data-ph="' + g.t + ' (' + g.f + ')">' +
    '<p class="lb__cap">' + g.t + ' · ' + g.c + '</p>';
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  initPlaceholders();
}
function cerrarVisor(){
  document.getElementById('lb').hidden = true;
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   FORMULARIO DE COTIZACION -> mensaje ordenado de WhatsApp
   No calcula precios. Solo estructura la informacion del prospecto.
   -------------------------------------------------------------------------- */
function armarMensaje(d){
  let m = 'Hola, quisiera solicitar una cotización.\n\n';
  m += 'Proyecto: ' + d.tipo + '\n';
  if (d.zona)    m += 'Zona: ' + d.zona + '\n';
  if (d.medidas) m += 'Medidas aproximadas: ' + d.medidas + '\n';
  m += 'Descripción: ' + d.desc + '\n\n';
  if (d.fotos)   m += 'Tengo fotografías de referencia.\n\n';
  m += 'Mi nombre: ' + d.nombre + '\n';
  m += 'Teléfono: ' + d.tel + '\n\n';
  m += 'Envío esta solicitud desde la página web.';
  return m;
}

function initFormulario(){
  const form = document.getElementById('form');
  if (!form) return;

  const done   = document.getElementById('done');
  const doneWa = document.getElementById('done-wa');

  form.addEventListener('submit', function(e){
    e.preventDefault();

    const campos = ['f-tipo','f-desc','f-nom','f-tel'];
    let ok = true;
    campos.forEach(function(id){
      const el = document.getElementById(id);
      const vacio = !el.value.trim();
      el.classList.toggle('is-bad', vacio);
      if (vacio && ok){ el.focus(); ok = false; }
    });
    if (!ok) return;

    const datos = {
      tipo:    document.getElementById('f-tipo').value,
      desc:    document.getElementById('f-desc').value.trim(),
      zona:    document.getElementById('f-zona').value.trim(),
      medidas: document.getElementById('f-med').value.trim(),
      nombre:  document.getElementById('f-nom').value.trim(),
      tel:     document.getElementById('f-tel').value.trim(),
      fotos:   document.getElementById('f-fotos').checked
    };

    doneWa.href = waLink(armarMensaje(datos));
    done.hidden = false;

    /* NOTA DE IMPLEMENTACION
       En produccion, aqui tambien se envia una copia de la solicitud al correo
       del negocio (por ejemplo con Formspree o una funcion serverless), para que
       quede registro aunque el visitante no llegue a pulsar WhatsApp.
       Requiere el correo del cliente: [PENDIENTE CONFIRMAR CON CLIENTE] */
  });

  document.getElementById('done-back').addEventListener('click', function(){
    done.hidden = true;
  });
}

/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  pintarGaleria();
  initPlaceholders();   // vuelve a recorrer, ahora con las fotos de la galeria
  initReveal();
  initFormulario();

  document.getElementById('lb-x').addEventListener('click', cerrarVisor);
  document.getElementById('lb').addEventListener('click', function(e){
    if (e.target.id === 'lb') cerrarVisor();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !document.getElementById('lb').hidden) cerrarVisor();
  });
});
