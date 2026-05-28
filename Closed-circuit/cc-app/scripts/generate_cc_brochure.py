from pathlib import Path
import textwrap


# A4 page dimensions in points
PAGE_WIDTH = 595
PAGE_HEIGHT = 842
MARGIN = 40
CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN


def pdf_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def wrapped_lines(text: str, width: int):
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


class PDFBuilder:
    def __init__(self):
        self.ops = []
        self.pages = []
        self.current_page_ops = []
        
    def add(self, op: str):
        self.current_page_ops.append(op)
        
    def new_page(self):
        if self.current_page_ops:
            self.pages.append(self.current_page_ops)
            self.current_page_ops = []
            
    def finalize(self):
        if self.current_page_ops:
            self.pages.append(self.current_page_ops)


def rect(pdf, x, y, w, h, fill_rgb=None, stroke_rgb=None, line_width=1):
    pdf.add(f"{line_width} w")
    if fill_rgb:
        pdf.add(f"{fill_rgb[0]} {fill_rgb[1]} {fill_rgb[2]} rg")
    if stroke_rgb:
        pdf.add(f"{stroke_rgb[0]} {stroke_rgb[1]} {stroke_rgb[2]} RG")
    if fill_rgb and stroke_rgb:
        pdf.add(f"{x} {y} {w} {h} re B")
    elif fill_rgb:
        pdf.add(f"{x} {y} {w} {h} re f")
    else:
        pdf.add(f"{x} {y} {w} {h} re S")


def text(pdf, x, y, value, size=12, font="F1", rgb=(0.18, 0.21, 0.25)):
    pdf.add("BT")
    pdf.add(f"/{font} {size} Tf")
    pdf.add(f"{rgb[0]} {rgb[1]} {rgb[2]} rg")
    pdf.add(f"1 0 0 1 {x} {y} Tm")
    pdf.add(f"({pdf_escape(value)}) Tj")
    pdf.add("ET")


def paragraph(pdf, x, y, content, width_chars=72, size=11, leading=15, color=(0.31, 0.36, 0.43)):
    current_y = y
    for line in wrapped_lines(content, width_chars):
        text(pdf, x, current_y, line, size=size, rgb=color)
        current_y -= leading
    return current_y


def bullet_list(pdf, x, y, items, width_chars=42, size=10.5, leading=14, bullet_rgb=(0.39, 0.38, 0.96)):
    current_y = y
    for item in items:
        lines = wrapped_lines(item, width_chars)
        text(pdf, x, current_y, "-", size=14, rgb=bullet_rgb)
        first_x = x + 14
        text(pdf, first_x, current_y, lines[0], size=size, rgb=(0.18, 0.21, 0.25))
        current_y -= leading
        for line in lines[1:]:
            text(pdf, first_x, current_y, line, size=size, rgb=(0.18, 0.21, 0.25))
            current_y -= leading
        current_y -= 3
    return current_y


def numbered_list(pdf, x, y, items, width_chars=42, size=10.5, leading=14, number_rgb=(0.39, 0.38, 0.96)):
    current_y = y
    for i, item in enumerate(items, 1):
        lines = wrapped_lines(item, width_chars)
        text(pdf, x, current_y, f"{i}.", size=size, rgb=number_rgb)
        first_x = x + 20
        text(pdf, first_x, current_y, lines[0], size=size, rgb=(0.18, 0.21, 0.25))
        current_y -= leading
        for line in lines[1:]:
            text(pdf, first_x, current_y, line, size=size, rgb=(0.18, 0.21, 0.25))
            current_y -= leading
        current_y -= 2
    return current_y


# Build the PDF
pdf = PDFBuilder()

# ===== PAGE 1: Cover =====
pdf.add("0 0 0 RG")
pdf.add("0 0 0 rg")
rect(pdf, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill_rgb=(0.02, 0.03, 0.07))
rect(pdf, 30, 30, PAGE_WIDTH - 60, PAGE_HEIGHT - 60, fill_rgb=(0.05, 0.07, 0.14), stroke_rgb=(0.39, 0.38, 0.96), line_width=2)

# Gradient accent bar
rect(pdf, 50, 650, CONTENT_WIDTH - 20, 4, fill_rgb=(0.39, 0.38, 0.96))

# Title
text(pdf, 50, 600, "CLOSED CIRCUIT", size=36, font="F2", rgb=(1, 1, 1))
text(pdf, 50, 560, "Your Memories. Your People. Private Forever.", size=18, font="F2", rgb=(0.61, 0.58, 0.95))

# Subtitle
paragraph(pdf, 50, 520, "A unique digital gift for every special occasion. Give a modern digital gift - a private platform that keeps memories safe forever.", width_chars=55, size=13, leading=18, color=(0.75, 0.74, 0.85))

# Key points
bullet_list(pdf, 50, 440, [
    "Private & Secure - OTP based login, only invited members can join",
    "Post Approval System - Content needs approval before publishing",
    "Family & Group Sharing - Create private groups with precise visibility",
    "Albums for Memories - Organize photos and videos by events",
    "No Ads, No Noise - No advertisements or algorithms",
    "Perfect Gift - Ideal for birthdays, weddings, anniversaries and more",
], width_chars=35, size=11)

# Call to action
rect(pdf, 50, 120, CONTENT_WIDTH - 20, 70, fill_rgb=(0.39, 0.38, 0.96))
text(pdf, 65, 165, "Create Your Private Memory Platform Today", size=16, font="F2", rgb=(1, 1, 1))
text(pdf, 65, 135, "Contact: info@closedcircuit.com", size=11, rgb=(0.9, 0.9, 1))

# Website URL
text(pdf, 50, 70, "www.closedcircuit.com", size=12, font="F2", rgb=(0.61, 0.58, 0.95))

pdf.new_page()

# ===== PAGE 2: About & Features =====
rect(pdf, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill_rgb=(0.99, 0.98, 0.96))
rect(pdf, MARGIN, MARGIN, CONTENT_WIDTH, PAGE_HEIGHT - 2*MARGIN, fill_rgb=(1, 1, 1), stroke_rgb=(0.85, 0.85, 0.85))

# Header
rect(pdf, MARGIN, PAGE_HEIGHT - 80, CONTENT_WIDTH, 50, fill_rgb=(0.39, 0.38, 0.96))
text(pdf, MARGIN + 15, PAGE_HEIGHT - 45, "ABOUT CLOSED CIRCUIT", size=18, font="F2", rgb=(1, 1, 1))

# About section
text(pdf, MARGIN + 15, PAGE_HEIGHT - 100, "What is Closed Circuit?", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
paragraph(pdf, MARGIN + 15, PAGE_HEIGHT - 125, "Closed Circuit is your own private digital platform - like a personal Instagram, but only for you, your family, and close friends. No strangers, no public posts, just your memories and your people.", width_chars=60, size=11, leading=15)

text(pdf, MARGIN + 15, 620, "Who is it for?", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
bullet_list(pdf, MARGIN + 15, 595, [
    "Families wanting to preserve memories privately",
    "Friends groups sharing special moments",
    "Event organizers managing celebrations",
    "Anyone looking for a meaningful, private gift",
], width_chars=35, size=10)

# Features section
text(pdf, 320, 700, "KEY FEATURES", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
bullet_list(pdf, 320, 675, [
    "[Secure] Private & Secure - OTP login system",
    "[Check] Post Approval - Content moderation",
    "[Users] Family & Group Sharing",
    "[Image] Albums for Memories",
    "[Calendar] Event Management",
    "[No] No Ads or Algorithms",
], width_chars=30, size=10)

# Availability
text(pdf, 320, 520, "AVAILABLE ON", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
bullet_list(pdf, 320, 495, [
    "[Web] Web Platform",
    "[Android] Android App",
    "[iPhone] iPhone App",
], width_chars=30, size=10)

# Occasions
text(pdf, MARGIN + 15, 450, "PERFECT OCCASIONS", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
bullet_list(pdf, MARGIN + 15, 425, [
    "Birthdays - Sibling, Children, Friends",
    "Wedding Gifts",
    "Anniversaries",
    "Family Reunions",
    "Graduations",
    "Baby Celebrations",
], width_chars=35, size=10)

# Page number
text(pdf, PAGE_WIDTH/2 - 10, 25, "2", size=10, rgb=(0.5, 0.5, 0.5))

pdf.new_page()

# ===== PAGE 3: How We Differ =====
rect(pdf, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill_rgb=(0.99, 0.98, 0.96))
rect(pdf, MARGIN, MARGIN, CONTENT_WIDTH, PAGE_HEIGHT - 2*MARGIN, fill_rgb=(1, 1, 1), stroke_rgb=(0.85, 0.85, 0.85))

# Header
rect(pdf, MARGIN, PAGE_HEIGHT - 80, CONTENT_WIDTH, 50, fill_rgb=(0.39, 0.38, 0.96))
text(pdf, MARGIN + 15, PAGE_HEIGHT - 45, "HOW WE DIFFER FROM SOCIAL MEDIA", size=16, font="F2", rgb=(1, 1, 1))

# Comparison with Social Media
text(pdf, MARGIN + 15, 700, "Closed Circuit vs. Traditional Social Media", size=14, font="F2", rgb=(0.1, 0.1, 0.15))

bullet_list(pdf, MARGIN + 15, 670, [
    "PRIVACY CONTROL - You control who sees your content, not an algorithm",
    "DATA SECURITY - Your memories stay private, never sold or shared",
    "NO ADS - No advertisements, no sponsored content, no distractions",
    "CONTENT LONGEVITY - Your memories last forever, not buried in feeds",
    "COMMUNITY SIZE - Quality connections over quantity followers",
    "MENTAL HEALTH - No echo chambers, comparison, or doomscrolling",
], width_chars=35, size=10)

# Comparison with Facebook
text(pdf, MARGIN + 15, 450, "Closed Circuit vs. Facebook", size=14, font="F2", rgb=(0.1, 0.1, 0.15))

bullet_list(pdf, MARGIN + 15, 420, [
    "DATA PRIVACY - Your data stays yours, never shared with advertisers",
    "CONTENT VISIBILITY - Only approved members see your content",
    "NO TRACKING - No cross-site tracking or data harvesting",
    "NO DATA BREACHES - Private infrastructure, not a public target",
    "EMOTIONAL HEALTH - No political drama or toxic content",
], width_chars=35, size=10)

# Comparison with WhatsApp
text(pdf, 320, 700, "Closed Circuit vs. WhatsApp", size=14, font="F2", rgb=(0.1, 0.1, 0.15))

bullet_list(pdf, 320, 670, [
    "GROUP SIZE - No limits on community size",
    "CONTENT PERMANENCE - Memories last forever, not lost in chats",
    "MEDIA ORGANIZATION - Albums organized by events",
    "BROADCASTING - Easy sharing to entire communities",
    "PURPOSE-BUILT - Built specifically for memory preservation",
], width_chars=30, size=10)

# Page number
text(pdf, PAGE_WIDTH/2 - 10, 25, "3", size=10, rgb=(0.5, 0.5, 0.5))

pdf.new_page()

# ===== PAGE 4: Top 10 Reasons =====
rect(pdf, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill_rgb=(0.99, 0.98, 0.96))
rect(pdf, MARGIN, MARGIN, CONTENT_WIDTH, PAGE_HEIGHT - 2*MARGIN, fill_rgb=(1, 1, 1), stroke_rgb=(0.85, 0.85, 0.85))

# Header
rect(pdf, MARGIN, PAGE_HEIGHT - 80, CONTENT_WIDTH, 50, fill_rgb=(0.39, 0.38, 0.96))
text(pdf, MARGIN + 15, PAGE_HEIGHT - 45, "TOP 10 REASONS TO CHOOSE CLOSED CIRCUIT", size=16, font="F2", rgb=(1, 1, 1))

numbered_list(pdf, MARGIN + 15, 700, [
    "Complete Privacy Control - You decide who sees everything",
    "Memories Last Forever - No content deletion or feed algorithm",
    "No Algorithm - What you see is what you want, not what they want",
    "Multiple Expression Methods - Text, diagrams, voice, photos, videos",
    "Genuine Connections - Only real friends and family, not followers",
    "No Advertisements - Pure, distraction-free experience",
    "Easy Organization - Albums, events, groups - all organized",
    "Zero Tracking - Your privacy is protected, not monetized",
    "Perfect for Communities - Families, schools, teams, organizations",
    "Mental Health Focus - No comparison, no negativity, just memories",
], width_chars=40, size=10.5, leading=18)

# Page number
text(pdf, PAGE_WIDTH/2 - 10, 25, "4", size=10, rgb=(0.5, 0.5, 0.5))

pdf.new_page()

# ===== PAGE 5: Use Cases =====
rect(pdf, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill_rgb=(0.99, 0.98, 0.96))
rect(pdf, MARGIN, MARGIN, CONTENT_WIDTH, PAGE_HEIGHT - 2*MARGIN, fill_rgb=(1, 1, 1), stroke_rgb=(0.85, 0.85, 0.85))

# Header
rect(pdf, MARGIN, PAGE_HEIGHT - 80, CONTENT_WIDTH, 50, fill_rgb=(0.39, 0.38, 0.96))
text(pdf, MARGIN + 15, PAGE_HEIGHT - 45, "USE CASES", size=18, font="F2", rgb=(1, 1, 1))

# Use cases grid
use_cases = [
    "Family Celebrations - Preserve wedding, birthday, and holiday memories",
    "Gated Communities - Private sharing for residents only",
    "School Alumni - Connect with classmates and share reunions",
    "Corporate Teams - Keep team milestones and celebrations private",
    "Wedding Planning - Share photos, videos, and updates with guests",
    "Travel Groups - Create lasting memories of trips together",
    "Sports Teams - Document games, training, and team events",
    "Support Communities - Private space for shared experiences",
]

y_pos = 700
for i, case in enumerate(use_cases[:4]):
    text(pdf, MARGIN + 15, y_pos, f"{i+1}.", size=12, rgb=(0.39, 0.38, 0.96))
    paragraph(pdf, MARGIN + 35, y_pos, case, width_chars=30, size=10, leading=14, color=(0.2, 0.2, 0.25))
    y_pos -= 70

y_pos = 700
for i, case in enumerate(use_cases[4:], 5):
    text(pdf, 320, y_pos, f"{i}.", size=12, rgb=(0.39, 0.38, 0.96))
    paragraph(pdf, 340, y_pos, case, width_chars=28, size=10, leading=14, color=(0.2, 0.2, 0.25))
    y_pos -= 70

# Gift ideas section
text(pdf, MARGIN + 15, 420, "GIFT OCCASIONS", size=14, font="F2", rgb=(0.1, 0.1, 0.15))

gift_occasions = [
    "[Birthday] Birthday - A private album for their special day",
    "[Wedding] Wedding - Preserve all the precious moments",
    "[Anniversary] Anniversary - Celebrate years of memories together",
    "[Baby] New Baby - Share the joy with close family",
    "[Graduation] Graduation - Mark this achievement privately",
    "[Party] Retirement - Honor years of work memories",
    "[Family] Family Reunion - Bring extended family together",
    "[Travel] Travel Memories - All your trips in one place",
]

bullet_list(pdf, MARGIN + 15, 395, gift_occasions, width_chars=40, size=10)

# Page number
text(pdf, PAGE_WIDTH/2 - 10, 25, "5", size=10, rgb=(0.5, 0.5, 0.5))

pdf.new_page()

# ===== PAGE 6: Technology & Contact =====
rect(pdf, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill_rgb=(0.99, 0.98, 0.96))
rect(pdf, MARGIN, MARGIN, CONTENT_WIDTH, PAGE_HEIGHT - 2*MARGIN, fill_rgb=(1, 1, 1), stroke_rgb=(0.85, 0.85, 0.85))

# Header
rect(pdf, MARGIN, PAGE_HEIGHT - 80, CONTENT_WIDTH, 50, fill_rgb=(0.39, 0.38, 0.96))
text(pdf, MARGIN + 15, PAGE_HEIGHT - 45, "TECHNOLOGY & CONTACT", size=18, font="F2", rgb=(1, 1, 1))

# Tech stack
text(pdf, MARGIN + 15, 700, "TECHNOLOGY STACK", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
bullet_list(pdf, MARGIN + 15, 670, [
    "React 19 - Modern frontend framework",
    "React Router - Multi-page navigation",
    "Framer Motion - Smooth animations",
    "Tailwind CSS - Modern styling",
    "Lucide React - Icon library",
    "Vite - Fast build tool",
], width_chars=35, size=10)

# Privacy features
text(pdf, 320, 700, "PRIVACY FEATURES", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
bullet_list(pdf, 320, 670, [
    "No external sharing",
    "No public access",
    "No data selling",
    "No tracking",
    "No advertisements",
    "Your memories stay in your digital space forever",
], width_chars=28, size=10)

# Why choose
text(pdf, MARGIN + 15, 480, "WHY CHOOSE CLOSED CIRCUIT?", size=14, font="F2", rgb=(0.1, 0.1, 0.15))
paragraph(pdf, MARGIN + 15, 455, "Built on Privacy: member data, posts, albums, and events remain private. Confidential by Design: conversations and media stay inside approved circles. Secure by Technology: protected infrastructure and data storage.", width_chars=55, size=10.5, leading=14)

# Contact section
rect(pdf, MARGIN + 15, 100, CONTENT_WIDTH, 150, fill_rgb=(0.95, 0.95, 0.98), stroke_rgb=(0.39, 0.38, 0.96))
text(pdf, MARGIN + 25, 220, "GET IN TOUCH", size=16, font="F2", rgb=(0.1, 0.1, 0.15))
text(pdf, MARGIN + 25, 195, "Email: info@closedcircuit.com", size=11, rgb=(0.2, 0.2, 0.25))
text(pdf, MARGIN + 25, 175, "Website: www.closedcircuit.com", size=11, rgb=(0.2, 0.2, 0.25))
text(pdf, MARGIN + 25, 155, "Create your private memory platform today!", size=11, font="F2", rgb=(0.39, 0.38, 0.96))

# Footer tagline
text(pdf, MARGIN + 15, 80, "Your Memories. Your People. Closed Circuit.", size=12, font="F2", rgb=(0.39, 0.38, 0.96))

# Page number
text(pdf, PAGE_WIDTH/2 - 10, 25, "6", size=10, rgb=(0.5, 0.5, 0.5))

pdf.new_page()

# Finalize and build PDF
pdf.finalize()

# Generate PDF content
all_content = []
for page_ops in pdf.pages:
    stream = "\n".join(page_ops).encode("latin-1")
    all_content.append(stream)

# Build PDF structure
objects = []
objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")

# Pages reference
pages_ref = "<< /Type /Pages /Kids ["
for i in range(len(pdf.pages)):
    pages_ref += f"{3 + i} 0 R "
pages_ref += f"] /Count {len(pdf.pages)} >>"
objects.append(pages_ref.encode("latin-1"))

# Page objects
for i, stream in enumerate(all_content):
    page_obj = f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents {3 + len(pdf.pages) + i} 0 R >>"
    objects.append(page_obj.encode("latin-1"))

# Font objects
objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

# Content streams
for stream in all_content:
    content_obj = f"<< /Length {len(stream)} >>\nstream\n".encode("latin-1") + stream + b"\nendstream"
    objects.append(content_obj)

# Build final PDF
pdf_output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
offsets = [0]
for index, obj in enumerate(objects, start=1):
    offsets.append(len(pdf_output))
    pdf_output.extend(f"{index} 0 obj\n".encode("latin-1"))
    pdf_output.extend(obj)
    pdf_output.extend(b"\nendobj\n")

xref_offset = len(pdf_output)
pdf_output.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
pdf_output.extend(b"0000000000 65535 f \n")
for offset in offsets[1:]:
    pdf_output.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))

pdf_output.extend(
    f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("latin-1")
)

output_path = Path("public/Closed-Circuit-Brochure.pdf")
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_bytes(pdf_output)

print(f"Created {output_path} ({output_path.stat().st_size} bytes)")
