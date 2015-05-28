import os, urllib, StringIO
from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Frame, Table, TableStyle, SimpleDocTemplate

# font registration:
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

#django libs:
from django.http import HttpResponse
from django.conf import settings

#other:
from localground.apps.lib.helpers.units import Units

class Report():
    """
    A helper class that creates PDF files using ReportLab.
    """
    canvas = None
    path = None
    margin_x = None
    margin_y = None
    origin_x = None
    origin_y = None
    file_name = None
    page_width = None
    page_height = None
    inner_width = None
    inner_height = None
    is_landscape = False
    author = None
    title = None
    qr_size = None
    gutter_size = 10
    
    def __init__(self, path, margin_x=48, margin_y=60, file_name='Untitled.pdf',
                 is_landscape=False, author=None, title=None):
        self.path = path
        self.margin_x = self.origin_x = margin_x
        self.margin_y = self.origin_y = margin_y
        self.file_name = file_name
        self.is_landscape = is_landscape
        self.author = author
        self.title = title
        
        # embeds "Hand of Sean" font:
        afmFile = os.path.join(settings.FONT_ROOT, 'HandOfSean.afm')
        pfbFile = os.path.join(settings.FONT_ROOT, 'HandOfSean.pfb')
        ttfFile = os.path.join(settings.FONT_ROOT, 'handsean.ttf')
        justFace = pdfmetrics.EmbeddedType1Face(afmFile, pfbFile) #embeds font
        faceName = 'HandOfSean' # pulled from AFM file
        pdfmetrics.registerTypeFace(justFace)
        justFont = pdfmetrics.Font('HandSean', faceName, 'WinAnsiEncoding')
        pdfmetrics.registerFont(justFont)
        pdfmetrics.registerFont(TTFont('HandSean', ttfFile))
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=' + self.file_name
        
        self.set_orientation(self.is_landscape)
        
        self.canvas = canvas.Canvas(self.path + '/' + self.file_name,
                               pagesize=(self.page_width, self.page_height))
        if self.author is not None:
            self.canvas.setAuthor(self.author)
        if self.title is not None:
            self.canvas.setTitle(self.title)
        
    def set_orientation(self, is_landscape):
        self.page_width, self.page_height = letter
        if is_landscape:
            self.page_width, self.page_height = self.page_height, self.page_width
        self.inner_width = self.page_width - (2 * self.margin_x)
        self.inner_height = self.page_height - (2 * self.margin_y)
        if self.canvas is not None:
            self.canvas.setPageSize([self.page_width, self.page_height])
        
    def new_page(self):
        self.canvas.showPage()
        
    def save(self):
        self.canvas.showPage()
        self.canvas.save()
        
    def add_footer(self, qr_image, uuID, instructions):   
        # output QR-code:
        self.qr_size = Units.pixel_to_point(qr_image.size[0])
        x = self.origin_x + self.inner_width - self.qr_size #align right
        self.canvas.drawInlineImage(qr_image, x, self.origin_y, self.qr_size,
                                    self.qr_size)
        
        # output Print ID:
        items = []
        style = ParagraphStyle(name='Helvetica', fontName='Helvetica', fontSize=10)
        items.append(Paragraph('Print ID: ' + uuID, style))
        frame = Frame(x, self.origin_y-self.qr_size, self.inner_width-self.qr_size,
                      self.qr_size, showBoundary=0, leftPadding=0, bottomPadding=0,
                      rightPadding=0, topPadding=0)
        frame.addFromList(items, self.canvas)
        
        # output default instructions:
        link_text = "When you're done drawing on the map, scan or photograph it and \
                    submit it to our website: http://localground.org/upload, or \
                    email it to localground.apps.uploads@gmail.com."
        
        items = [] 
        style = ParagraphStyle(
            name='Helvetica', fontName='Helvetica', fontSize=8,
            backColor=colors.HexColor(0xEEEEEE), borderColor=colors.HexColor(0xEEEEEE),
            leftIndent=0, rightIndent=0, spaceBefore=5, spaceAfter=5, borderWidth=5)
        items.append(Paragraph(link_text, style))
        
        padding_x, padding_y = -4, 12
        width, height = self.inner_width - self.qr_size, self.qr_size
        frame = Frame(self.origin_x+padding_x, self.origin_y+3, width, height, showBoundary=0)
        frame.addFromList(items, self.canvas)
        
        # output custom instructions:
        items = []
        style = ParagraphStyle(name='Helvetica', fontName='Helvetica', fontSize=10)
        items.append(Paragraph(instructions, style))
        frame = Frame(self.origin_x+padding_x-2, self.origin_y-padding_y, width,
                      height-15, showBoundary=0)
        frame.addFromList(items, self.canvas)
        
    
    def add_header(self, is_data_entry=True, is_map_page=True):
        x, y = self.origin_x, self.origin_y+self.inner_height-15
        if is_data_entry:
            y = y - 5
        width = self.inner_width
        self.canvas.setFont('HandSean', 18)
        self.canvas.drawString(x, y, self.title)
        
        if is_data_entry:
            self.canvas.setFont('Helvetica', 10)
            r, spacing = 6, 4
            x = self.origin_x + width - r
            
            if is_map_page:
                # Color Bubbles:
                for i in range(0,10):
                    self.canvas.circle(x, y+spacing, r, stroke=1, fill=0)
                    x = x - 2*r - spacing
                self.canvas.drawRightString(x, y, 'Colors Used:')
            else:
                x = x - 10*(2*r + spacing)
                
            # Name field:
            y = y+20
            self.canvas.drawRightString(x, y, 'Name:')
            self.canvas.line(x+5,y, self.origin_x + width, y) 
        
    def add_form(self, num_rows, form, print_object, is_mini_form=False):
        cols = print_object.get_form_field_layout()
        field_aliases, field_widths = ['ID'], [5]
        field_aliases.extend([c.field.col_alias for c in cols])
        field_widths.extend([c.width for c in cols])
        field_widths = [n/100.0*self.inner_width for n in field_widths] #normalize
        x, y = self.origin_x, self.origin_y + self.qr_size
        width = self.inner_width
        height = self.inner_height - self.qr_size - 35
        if is_mini_form:
            height = Units.pixel_to_point(300) #only render a 300-pixel tall form
        
        data, rowheights, header_flowables = [], [39], []
        style = ParagraphStyle(name='Helvetica', fontName='Helvetica', fontSize=10)
        for a in field_aliases:
            header_flowables.append(Paragraph('<b>%s</b>' % a, style))
        data.append(header_flowables)
        for n in range(0, num_rows):
            data.append(['' for n in field_widths])
            rowheights.append(39)
    
        t=Table(data, field_widths, rowheights)
        GRID_STYLE = TableStyle([
            ('GRID', (0,0), (-1,-1), 0.25, colors.black),
            ('FONT', (0,0), (-1,-1), 'HandSean'),
            ('BOX',(0,0),(-1,-1),2,colors.black)
        ])
        t.setStyle(GRID_STYLE)
        frame = Frame(x, y, width, height, showBoundary=0, leftPadding=0,
                      bottomPadding=0, rightPadding=0, topPadding=0)
        frame.addFromList([t], self.canvas)
        
    def add_map(self, map_image, is_data_entry=True, has_mini_form=False):
        y = self.origin_y
        map_width, map_height = map_image.size
        if is_data_entry:
            y = y + self.qr_size + self.gutter_size
        if has_mini_form:
            y = y + Units.pixel_to_point(300)
        self.canvas.drawInlineImage(
            map_image, self.origin_x, y,
            Units.pixel_to_point(map_width), Units.pixel_to_point(map_height))
