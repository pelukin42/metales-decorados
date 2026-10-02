# -*- coding: utf-8 -*-
"""
Genera las dos piezas descargables de Metales Decorados:

  1. Catalogo-Metales-Decorados.pdf   11 paginas, para mandar por WhatsApp
  2. Tarjeta-Resenas.pdf              media carta, para imprimir y entregar

Uso:
    python herramientas/generar-pdf.py             # genera las dos piezas
    python herramientas/generar-pdf.py catalogo    # solo el catalogo
    python herramientas/generar-pdf.py tarjeta     # solo la tarjeta de resenas

Cuando el cliente cree su perfil de Google Business, poner el enlace en
URL_RESENA (abajo) y volver a correr el script. Los QR se regeneran solos.

Requiere: segno  (pip install segno)  y  Google Chrome instalado.
Opcional: pillow  (pip install pillow)  para aligerar las fotos dentro del PDF.
"""

import io, os, base64, subprocess, shutil, sys, tempfile, time
import urllib.parse
from functools import lru_cache
import segno

try:
    from PIL import Image
except ImportError:      # sin Pillow las fotos se incrustan tal cual (el PDF pesa mas)
    Image = None

# ==========================================================================
#  CONFIGURACION — lo unico que hay que tocar
# ==========================================================================

TELEFONO   = '+506 8850-9207'
WHATSAPP   = '50688509207'
INSTAGRAM  = '@metales_decorados01'
CIUDAD     = 'Guadalupe, Goicoechea'
PROVINCIA  = 'San José, Costa Rica'

# [PENDIENTE CONFIRMAR CON CLIENTE]
# El negocio todavia NO tiene perfil de Google Business.
# Al crearlo, pegar aqui el enlace directo al formulario de resena.
# Se obtiene en el panel de Google Business: Inicio -> "Pide resenas" -> copiar enlace.
# Queda de la forma:  https://g.page/r/CXXXXXXXXXXXX/review
URL_RESENA = ''

MSG_WHATSAPP = ('Hola, vi el catálogo de Metales Decorados y quisiera '
                'cotizar un proyecto.')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG  = os.path.join(RAIZ, 'amedida', 'img')


# ==========================================================================
#  CONTENIDO DEL CATALOGO
#  Solo trabajos reales con fotografia. Nada de datos inventados:
#  sin precios, sin plazos, sin garantias, sin medidas que no consten.
# ==========================================================================

PAGINAS = [
    {
        'cat': 'Portones',
        'titulo': 'Portones',
        'texto': 'Portones de entrada fabricados a la medida del acceso: '
                 'batientes, corredizos o con puerta peatonal integrada.',
        'fotos': ['proyecto-01-a.jpg', 'proyecto-02-a.jpg',
                  'proyecto-03-a.jpg', 'proyecto-01-b.jpg'],
    },
    {
        'cat': 'Puertas principales',
        'titulo': 'Puertas principales',
        'texto': 'Puertas de acceso trabajadas pieza por pieza. En hierro '
                 'forjado, o en lámina decorada con vidrio abatible.',
        'fotos': ['proyecto-05-a.jpg', 'proyecto-06-a.jpg',
                  'proyecto-06-c.jpg', 'proyecto-06-d.jpg'],
    },
    {
        'cat': 'Puertas principales',
        'titulo': 'Cada puerta, un diseño distinto',
        'texto': 'Lámina calada con motivos florales o geométricos, o hierro '
                 'forjado sobre vidrio. Todo a la medida del vano y de la casa.',
        'fotos': ['proyecto-06-b.jpg', 'proyecto-07-a.jpg'],
        'grande': True,
    },
    {
        'cat': 'Rejas y pasamanos',
        'titulo': 'Rejas y pasamanos',
        'texto': 'Rejas de protección y cerramiento, pasamanos de escalera y '
                 'barandas, ajustados al espacio y al estilo del proyecto.',
        'fotos': ['proyecto-04-a.jpg', 'proyecto-08-a.jpg'],
        'grande': True,
    },
    {
        'cat': 'Decoración en metal',
        'titulo': 'Decoración en metal',
        'texto': 'Paneles calados, lámparas y piezas decorativas. El metal '
                 'como parte del diseño del ambiente, no solo como estructura.',
        'fotos': ['proyecto-09-a.jpg'],
        'grande': True,
    },
    {
        'cat': 'Muebles',
        'titulo': 'Muebles',
        'texto': 'Juegos de comedor y de sala, mesas, bancas y camas, pensados '
                 'para el espacio y el estilo de cada proyecto.',
        'fotos': ['proyecto-49-a.jpg', 'proyecto-44-a.jpg',
                  'proyecto-38-a.jpg', 'proyecto-37-a.jpg'],
    },
    {
        'cat': 'Lámparas',
        'titulo': 'Lámparas',
        'texto': 'Lámparas colgantes y faroles de pared y de poste, para '
                 'salones, corredores y accesos.',
        'fotos': ['proyecto-43-a.jpg', 'proyecto-24-a.jpg',
                  'proyecto-25-a.jpg', 'proyecto-31-a.jpg'],
    },
    {
        'cat': 'Escaleras',
        'titulo': 'Escaleras',
        'texto': 'Escaleras de caracol y escaleras de peldaños de madera sobre '
                 'estructura metálica, para interiores y exteriores.',
        'fotos': ['proyecto-33-a.jpg', 'proyecto-34-a.jpg',
                  'proyecto-35-a.jpg', 'proyecto-36-a.jpg'],
    },
    {
        'cat': 'Chimeneas',
        'titulo': 'Chimeneas',
        'texto': 'Puertas de chimenea con malla metálica y diseños calados, '
                 'hechas para cada hogar.',
        'fotos': ['proyecto-41-a.jpg', 'proyecto-46-a.jpg',
                  'proyecto-47-a.jpg', 'proyecto-42-a.jpg'],
    },
]


# ==========================================================================
#  UTILIDADES
# ==========================================================================

def qr_datauri(texto, escala=10, oscuro='#15181c', claro=None):
    """Devuelve un QR como data URI PNG, listo para incrustar en el HTML."""
    buf = io.BytesIO()
    segno.make(texto, error='h').save(
        buf, kind='png', scale=escala, border=2, dark=oscuro, light=claro)
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()


ANCHO_MAX_FOTO = 1400    # px; sobra para una foto de 3.5 a 7 pulgadas en el PDF


@lru_cache(maxsize=None)
def img_datauri(nombre):
    """Incrusta la foto en el HTML para que el PDF no dependa de rutas.
    Con Pillow se reduce a ANCHO_MAX_FOTO px: el PDF queda mas liviano para mandarlo
    por WhatsApp y se ve igual."""
    ruta = os.path.join(IMG, nombre)
    if not os.path.exists(ruta):
        print('   ! falta la foto:', nombre)
        return ''
    if Image is not None:
        with Image.open(ruta) as im:
            im = im.convert('RGB')
            if im.width > ANCHO_MAX_FOTO:
                im = im.resize((ANCHO_MAX_FOTO, round(im.height * ANCHO_MAX_FOTO / im.width)), Image.LANCZOS)
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=85, optimize=True)
        datos = buf.getvalue()
    else:
        with open(ruta, 'rb') as f:
            datos = f.read()
    return 'data:image/jpeg;base64,' + base64.b64encode(datos).decode()


def buscar_chrome():
    for r in [r'C:\Program Files\Google\Chrome\Application\chrome.exe',
              r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
              r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
              r'C:\Program Files\Microsoft\Edge\Application\msedge.exe']:
        if os.path.exists(r):
            return r
    for n in ('google-chrome', 'chromium', 'msedge'):
        if shutil.which(n):
            return shutil.which(n)
    sys.exit('No se encontró Chrome ni Edge para generar el PDF.')


def html_a_pdf(html, salida, tmp):
    io.open(tmp, 'w', encoding='utf-8').write(html)
    antes = os.path.getmtime(salida) if os.path.exists(salida) else 0
    # Perfil propio: si no, Chrome le pasa el trabajo a una ventana abierta,
    # devuelve el control enseguida y el PDF se escribe despues, tarde.
    perfil = tempfile.mkdtemp(prefix='md-chrome-')
    subprocess.run([buscar_chrome(), '--headless=new', '--disable-gpu',
                    '--no-sandbox', '--no-pdf-header-footer',
                    '--user-data-dir=' + perfil,
                    '--virtual-time-budget=20000',
                    '--print-to-pdf=' + salida,
                    'file:///' + tmp.replace('\\', '/')],
                   capture_output=True)
    # Se espera a que el PDF sea nuevo y deje de crecer antes de seguir
    limite, tam = time.time() + 90, -1
    while True:
        if os.path.exists(salida) and os.path.getmtime(salida) > antes:
            t = os.path.getsize(salida)
            if t == tam and t > 0:
                break
            tam = t
        if time.time() > limite:
            sys.exit('Chrome no genero ' + os.path.basename(salida) + ' a tiempo.')
        time.sleep(1)
    os.remove(tmp)
    shutil.rmtree(perfil, ignore_errors=True)
    kb = round(os.path.getsize(salida) / 1024)
    print('   ->', os.path.basename(salida), '(' + str(kb), 'KB)')


# ==========================================================================
#  ESTILOS COMPARTIDOS
# ==========================================================================

BASE = """
  @page{ margin:0; }
  *,*::before,*::after{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; }
  body{
    font-family:'Inter','Segoe UI',system-ui,sans-serif;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  h1,h2,h3{ font-family:'Sora','Segoe UI',sans-serif; margin:0; font-weight:600;
            letter-spacing:-.02em; line-height:1.08; }
  .pg{ position:relative; overflow:hidden; page-break-after:always; }
  .pg:last-child{ page-break-after:auto; }
  .eyebrow{ font-size:8.5pt; letter-spacing:.24em; text-transform:uppercase;
            color:#c8a04a; font-weight:600; }
  .rule{ height:1px; width:52px; background:linear-gradient(90deg,#c8a04a,transparent); }
  .marca{ display:flex; align-items:center; gap:9px; }
  .marca i{ width:26px; height:26px; border-radius:6px; display:grid; place-items:center;
            background:linear-gradient(140deg,#2a2d33,#101215); border:1px solid #2e333a;
            font-family:'Sora',sans-serif; font-weight:700; font-size:9pt;
            color:#d9b567; font-style:normal; }
  .marca b{ font-family:'Sora',sans-serif; font-size:10pt; font-weight:600; }
"""

FUENTES = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
           'family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap">')


# ==========================================================================
#  1) CATALOGO
# ==========================================================================

def construir_catalogo():
    qr_wa = qr_datauri('https://wa.me/' + WHATSAPP + '?text=' +
                       urllib.parse.quote(MSG_WHATSAPP),   # tildes incluidas
                       oscuro='#15181c', claro='#ffffff')

    # Bloque de resena: solo se dibuja el QR si ya existe el perfil de Google.
    if URL_RESENA:
        bloque_resena = (
            '<div class="qr"><img src="' + qr_datauri(URL_RESENA, escala=8,
             oscuro='#15181c', claro='#ffffff') + '" alt="QR de reseña">'
            '<span>Dejar una reseña</span></div>')
    else:
        bloque_resena = (
            '<div class="qr qr--falta"><div class="caja">QR<br>PENDIENTE</div>'
            '<span>Falta crear el perfil<br>de Google Business</span></div>')

    P = []

    # --- Portada ---
    P.append(
      '<div class="pg portada">'
        '<img class="fondo" src="' + img_datauri('hero.jpg') + '" alt="">'
        '<div class="velo"></div>'
        '<div class="contenido">'
          '<div class="marca"><i>MD</i><b>Metales Decorados</b></div>'
          '<div class="centro">'
            '<div class="rule"></div>'
            '<p class="eyebrow">Portafolio de trabajos</p>'
            '<h1>Transformamos metal en proyectos hechos a tu medida</h1>'
            '<p class="sub">Portones · Puertas principales · Rejas · '
            'Pasamanos · Decoración en metal · Muebles · Lámparas · '
            'Escaleras · Chimeneas</p>'
          '</div>'
          '<div class="pie"><span>' + CIUDAD + ' · ' + PROVINCIA + '</span>'
          '<span>' + TELEFONO + '</span></div>'
        '</div>'
      '</div>')

    # --- Paginas de categoria ---
    for i, p in enumerate(PAGINAS, 1):
        fotos = [f for f in p['fotos'] if img_datauri(f)]
        if len(fotos) == 1:   clase = 'rej rej--1'
        elif p.get('grande'): clase = 'rej rej--2'
        else:                 clase = 'rej rej--4'
        celdas = ''.join(
            '<div class="celda"><img src="' + img_datauri(f) + '" alt=""></div>'
            for f in fotos)

        P.append(
          '<div class="pg interior">'
            '<div class="cab">'
              '<div class="rule"></div>'
              '<p class="eyebrow">' + p['cat'] + '</p>'
              '<h2>' + p['titulo'] + '</h2>'
              '<p class="txt">' + p['texto'] + '</p>'
            '</div>'
            '<div class="' + clase + '">' + celdas + '</div>'
            '<div class="npag"><span class="marca"><i>MD</i></span>'
            '<span>' + str(i + 1).zfill(2) + '</span></div>'
          '</div>')

    # --- Contacto ---
    P.append(
      '<div class="pg contacto">'
        '<div class="cab">'
          '<div class="rule"></div>'
          '<p class="eyebrow">Contacto</p>'
          '<h2>Coticemos su proyecto</h2>'
          '<p class="txt">Cuéntenos qué necesita fabricar, la zona y las '
          'medidas aproximadas. Con una fotografía del espacio o una imagen '
          'de referencia ya se puede preparar la cotización.</p>'
        '</div>'

        '<div class="datos">'
          '<div><b>Teléfono y WhatsApp</b><span>' + TELEFONO + '</span></div>'
          '<div><b>Instagram</b><span>' + INSTAGRAM + '</span></div>'
          '<div><b>Taller</b><span>' + CIUDAD + '<br>' + PROVINCIA + '</span></div>'
        '</div>'

        '<div class="qrs">'
          '<div class="qr"><img src="' + qr_wa + '" alt="QR de WhatsApp">'
          '<span>Escribir por WhatsApp</span></div>'
          '<div class="qrs__tx">'
            '<h3>Escanee el código con la cámara</h3>'
            '<p>Se abre el chat de WhatsApp con el mensaje ya escrito. '
            'Solo agregue las fotos o los detalles de lo que necesita.</p>'
            '<p class="ojo">También puede escribir directamente al '
            '<b>' + TELEFONO + '</b></p>'
          '</div>'
        '</div>'

        '<div class="resena">'
          '<div class="resena__tx">'
            '<p class="eyebrow">¿Ya trabajamos con usted?</p>'
            '<h3>Su opinión nos ayuda mucho</h3>'
            '<p class="txt">Si le fabricamos algo, dejarnos una reseña en '
            'Google toma menos de un minuto y ayuda a que otras personas '
            'nos encuentren.</p>'
          '</div>' + bloque_resena +
        '</div>'

        '<div class="npag"><span class="marca"><i>MD</i><b>Metales Decorados</b></span>'
        '<span>' + str(len(PAGINAS) + 2).zfill(2) + '</span></div>'
      '</div>')

    css = BASE + """
    @page{ size:Letter; }
    body{ background:#0d0e10; color:#edeef0; }
    .pg{ width:8.5in; height:11in; }

    /* Portada */
    .portada .fondo{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    .portada .velo{ position:absolute; inset:0;
      background:linear-gradient(180deg,rgba(13,14,16,.86) 0%,rgba(13,14,16,.55) 42%,rgba(13,14,16,.96) 100%); }
    .portada .contenido{ position:relative; height:100%; padding:0.72in 0.7in;
      display:flex; flex-direction:column; justify-content:space-between; }
    .portada .centro{ max-width:5.6in; }
    .portada .rule{ margin-bottom:16px; }
    .portada h1{ font-size:31pt; margin:10px 0 16px; }
    .portada .sub{ margin:0; color:#b9bec5; font-size:10.5pt; letter-spacing:.01em; }
    .portada .pie{ display:flex; justify-content:space-between; font-size:8.5pt;
      color:#868d96; letter-spacing:.05em; border-top:1px solid #22262b; padding-top:12px; }

    /* Interiores */
    .interior{ padding:0.7in 0.7in 0.55in; display:flex; flex-direction:column; }
    .cab{ margin-bottom:0.3in; }
    .cab .rule{ margin-bottom:13px; }
    .cab h2{ font-size:20pt; margin:8px 0 9px; }
    .cab .txt{ margin:0; color:#b9bec5; font-size:9.5pt; line-height:1.55; max-width:5.4in; }

    /* minmax(0,1fr) y la foto en posicion absoluta: una foto vertical no puede
       empujar la rejilla fuera de la pagina ni tapar el numero de pagina */
    .rej{ display:grid; gap:0.13in; flex:1; min-height:0; }
    .rej--4{ grid-template-columns:1fr 1fr; grid-template-rows:minmax(0,1fr) minmax(0,1fr); }
    .rej--2{ grid-template-columns:1fr 1fr; grid-template-rows:minmax(0,1fr); }
    .rej--1{ grid-template-columns:1fr; grid-template-rows:minmax(0,1fr); }
    .celda{ position:relative; overflow:hidden; border-radius:5px; min-height:0;
            border:1px solid #22262b; background:#1a1d21; }
    .celda img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }

    .npag{ display:flex; justify-content:space-between; align-items:center;
      margin-top:0.28in; padding-top:11px; border-top:1px solid #1f2329;
      font-size:8pt; color:#868d96; letter-spacing:.1em; }

    /* Contacto */
    .contacto{ padding:0.7in; display:flex; flex-direction:column; }
    .datos{ display:grid; grid-template-columns:repeat(3,1fr); gap:0.18in;
      margin:0.34in 0 0.3in; }
    .datos div{ border:1px solid #22262b; border-radius:5px; padding:15px 16px;
      background:#141619; }
    .datos b{ display:block; font-size:7.5pt; letter-spacing:.15em;
      text-transform:uppercase; color:#868d96; margin-bottom:6px; font-weight:600; }
    .datos span{ font-size:10pt; color:#edeef0; line-height:1.45; }

    .qrs{ display:flex; gap:0.34in; align-items:center; }
    .qrs__tx{ flex:1; max-width:3.6in; }
    .qrs__tx h3{ font-size:12pt; margin-bottom:9px; }
    .qrs__tx p{ margin:0 0 9px; color:#b9bec5; font-size:9pt; line-height:1.55; }
    .qrs__tx .ojo{ color:#868d96; font-size:8.5pt; margin:0; }
    .qrs__tx .ojo b{ color:#c8a04a; }
    .qr{ display:flex; flex-direction:column; align-items:center; gap:9px; }
    .qr img{ width:1.5in; height:1.5in; border-radius:5px; border:5px solid #fff; }
    .qr span{ font-size:8.5pt; color:#b9bec5; text-align:center; line-height:1.35; }
    .qr--falta .caja{ width:1.5in; height:1.5in; border-radius:5px;
      border:2px dashed rgba(200,160,74,.55); display:flex; align-items:center;
      justify-content:center; text-align:center; color:#c8a04a; font-size:8.5pt;
      font-family:'Sora',sans-serif; letter-spacing:.12em; line-height:1.6;
      background:rgba(200,160,74,.07); }

    .resena{ margin-top:auto; display:flex; gap:0.3in; align-items:center;
      border:1px solid #22262b; border-left:2px solid #c8a04a; border-radius:5px;
      padding:0.26in 0.3in; background:#141619; }
    .resena__tx{ flex:1; }
    .resena h3{ font-size:13pt; margin:7px 0 8px; }
    .resena .txt{ margin:0; color:#b9bec5; font-size:9pt; line-height:1.55; }
    .resena .qr img{ width:1.15in; height:1.15in; }
    .resena .qr--falta .caja{ width:1.15in; height:1.15in; font-size:7.5pt; }
    """

    return ('<!DOCTYPE html><html lang="es-CR"><head><meta charset="utf-8">'
            + FUENTES + '<style>' + css + '</style></head><body>'
            + ''.join(P) + '</body></html>')


# ==========================================================================
#  2) TARJETA DE RESENAS  (media carta, para imprimir y entregar)
# ==========================================================================

def construir_tarjeta():
    if URL_RESENA:
        qr = ('<img class="qrgrande" src="' + qr_datauri(URL_RESENA, escala=12)
              + '" alt="QR de reseña">')
        pie = 'Escanee el código con la cámara del teléfono'
    else:
        qr = ('<div class="qrgrande falta">QR PENDIENTE<br>'
              '<small>Falta crear el perfil de Google Business</small></div>')
        # Lo lee el propietario: sin jerga tecnica (la instruccion esta arriba, en URL_RESENA)
        pie = ('Aquí va el código QR que abre la reseña en Google. '
               'Se activa al crear el perfil de Google Business.')

    css = BASE + """
    @page{ size:8.5in 5.5in; }
    body{ background:#fff; color:#15181c; }
    .pg{ width:8.5in; height:5.5in; padding:0.5in 0.55in;
         display:flex; gap:0.5in; align-items:center; }
    .izq{ flex:1; }
    .izq .rule{ margin-bottom:14px; }
    .izq h1{ font-size:22pt; margin:9px 0 12px; }
    .izq p{ margin:0 0 9px; color:#4d545c; font-size:10pt; line-height:1.6; }
    .izq .marca{ margin-bottom:20px; }
    .izq .marca i{ background:#15181c; border-color:#15181c; color:#d9b567; }
    .der{ text-align:center; }
    .qrgrande{ width:2.5in; height:2.5in; display:block; }
    .qrgrande.falta{ border:2px dashed #b8892a; border-radius:6px; color:#8a6410;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      font-family:'Sora',sans-serif; font-size:11pt; letter-spacing:.1em;
      background:#f8f3e6; padding:16px; line-height:1.7; }
    .qrgrande.falta small{ font-size:7.5pt; letter-spacing:0; color:#79818b;
      display:block; margin-top:8px; font-family:'Inter',sans-serif; }
    .der .cap{ font-size:8pt; color:#79818b; margin-top:12px; max-width:2.5in;
      line-height:1.5; }
    .contactos{ border-top:1px solid #d5dae0; padding-top:11px; margin-top:16px;
      font-size:8.5pt; color:#79818b; letter-spacing:.04em; }
    """

    cuerpo = (
      '<div class="pg">'
        '<div class="izq">'
          '<div class="marca"><i>MD</i><b>Metales Decorados</b></div>'
          '<div class="rule"></div>'
          '<p class="eyebrow" style="color:#8a6410">Gracias por confiar en nosotros</p>'
          '<h1>Su opinión nos ayuda<br>a seguir creciendo</h1>'
          '<p>Si quedó conforme con su trabajo, dejarnos una reseña en Google '
          'toma menos de un minuto.</p>'
          '<p>Es la forma más directa de ayudarnos: hace que otras personas '
          'de la zona nos encuentren.</p>'
          '<div class="contactos">' + TELEFONO + ' · ' + INSTAGRAM + ' · ' + CIUDAD + '</div>'
        '</div>'
        '<div class="der">' + qr + '<p class="cap">' + pie + '</p></div>'
      '</div>')

    return ('<!DOCTYPE html><html lang="es-CR"><head><meta charset="utf-8">'
            + FUENTES + '<style>' + css + '</style></head><body>'
            + cuerpo + '</body></html>')


# ==========================================================================
if __name__ == '__main__':
    print('Generando piezas descargables...')
    if not URL_RESENA:
        print('   ! URL_RESENA vacía: los QR de reseña salen como marcador.')
        print('     El negocio aún no tiene perfil de Google Business.')

    # Un HTML temporal por pieza, para que nunca se crucen
    tmp = os.path.join(RAIZ, 'herramientas', '_tmp-{}.html')
    solo = sys.argv[1] if len(sys.argv) > 1 else 'todo'

    # El catalogo se guarda dentro del sitio para poder descargarlo desde la web
    if solo in ('todo', 'catalogo'):
        html_a_pdf(construir_catalogo(),
                   os.path.join(RAIZ, 'amedida', 'Catalogo-Metales-Decorados.pdf'),
                   tmp.format('catalogo'))
    if solo in ('todo', 'tarjeta'):
        html_a_pdf(construir_tarjeta(),
                   os.path.join(RAIZ, 'Tarjeta-Resenas.pdf'), tmp.format('tarjeta'))

    print('Listo.')
