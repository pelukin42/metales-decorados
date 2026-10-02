# Metales Decorados — convenciones del proyecto

Propuesta web para **Metales Decorados** (Guadalupe, Goicoechea, San José, Costa Rica).
Taller de hierro forjado y corte CNC láser.

El sitio en producción es un único plan: `amedida/` (multi-sección con catálogo, cotizador y
asistente). `index.html` en la raíz solo redirige a `amedida/index.html`. La demo `profesional/`
se eliminó del repo: ya no se mantiene ni se compara.

`amedida/` es el **Plan Premium**: "A Medida" ya no existe como plan. Los planes vigentes de
Axel Sites son Esencial, Profesional, Premium y Personalizado. Un sitio sin base de datos no
lleva la mensualidad de $60. La carpeta conserva el nombre `amedida/` para no romper enlaces.

Dominio comprado por el cliente: **metalesdecorados.com** (canonical ya actualizado).

Para el método completo de construcción, usar el skill **`nuevo-cliente`**.

## Reglas duras

**No inventar ningún dato del negocio.** Ni precios, materiales, garantías, plazos,
correos, direcciones, años de experiencia, cobertura ni testimonios. Campo sin
confirmar = vacío en `core.js` = la sección no se dibuja. Se anota en
`PENDIENTES-CLIENTE.md`.

**Solo fotos reales del cliente**, tomadas de `@metales_decorados01` con la interfaz
de Instagram recortada. Nunca bancos de imágenes ni fotos de otra empresa.

**Sin frases vacías**: "los mejores", "calidad #1", "líderes del mercado",
"garantizado". Sin prometer posicionamiento en Google.

## Fuente única

`assets/core.css` y `assets/core.js` son la fuente. Al editarlos, re-copiar:

```bash
cp assets/core.css amedida/css/styles.css
cp assets/core.js amedida/js/core.js
```

Todos los datos del negocio viven en el objeto `MD` de `assets/core.js`. Nada de
datos sueltos por el HTML.

## Sistema visual

Acero oscuro + latón. Tokens en el `:root` de `core.css`. Tipografía Sora (display)
e Inter (cuerpo). Fotografía protagonista.

## Fotografías

Cada `<img>` lleva `data-ph="descripción"`. El marcador "Fotografía pendiente" se
dibuja **antes** y se retira al cargar la imagen — ese orden es deliberado, porque con
`loading="lazy"` el evento `error` puede no dispararse nunca.

Al copiar una foto con el nombre exacto en `img/`, aparece sola. Los nombres esperados
están en `amedida/img/LEEME.txt`.

Falta pedir los originales del celular: las actuales vienen recomprimidas por Instagram.

### Fotos livianas (WebP)

Cada foto original de `amedida/img/` (`.jpg`) es la fuente y no se toca. Las copias WebP
livianas de `amedida/img/web/` y `amedida/js/fotos-web.js` **se generan** con:

```bash
python herramientas/optimizar-fotos.py            # tras agregar o reemplazar fotos
python herramientas/optimizar-fotos.py --revisar  # avisa si algo quedó desactualizado
```

Se suben al repo junto con la foto (también el `?v=` que el script pone en `index.html`).
Una foto nueva aparece sola sin correrlo, pero **si se reemplaza una existente hay que
correrlo**, o las tarjetas seguirán mostrando la anterior. Requiere `pip install pillow numpy`.

La calidad no es un número fijo: por cada copia el script elige la compresión más fuerte
(WebP 62–82) que todavía conserve un parecido (SSIM) de al menos 0.965 con la original. No bajar
ese piso ni los anchos para ahorrar peso. Además de las copias, el script guarda en
`fotos-web.js` una vista previa borrosa de cada foto (`l`, ~300 bytes).

### Cómo se cargan las fotos (no romper esto)

- Las fotos que arma `main.js` se piden **por turnos**: `imgFoto()` no pone `src` sino
  `data-src`, y `diferirFotos()` las pide cuando están por verse (500 px de margen), de a 2
  en celular y 3 en escritorio, las más cercanas al borde de la pantalla primero. Sin esto, en
  conexiones lentas las fotos de abajo le quitan la conexión a las que la persona está viendo.
  Cualquier `<img>` nueva generada por JS debe usar `imgFoto()` y llamar a `diferirFotos()`.
- Mientras una foto baja se ve su vista previa borrosa (o un fondo liso), **sin** el texto
  "Fotografía pendiente"; ese texto aparece solo si la foto falla o no existe.

## Catálogo

Al abrir solo se ven las categorías (portada + cantidad). Las fotos de los proyectos aparecen
al elegir una; no volver a poner una vista ni un botón "Todos" con todos los proyectos a la vez. Las portadas se
eligen en `CAT_PORTADA` de `amedida/js/main.js`.

**Categoría nueva: tocar todos estos lugares** (si no, el sitio queda desactualizado):
1. `amedida/js/main.js`: `CATEGORIAS`, `CAT_LABEL_EN`, `CAT_PORTADA`, `TIPO_POR_CAT`, el texto
   `ftr*` en `I18N.en` y el campo `cat` de sus proyectos.
2. `amedida/js/cotizador.js`: `CZ_TIPOS` (con ícono) y `CZ_TIPO_EN`.
3. `amedida/js/chatbot.js`: la lista de `botQue()` y `BOT_TIPO_EN`.
4. `amedida/index.html`: enlace en el pie (`data-cat` + `data-i18n`).
5. `herramientas/generar-pdf.py`: una página en `PAGINAS` y `python herramientas/generar-pdf.py catalogo`.
6. `python herramientas/optimizar-fotos.py` para sus fotos.

Los textos de los proyectos describen solo lo que se ve: no afirmar material (hierro, forja,
aluminio, lámina), ubicación ni fechas que el cliente no haya confirmado. Eso va en `PENDIENTE`.

## Guía de ayuda (wizard de 30 segundos)

`amedida/js/guia.js`: si la persona lleva 30 s con la página a la vista y todavía no empezó nada,
aparece una tarjeta (abajo a la derecha, sobre los botones flotantes) que pregunta qué quiere
hacer. Paso 1: pedir cotización / tengo una pregunta / solo ver trabajos. Si elige cotizar, paso 2:
**asistente virtual** (se abre y entra al flujo de cotizar, vía `botAbrirEn()` de `chatbot.js`) o
**cotizador** (baja a `#cotizar`). Reglas: una sola vez por visita (`sessionStorage`), no es modal, se
cierra con la X, Esc o "Ahora no"; no aparece si ya abrió el asistente, tocó el cotizador o un botón
de WhatsApp, ni mientras mira una ficha o el cotizador; el tiempo solo cuenta con la pestaña visible.
Los textos (ES/EN) están en el objeto `G` del archivo; no decir precios ni plazos.

## Mapa

La sección de contacto muestra un mapa de Google cargado desde `MD.mapsEmbed` (`assets/core.js`),
diferido (`loading="lazy"`) para no gastar datos hasta que se llega al contacto. Apunta a la
**ficha del negocio en Google Maps** ("Metales Decorados", taller de metalurgia; se reconoce por su
teléfono +506 8850 9207) mediante su `cid`. Si algún día se usa un mapa que no sea el del lugar
exacto, poner `MD.mapaExacto = false` y aparece el rótulo "Zona del taller". No escribir una
dirección en texto que el cliente no haya confirmado: la dirección que muestra el mapa es la de su
propia ficha de Google.

## Banderas de servicios

| Bandera | Estado | Dónde |
|---|---|---|
| Corte láser / CNC | `MD_LASER = false` | `amedida/js/main.js` ~línea 13 |
| Mobiliario | Categoría "Muebles" (catálogo, cotizador, asistente, pie, PDF) | Falta la tarjeta de servicio en "Qué fabricamos". El README documenta cómo. |

La evidencia del corte láser es fuerte (bio, hashtags, fotos del portafolio), pero
**no se publica** hasta que el cliente confirme materiales y espesores.

## Asistente virtual

Se presenta siempre como asistente virtual. Tiene prohibido inventar precios, prometer
fechas, confirmar disponibilidad o dar por aceptada una solicitud. Cuando no sabe:

> "No tengo esa información confirmada, pero podés consultarla directamente con
> Metales Decorados por WhatsApp."

## Correr y generar

```bash
python -m http.server 5180        # o el preview "propuesta" de launch.json
python herramientas/generar-pdf.py  # catálogo + tarjeta de reseñas (o: ... catalogo / ... tarjeta)
python herramientas/optimizar-fotos.py  # versiones livianas de las fotos (WebP)
```

El QR de reseñas está pendiente: falta el enlace de reseñas. Ya existe una ficha en Google Maps
(ver "Mapa"); confirmar con el cliente que la administra y luego pegar el enlace en `URL_RESENA`
de `herramientas/generar-pdf.py` y regenerar.

## Antes de publicar

1. Quitar el `<div class="demo-bar">` y la clase `has-demo-bar` del `<body>`.
2. Cambiar `robots` de `noindex,nofollow` a `index,follow`.
3. Conectar el envío por correo (Formspree o serverless) para que quede registro de
   cada solicitud. Marcado con `NOTA DE IMPLEMENTACIÓN` en `js/main.js` y
   `js/cotizador.js`. Requiere el correo del cliente, aún pendiente.
4. Correr `python herramientas/optimizar-fotos.py --revisar` y confirmar que dice "Todo al día".
