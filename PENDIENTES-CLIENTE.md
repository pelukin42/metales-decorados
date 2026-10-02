# Pendientes por confirmar con Metales Decorados

Lista para la reunión con el propietario. **Nada de esto se inventó en las demos**: donde falta el dato,
la página muestra la etiqueta `PENDIENTE CONFIRMAR CON CLIENTE`.

---

## 1. Datos de contacto

| Dato | Estado | Nota |
|---|---|---|
| Teléfono principal | ✅ Confirmado | +506 8850-9207 |
| Ubicación general | ✅ Confirmado | Guadalupe, Goicoechea, San José |
| Instagram | ✅ Confirmado | @metales_decorados01 |
| **Dirección exacta** | ⬜ Pendiente | Un directorio público (AiYellow) indica *"150 mts sur de Romanas Ballar, Barrio Pilar"*. **Verificar**: puede estar desactualizado. |
| **Segundo teléfono** | ⬜ Pendiente | El mismo directorio lista 8834-7681 y 8361-6116. **Confirmar si siguen vigentes** o si quedó solo el 8850-9207. |
| **Correo electrónico** | ⬜ Pendiente | No se inventó ninguno. El campo está oculto hasta tenerlo. |
| **Horario de atención** | ⬜ Pendiente | No se publica hasta confirmarlo. |
| **Facebook / otras redes** | ⬜ Pendiente | Existe una página de Facebook con nombre similar; verificar si es la misma empresa. |
| **Perfil de Google Business** | 🔴 **No existe** | El negocio **todavía no tiene perfil**. Es lo de mayor impacto de toda la propuesta: para un taller local, la ficha de Google trae más clientes que el sitio web. Hay que crearla, verificarla (Google manda un código) y llenarla. De ahí sale el enlace de reseñas que alimenta el QR. En el sitio se quitó la nota "Para activar" y el botón "Ver perfil en Google" (quedaban con etiquetas de pendiente visibles al público); la sección de reseñas queda solo con el mensaje genérico hasta que exista el perfil. Al crear y verificar el perfil: volver a agregar en `amedida/index.html` (sección `<div class="google rv">`) el botón "Ver perfil en Google" con el enlace real, y sumar la calificación/reseñas si se quiere mostrarlas. |
| **Mapa** | ⬜ Pendiente | Se inserta al confirmar la dirección. |

---

## 2. Servicios

| Tema | Estado | Nota |
|---|---|---|
| Portones | ✅ | Confirmado por el cliente y por la bio de Instagram |
| Puertas principales | ✅ | Aparece en la bio de Instagram — **añadido a la propuesta** |
| Rejas | ✅ | |
| Pasamanos / barandas | ✅ | La bio dice "barandas"; el directorio dice "pasamanos" |
| Mobiliario en metal | 🟡 **Solo como categoría "Muebles" del catálogo** | Ya hay proyectos con fotos reales (juegos de comedor, sala, banca, cama). Ya aparece en el cotizador, el asistente, el pie y el catálogo en PDF. **Falta decidir si se activa también la tarjeta de servicio** en "Qué fabricamos": necesita una foto `servicio-mobiliario.jpg`. |
| Decoración (lámparas, candelabros) | ✅ | |
| Proyectos a medida | ✅ | |
| **CORTE LÁSER / CNC** | 🔶 **Pendiente clave** | La evidencia es fuerte y es toda suya: (1) su bio dice *"Especialistas en Hierro forjado y **corte cnc láser**"*; (2) usan los hashtags **#lásercostarica**, **#cnc** y **#cncplasma** en sus propias publicaciones; (3) varias fotos del portafolio **son piezas cortadas en láser/CNC** (la puerta del pavo real, las puertas en lámina decorada, los paneles del taller). Aun así **no se publicó como servicio**, según lo indicado. La sección está construida y desactivada. **Preguntar: ¿lo ofrecen comercialmente a terceros, o solo lo usan para fabricar sus propias piezas? ¿Qué materiales y espesores?** Para activarla: `MD_LASER = true` en `amedida/js/main.js`. |
| **Portones automáticos / motores** | 🔶 Pendiente | **No se afirmó nada** en la web sobre automatización. Pero ellos usan el hashtag **#portoneselectricos** en al menos dos publicaciones propias, y en una foto se ve una guía en el suelo. Preguntar si instalan motores/automatización o si solo fabrican el portón. |
| **¿Hacen instalación?** | 🔶 Pendiente | Una de sus publicaciones muestra a **dos operarios colocando una baranda de escalera con nivel y cinta métrica**, lo que sugiere que sí instalan. No se afirmó en la web. Confirmar: ¿instalación incluida o aparte? |

---

## 3. Información comercial (todo pendiente)

- [ ] **Materiales completos y acabados.** Confirmados por la bio: hierro forjado y aluminio. Falta el resto (acero inoxidable, pinturas, tratamientos anticorrosivos, etc.).
- [ ] **Tiempos de fabricación** aproximados por tipo de trabajo.
- [ ] **Garantía**: ¿existe? ¿de qué tipo y por cuánto tiempo?
- [ ] **Zonas de cobertura**: ¿solo GAM? ¿todo el país? *Pista:* ellos mismos etiquetaron proyectos en **Garita, Alajuela** y en **Tres Ríos**, así que trabajan al menos fuera de San José. Confirmar el alcance real antes de publicarlo.
- [ ] **Métodos de pago** y si se trabaja con adelanto.
- [ ] **Años de experiencia** — no se publicó ninguna cifra.
- [ ] ¿Trabajan proyectos **comerciales** además de residenciales?

---

## 4. Contenido a solicitar

- [ ] **Fotografías originales en alta resolución.** Las que están en el sitio son obras reales suyas, pero salieron de capturas de Instagram y están recomprimidas. Pedir los archivos originales del celular y reemplazarlos con el mismo nombre (ver `amedida/img/LEEME.txt`).
- [x] **Fotos de MOBILIARIO.** Ya llegaron y están en la categoría "Muebles" del catálogo. Queda pendiente que confirmen si quieren activarlo también como servicio (ver la tabla de servicios, arriba).
- [ ] **Logo** en vector o PNG con fondo transparente. Ahora se usa un monograma "MD" provisional.
- [ ] **Testimonios reales** autorizados por los clientes, o el enlace a las reseñas de Google.
- [ ] Datos de cada proyecto del catálogo: ubicación, material, tipo de trabajo.
- [ ] ¿Quieren la **versión bilingüe** (ES/EN)? En la cotización CT-01 queda fuera y se cotiza aparte.

---

## 4-bis. Observaciones de sus publicaciones

Datos que salieron de revisar sus propios posts y que conviene aprovechar en la reunión:

- **"Puertas principales en lámina decorada con vidrio abatible"** es un pie de foto suyo. Confirma una línea de producto y un material (lámina + vidrio) que no estaba en el brief. Ya está en el catálogo.
- Las **puertas caladas** (pavo real, motivos florales, greca) son visiblemente su producto más vistoso y diferenciador. Podrían encabezar la propuesta comercial.
- Instagram muestra en su perfil la etiqueta *"Perfil con contenido generado con IA"*. Es un rótulo automático de Meta y no afecta al sitio web, pero conviene que lo sepan por si les resta credibilidad ante un cliente.

---

## 4-ter. Piezas descargables ya generadas

- **`amedida/Catalogo-Metales-Decorados.pdf`** — 7 páginas, se descarga desde el sitio y se manda por WhatsApp. Incluye QR que abre el chat con el mensaje ya escrito.
- **`Tarjeta-Resenas.pdf`** — media carta, para imprimir y entregar con cada trabajo.

Los dos llevan el QR de reseña **como marcador**, porque el perfil de Google no existe todavía.
Al crearlo: pegar el enlace en `URL_RESENA` dentro de `herramientas/generar-pdf.py` y correr
`python herramientas/generar-pdf.py`. Los QR se regeneran solos.

---

## 5. Decisiones técnicas

- [ ] **Dominio**: ¿ya tienen uno? Si no, verificar disponibilidad (`metalesdecorados.cr`, `.com`).
- [ ] **Correo profesional** (Plan Premium): definir la dirección, p. ej. `info@`, `ventas@`.
- [ ] ¿Quieren recibir **copia por correo** de cada solicitud del cotizador, además del WhatsApp? Requiere el correo del punto anterior.

---

## Regla que se aplicó en toda la propuesta

> No se publicó ningún precio, material, garantía, cobertura, plazo, correo ni testimonio
> que no estuviera confirmado. Tampoco se usaron frases como "los mejores de Costa Rica",
> "calidad #1" o "resultados garantizados", ni fotografías de trabajos de otras empresas.
