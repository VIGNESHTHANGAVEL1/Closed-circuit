from pathlib import Path
import textwrap


PAGE_WIDTH = 595
PAGE_HEIGHT = 842


def pdf_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def wrapped_lines(text: str, width: int):
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


ops = []


def add(op: str):
    ops.append(op)


def rect(x, y, w, h, fill_rgb=None, stroke_rgb=None, line_width=1):
    add(f"{line_width} w")
    if fill_rgb:
        add(f"{fill_rgb[0]} {fill_rgb[1]} {fill_rgb[2]} rg")
    if stroke_rgb:
        add(f"{stroke_rgb[0]} {stroke_rgb[1]} {stroke_rgb[2]} RG")
    if fill_rgb and stroke_rgb:
        add(f"{x} {y} {w} {h} re B")
    elif fill_rgb:
        add(f"{x} {y} {w} {h} re f")
    else:
        add(f"{x} {y} {w} {h} re S")


def text(x, y, value, size=12, font="F1", rgb=(0.18, 0.21, 0.25)):
    add("BT")
    add(f"/{font} {size} Tf")
    add(f"{rgb[0]} {rgb[1]} {rgb[2]} rg")
    add(f"1 0 0 1 {x} {y} Tm")
    add(f"({pdf_escape(value)}) Tj")
    add("ET")


def paragraph(x, y, content, width_chars=72, size=11, leading=15, color=(0.31, 0.36, 0.43)):
    current_y = y
    for line in wrapped_lines(content, width_chars):
        text(x, current_y, line, size=size, rgb=color)
        current_y -= leading
    return current_y


def bullet_list(x, y, items, width_chars=42, size=10.5, leading=14, bullet_rgb=(0.76, 0.28, 0.05)):
    current_y = y
    for item in items:
        lines = wrapped_lines(item, width_chars)
        text(x, current_y, "-", size=14, rgb=bullet_rgb)
        first_x = x + 14
        text(first_x, current_y, lines[0], size=size, rgb=(0.18, 0.21, 0.25))
        current_y -= leading
        for line in lines[1:]:
            text(first_x, current_y, line, size=size, rgb=(0.18, 0.21, 0.25))
            current_y -= leading
        current_y -= 3
    return current_y


rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill_rgb=(0.99, 0.97, 0.94))
rect(28, 28, PAGE_WIDTH - 56, PAGE_HEIGHT - 56, fill_rgb=(1, 1, 1), stroke_rgb=(0.93, 0.85, 0.74))
rect(40, 645, PAGE_WIDTH - 80, 155, fill_rgb=(1.0, 0.94, 0.88))
rect(40, 615, PAGE_WIDTH - 80, 8, fill_rgb=(0.96, 0.52, 0.16))

text(54, 774, "WEBSITE BROCHURE", size=10, font="F2", rgb=(0.76, 0.28, 0.05))
text(54, 742, "Find Temples, Priests, and Pooja Stores", size=24, font="F2", rgb=(0.09, 0.11, 0.15))
text(54, 714, "with Confidence and Convenience", size=24, font="F2", rgb=(0.76, 0.28, 0.05))
paragraph(
    54,
    684,
    "A modern location-based search platform that helps users discover trusted spiritual services nearby. "
    "From temples and priests to pooja essentials, everything is brought together into one clean digital experience.",
    width_chars=82,
    size=11.5,
    leading=16,
)

text(54, 600, "About", size=16, font="F2", rgb=(0.09, 0.11, 0.15))
paragraph(
    54,
    578,
    "This website is designed for devotees, families, and communities who want a better way to find spiritual "
    "services in their area. Users can explore temples, connect with priests, and locate nearby pooja stores "
    "through one reliable platform.",
    width_chars=58,
)

text(320, 600, "Features", size=16, font="F2", rgb=(0.09, 0.11, 0.15))
bullet_list(
    320,
    578,
    [
        "Location-based temple discovery for fast nearby search.",
        "Priests directory for rituals, ceremonies, and guidance.",
        "Pooja store finder for samagri and festival essentials.",
        "Clean user journey with clear categories and easy browsing.",
    ],
    width_chars=32,
)

rect(40, 270, 245, 250, fill_rgb=(0.99, 0.98, 0.96), stroke_rgb=(0.93, 0.85, 0.74))
rect(310, 270, 245, 250, fill_rgb=(0.99, 0.98, 0.96), stroke_rgb=(0.93, 0.85, 0.74))

text(56, 492, "Tech Stack", size=16, font="F2", rgb=(0.09, 0.11, 0.15))
bullet_list(
    56,
    468,
    [
        "React + Vite for a fast and responsive frontend.",
        "React Router for structured page navigation.",
        "Framer Motion for polished, modern interactions.",
        "Tailwind CSS for clean and scalable interface styling.",
    ],
    width_chars=31,
)

text(326, 492, "Benefits", size=16, font="F2", rgb=(0.09, 0.11, 0.15))
bullet_list(
    326,
    468,
    [
        "Saves time for users looking for nearby spiritual services.",
        "Improves visibility for local temples, priests, and pooja stores.",
        "Supports festivals, poojas, and urgent local needs.",
        "Creates a professional and trustworthy discovery experience.",
    ],
    width_chars=31,
)

rect(40, 110, PAGE_WIDTH - 80, 120, fill_rgb=(1.0, 0.95, 0.9), stroke_rgb=(0.95, 0.74, 0.55))
text(56, 204, "Positioning", size=15, font="F2", rgb=(0.57, 0.25, 0.06))
paragraph(
    56,
    180,
    "A professional digital platform that connects devotion with local discovery. "
    "Modern, helpful, and trustworthy for everyday spiritual needs.",
    width_chars=82,
    size=11.5,
    leading=16,
    color=(0.34, 0.25, 0.18),
)
text(56, 128, "Temple Search | Priest Connect | Pooja Store Discovery", size=11, font="F2", rgb=(0.76, 0.28, 0.05))

stream = "\n".join(ops).encode("latin-1")

objects = []
objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
objects.append(
    f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
    "/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>".encode("latin-1")
)
objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
objects.append(f"<< /Length {len(stream)} >>\nstream\n".encode("latin-1") + stream + b"\nendstream")

pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
offsets = [0]
for index, obj in enumerate(objects, start=1):
    offsets.append(len(pdf))
    pdf.extend(f"{index} 0 obj\n".encode("latin-1"))
    pdf.extend(obj)
    pdf.extend(b"\nendobj\n")

xref_offset = len(pdf)
pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
pdf.extend(b"0000000000 65535 f \n")
for offset in offsets[1:]:
    pdf.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))

pdf.extend(
    f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("latin-1")
)

output_path = Path("public/Temple-Services-Brochure.pdf")
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_bytes(pdf)

print(f"Created {output_path} ({output_path.stat().st_size} bytes)")
