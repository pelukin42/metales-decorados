# Propuesta web — Metales Decorados

Portafolio digital + sistema de captación de cotizaciones para **Metales Decorados**
(Guadalupe, Goicoechea, San José, Costa Rica).

Dos versiones completas y funcionales, listas para mostrar al cliente.

> **Nombres de plan:** la demo `amedida/` es el **Plan Premium** (antes "A Medida"; la cotización CT-01
> rev. 1 lo llamaba "Plan Pro"). Como el sitio no lleva base de datos, no tiene la mensualidad de $60.

---

## Cómo verlo

Abrí **`index.html`** en la raíz: es la portada de la propuesta, con la comparación de
planes y los enlaces a las dos demos.

Para que todo funcione bien (fuentes, JS), conviene servirlo por HTTP en vez de abrir
el archivo directamente:

```bash
python -m http.server 5180
```

Luego entrá a `http://localhost:5180`.

---

## Estructura

```
index.html               Portada de la propuesta + comparador de planes
PENDIENTES-CLIENTE.md    Lista de datos por confirmar con el propietario
assets/
  core.css               Sistema visual base (compartido)
  core.js                Configuración del negocio, WhatsApp, placeholders

profesional/             DEMO — Plan Profesional
  index.html
  css/styles.css         copia de core.css
  css/site.css           estilos propios de esta versión
  js/core.js             copia de core.js
  js/main.js             galería + formulario de cotización
  img/LEEME.txt          qué fotos hacen falta y cómo se llaman

amedida/                DEMO — Plan A Medida
  index.html
  css/styles.css         copia de core.css
  css/site.css           estilos propios de esta versión
  js/core.js             copia de core.js
  js/main.js             servicios, catálogo filtrable, ficha, bilingüe
  js/cotizador.js        cotizador avanzado en 4 pasos
  js/chatbot.js          asistente virtual
  img/LEEME.txt          qué fotos hacen falta y cómo se llaman
```

> `assets/core.css` y `assets/core.js` son la **fuente única**. Si los editás,
> volvé a copiarlos a las dos versiones:
> ```bash
> cp assets/core.css profesional/css/styles.css && cp assets/core.css amedida/css/styles.css
> cp assets/core.js profesional/js/core.js && cp assets/core.js amedida/js/core.js
> ```

---

## Lo único que hay que editar para cambiar datos del negocio

Todo vive en **`assets/core.js`**, en el objeto `MD`. Nada de datos repartidos por el HTML.

```js
const MD = {
  telefono: '+506 8850-9207',
  whatsapp: '50688509207',
  email: '',            // vacío = el campo no aparece en la página
  direccionExacta: '',  // vacío = no se publica
  horario: '',          // vacío = no se publica
  googleBusiness: '',   // URL real del perfil
  ...
};
```

Los campos vacíos **no se inventan ni se rellenan**: simplemente no se muestran, y en su
lugar la página deja la marca `PENDIENTE CONFIRMAR CON CLIENTE`.

---

## Las fotografías

Las imágenes son **obras reales de Metales Decorados**, tomadas de sus publicaciones en
`@metales_decorados01`. Se recortó la interfaz de Instagram, la fecha, la barra de estado y
cualquier otro elemento de la app: solo queda la obra.

**No se usó ninguna fotografía de otra empresa**, ni de bancos de imágenes, ni de internet.

### Antes de publicar: pedir los originales

Las fotos vienen de capturas de pantalla, así que están recomprimidas por Instagram y han
perdido nitidez. Para producción conviene pedirle al propietario los archivos originales del
celular. Reemplazarlas es trivial: **se copia la foto nueva encima, con el mismo nombre**.

### Cómo funciona el sistema de imágenes

1. Cada `<img>` apunta a un archivo concreto (`img/servicio-portones.jpg`).
2. El marcador **"FOTOGRAFÍA PENDIENTE"** se dibuja por defecto debajo de la imagen y se
   retira solo cuando la foto carga bien.
3. Al copiar una foto con el nombre exacto en `img/`, **aparece sola**. Sin tocar código.

> El marcador se dibuja *antes* y se quita al cargar, no al revés. Con `loading="lazy"` el
> navegador puede no llegar a intentar la descarga nunca, y entonces el evento `error` no se
> dispara: si dependiéramos de él, el hueco quedaría vacío en lugar de mostrar el aviso.

La lista completa de nombres, y lo que falta, está en `profesional/img/LEEME.txt` y
`amedida/img/LEEME.txt`.

### Mobiliario: retirado por falta de fotos

Metales Decorados **sí ofrece mobiliario** (juegos de sala y comedor, mesas, bancos, estantes),
pero no hay ninguna fotografía, así que se quitó del sitio en lugar de dejar un hueco marcado
como pendiente. No se perdió nada: es solo contenido, y vuelve apenas manden fotos.

**Para reactivarlo** cuando lleguen las fotos:

| Dónde | Qué hacer |
|---|---|
| `amedida/js/main.js` | Volver a agregar el objeto `mobiliario` a `SERVICIOS`, y `'Mobiliario'` a `CATEGORIAS`. Añadir el proyecto al arreglo `PROYECTOS`. |
| `amedida/js/cotizador.js` | Agregar `Mobiliario` y `Mesa` a `CZ_TIPOS`. |
| `amedida/js/chatbot.js` | Agregar `'Mobiliario'` a las opciones de `botQue()`. |
| `profesional/index.html` | Volver a poner la tarjeta de servicio, la opción del `<select>` y el enlace del pie. |
| Ambos | Sumar `mobiliario` a los textos de `<title>`, `description`, el hero y el pie. |

La única foto que la versión Profesional espera y no existe es `servicio-mobiliario.jpg`; en
A Medida, además, `p11-a.jpg` para la ficha de "Proyectos especiales".

---

## Piezas descargables (valor agregado del Plan A Medida)

```bash
python herramientas/generar-pdf.py
```

Genera dos archivos a partir de las mismas fotos del sitio:

| Archivo | Para qué |
|---|---|
| `amedida/Catalogo-Metales-Decorados.pdf` | 7 páginas. Se descarga desde el catálogo del sitio y se manda por WhatsApp. Última página con QR que abre el chat con el mensaje ya escrito. |
| `Tarjeta-Resenas.pdf` | Media carta. Se imprime y se entrega con cada trabajo, con el QR de reseña grande. |

### El QR de reseñas está pendiente

Metales Decorados **no tiene perfil de Google Business todavía**, así que ese QR sale como un
marcador visible en lugar de apuntar a una dirección falsa. Cuando lo creen:

1. Panel de Google Business → Inicio → *Pide reseñas* → copiar enlace (`https://g.page/r/.../review`).
2. Pegarlo en `URL_RESENA`, arriba de `herramientas/generar-pdf.py`.
3. Correr el script. Los dos PDF se regeneran con el QR real.

> Por qué separadas: el catálogo se manda a alguien que **todavía no ha comprado**, y la reseña
> se le pide a alguien a quien **ya se le entregó**. Son públicos distintos. El catálogo lleva un
> bloque de reseña discreto al final, redactado para quien ya es cliente; la tarjeta es solo para
> la entrega.

---

## Qué se confirmó de fuentes públicas

| Dato | Fuente |
|---|---|
| *"Especialistas en Hierro forjado y corte cnc láser, puertas principales, portones, barandas, muebles en hierro y aluminio"* | Bio pública de `@metales_decorados01` |
| Rejas, lámparas, juegos de sala, juegos de comedor, pasamanos, candelabros, estantes, bancos, mesas | Ficha pública en AiYellow |
| Ubicación y teléfono | Aportado por el cliente |

**Hallazgos que cambian el alcance:**

1. **Puertas principales** aparece primero en su propia bio y no estaba en el brief.
   Se agregó como categoría propia en ambas versiones, y resultó ser su trabajo más vistoso.
2. **Corte CNC láser**: además de la bio, usan los hashtags `#lásercostarica`, `#cnc` y
   `#cncplasma`, y varias fotos del portafolio son piezas cortadas en láser. Aun así **no se
   publicó**, tal como se indicó. La sección está construida y desactivada.
3. **Automatización**: usan `#portoneselectricos` en publicaciones propias. **No se afirmó
   nada** al respecto en la web.
4. **Cobertura**: etiquetaron proyectos en **Garita, Alajuela** y **Tres Ríos**, así que
   trabajan fuera de San José. La pregunta de zonas sigue marcada como pendiente.
5. **Instalación**: una publicación muestra a sus operarios colocando una baranda. Sugiere
   que instalan, pero **no se afirmó** en la web.

Todo esto está detallado en `PENDIENTES-CLIENTE.md`.

---

## Activar el corte láser (cuando el cliente confirme)

**Plan A Medida** — en `amedida/js/main.js`, línea ~13:

```js
const MD_LASER = true;   // estaba en false
```

**Plan Profesional** — en `profesional/index.html`, quitar el atributo `hidden`
del `<article id="card-laser">`.

En ambos casos, completar después el texto real del servicio (materiales, espesores).

---

## Detalles de implementación

- **Sin dependencias ni build.** HTML, CSS y JavaScript planos. Se sube por FTP y funciona.
- **Responsive** en móvil, tablet y escritorio.
- **Accesibilidad**: navegación por teclado, `aria-label` en los controles, y respeta
  `prefers-reduced-motion` (si el usuario desactivó las animaciones, no se ejecutan).
- **SEO**: metadatos, Open Graph y datos estructurados `LocalBusiness` en JSON-LD.
  No se declara `aggregateRating` propio: las reseñas se enlazan al perfil real de Google.
### Al publicar el sitio definitivo

Dos cosas hay que revertir, porque están puestas a propósito para la demo:

1. **La cinta superior** que dice "PROPUESTA — PLAN…": quitar el `<div class="demo-bar">`
   y la clase `has-demo-bar` del `<body>`.
2. **El `noindex`**: las dos demos llevan `<meta name="robots" content="noindex,nofollow">`
   para no competirle en Google al sitio real. Cambiarlo a `index,follow`.

### Lo que falta para producción (no para la propuesta)

El cotizador y el asistente abren WhatsApp con el mensaje ya armado, que es el
comportamiento pedido. Para que además quede **registro** de cada solicitud aunque el
visitante no llegue a pulsar WhatsApp, hay que conectar el envío por correo
(Formspree, o una función serverless). Está marcado con `NOTA DE IMPLEMENTACIÓN` en
`js/main.js` y `js/cotizador.js`. Requiere el correo del cliente, que está pendiente.

---

## Reglas que se respetaron

- No se inventó ningún precio, material, garantía, cobertura, plazo, correo, red social,
  dirección exacta ni años de experiencia.
- No se redactó ningún testimonio. La sección existe, vacía y marcada.
- No se usaron frases como *"los mejores de Costa Rica"*, *"calidad #1"*,
  *"líderes del mercado"* ni *"resultados garantizados"*.
- No se prometió posicionamiento en Google.
- No se fabricaron reseñas: el negocio todavía no tiene perfil de Google Business, así que no se
  muestra ninguna calificación. La sección queda lista para activarse al crearlo.
- El asistente virtual **se presenta siempre como asistente virtual** y tiene prohibido
  inventar precios, prometer fechas, confirmar disponibilidad o dar por aceptada una
  solicitud. Cuando no sabe algo responde: *"No tengo esa información confirmada, pero
  podés consultarla directamente con Metales Decorados por WhatsApp."*
