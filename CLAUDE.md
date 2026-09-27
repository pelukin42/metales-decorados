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

## Banderas de servicios

| Bandera | Estado | Dónde |
|---|---|---|
| Corte láser / CNC | `MD_LASER = false` | `amedida/js/main.js` ~línea 13 |
| Mobiliario | Retirado del sitio | Sin fotos. El README documenta cómo reactivarlo. |

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
python herramientas/generar-pdf.py  # catálogo + tarjeta de reseñas
```

El QR de reseñas está pendiente: no existe perfil de Google Business todavía. Al
crearlo, pegar el enlace en `URL_RESENA` de `herramientas/generar-pdf.py` y regenerar.

## Antes de publicar

1. Quitar el `<div class="demo-bar">` y la clase `has-demo-bar` del `<body>`.
2. Cambiar `robots` de `noindex,nofollow` a `index,follow`.
3. Conectar el envío por correo (Formspree o serverless) para que quede registro de
   cada solicitud. Marcado con `NOTA DE IMPLEMENTACIÓN` en `js/main.js` y
   `js/cotizador.js`. Requiere el correo del cliente, aún pendiente.
