import argparse
import base64
import os
import re
from io import BytesIO

from PIL import Image


_ATTR_BLACK_RE = re.compile(
    r"(?P<attr>fill|stroke)\s*=\s*(?P<q>['\"])(?P<val>\s*(?:#000000|#000|black|rgb\(0\s*,\s*0\s*,\s*0\s*\)|rgb\(0%\s*,\s*0%\s*,\s*0%\s*\))\s*)(?P=q)",
    flags=re.IGNORECASE,
)

_STYLE_BLACK_RE = re.compile(
    r"(?P<prop>fill|stroke)\s*:\s*(?P<val>(?:#000000|#000|black|rgb\(0\s*,\s*0\s*,\s*0\s*\)|rgb\(0%\s*,\s*0%\s*,\s*0%\s*\)))",
    flags=re.IGNORECASE,
)

_PNG_DATA_RE = re.compile(r"data:image/png;base64,(?P<b64>[A-Za-z0-9+/=\r\n]+)")


def _convert_embedded_png_data_uri(match: re.Match, *, threshold: int) -> str:
    b64_with_ws = match.group("b64")
    b64_clean = re.sub(r"\s+", "", b64_with_ws)

    try:
        raw = base64.b64decode(b64_clean)
        img = Image.open(BytesIO(raw))
        img.load()
    except Exception:
        return match.group(0)

    try:
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        pixels = list(img.getdata())
        out = []
        for r, g, b, a in pixels:
            if a != 0 and r <= threshold and g <= threshold and b <= threshold:
                out.append((255, 255, 255, a))
            else:
                out.append((r, g, b, a))

        img.putdata(out)

        buf = BytesIO()
        img.save(buf, format="PNG")
        new_b64 = base64.b64encode(buf.getvalue()).decode("ascii")
        return f"data:image/png;base64,{new_b64}"
    except Exception:
        return match.group(0)


def convert_black_to_white_in_svg(svg_path: str, *, threshold: int) -> bool:
    raw = open(svg_path, "rb").read()
    content = raw.decode("utf-8", errors="replace")

    original = content

    content = _ATTR_BLACK_RE.sub(lambda m: f"{m.group('attr')}={m.group('q')}#fff{m.group('q')}", content)
    content = _STYLE_BLACK_RE.sub(lambda m: f"{m.group('prop')}:#fff", content)

    content = _PNG_DATA_RE.sub(lambda m: _convert_embedded_png_data_uri(m, threshold=threshold), content)

    if content == original:
        return False

    with open(svg_path, "w", encoding="utf-8", newline="") as f:
        f.write(content)

    return True


def process_directory(directory_path: str, *, threshold: int) -> None:
    svg_files = [
        os.path.join(directory_path, name)
        for name in os.listdir(directory_path)
        if name.lower().endswith(".svg")
    ]

    changed = 0
    for path in svg_files:
        try:
            if convert_black_to_white_in_svg(path, threshold=threshold):
                changed += 1
                print(f"Converted: {path}")
            else:
                print(f"No change: {path}")
        except Exception as e:
            print(f"Error processing {path}: {e}")

    print(f"\nDone. {changed}/{len(svg_files)} files modified.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--directory",
        default=r"C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\assets\Final small icon images black svg",
    )
    parser.add_argument("--threshold", type=int, default=50)
    args = parser.parse_args()

    process_directory(args.directory, threshold=args.threshold)


if __name__ == "__main__":
    main()
