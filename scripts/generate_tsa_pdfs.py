#!/usr/bin/env python3
"""
Generate TSA competition PDFs: student-copyright-checklist.pdf and work-log.pdf.
Uses ReportLab. Run from repo root: python scripts/generate_tsa_pdfs.py
Install: pip install reportlab pillow
Output: public/documents/
"""

import os
import sys
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer,
    PageBreak, KeepTogether,
)

# --- Paths (run from repo root) ---
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO_ROOT, 'public', 'documents')
LOGO_PATH = os.path.join(REPO_ROOT, 'public', 'logo.png')

# --- Colors ---
BG_BLACK = HexColor('#000000')
CARD_BG = HexColor('#0F172A')
ROW_ALT = HexColor('#0A1020')
BORDER = HexColor('#1E3A5F')
BLUE_ACCENT = HexColor('#3B82F6')
BLUE_HEADER = HexColor('#1D4ED8')
TEAL_ACCENT = HexColor('#2DD4BF')
GREEN = HexColor('#34D399')
WHITE = HexColor('#E2E8F0')
MUTED = HexColor('#94A3B8')
FOOTER_TEXT = HexColor('#475569')

# Header: logo + title + subtitle + gap + line; content starts below line
HEADER_HEIGHT = 1.7 * inch  # space reserved so line never overlaps text
LOGO_SIZE = 0.6 * inch
MARGIN = 0.75 * inch
# Footer: line above text, text in reserved band
FOOTER_LINE_Y = 0.72 * inch  # line position from bottom
FOOTER_TEXT_Y = 0.42 * inch  # footer text baseline from bottom
BOTTOM_MARGIN = 1.0 * inch  # content must stay above this


def _register_cursive_font():
    """Register a cursive/script TTF for signatures; return font name or fallback."""
    script_font_name = 'SignatureScript'
    fonts_dir = os.path.join(REPO_ROOT, 'scripts', 'fonts')
    local_ttf = os.path.join(fonts_dir, 'DancingScript-Regular.ttf')
    search_paths = [
        local_ttf,
        os.path.join(fonts_dir, 'Script.ttf'),
        '/System/Library/Fonts/Supplemental/Brush Script.ttf',
        '/Library/Fonts/Brush Script MT.ttf',
        '/usr/share/fonts/truetype/google-dancing-script/DancingScript-Regular.ttf',
        os.path.expanduser('~/Library/Fonts/Dancing Script.ttf'),
    ]
    # Try to download Dancing Script if not present
    if not os.path.isfile(local_ttf):
        try:
            import urllib.request
            os.makedirs(fonts_dir, exist_ok=True)
            url = 'https://github.com/google/fonts/raw/main/ofl/dancingscript/DancingScript%5Bwght%5D.ttf'
            # Use static Regular variant from jsDelivr
            url = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/dancingscript/DancingScript-Regular.ttf'
            urllib.request.urlretrieve(url, local_ttf)
        except Exception:
            pass
    for path in search_paths:
        if path and os.path.isfile(path):
            try:
                pdfmetrics.registerFont(TTFont(script_font_name, path))
                return script_font_name
            except Exception:
                continue
    # Fallback: Helvetica-BoldOblique (not cursive but script-like)
    return 'Helvetica-BoldOblique'


SIGNATURE_FONT = _register_cursive_font()
if SIGNATURE_FONT == 'Helvetica-BoldOblique':
    print('Note: No cursive TTF found. Add scripts/fonts/DancingScript-Regular.ttf for signature style.', file=sys.stderr)


from PIL import Image

def _get_optimized_logo():
    """Create a smaller version of the logo for PDF embedding to save space."""
    opt_logo_path = os.path.join(OUT_DIR, 'logo_opt.png')
    if os.path.exists(LOGO_PATH):
        try:
            os.makedirs(OUT_DIR, exist_ok=True)
            with Image.open(LOGO_PATH) as img:
                # Resize to 256px max dimension (plenty for a small PDF icon)
                img.thumbnail((256, 256))
                img.save(opt_logo_path, optimize=True)
            return opt_logo_path
        except Exception as e:
            print(f"Logo optimization failed: {e}")
    return LOGO_PATH

OPT_LOGO = _get_optimized_logo()

def draw_black_background(canvas, _doc):
    """Draw full-page black background and enable compression."""
    canvas.saveState()
    canvas.setPageCompression(1) # Enable PDF compression
    canvas.setFillColor(BG_BLACK)
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
    canvas.restoreState()


def draw_header(canvas, _doc, title_text, subtitle_text='Monroe Resource Hub | Central Academy of Technology and Arts | TSA 2026'):
    """Draw logo, title, subtitle, then blue accent line below with gap so line never covers text."""
    canvas.saveState()
    page_w, page_h = letter[0], letter[1]
    # Logo at left
    logo_to_use = OPT_LOGO if os.path.exists(OPT_LOGO) else LOGO_PATH
    if os.path.exists(logo_to_use):
        canvas.drawImage(logo_to_use, MARGIN, page_h - MARGIN - LOGO_SIZE, width=LOGO_SIZE, height=LOGO_SIZE, preserveAspectRatio=True, mask='auto')
    # Title to the right of logo
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 19)
    title_x = MARGIN + LOGO_SIZE + 0.2 * inch
    title_y = page_h - MARGIN - 0.5 * inch
    canvas.drawString(title_x, title_y, title_text)
    # Subtitle below title with spacing
    canvas.setFillColor(MUTED)
    canvas.setFont('Helvetica', 9)
    subtitle_y = title_y - 0.22 * inch
    canvas.drawString(title_x, subtitle_y, subtitle_text)
    # Blue accent line well below subtitle so it never touches text
    line_y = subtitle_y - 0.18 * inch
    canvas.setStrokeColor(BLUE_ACCENT)
    canvas.setLineWidth(2)
    canvas.line(MARGIN, line_y, page_w - MARGIN, line_y)
    canvas.restoreState()


def first_page_cb(canvas, doc, title, subtitle):
    draw_black_background(canvas, doc)
    draw_header(canvas, doc, title, subtitle)
    # Footer area (optional on first page)
    _draw_footer(canvas, doc)


def later_pages_cb(canvas, doc, title, subtitle):
    draw_black_background(canvas, doc)
    draw_header(canvas, doc, title, subtitle)
    _draw_footer(canvas, doc)


def _draw_footer(canvas, doc):
    """Draw footer line above the text so the line never covers the footer text."""
    canvas.saveState()
    page_w = letter[0]
    # Line above the text with gap
    canvas.setStrokeColor(FOOTER_TEXT)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, FOOTER_LINE_Y, page_w - MARGIN, FOOTER_LINE_Y)
    canvas.setFillColor(FOOTER_TEXT)
    canvas.setFont('Helvetica', 8)
    canvas.drawCentredString(page_w / 2, FOOTER_TEXT_Y,
        'Monroe Resource Hub | Central Academy of Technology and Arts | TSA Chapter | monroeresourcehub.us')
    canvas.restoreState()


def build_styles():
    styles = getSampleStyleSheet()
    # Cell styles: wrap text in tables, no word-splitting so words stay whole
    styles.add(ParagraphStyle(
        name='Cell',
        fontName='Helvetica',
        fontSize=9,
        textColor=WHITE,
        leading=11,
        spaceAfter=0,
        spaceBefore=0,
        splitLongWords=False,
    ))
    styles.add(ParagraphStyle(
        name='CellHeader',
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=WHITE,
        leading=11,
        spaceAfter=0,
        spaceBefore=0,
        splitLongWords=False,
    ))
    styles.add(ParagraphStyle(
        name='CellMuted',
        fontName='Helvetica',
        fontSize=9,
        textColor=MUTED,
        leading=11,
        spaceAfter=0,
        spaceBefore=0,
        splitLongWords=False,
    ))
    styles.add(ParagraphStyle(
        name='PhaseTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=TEAL_ACCENT,
        leading=12,
        spaceAfter=0,
        spaceBefore=0,
        splitLongWords=False,
    ))
    styles.add(ParagraphStyle(
        name='WhiteBold',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=WHITE,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        name='Muted',
        fontName='Helvetica',
        fontSize=9,
        textColor=MUTED,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        name='WhiteBody',
        fontName='Helvetica',
        fontSize=10,
        textColor=WHITE,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        name='Signature',
        fontName=SIGNATURE_FONT,
        fontSize=12,
        textColor=BLUE_ACCENT,
        spaceAfter=0,
    ))
    styles.add(ParagraphStyle(
        name='SignatureTeal',
        fontName=SIGNATURE_FONT,
        fontSize=12,
        textColor=TEAL_ACCENT,
        spaceAfter=0,
    ))
    styles.add(ParagraphStyle(
        name='GreenItalic',
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=GREEN,
        spaceAfter=6,
    ))
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=TEAL_ACCENT,
        spaceAfter=6,
        leftIndent=0,
    ))
    return styles


def table_style_card(bg=CARD_BG):
    """Table style with padding so borders/lines do not cover text."""
    return TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('TEXTCOLOR', (0, 0), (-1, -1), WHITE),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ])


def _escape(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def cell_para(text, styles, style_name='Cell'):
    """Wrap text in a Paragraph so it wraps inside table cells and fits the box."""
    return Paragraph(_escape(text), styles[style_name])


def build_student_copyright_checklist():
    out_path = os.path.join(OUT_DIR, 'student-copyright-checklist.pdf')
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=HEADER_HEIGHT + 0.25 * inch,
        bottomMargin=BOTTOM_MARGIN,
    )
    styles = build_styles()
    story = []

    # Meta info grid (4 columns) — Paragraphs so text fits in cells
    meta_data = [
        [cell_para('PROJECT:', styles, 'CellMuted'), cell_para('Monroe Resource Hub', styles),
         cell_para('SCHOOL:', styles, 'CellMuted'), cell_para('Central Academy of Technology and Arts', styles)],
        [cell_para('ORGANIZATION:', styles, 'CellMuted'), cell_para('TSA', styles),
         cell_para('DATE:', styles, 'CellMuted'), cell_para('02/05/2026', styles)],
    ]
    meta_table = Table(meta_data, colWidths=[1.3 * inch, 2.2 * inch, 1.3 * inch, 2.2 * inch])
    meta_table.setStyle(table_style_card())
    story.append(meta_table)
    story.append(Spacer(1, 0.2 * inch))

    # Italic note
    story.append(Paragraph(
        '<i>Use of copyrighted material without proper permission may result in disqualification.</i>',
        ParagraphStyle('ItalicNote', fontName='Helvetica-Oblique', fontSize=9, textColor=MUTED, spaceAfter=12)
    ))
    story.append(Spacer(1, 0.2 * inch))

    # Section 1 - Images (all cells as Paragraphs so text fits and wraps)
    story.append(Paragraph('1. Images', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    sect1_data = [
        [cell_para('Image Description', styles, 'CellHeader'), cell_para('Source', styles, 'CellHeader'),
         cell_para('License/Permission', styles, 'CellHeader'), cell_para('Location Used', styles, 'CellHeader')],
        [cell_para('Unsplash Stock Photos', styles), cell_para('Unsplash.com', styles),
         cell_para('Unsplash License (Free Use)', styles), cell_para('Hero sections, featured content', styles)],
        [cell_para('Custom Logo Design', styles), cell_para('Original Design', styles),
         cell_para('N/A - Original Work', styles), cell_para('Website branding, navigation', styles)],
        [cell_para('Community Images', styles), cell_para('Original Photos', styles),
         cell_para('N/A - Original Work', styles), cell_para('Various pages', styles)],
    ]
    t1 = Table(sect1_data, colWidths=[1.5 * inch, 1.4 * inch, 1.9 * inch, 1.5 * inch])
    t1.setStyle(table_style_card())
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
    ]))
    story.append(t1)
    story.append(Spacer(1, 0.3 * inch))

    # Section 2 - Text Content
    story.append(Paragraph('2. Text Content', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    sect2_data = [
        [cell_para('Image Description', styles, 'CellHeader'), cell_para('Source', styles, 'CellHeader'),
         cell_para('License/Permission', styles, 'CellHeader'), cell_para('Location Used', styles, 'CellHeader')],
        [cell_para('Community Resource Information', styles), cell_para('Monroe Community Organizations / City Government', styles),
         cell_para('Public Information / Public Domain', styles), cell_para('Resource directory listings', styles)],
        [cell_para('All Website Content', styles), cell_para('Original Writing by Student Team', styles),
         cell_para('N/A - Original Work', styles), cell_para('Entire website', styles)],
    ]
    t2 = Table(sect2_data, colWidths=[1.6 * inch, 2.1 * inch, 1.6 * inch, 1.5 * inch])
    t2.setStyle(table_style_card())
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
    ]))
    story.append(t2)
    story.append(Spacer(1, 0.3 * inch))

    # Section 3 - Code and Libraries
    story.append(Paragraph('3. Code and Libraries', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    sect3_rows = [
        [cell_para('Library/Framework', styles, 'CellHeader'), cell_para('Version', styles, 'CellHeader'),
         cell_para('License', styles, 'CellHeader'), cell_para('Usage', styles, 'CellHeader')],
        [cell_para('Next.js', styles), cell_para('16.1.6', styles), cell_para('MIT License', styles), cell_para('Core framework (App Router)', styles)],
        [cell_para('React', styles), cell_para('19.2.4', styles), cell_para('MIT License', styles), cell_para('UI library for all components', styles)],
        [cell_para('Tailwind CSS', styles), cell_para('3.4', styles), cell_para('MIT License', styles), cell_para('Styling and responsive design', styles)],
        [cell_para('TypeScript', styles), cell_para('5.9', styles), cell_para('Apache License 2.0', styles), cell_para('Type-safe development', styles)],
        [cell_para('Node.js', styles), cell_para('22 LTS', styles), cell_para('MIT License', styles), cell_para('Server-side runtime and build tooling', styles)],
        [cell_para('Supabase', styles), cell_para('Latest', styles), cell_para('Apache License 2.0', styles), cell_para('Database, authentication, backend services', styles)],
        [cell_para('Lucide React', styles), cell_para('Latest', styles), cell_para('ISC License', styles), cell_para('All icons throughout application', styles)],
        [cell_para('React Hook Form', styles), cell_para('Latest', styles), cell_para('MIT License', styles), cell_para('Form handling and validation', styles)],
        [cell_para('Zod', styles), cell_para('Latest', styles), cell_para('MIT License', styles), cell_para('Schema validation for forms and API', styles)],
        [cell_para('Google Generative AI (Gemini)', styles), cell_para('Latest', styles), cell_para('Terms of Service', styles), cell_para('AI resume builder and job assistant', styles)],
        [cell_para('React Big Calendar', styles), cell_para('Latest', styles), cell_para('MIT License', styles), cell_para('Event calendar display', styles)],
        [cell_para('jspdf and html2canvas', styles), cell_para('Latest', styles), cell_para('MIT License', styles), cell_para('Resume PDF export functionality', styles)],
        [cell_para('Other libraries', styles), cell_para('See package.json', styles), cell_para('MIT / Apache', styles), cell_para('Various supporting utilities', styles)],
    ]
    t3 = Table(sect3_rows, colWidths=[1.9 * inch, 0.95 * inch, 1.55 * inch, 2.25 * inch])
    t3.setStyle(table_style_card())
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [CARD_BG, ROW_ALT]),
    ]))
    story.append(t3)
    story.append(Spacer(1, 0.3 * inch))

    # Section 4 - Written Permissions (teal left bar, padding so text not covered)
    story.append(Paragraph('4. Written Permissions', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    perm_text = """&bull; All materials used are original work, MIT/Apache/ISC licensed, Unsplash licensed, or public domain.<br/>
&bull; No written permissions were required for the materials used in this project."""
    perm_para = Paragraph(perm_text, ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, leftIndent=12, spaceAfter=0,
        backColor=CARD_BG, leading=12, splitLongWords=False))
    perm_table = Table([['', perm_para]], colWidths=[0.1 * inch, 5.95 * inch])
    perm_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), TEAL_ACCENT),
        ('BACKGROUND', (1, 0), (1, -1), CARD_BG),
        ('LEFTPADDING', (1, 0), (1, -1), 14),
        ('RIGHTPADDING', (1, 0), (1, -1), 14),
        ('TOPPADDING', (1, 0), (1, -1), 12),
        ('BOTTOMPADDING', (1, 0), (1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(perm_table)
    story.append(Spacer(1, 0.25 * inch))

    # Section 5 - Framework Template Statement
    story.append(Paragraph('5. Framework Template Statement', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    frame_text = 'All templates, themes, components, and designs were custom-built by the CATA TSA team. No pre-built templates or themes were used.'
    frame_para = Paragraph(_escape(frame_text), ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, leftIndent=12, spaceAfter=0,
        backColor=CARD_BG, leading=12, splitLongWords=False))
    frame_table = Table([['', frame_para]], colWidths=[0.1 * inch, 5.95 * inch])
    frame_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), TEAL_ACCENT),
        ('BACKGROUND', (1, 0), (1, -1), CARD_BG),
        ('LEFTPADDING', (1, 0), (1, -1), 14),
        ('RIGHTPADDING', (1, 0), (1, -1), 14),
        ('TOPPADDING', (1, 0), (1, -1), 12),
        ('BOTTOMPADDING', (1, 0), (1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(frame_table)
    story.append(Spacer(1, 0.3 * inch))

    # Section 6 - Student Signatures (cursive font for signature column)
    story.append(Paragraph('6. Student Signatures', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    story.append(Paragraph('Students certify the accuracy of the information above.', ParagraphStyle('Muted', fontName='Helvetica', fontSize=9, textColor=MUTED, spaceAfter=12)))

    sig_date = '02/05/2026'
    students = [
        ('Yatish Grandhe', 'Yatish Grandhe'),
        ('Dhyan Kanna', 'Dhyan Kanna'),
        ('Vihaan Kotagiri', 'Vihaan Kotagiri'),
    ]
    for name, sig_name in students:
        row = [
            Paragraph('<b>Name</b><br/>' + _escape(name), styles['WhiteBody']),
            Paragraph(sig_name, styles['Signature']),  # Cursive/script font
            Paragraph('<b>Date</b><br/>' + _escape(sig_date), styles['WhiteBody']),
        ]
        sig_t = Table([[cell_para('Name', styles, 'CellMuted'), cell_para('Signature', styles, 'CellMuted'), cell_para('Date', styles, 'CellMuted')], row],
                     colWidths=[2.0 * inch, 2.2 * inch, 1.5 * inch])
        sig_t.setStyle(table_style_card())
        story.append(sig_t)
        story.append(Spacer(1, 0.2 * inch))

    # Advisor (cursive in teal)
    advisor_row = [
        Paragraph('<b>Name</b><br/>' + _escape('Tyler Powell'), styles['WhiteBody']),
        Paragraph('Tyler Powell', styles['SignatureTeal']),  # Cursive in teal
        Paragraph('<b>Date</b><br/>' + _escape(sig_date), styles['WhiteBody']),
    ]
    adv_table = Table([[cell_para('Name', styles, 'CellMuted'), cell_para('Signature', styles, 'CellMuted'), cell_para('Date', styles, 'CellMuted')], advisor_row],
                     colWidths=[2.0 * inch, 2.2 * inch, 1.5 * inch])
    adv_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), ROW_ALT),
        ('TEXTCOLOR', (0, 0), (-1, -1), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (-1, 0), MUTED),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(adv_table)

    def on_first(canvas, doc):
        first_page_cb(canvas, doc, 'STUDENT COPYRIGHT CHECKLIST', 'Monroe Resource Hub | Central Academy of Technology and Arts | TSA 2026')

    def on_later(canvas, doc):
        later_pages_cb(canvas, doc, 'STUDENT COPYRIGHT CHECKLIST', 'Monroe Resource Hub | Central Academy of Technology and Arts | TSA 2026')

    doc.build(story, onFirstPage=on_first, onLaterPages=on_later)
    print('Generated:', out_path)
    return out_path


def build_work_log():
    out_path = os.path.join(OUT_DIR, 'work-log.pdf')
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=HEADER_HEIGHT + 0.25 * inch,
        bottomMargin=BOTTOM_MARGIN,
    )
    styles = build_styles()
    story = []

    # Meta grid (Paragraphs so text fits)
    meta_data = [
        [cell_para('PROJECT:', styles, 'CellMuted'), cell_para('Monroe Resource Hub', styles),
         cell_para('DATE RANGE:', styles, 'CellMuted'), cell_para('January 2025 - January 2026', styles)],
        [cell_para('SCHOOL:', styles, 'CellMuted'), cell_para('Central Academy of Technology and Arts', styles),
         cell_para('STUDENTS:', styles, 'CellMuted'), cell_para('Yatish Grandhe, Dhyan Kanna, Vihaan Kotagiri', styles)],
        [cell_para('ORGANIZATION:', styles, 'CellMuted'), cell_para('TSA', styles),
         cell_para('STATUS:', styles, 'CellMuted'), cell_para('Completed and Deployed', styles)],
    ]
    meta_table = Table(meta_data, colWidths=[1.3 * inch, 2.0 * inch, 1.3 * inch, 2.4 * inch])
    meta_table.setStyle(table_style_card())
    story.append(meta_table)
    story.append(Spacer(1, 0.25 * inch))

    # Project Summary card (teal left bar, padding so text fits)
    summary_text = """The Monroe Resource Hub is a comprehensive community platform designed to connect residents of Monroe, North Carolina with vital resources, services, and opportunities. The platform includes a resource directory, an AI-powered resume builder, a job application assistant, a community events calendar, and volunteer opportunity listings. Built with Next.js, React, Supabase, and Google Gemini AI, the application is fully deployed at monroeresourcehub.us."""
    summary_para = Paragraph(_escape(summary_text), ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, leftIndent=12, spaceAfter=0, backColor=CARD_BG, leading=12, splitLongWords=False))
    summary_table = Table([['', summary_para]], colWidths=[0.1 * inch, 5.95 * inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), TEAL_ACCENT),
        ('BACKGROUND', (1, 0), (1, -1), CARD_BG),
        ('LEFTPADDING', (1, 0), (1, -1), 14),
        ('RIGHTPADDING', (1, 0), (1, -1), 14),
        ('TOPPADDING', (1, 0), (1, -1), 12),
        ('BOTTOMPADDING', (1, 0), (1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(Paragraph('Project Summary', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    story.append(summary_table)
    story.append(Spacer(1, 0.3 * inch))

    # Work Log Entries
    story.append(Paragraph('Work Log Entries', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=12, textColor=WHITE, spaceAfter=10)))

    phases = [
        (1, 'Project Planning and Research', 'January 2025', '15 hours', 'All team members',
         ['Community needs assessment', 'Researched existing platforms', 'Identified features', 'Created timeline and milestones', 'Selected tech stack (Next.js, Supabase, Tailwind CSS, TypeScript)'],
         'Established project scope and technical requirements'),
        (2, 'UI/UX Design and Wireframing', 'February 2025', '20 hours', 'Design team',
         ['Wireframes for all pages', 'Color scheme and branding', 'Custom logo design', 'Responsive layouts', 'Design system and component library'],
         'Complete design system and visual mockups'),
        (3, 'Database Setup and Backend Development', 'March - April 2025', '25 hours', 'Backend team',
         ['Database schema for resources/events/users', 'Supabase project setup', 'Authentication system', 'API routes', 'Row Level Security (RLS) policies'],
         'Fully functional backend with secure authentication'),
        (4, 'Frontend Development - Core Pages', 'May - June 2025', '30 hours', 'Frontend team',
         ['Homepage with hero and categories', 'Resource directory with search and filters', 'Resource detail pages', 'Events calendar with React Big Calendar', 'About page and contact forms', 'Responsive navigation and footer'],
         'Complete user-facing pages and navigation'),
        (5, 'Career Center Development', 'July - September 2025', '35 hours', 'AI/Backend team',
         ['Google Gemini AI integration', 'AI-powered resume builder with templates', 'Job application assistant', 'Local job board', 'PDF export with jspdf and html2canvas'],
         'Fully functional career center with AI-powered features'),
        (6, 'Testing and Quality Assurance', 'November 2025', '18 hours', 'All team members',
         ['Cross-browser testing (Chrome, Firefox, Edge)', 'Responsive device testing', 'Security and vulnerability scans', 'Full user flow testing', 'Bug fixes and performance improvements', 'Accessibility validation'],
         'Stable, tested, and secure application'),
        (7, 'Content Population and Data Entry', 'December 2025', '15 hours', 'Content team',
         ['50+ community resources added', 'Organized by category', 'Event listings and calendar entries', 'Job listings', 'Wrote all page content'],
         'Fully populated database with real community data'),
        (8, 'Documentation and Final Preparation', 'January 2026', '12 hours', 'All team members',
         ['Reference page with all sources', 'Student copyright checklist', 'Work log entries', 'Presentation materials', 'User documentation', 'Final review and quality check'],
         'Complete project documentation and competition-ready submission'),
    ]

    for num, title, date_range, hours, team, tasks_list, outcome in phases:
        phase_story = []
        # Header row: phase title (teal) and date (right) as Paragraphs so long text wraps
        header_data = [[cell_para(title, styles, 'PhaseTitle'), cell_para(date_range, styles)]]
        header_t = Table(header_data, colWidths=[4.5 * inch, 2.0 * inch])
        header_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
            ('TEXTCOLOR', (0, 0), (0, -1), TEAL_ACCENT),
            ('TEXTCOLOR', (1, 0), (1, -1), WHITE),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        phase_story.append(header_t)
        phase_story.append(Spacer(1, 0.08 * inch))
        # Meta: hours and team
        phase_story.append(Paragraph(f'<b>Hours:</b> {hours} &nbsp;&nbsp; <b>Team:</b> {team}', ParagraphStyle('Meta', fontName='Helvetica', fontSize=9, textColor=MUTED, spaceAfter=6)))
        # Bullet list of tasks
        tasks_para = '<br/>'.join(f'• {t}' for t in tasks_list)
        phase_story.append(Paragraph(tasks_para, ParagraphStyle('Tasks', fontName='Helvetica', fontSize=9, textColor=WHITE, leftIndent=12, spaceAfter=4)))
        # Green italic outcome
        phase_story.append(Paragraph(f'<i>Outcome: {outcome}</i>', ParagraphStyle('Outcome', fontName='Helvetica-Oblique', fontSize=10, textColor=GREEN, spaceAfter=12)))
        story.append(KeepTogether(phase_story))
        story.append(Spacer(1, 0.1 * inch))

    # Total Time Summary table (Paragraphs so text fits)
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph('Total Time Summary', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    total_data = [
        [cell_para('Phase', styles, 'CellHeader'), cell_para('Date Range', styles, 'CellHeader'),
         cell_para('Hours', styles, 'CellHeader'), cell_para('Team Members', styles, 'CellHeader')],
        [cell_para('1. Project Planning and Research', styles), cell_para('January 2025', styles), cell_para('15', styles), cell_para('All team members', styles)],
        [cell_para('2. UI/UX Design and Wireframing', styles), cell_para('February 2025', styles), cell_para('20', styles), cell_para('Design team', styles)],
        [cell_para('3. Database Setup and Backend', styles), cell_para('March - April 2025', styles), cell_para('25', styles), cell_para('Backend team', styles)],
        [cell_para('4. Frontend - Core Pages', styles), cell_para('May - June 2025', styles), cell_para('30', styles), cell_para('Frontend team', styles)],
        [cell_para('5. Career Center Development', styles), cell_para('July - September 2025', styles), cell_para('35', styles), cell_para('AI/Backend team', styles)],
        [cell_para('6. Testing and QA', styles), cell_para('November 2025', styles), cell_para('18', styles), cell_para('All team members', styles)],
        [cell_para('7. Content Population', styles), cell_para('December 2025', styles), cell_para('15', styles), cell_para('Content team', styles)],
        [cell_para('8. Documentation and Final Prep', styles), cell_para('January 2026', styles), cell_para('12', styles), cell_para('All team members', styles)],
        [cell_para('TOTAL', styles, 'CellHeader'), cell_para('Jan 2025 - Jan 2026', styles, 'CellHeader'), cell_para('170', styles, 'CellHeader'), cell_para('25+ students', styles, 'CellHeader')],
    ]
    total_table = Table(total_data, colWidths=[2.25 * inch, 1.65 * inch, 0.85 * inch, 1.45 * inch])
    total_table.setStyle(table_style_card())
    total_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [CARD_BG, ROW_ALT]),
        ('BACKGROUND', (0, -1), (-1, -1), BLUE_HEADER),
        ('LINEABOVE', (0, -1), (-1, -1), 2, TEAL_ACCENT),
    ]))
    story.append(total_table)
    story.append(Spacer(1, 0.3 * inch))

    # Team Contributions
    story.append(Paragraph('Team Contributions', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    contrib_text = 'Collaborative project by the CATA TSA Chapter. Student developers led development, design, and content.'
    story.append(Paragraph(_escape(contrib_text), ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, spaceAfter=10, splitLongWords=False)))
    named_data = [
        [cell_para('Name', styles, 'CellHeader'), cell_para('Role', styles, 'CellHeader')],
        [cell_para('Yatish Grandhe', styles), cell_para('Student Developer', styles)],
        [cell_para('Dhyan Kanna', styles), cell_para('Student Developer', styles)],
        [cell_para('Vihaan Kotagiri', styles), cell_para('Student Developer', styles)],
    ]
    named_table = Table(named_data, colWidths=[2.5 * inch, 2.0 * inch])
    named_table.setStyle(table_style_card())
    named_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('LINEABOVE', (0, 0), (-1, 0), 2, BLUE_ACCENT),
    ]))
    story.append(named_table)
    story.append(Spacer(1, 0.25 * inch))

    # Completion info grid
    comp_data = [
        [cell_para('PROJECT COMPLETION:', styles, 'CellMuted'), cell_para('January 2026', styles),
         cell_para('STATUS:', styles, 'CellMuted'), cell_para('Completed and Deployed', styles)],
        [cell_para('DEPLOYMENT:', styles, 'CellMuted'), cell_para('Vercel Platform', styles),
         cell_para('URL:', styles, 'CellMuted'), cell_para('https://monroeresourcehub.us', styles)],
    ]
    comp_table = Table(comp_data, colWidths=[1.5 * inch, 1.8 * inch, 1.0 * inch, 2.2 * inch])
    comp_table.setStyle(table_style_card())
    story.append(comp_table)

    def on_first(canvas, doc):
        first_page_cb(canvas, doc, 'WORK LOG', 'Monroe Resource Hub | Central Academy of Technology and Arts | TSA 2026')

    def on_later(canvas, doc):
        later_pages_cb(canvas, doc, 'WORK LOG', 'Monroe Resource Hub | Central Academy of Technology and Arts | TSA 2026')

    doc.build(story, onFirstPage=on_first, onLaterPages=on_later)
    print('Generated:', out_path)
    return out_path


if __name__ == '__main__':
    if not os.path.exists(LOGO_PATH):
        print('Warning: Logo not found at', LOGO_PATH, '- run from repo root.')
    build_student_copyright_checklist()
    build_work_log()
    print('Done. PDFs in', OUT_DIR)
