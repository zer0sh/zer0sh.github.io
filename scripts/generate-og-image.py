#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

width = 1200
height = 630

# Colors from Direction J
bg_color = (7, 8, 11)        # #07080b
border_color = (19, 23, 34)  # #131722
card_bg = (12, 14, 20)       # #0c0e14
text_white = (255, 255, 255) # #ffffff
text_green = (16, 185, 129)  # #10b981
text_slate = (100, 116, 139) # #64748b
text_dim = (142, 153, 168)   # #8e99a8
ghost_color = (16, 21, 32)   # #101520

img = Image.new('RGB', (width, height), bg_color)
draw = ImageDraw.Draw(img)

# Outer and Inner border
draw.rectangle([(24, 24), (width - 24, height - 24)], outline=border_color, width=2)
draw.rectangle([(32, 32), (width - 32, height - 32)], outline=(14, 17, 26), width=1)

# Fonts
bold_font_path = "/usr/share/fonts/JetBrainsMonoNerdFontPropo-Bold.ttf"
regular_font_path = "/usr/share/fonts/JetBrainsMonoNLNerdFont-Regular.ttf"

watermark_font = ImageFont.truetype(bold_font_path, 110)
title_font = ImageFont.truetype(bold_font_path, 64)
subtitle_font = ImageFont.truetype(regular_font_path, 28)
mono_font = ImageFont.truetype(regular_font_path, 18)
badge_font = ImageFont.truetype(bold_font_path, 16)
doctrine_font = ImageFont.truetype(regular_font_path, 26)

# Ghost Watermark in background
draw.text((64, 40), "INFRASTRUCTURE", font=watermark_font, fill=ghost_color)

# Top Telemetry Bar
draw.ellipse([(64, 86), (74, 96)], fill=text_green)
draw.text((88, 82), "RUNTIME // SRE_NODE_0 · AVAILABILITY: 99.99% · LATENCY: 12MS", font=mono_font, fill=text_green)

# Main Title: STEVEN MUÑOZ
draw.text((64, 140), "STEVEN MUÑOZ", font=title_font, fill=text_white)

# Handle & Role
draw.text((64, 225), "zer0sh — Site Reliability Engineer", font=subtitle_font, fill=text_green)

# Doctrine Primary & Secondary
draw.text((64, 300), "Resilience is engineered, not hoped for.", font=doctrine_font, fill=text_white)
draw.text((64, 345), "Operating cloud-native platforms, Linux clusters & automated telemetry.", font=doctrine_font, fill=text_slate)

# Bottom Tech Pills
badges = ["KUBERNETES", "LINUX KERNEL", "PROMETHEUS & GRAFANA", "CI/CD AUTOMATION", "RCA & POST-MORTEMS"]
x = 64
y = 480
for badge in badges:
    bbox = draw.textbbox((0, 0), badge, font=badge_font)
    bw = bbox[2] - bbox[0] + 28
    bh = 38
    draw.rectangle([(x, y), (x + bw, y + bh)], fill=card_bg, outline=border_color, width=1)
    draw.text((x + 14, y + 10), badge, font=badge_font, fill=text_slate)
    x += bw + 14

# Bottom Edge Footer
draw.line([(64, 560), (width - 64, 560)], fill=border_color, width=1)
draw.text((64, 575), "SYSTEMS REGISTRY // LATAM / REMOTE", font=mono_font, fill=text_slate)
draw.text((width - 320, 575), "https://zer0sh.github.io", font=mono_font, fill=text_green)

os.makedirs("public/images", exist_ok=True)
output_path = "public/images/og-preview.png"
img.save(output_path, "PNG", quality=95)
print(f"Generated OG Image at {output_path}")
