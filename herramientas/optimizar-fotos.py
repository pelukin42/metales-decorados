"""Genera las versiones livianas (WebP) de las fotos del sitio y sus vistas previas borrosas.

Uso:
    python herramientas/optimizar-fotos.py             # genera lo que falte o haya cambiado
    python herramientas/optimizar-fotos.py --forzar    # regenera todo
    python herramientas/optimizar-fotos.py --revisar   # solo avisa si algo quedó desactualizado

Las fotos originales (.jpg en amedida/img/) NO se tocan: siguen siendo la fuente
y la versión que se ve en grande. De cada una se crean:
  - copias más chicas en amedida/img/web/ (WebP) para las tarjetas del catálogo,
    las miniaturas y la portada, y
  - una vista previa diminuta y borrosa (unos 300 bytes) que se ve al instante mientras
    baja la foto de verdad.
Todo queda anotado en amedida/js/fotos-web.js.

Calidad: no se usa un número fijo. Para cada copia se busca la compresión más fuerte
(calidad WebP entre CALIDAD_MIN y CALIDAD_MAX) que todavía se parezca a la foto
original con un SSIM de al menos OBJETIVO_SSIM, medido al mismo tamaño. Una foto con
mucho detalle conserva más calidad que una foto simple, y ninguna baja de ese piso.

La página usa la versión liviana si existe y, si no, la foto original. Por eso
una foto nueva aparece sola apenas se copia a img/; este script solo la hace más
liviana. Hay que correrlo cada vez que se agregue o se reemplace una foto (si se
reemplaza una foto sin correrlo, las tarjetas seguirían mostrando la anterior) y
subir también lo que cambie en img/web/, js/fotos-web.js e index.html.

Requiere:  pip install pillow numpy
"""

import base64
import hashlib
import io
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / "amedida" / "img"
WEB = IMG / "web"
MANIFIESTO = RAIZ / "amedida" / "js" / "fotos-web.js"
INDEX = RAIZ / "amedida" / "index.html"

# Anchos (px) de las copias. Nunca se agranda una foto.
ANCHOS = (480, 960)
ANCHOS_ESPECIALES = {"hero": (1280, 1600)}  # la portada se ve a pantalla completa (también en celular)
OMITIR = {"og"}                              # imagen para compartir el enlace: se queda en .jpg
ANCHO_MINIMO = 960                           # una foto más angosta ya es liviana: se usa tal cual, sin recomprimirla

CALIDAD_MAX = 82                             # tope: lo que se usa si la foto es muy detallada
CALIDAD_MIN = 62                             # piso: nunca se comprime más que esto
PASO_CALIDAD = 4
OBJETIVO_SSIM = 0.965                        # parecido mínimo con la original (1.0 = idéntica)
METODO = 6                                   # 6 = la compresión más lenta y más eficiente

LQIP_ANCHO = 24                              # vista previa borrosa: 24 px de ancho
LQIP_CALIDAD = 40


# --------------------------------------------------------------------------
#  Medición de calidad (SSIM sobre la luminosidad, ventana de 7x7)
# --------------------------------------------------------------------------

def _promedio(x: np.ndarray, k: int = 7) -> np.ndarray:
    c = np.pad(np.cumsum(np.cumsum(x, 0), 1), ((1, 0), (1, 0)))
    return (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)


def ssim(a: Image.Image, b: Image.Image) -> float:
    a = np.asarray(a.convert("L"), dtype=np.float64)
    b = np.asarray(b.convert("L"), dtype=np.float64)
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    ma, mb = _promedio(a), _promedio(b)
    saa, sbb, sab = _promedio(a * a) - ma * ma, _promedio(b * b) - mb * mb, _promedio(a * b) - ma * mb
    return float((((2 * ma * mb + c1) * (2 * sab + c2)) / ((ma * ma + mb * mb + c1) * (saa + sbb + c2))).mean())


def _webp(im: Image.Image, calidad: int) -> bytes:
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=calidad, method=METODO)
    return buf.getvalue()


def comprimir(im: Image.Image) -> tuple:
    """La compresión más fuerte que todavía cumple OBJETIVO_SSIM. Devuelve (bytes, calidad)."""
    def parecido(datos: bytes) -> float:
        return ssim(im, Image.open(io.BytesIO(datos)).convert("RGB"))

    mejor = (_webp(im, CALIDAD_MAX), CALIDAD_MAX)     # el tope siempre se acepta
    if parecido(mejor[0]) < OBJETIVO_SSIM:
        return mejor                                  # ni al tope llega: bajar solo empeoraría
    for q in range(CALIDAD_MAX - PASO_CALIDAD, CALIDAD_MIN - 1, -PASO_CALIDAD):
        datos = _webp(im, q)
        if parecido(datos) < OBJETIVO_SSIM:
            break
        mejor = (datos, q)
    return mejor


def vista_previa(im: Image.Image) -> str:
    chica = im.resize((LQIP_ANCHO, max(1, round(im.height * LQIP_ANCHO / im.width))), Image.LANCZOS)
    return "data:image/webp;base64," + base64.b64encode(_webp(chica, LQIP_CALIDAD)).decode()


# --------------------------------------------------------------------------
#  Manifiesto e index.html
# --------------------------------------------------------------------------

def huella(archivo: Path, anchos: tuple) -> str:
    """Cambia si cambia la foto o los ajustes: sirve para regenerar y para romper la caché."""
    h = hashlib.md5(archivo.read_bytes())
    h.update(f"{anchos}|{CALIDAD_MAX}|{CALIDAD_MIN}|{PASO_CALIDAD}|{OBJETIVO_SSIM}|{METODO}|"
             f"{LQIP_ANCHO}|{LQIP_CALIDAD}".encode())
    return h.hexdigest()[:8]


def leer_manifiesto() -> dict:
    if not MANIFIESTO.exists():
        return {}
    texto = MANIFIESTO.read_text(encoding="utf-8")
    try:
        return json.loads(texto[texto.find("{"):texto.rfind("}") + 1])
    except ValueError:
        return {}


def escribir_manifiesto(datos: dict) -> None:
    cuerpo = ",\n".join(
        f'  {json.dumps(k)}:{json.dumps(v, separators=(",", ":"))}' for k, v in sorted(datos.items())
    )
    texto = (
        "/* GENERADO por herramientas/optimizar-fotos.py. No editar a mano.\n"
        "   w = anchos de las copias WebP de img/web/ (vacío: la foto ya es liviana y se usa tal cual),\n"
        "   v = huella (rompe la caché), l = vista previa borrosa. Una foto que no aparece aquí se\n"
        "   muestra con su .jpg original. */\n"
        "const FOTOS_WEB = {\n" + cuerpo + "\n};\n"
    )
    with open(MANIFIESTO, "w", encoding="utf-8", newline="\n") as f:
        f.write(texto)


def poner_versiones_en_html(datos: dict) -> bool:
    """Las fotos escritas a mano en index.html (portada y 'a medida') llevan ?v=huella en la URL,
    igual que las que arma main.js. Así una copia nueva nunca se confunde con la que quedó guardada
    en el navegador. Devuelve True si hubo cambios."""
    with open(INDEX, encoding="utf-8", newline="") as f:
        html = f.read()

    def con_version(m):
        stem, ancho = m.group(1), m.group(2)
        v = datos.get(stem, {}).get("v")
        return f"img/web/{stem}-{ancho}.webp" + (f"?v={v}" if v else "")

    nuevo = re.sub(r"img/web/([\w-]+?)-(\d+)\.webp(?:\?v=[0-9a-f]+)?", con_version, html)
    if nuevo == html:
        return False
    with open(INDEX, "w", encoding="utf-8", newline="") as f:
        f.write(nuevo)
    return True


def planear() -> list:
    """Para cada foto: (foto, anchos de las copias, huella, archivos). Las angostas llevan
    anchos vacíos: no se recomprimen, pero sí tienen vista previa borrosa."""
    plan = []
    for foto in sorted(f for f in IMG.glob("*.jpg") if f.stem not in OMITIR):
        anchos = ANCHOS_ESPECIALES.get(foto.stem, ANCHOS)
        with Image.open(foto) as im:
            ancho_orig = ImageOps.exif_transpose(im).width
        usar = [] if ancho_orig < ANCHO_MINIMO else [w for w in anchos if w <= ancho_orig]
        plan.append((foto, usar, huella(foto, anchos), {w: WEB / f"{foto.stem}-{w}.webp" for w in usar}))
    return plan


def main() -> None:
    forzar = "--forzar" in sys.argv
    solo_revisar = "--revisar" in sys.argv
    antes = leer_manifiesto()
    plan = planear()

    def al_dia(foto, v, archivos):
        previo = antes.get(foto.stem, {})
        return previo.get("v") == v and previo.get("l") and all(a.exists() for a in archivos.values())

    if solo_revisar:
        pendientes = [foto.name for foto, _, v, archivos in plan if not al_dia(foto, v, archivos)]
        if pendientes:
            print(f"Hay {len(pendientes)} foto(s) sin versión liviana al día: {', '.join(pendientes)}")
            print("Correr:  python herramientas/optimizar-fotos.py")
            sys.exit(1)
        print(f"Todo al día: {len(plan)} fotos.")
        return

    WEB.mkdir(parents=True, exist_ok=True)
    nuevo, esperados = {}, set()
    hechas = saltadas = 0

    print(f"Fotos: {len(plan)}  (WebP calidad {CALIDAD_MIN}-{CALIDAD_MAX}, parecido mínimo {OBJETIVO_SSIM})\n")
    for foto, usar, v, archivos in plan:
        esperados.update(archivos.values())
        if not forzar and al_dia(foto, v, archivos):
            saltadas += 1
            nuevo[foto.stem] = {"w": usar, "v": v, "l": antes[foto.stem]["l"]}
            continue

        pesos = []
        with Image.open(foto) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            for w, destino in archivos.items():
                chica = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                datos, q = comprimir(chica)
                destino.write_bytes(datos)
                pesos.append(f"{w}px {len(datos) // 1024} KB (q{q})")
            nuevo[foto.stem] = {"w": usar, "v": v, "l": vista_previa(im)}
        hechas += 1
        print(f"  {foto.name:26} {foto.stat().st_size // 1024:>4} KB  ->  " + (", ".join(pesos) or "ya es liviana: se usa tal cual"))

    # Quita copias que ya no corresponden (foto borrada o anchos distintos)
    quitadas = 0
    for viejo in WEB.glob("*.webp"):
        if viejo not in esperados:
            viejo.unlink()
            quitadas += 1

    escribir_manifiesto(nuevo)
    html_cambio = poner_versiones_en_html(nuevo)

    total_mb = sum(a.stat().st_size for a in WEB.glob("*.webp")) / 1048576
    print(f"\nListo: {hechas} foto(s) procesada(s), {saltadas} sin cambios, {quitadas} copia(s) vieja(s) quitada(s).")
    print(f"{len(nuevo)} fotos en el manifiesto ({total_mb:.1f} MB en img/web/).")
    print(f"Manifiesto: {MANIFIESTO.relative_to(RAIZ)}" + ("  ·  index.html actualizado" if html_cambio else ""))


if __name__ == "__main__":
    main()
