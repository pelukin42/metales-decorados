"""Genera las versiones livianas (WebP) de las fotos del sitio.

Uso:
    python herramientas/optimizar-fotos.py             # genera lo que falte o haya cambiado
    python herramientas/optimizar-fotos.py --forzar    # regenera todo
    python herramientas/optimizar-fotos.py --revisar   # solo avisa si algo quedó desactualizado

Las fotos originales (.jpg en amedida/img/) NO se tocan: siguen siendo la fuente
y la versión que se ve en grande. De cada una se crean copias más chicas en
amedida/img/web/ (WebP) para las tarjetas del catálogo, las miniaturas y la
portada, y se escribe amedida/js/fotos-web.js con la lista de lo generado.

La página usa la versión liviana si existe y, si no, la foto original. Por eso
una foto nueva aparece sola apenas se copia a img/; este script solo la hace más
liviana. Hay que correrlo cada vez que se agregue o se reemplace una foto (si se
reemplaza una foto sin correrlo, las tarjetas seguirían mostrando la anterior) y
subir también lo que cambie en img/web/, js/fotos-web.js e index.html.

Requiere Pillow:  pip install pillow
"""

import hashlib
import json
import re
import sys
from pathlib import Path

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

CALIDAD = 82
METODO = 6                                   # 6 = la compresión más lenta y más eficiente


def huella(archivo: Path, anchos: tuple) -> str:
    """Cambia si cambia la foto o los ajustes: sirve para regenerar y para romper la caché."""
    h = hashlib.md5(archivo.read_bytes())
    h.update(f"{anchos}|{CALIDAD}|{METODO}".encode())
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
        "   Lista las fotos que tienen versión liviana (WebP) en img/web/. Una foto que\n"
        "   no aparece aquí se muestra con su .jpg original. */\n"
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
    """Para cada foto que lleva versión liviana: (foto, anchos que se generan, huella, archivos)."""
    plan = []
    for foto in sorted(f for f in IMG.glob("*.jpg") if f.stem not in OMITIR):
        anchos = ANCHOS_ESPECIALES.get(foto.stem, ANCHOS)
        with Image.open(foto) as im:
            ancho_orig = ImageOps.exif_transpose(im).width
        if ancho_orig < ANCHO_MINIMO:
            continue
        usar = [w for w in anchos if w <= ancho_orig]
        plan.append((foto, usar, huella(foto, anchos), {w: WEB / f"{foto.stem}-{w}.webp" for w in usar}))
    return plan


def main() -> None:
    forzar = "--forzar" in sys.argv
    solo_revisar = "--revisar" in sys.argv
    antes = leer_manifiesto()
    plan = planear()

    def al_dia(foto, v, archivos):
        return antes.get(foto.stem, {}).get("v") == v and all(a.exists() for a in archivos.values())

    if solo_revisar:
        pendientes = [foto.name for foto, _, v, archivos in plan if not al_dia(foto, v, archivos)]
        if pendientes:
            print(f"Hay {len(pendientes)} foto(s) sin versión liviana al día: {', '.join(pendientes)}")
            print("Correr:  python herramientas/optimizar-fotos.py")
            sys.exit(1)
        print(f"Todo al día: {len(plan)} fotos con versión liviana.")
        return

    WEB.mkdir(parents=True, exist_ok=True)
    nuevo, esperados = {}, set()
    hechas = saltadas = 0

    print(f"Fotos con versión liviana: {len(plan)}  (WebP calidad {CALIDAD})\n")
    for foto, usar, v, archivos in plan:
        esperados.update(archivos.values())
        if not forzar and al_dia(foto, v, archivos):
            saltadas += 1
        else:
            with Image.open(foto) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                for w, destino in archivos.items():
                    chica = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                    chica.save(destino, "WEBP", quality=CALIDAD, method=METODO)
            hechas += 1
            pesos = ", ".join(f"{w}px {archivos[w].stat().st_size // 1024} KB" for w in usar)
            print(f"  {foto.name:26} {foto.stat().st_size // 1024:>4} KB  ->  {pesos}")
        nuevo[foto.stem] = {"w": usar, "v": v}

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
    print(f"Con versión liviana: {len(nuevo)} fotos ({total_mb:.1f} MB en img/web/).")
    print(f"Manifiesto: {MANIFIESTO.relative_to(RAIZ)}" + ("  ·  index.html actualizado" if html_cambio else ""))


if __name__ == "__main__":
    main()
