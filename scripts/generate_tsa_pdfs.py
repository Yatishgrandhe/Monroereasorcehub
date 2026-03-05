#!/usr/bin/env python3
"""
Generate TSA competition PDFs: student-copyright-checklist.pdf and work-log.pdf.
Uses ReportLab. Run from repo root: python scripts/generate_tsa_pdfs.py
Install: pip install reportlab pillow
Output: public/documents/
"""

import os
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, Image,
    PageBreak, KeepTogether,
)
from reportlab.pdfgen.canvas import Canvas

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

# Header height for both docs
HEADER_HEIGHT = 1.4 * inch
LOGO_SIZE = 0.6 * inch
MARGIN = 0.75 * inch


def draw_black_background(canvas, _doc):
    """Draw full-page black background."""
    canvas.saveState()
    canvas.setFillColor(BG_BLACK)
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
    canvas.restoreState()


def draw_header(canvas, _doc, title_text, subtitle_text='Monroe Resource Hub | Central Academy of Technology and Arts | TSA 2026'):
    """Draw logo, title, subtitle, and blue accent line."""
    canvas.saveState()
    page_w, page_h = letter[0], letter[1]
    # Logo at left
    if os.path.exists(LOGO_PATH):
        canvas.drawImage(LOGO_PATH, MARGIN, page_h - MARGIN - LOGO_SIZE, width=LOGO_SIZE, height=LOGO_SIZE)
    # Title to the right of logo
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 19)
    title_x = MARGIN + LOGO_SIZE + 0.2 * inch
    title_y = page_h - MARGIN - 0.35 * inch
    canvas.drawString(title_x, title_y, title_text)
    # Subtitle
    canvas.setFillColor(MUTED)
    canvas.setFont('Helvetica', 9)
    canvas.drawString(title_x, title_y - 0.2 * inch, subtitle_text)
    # Blue accent line
    canvas.setStrokeColor(BLUE_ACCENT)
    canvas.setLineWidth(2)
    canvas.line(MARGIN, page_h - HEADER_HEIGHT + 0.15 * inch, page_w - MARGIN, page_h - HEADER_HEIGHT + 0.15 * inch)
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
    canvas.saveState()
    page_w, page_h = letter[0], letter[1]
    canvas.setStrokeColor(FOOTER_TEXT)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 0.6 * inch, page_w - MARGIN, 0.6 * inch)
    canvas.setFillColor(FOOTER_TEXT)
    canvas.setFont('Helvetica', 8)
    canvas.drawCentredString(page_w / 2, 0.4 * inch,
        'Monroe Resource Hub | Central Academy of Technology and Arts | TSA Chapter | monroeresourcehub.us')
    canvas.restoreState()


def build_styles():
    styles = getSampleStyleSheet()
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
        fontName='Helvetica-BoldOblique',
        fontSize=12,
        textColor=BLUE_ACCENT,
    ))
    styles.add(ParagraphStyle(
        name='SignatureTeal',
        fontName='Helvetica-BoldOblique',
        fontSize=12,
        textColor=TEAL_ACCENT,
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
    return TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('TEXTCOLOR', (0, 0), (-1, -1), WHITE),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ])


def build_student_copyright_checklist():
    out_path = os.path.join(OUT_DIR, 'student-copyright-checklist.pdf')
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=HEADER_HEIGHT + 0.2 * inch,
        bottomMargin=0.9 * inch,
    )
    styles = build_styles()
    story = []

    # Meta info grid (4 columns)
    meta_data = [
        ['PROJECT:', 'Monroe Resource Hub'],
        ['SCHOOL:', 'Central Academy of Technology and Arts'],
        ['ORGANIZATION:', 'TSA'],
        ['DATE:', '02/05/2026'],
    ]
    col_widths = [1.3 * inch, None, 1.3 * inch, None]  # ORGANIZATION label column at least 1.3 in
    meta_table = Table(meta_data, colWidths=[1.3 * inch, 2.2 * inch, 1.3 * inch, 2.2 * inch])
    meta_table.setStyle(table_style_card())
    meta_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), MUTED),
        ('TEXTCOLOR', (2, 0), (2, -1), MUTED),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 0.15 * inch))

    # Italic note
    story.append(Paragraph(
        '<i>Use of copyrighted material without proper permission may result in disqualification.</i>',
        ParagraphStyle('ItalicNote', fontName='Helvetica-Oblique', fontSize=9, textColor=MUTED, spaceAfter=12)
    ))
    story.append(Spacer(1, 0.2 * inch))

    # Section 1 - Images
    story.append(Paragraph('1. Images', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    sect1_data = [
        ['Image Description', 'Source', 'License/Permission', 'Location Used'],
        ['Unsplash Stock Photos', 'Unsplash.com', 'Unsplash License (Free Use)', 'Hero sections, featured content'],
        ['Custom Logo Design', 'Original Design', 'N/A - Original Work', 'Website branding, navigation'],
        ['Community Images', 'Original Photos', 'N/A - Original Work', 'Various pages'],
    ]
    t1 = Table(sect1_data, colWidths=[1.4 * inch, 1.3 * inch, 1.8 * inch, 1.5 * inch])
    t1.setStyle(table_style_card())
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
    ]))
    story.append(t1)
    story.append(Spacer(1, 0.25 * inch))

    # Section 2 - Text Content
    story.append(Paragraph('2. Text Content', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    sect2_data = [
        ['Image Description', 'Source', 'License/Permission', 'Location Used'],
        ['Community Resource Information', 'Monroe Community Organizations / City Government', 'Public Information / Public Domain', 'Resource directory listings'],
        ['All Website Content', 'Original Writing by Student Team', 'N/A - Original Work', 'Entire website'],
    ]
    t2 = Table(sect2_data, colWidths=[1.5 * inch, 2.0 * inch, 1.5 * inch, 1.5 * inch])
    t2.setStyle(table_style_card())
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ]))
    story.append(t2)
    story.append(Spacer(1, 0.25 * inch))

    # Section 3 - Code and Libraries
    story.append(Paragraph('3. Code and Libraries', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    sect3_data = [
        ['Library/Framework', 'Version', 'License', 'Usage'],
        ['Next.js', '16.1.6', 'MIT License', 'Core framework (App Router)'],
        ['React', '19.2.4', 'MIT License', 'UI library for all components'],
        ['Tailwind CSS', '3.4', 'MIT License', 'Styling and responsive design'],
        ['TypeScript', '5.9', 'Apache License 2.0', 'Type-safe development'],
        ['Node.js', '22 LTS', 'MIT License', 'Server-side runtime and build tooling'],
        ['Supabase', 'Latest', 'Apache License 2.0', 'Database, authentication, backend services'],
        ['Lucide React', 'Latest', 'ISC License', 'All icons throughout application'],
        ['React Hook Form', 'Latest', 'MIT License', 'Form handling and validation'],
        ['Zod', 'Latest', 'MIT License', 'Schema validation for forms and API'],
        ['Google Generative AI (Gemini)', 'Latest', 'Terms of Service', 'AI resume builder and job assistant'],
        ['React Big Calendar', 'Latest', 'MIT License', 'Event calendar display'],
        ['jspdf and html2canvas', 'Latest', 'MIT License', 'Resume PDF export functionality'],
        ['Other libraries', 'See package.json', 'MIT / Apache', 'Various supporting utilities'],
    ]
    t3 = Table(sect3_data, colWidths=[1.8 * inch, 0.9 * inch, 1.5 * inch, 2.3 * inch])
    t3.setStyle(table_style_card())
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [CARD_BG, ROW_ALT]),
    ]))
    story.append(t3)
    story.append(Spacer(1, 0.25 * inch))

    # Section 4 - Written Permissions
    story.append(Paragraph('4. Written Permissions', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    perm_text = """• All materials used are original work, MIT/Apache/ISC licensed, Unsplash licensed, or public domain.<br/>
• No written permissions were required for the materials used in this project."""
    perm_para = Paragraph(perm_text, ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, leftIndent=12, spaceAfter=8,
        borderColor=TEAL_ACCENT, borderWidth=0, borderPadding=10, backColor=CARD_BG))
    # Teal left bar via table
    perm_table = Table([['', perm_para]], colWidths=[0.08 * inch, 6.0 * inch])
    perm_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), TEAL_ACCENT),
        ('BACKGROUND', (1, 0), (1, -1), CARD_BG),
        ('LEFTPADDING', (1, 0), (1, -1), 12),
        ('TOPPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (1, 0), (1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(perm_table)
    story.append(Spacer(1, 0.2 * inch))

    # Section 5 - Framework Template Statement
    story.append(Paragraph('5. Framework Template Statement', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    frame_text = """All templates, themes, components, and designs were custom-built by the CATA TSA team. No pre-built templates or themes were used."""
    frame_para = Paragraph(frame_text, ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, leftIndent=12, spaceAfter=6,
        backColor=CARD_BG))
    frame_table = Table([['', frame_para]], colWidths=[0.08 * inch, 6.0 * inch])
    frame_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), TEAL_ACCENT),
        ('BACKGROUND', (1, 0), (1, -1), CARD_BG),
        ('LEFTPADDING', (1, 0), (1, -1), 12),
        ('TOPPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (1, 0), (1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(frame_table)
    story.append(Spacer(1, 0.25 * inch))

    # Section 6 - Student Signatures
    story.append(Paragraph('6. Student Signatures', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    story.append(Paragraph('Students certify the accuracy of the information above.', ParagraphStyle('Muted', fontName='Helvetica', fontSize=9, textColor=MUTED, spaceAfter=10)))

    sig_date = '02/05/2026'
    students = [
        ('Yatish Grandhe', 'Yatish Grandhe', BLUE_ACCENT, 'Signature'),
        ('Dhyan Kanna', 'Dhyan Kanna', BLUE_ACCENT, 'Signature'),
        ('Vihaan Kotagiri', 'Vihaan Kotagiri', BLUE_ACCENT, 'Signature'),
    ]
    for name, sig_name, _c, _l in students:
        row = [
            Paragraph(f'<b>Name</b><br/>{name}', styles['WhiteBody']),
            Paragraph(f'<font color="#3B82F6"><b><i>{sig_name}</i></b></font>', ParagraphStyle('Sig', fontName='Helvetica-BoldOblique', fontSize=12, textColor=BLUE_ACCENT)),
            Paragraph(f'<b>Date</b><br/>{sig_date}', styles['WhiteBody']),
        ]
        sig_t = Table([['Name', 'Signature', 'Date'], row], colWidths=[2.0 * inch, 2.2 * inch, 1.5 * inch])
        sig_t.setStyle(table_style_card())
        sig_t.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0, 0), (-1, 0), MUTED),
        ]))
        story.append(sig_t)
        story.append(Spacer(1, 0.15 * inch))

    # Advisor
    advisor_row = [
        Paragraph('<b>Name</b><br/>Tyler Powell', styles['WhiteBody']),
        Paragraph(f'<font color="#2DD4BF"><b><i>Tyler Powell</i></b></font>', ParagraphStyle('SigTeal', fontName='Helvetica-BoldOblique', fontSize=12, textColor=TEAL_ACCENT)),
        Paragraph(f'<b>Date</b><br/>{sig_date}', styles['WhiteBody']),
    ]
    adv_table = Table([['Name', 'Signature', 'Date'], advisor_row], colWidths=[2.0 * inch, 2.2 * inch, 1.5 * inch])
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
        topMargin=HEADER_HEIGHT + 0.2 * inch,
        bottomMargin=0.9 * inch,
    )
    styles = build_styles()
    story = []

    # Meta grid
    meta_data = [
        ['PROJECT:', 'Monroe Resource Hub', 'DATE RANGE:', 'January 2025 - January 2026'],
        ['SCHOOL:', 'Central Academy of Technology and Arts', 'STUDENTS:', 'Yatish Grandhe, Dhyan Kanna, Vihaan Kotagiri'],
        ['ORGANIZATION:', 'TSA', 'STATUS:', 'Completed and Deployed'],
    ]
    meta_table = Table(meta_data, colWidths=[1.3 * inch, 2.0 * inch, 1.3 * inch, 2.4 * inch])
    meta_table.setStyle(table_style_card())
    meta_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), MUTED),
        ('TEXTCOLOR', (2, 0), (2, -1), MUTED),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 0.2 * inch))

    # Project Summary card (teal left bar)
    summary_text = """The Monroe Resource Hub is a comprehensive community platform designed to connect residents of Monroe, North Carolina with vital resources, services, and opportunities. The platform includes a resource directory, an AI-powered resume builder, a job application assistant, a community events calendar, and volunteer opportunity listings. Built with Next.js, React, Supabase, and Google Gemini AI, the application is fully deployed at monroeresourcehub.us."""
    summary_para = Paragraph(summary_text, ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, leftIndent=12, spaceAfter=6, backColor=CARD_BG))
    summary_table = Table([['', summary_para]], colWidths=[0.08 * inch, 6.0 * inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), TEAL_ACCENT),
        ('BACKGROUND', (1, 0), (1, -1), CARD_BG),
        ('LEFTPADDING', (1, 0), (1, -1), 12),
        ('TOPPADDING', (1, 0), (1, -1), 10),
        ('BOTTOMPADDING', (1, 0), (1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(Paragraph('Project Summary', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    story.append(summary_table)
    story.append(Spacer(1, 0.25 * inch))

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
        # Header row: phase title (teal) and date (right)
        header_data = [[title, date_range]]
        header_t = Table(header_data, colWidths=[4.5 * inch, 2.0 * inch])
        header_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
            ('TEXTCOLOR', (0, 0), (0, -1), TEAL_ACCENT),
            ('TEXTCOLOR', (1, 0), (1, -1), WHITE),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
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

    # Total Time Summary table
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph('Total Time Summary', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=6)))
    total_data = [
        ['Phase', 'Date Range', 'Hours', 'Team Members'],
        ['1. Project Planning and Research', 'January 2025', '15', 'All team members'],
        ['2. UI/UX Design and Wireframing', 'February 2025', '20', 'Design team'],
        ['3. Database Setup and Backend', 'March - April 2025', '25', 'Backend team'],
        ['4. Frontend - Core Pages', 'May - June 2025', '30', 'Frontend team'],
        ['5. Career Center Development', 'July - September 2025', '35', 'AI/Backend team'],
        ['6. Testing and QA', 'November 2025', '18', 'All team members'],
        ['7. Content Population', 'December 2025', '15', 'Content team'],
        ['8. Documentation and Final Prep', 'January 2026', '12', 'All team members'],
        ['TOTAL', 'Jan 2025 - Jan 2026', '170', '25+ students'],
    ]
    total_table = Table(total_data, colWidths=[2.2 * inch, 1.6 * inch, 0.8 * inch, 1.4 * inch])
    total_table.setStyle(table_style_card())
    total_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [CARD_BG, ROW_ALT]),
        ('BACKGROUND', (0, -1), (-1, -1), BLUE_HEADER),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('LINEABOVE', (0, -1), (-1, -1), 2, TEAL_ACCENT),
    ]))
    story.append(total_table)
    story.append(Spacer(1, 0.25 * inch))

    # Team Contributions
    story.append(Paragraph('Team Contributions', ParagraphStyle('Sect', fontName='Helvetica-Bold', fontSize=11, textColor=BLUE_ACCENT, spaceAfter=4)))
    contrib_text = 'Collaborative project by the CATA TSA Chapter. Student developers led development, design, and content.'
    story.append(Paragraph(contrib_text, ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=WHITE, spaceAfter=8)))
    named_data = [
        ['Name', 'Role'],
        ['Yatish Grandhe', 'Student Developer'],
        ['Dhyan Kanna', 'Student Developer'],
        ['Vihaan Kotagiri', 'Student Developer'],
    ]
    named_table = Table(named_data, colWidths=[2.5 * inch, 2.0 * inch])
    named_table.setStyle(table_style_card())
    named_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HEADER),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('LINEABOVE', (0, 0), (-1, 0), 2, BLUE_ACCENT),
    ]))
    story.append(named_table)
    story.append(Spacer(1, 0.2 * inch))

    # Completion info grid
    comp_data = [
        ['PROJECT COMPLETION:', 'January 2026', 'STATUS:', 'Completed and Deployed'],
        ['DEPLOYMENT:', 'Vercel Platform', 'URL:', 'https://monroeresourcehub.us'],
    ]
    comp_table = Table(comp_data, colWidths=[1.5 * inch, 1.8 * inch, 1.0 * inch, 2.2 * inch])
    comp_table.setStyle(table_style_card())
    comp_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), MUTED),
        ('TEXTCOLOR', (2, 0), (2, -1), MUTED),
    ]))
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
