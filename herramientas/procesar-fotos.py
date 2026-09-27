"""Redimensiona y comprime las fotos que el cliente manda por WhatsApp.

Uso:
    python herramientas/procesar-fotos.py

Toma cada imagen en entrada-fotos/ (jpg, jpeg, png, webp, heic no soportado),
la corrige de orientacion, la reduce a 1600px de ancho maximo y la guarda como
.jpg en entrada-fotos/procesadas/ con el mismo nombre base, buscando quedar
por debajo de 400 KB. Los originales no se tocan.
"""

import sys
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "entrada-fotos"
SALIDA = ENTRADA / "procesadas"
ANCHO_MAX = 1600
PESO_OBJETIVO = 400 * 1024
EXT_VALIDAS = {".jpg", ".jpeg", ".png", ".webp"}


def procesar(archivo: Path, destino: Path) -> None:
    with Image.open(archivo) as img:
        img = ImageOps.exif_transpose(img)
        if img.mode != "RGB":
            img = img.convert("RGB")

        if img.width > ANCHO_MAX:
            alto = round(img.height * ANCHO_MAX / img.width)
            img = img.resize((ANCHO_MAX, alto), Image.LANCZOS)

        destino.parent.mkdir(parents=True, exist_ok=True)

        calidad = 90
        while calidad >= 50:
            img.save(destino, "JPEG", quality=calidad, optimize=True)
            if destino.stat().st_size <= PESO_OBJETIVO or calidad == 50:
                break
            calidad -= 10

        kb = destino.stat().st_size / 1024
        rel = destino.relative_to(SALIDA)
        print(f"  {archivo.relative_to(ENTRADA)} -> procesadas/{rel}  ({img.width}x{img.height}, {kb:.0f} KB, calidad {calidad})")


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    archivos = sorted(
        f for f in ENTRADA.rglob("*")
        if f.is_file() and f.suffix.lower() in EXT_VALIDAS and SALIDA not in f.parents
    )

    if not archivos:
        print(f"No hay fotos nuevas en {ENTRADA}")
        print("Dejá ahí las fotos bajadas de WhatsApp (podés usar subcarpetas) y volvé a correr este script.")
        sys.exit(0)

    print(f"Procesando {len(archivos)} foto(s)...")
    for archivo in archivos:
        try:
            relativo = archivo.relative_to(ENTRADA)
            destino = SALIDA / relativo.parent / (archivo.stem + ".jpg")
            procesar(archivo, destino)
        except Exception as e:
            print(f"  ERROR con {archivo.name}: {e}")

    print(f"\nListo. Revisá las fotos en {SALIDA}")
    print("Decime cuál es cuál (portón, puerta, reja, etc.) y las copio con el nombre final a img/.")


if __name__ == "__main__":
    main()
