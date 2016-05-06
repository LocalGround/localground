#!/usr/bin/env python
import traceback, sys
import Image, ImageDraw, ImageChops, ImageMath
import os, stat, urllib, StringIO, cv, math
from datetime import datetime 
from django.conf import settings
from localground.apps.site import models
import simplejson as json

class General:        
    def __init__(self):
        return

    def pil2cv(self, pil_image):
        im = pil_image.convert('RGB')
        cv_image = cv.CreateImageHeader(im .size, cv.IPL_DEPTH_8U, 3)  # RGB image
        cv.SetData(cv_image, im .tostring(), im .size[0]*3)
        cv.CvtColor(cv_image, cv_image, cv.CV_RGB2BGR)
        return cv_image
    
    def make_directory(self, path):
        from localground.apps.site.models import BaseMedia
        BaseMedia.make_directory(path)

class Processor(General):
    is_debug = True
    new_size = [1200, 1200]
    file_name_scaled = 'scaled_image.png'
    file_name_thumb = 'thumbnail_image.png'
    
    def __init__(self, obj, **kwargs):
        General.__init__(self)
        self.obj = obj
        self.mapimage = obj
        self.rectangles = []
        self.pil_image = None
        self.finder = None
        self.qr_processor = None
        self.map_processor = None
        self.logger = Logger(self.is_debug,
                             tmp_directory=self.obj.get_abs_directory_path() + \
                             '/debug/')
        
        
    def process_image(self, object_name):
        # read image from file system:
        self.logger.log('Beginning to process %s #%s...' % (object_name, self.obj.uuid))
        try:
            self.logger.log('Opening %s' % self.obj.original_image_filesystem())
            self.pil_image = Image.open(self.obj.original_image_filesystem())
            self.pil_image = self.pil_image.convert('RGBA')
        except IOError:
            self.logger.tmp_directory = settings.TEMP_DIR
            raise ProcessingError(self.logger, self.obj,
                        models.StatusCode.DIRECTORY_MISSING,
                        message='Exiting:  Map image not found in file system',
                        terminate=False)
            
        #scale image to uniform size (1200x1200 pix^2) to speed up processing:
        self.scale_and_thumbnail_image()
        
        #get rectangles using canny edge detection
        self.finder = RectangleFinder(self.pil_image, self.logger)
        self.finder.get_rectangles()
        self.finder.draw_rectangles()
        
        #filter rectangles to find qr rectangle; exit if no rectangle found:
        self.obj.qr_rect = self.finder.get_qr_rectangle()
        if self.obj.qr_rect is None:
            raise ProcessingError(self.logger, self.obj,
                        models.StatusCode.QR_RECT_NOT_FOUND,
                        message='Exiting:  No QR rectangle found',
                        terminate=True)
               
        #read qr-code:
        if self.obj.qr_code is not None and len(self.obj.qr_code) == 8:
            self.logger.log('qr_code already exists')
            # TODO:  don't necessarily initialize theta to 0 or page_num to 1!
            # Should be stored in DB also:
            print_id, theta, self.page_num =  self.obj.qr_code, 0, 1
        else:
            self.qr_processor = QrCodeUtils(self.obj, self.pil_image, self.logger)
            print_id, theta, self.page_num = self.qr_processor.read_qr(self.obj.qr_rect)
            #self.obj.qr_code = print_id
        
        #exit if no print_id found:
        if print_id is None:
            raise ProcessingError(self.logger, self.obj,
                        models.StatusCode.QR_CODE_NOT_READ,
                        message='Exiting:  QR-Code not read',
                        terminate=True)
        
        #rotate entire image based on qr-code orientation; re-query for
        #rectangles if theta != 0:
        self.rotate_image_by_angle(theta)
        
        #query for source print; exit if no print found:
        try:
            self.logger.log('Querying for print %s' % print_id)
            self.obj.source_print = models.Print.objects.get(uuid=print_id)
        except models.Print.DoesNotExist:
            #return if code not in database:
            raise ProcessingError(self.logger, self.obj,
                        models.StatusCode.PRINT_NOT_FOUND,
                        message='Exiting:  QR-Code %s not in database' % print_id,
                        terminate=True)

    def process_mapimage(self):
        self.process_image('map image')
            
        # Process Map:
        #------------------------------
        #filter rectangles to find map rectangle, based on metadata from the
        #print; exit if no map rectangle found:    
        self.mapimage.map_rect = self.finder.get_map_rectangle(self.mapimage.source_print)
        if self.mapimage.map_rect is None:
            self.logger.log('Exiting:  No map rectangle found')
            self.mapimage.status = models.StatusCode.objects.get(
                                    id=models.StatusCode.MAP_RECT_NOT_FOUND)
            self.mapimage.save()
            return
    
        #helper class for processing map image:
        self.map_processor = MapUtils(self.mapimage, self.pil_image, self.logger)
        
        #generate all of the map image alternatives:
        self.map_processor.process_map_image(self.mapimage.map_rect)

        self.finder.draw_rectangles()

        #save all changes made to the map image:
        self.mapimage.status = models.StatusCode.objects.get(
                                id=models.StatusCode.PROCESSED_SUCCESSFULLY)
        self.mapimage.save()
        self.logger.write_messages_to_file()
        return
    
        
    def rotate_image_by_angle(self, theta):
        #if the map needs to be rotated, do it.
        # then re-calculate rectangles and re-identify qr-rectangle:
        if theta is not None and theta != 0:
            self.logger.log('theta: %s' % (theta))
            orig_size = self.pil_image.size
            im = self.pil_image.convert('RGBA').rotate(theta, Image.BICUBIC, expand=True)
            fff = Image.new('RGBA', im.size, (255,)*4)
            self.pil_image = Image.composite(im, fff, im)
            self.pil_image.save('%srotated.png' % (self.obj.get_abs_directory_path()))
            
            #update finder image and retrieve rectangles again:
            self.finder.pil_image = self.pil_image 
            self.finder.get_rectangles()
            self.obj.qr_rect = self.finder.get_qr_rectangle()
        
    def scale_and_thumbnail_image(self):
        #resize image (to make faster / conserve bandwidth):
        original_size = self.pil_image.size
        self.pil_image.thumbnail(self.new_size, Image.ANTIALIAS)
        self.pil_image.save('%s/%s' % (self.obj.get_abs_directory_path(),
                                       self.file_name_scaled))
        self.obj.file_name_scaled = self.file_name_scaled
        new_size = self.pil_image.size
        
        #set scale factor:
        self.obj.scale_factor = 1.0*original_size[0]/new_size[0]
        
        #create thumbnail too:
        #thumb = self.pil_image.copy()
        #thumb.thumbnail([500, 500], Image.ANTIALIAS)
        #thumb.save('%s/%s' % (self.obj.get_abs_directory_path(),
        #                               self.file_name_thumb))
        #self.obj.file_name_thumb = self.file_name_thumb        
    

class ProcessingError(Exception):
    def __init__(self, logger, obj, status_code, message=None, terminate=False):
        if message is not None:
            self.msg = message
            logger.log(message)
            logger.log(traceback.format_exc())
            #logger.log(sys.argv[0])
        obj.status = models.StatusCode.objects.get(id=status_code)
        obj.save()
        logger.log(datetime.now())
        logger.log('Status code for %s: %s' %
                        (obj.uuid, status_code))
        logger.write_messages_to_file()
        
        #completely exit python execution pipeline:
        if terminate:
            raise SystemExit
        #    #sys.exit()
        
        #this line is required to make exception pickleable:
        Exception.__init__(self, logger, obj, status_code, message, terminate)
        
       # super(ProcessingError, self).__init__(logger, obj, status_code, message, terminate)
    
    def __str__(self):
        return repr(self.msg)

class BasemapTypes:
    MAP_TYPE_HYBRID_SATELLITE = 3
    MAP_TYPE_SATELLITE = 9
    
class ImageProcessingTypes:
    #cropped to map bounds:
    ORIG = 'map.png'
    COLOR_TO_ALPHA = 'color_to_alpha.png'
    GRAYSCALE_SUBTRACTED = 'grayscale_subtracted.png'
    
    #extended to include margins:
    WITH_MARGINS = 'map_with_margins.png'
    COLOR_TO_ALPHA_WITH_MARGINS = 'color_to_alpha_with_margins.png'
    GRAYSCALE_SUBTRACTED_WITH_MARGINS = 'grayscale_subtracted_with_margins.png'
    COLOR_TO_ALPHA_WITH_SOLID_MARGINS = 'color_to_alpha_with_solid_margins.png'
    GRAYSCALE_SUBTRACTED_WITH_SOLID_MARGINS = 'grayscale_subtracted_with_solid_margins.png'

class Quadrilateral():
    
    def __init__(self, point_array, contract_by=0):
        self.point_array = point_array
        
        #figure out which point goes where:
        def x_comparison(a, b):
            return cmp(a[0], b[0])

        #copy array (don't sort original) & sort
        l = point_array[:]
        l.sort(x_comparison) 
        
        #assign ordered pair to name (for convenience/clarity):
        self.top_left = l[0]
        self.top_right = l[2]
        self.bottom_left = l[1]
        self.bottom_right = l[3]

        if self.top_right[1] > self.bottom_right[1]:
            #flip if top y-val is greater than bottom y-val
            self.bottom_right = l[2]
            self.top_right = l[3]
        if self.top_left[1] > self.bottom_left[1]:
            #flip
            self.bottom_left = l[0]
            self.top_left = l[1]
        
        b = contract_by    
        self.top_left = (self.top_left[0] + b, self.top_left[1] + b)
        self.bottom_right = (self.bottom_right[0] - int(b/2), self.bottom_right[1] - int(b/2))
        self.top_right = (self.top_right[0] - int(b/2), self.top_right[1] + b)
        self.bottom_left = (self.bottom_left[0] + b, self.bottom_left[1] - int(b/2))
        '''print 'top_left:', self.top_left
        print 'bottom_right:', self.bottom_right
        print 'top_right:', self.top_right
        print 'bottom_left:', self.bottom_left'''
    
    def to_pil_bbox(self, padding=0):
        points = self.to_cv_poly()
        x_list = [p[0] for p in points]
        y_list = [p[1] for p in points]
        
        self.left = min(x_list)
        self.top = min(y_list)
        self.right = max(x_list)
        self.bottom = max(y_list)
        
        #left, upper, right, and lower
        bbox =  [
            self.left + padding,
            self.top  + padding,
            self.right - padding,
            self.bottom - padding
        ]
        #print bbox
        return bbox
    
    def get_width(self):
        return self.top_right[0] - self.top_left[0]
    
    def get_height(self):
        return self.bottom_right[1] - self.top_right[1]
        
    def to_cv_poly(self):
        return [self.bottom_right, self.bottom_left, self.top_left, self.top_right]
    
    def get_margins(self, img):
        w, h = img.size
        bbox = self.to_pil_bbox() #left, upper, right, and lower
        left = bbox[0]
        top = bbox[1]
        right = w - bbox[2]
        bottom = h - bbox[3]
        return top, left, bottom, right
    
    def crop_to_shape(self, img, rotate=False, padding=0):
        # Crop and return, if no rotation needed:
        if not rotate:
            img = img.crop(self.to_pil_bbox(padding=padding))
            return img
        else:        
            w = self.top_right[0] - self.top_left[0]
            h = self.bottom_right[1] - self.top_right[1]
            
            #print h, w
            #an 8-tuple (x0, y0, x1, y1, x2, y2, y3, y3) which contain the
            #upper left, lower left, lower right, and upper right corner
            #of the source quadrilateral
            img = img.transform((w, h), Image.QUAD, (self.top_left[0], self.top_left[1],
                                                 self.bottom_left[0], self.bottom_left[1],
                                                 self.bottom_right[0], self.bottom_right[1],
                                                 self.top_right[0], self.top_right[1]))
            
            return img
            bbox = [padding, padding, h-padding, w-padding]
            return img.crop(bbox)        
    

class Logger(General):
    def __init__(self, is_debug, tmp_directory=settings.TEMP_DIR):
        self.is_debug = is_debug
        self.tmp_directory = tmp_directory
        self.messages = []
        if self.is_debug and not os.path.exists(self.tmp_directory):
            try:
                self.make_directory(self.tmp_directory)
                #os.mkdir(self.tmp_directory)
                #os.chmod(self.tmp_directory, 775)
                
            except OSError:
                self.log('%s does not exist.  Defaulting to %s' %
                         (self.tmp_directory, '/tmp/mapimages/'))
                self.tmp_directory = '/tmp/mapimages/'
                #os.mkdir(self.tmp_directory)
        
    def log(self, message):
        if self.is_debug:
            self.messages.append(datetime.now())
            self.messages.append(message)
            print message
            
    def write_messages_to_file(self):
        f = open(os.path.join(self.tmp_directory, 'processor_log.log'), 'w')
        for m in self.messages:
            f.write(str(m) + '\n')
        f.close()
        

class ImageUtilities(General):
    
    @staticmethod 
    def find_rectangles_by_channel(cv_image, binary_threshold, kernel_size,
                                 logger=None):
            
        return ImageUtilities.find_polygons_by_channel(cv_image, binary_threshold,
                        kernel_size, is_quadrilateral=True, is_rectangle=True,
                        logger=logger)

    @staticmethod 
    def find_polygons_by_channel(cv_image, binary_threshold, kernel_size,
                                 is_quadrilateral=False, is_rectangle=False,
                                 logger=None):
        """
        Finds multiple polygons in image
    
        Steps:
        1) Use ImageUtilities edge to highlight contours, and dilation to connect
        the edge segments.
        2) Threshold the result to binary edge tokens
        3) Use cv.FindContours: returns a cv.CvSequence of cv.CvContours
        
        Return all polygon contours in one flat list of arrays, 4 x,y points each.
        """
        polygons = []
        color_img = cv.CloneImage(cv_image)    
        r   = cv.CreateImage(cv.GetSize(color_img), color_img.depth, 1);
        g   = cv.CreateImage(cv.GetSize(color_img), color_img.depth, 1);
        b   = cv.CreateImage(cv.GetSize(color_img), color_img.depth, 1);
        cv.Split(color_img, r, g, b, None)
        s   = cv.CreateImage(cv.GetSize(color_img), color_img.depth, 1);
        dst = cv.CreateImage(cv.GetSize(color_img), color_img.depth, 1);
        cv.AddWeighted(r, 1./3., g, 1./3., 0.0, s)
        cv.AddWeighted(s, 2./3., b, 1./3., 0.0, s)
        cv.Threshold( s, dst, binary_threshold, 255, cv.CV_THRESH_BINARY )
    
        # Note:  varying the size of the kernel might also be a good idea for
        # finding borders:
        kernel = cv.CreateStructuringElementEx(kernel_size, kernel_size, 0, 0, cv.CV_SHAPE_RECT)
        cv.Erode( dst, dst, kernel, 1)
        
        if logger.is_debug:
            cv.SaveImage('%sblack_and_white_%s.png' % (logger.tmp_directory, binary_threshold), dst)
        
        timg = cv.CreateImage(cv.GetSize(dst), color_img.depth, 3);
        cv.CvtColor(dst, timg, cv.CV_GRAY2RGB)
        
        #select even sizes only
        width, height = (color_img.width & -2, color_img.height & -2 )
        gray = cv.CreateImage( (width,height), 8, 1 )
        
        cv.SetImageROI( timg, (0, 0, width, height) )
    
        # down-scale and upscale the image to filter out the noise
        pyr = cv.CreateImage( (width/2, height/2), 8, 3 )
        cv.PyrDown( timg, pyr, 7 )
        cv.PyrUp( pyr, timg, 7 )
    
        tgray = cv.CreateImage( (width,height), 8, 1 )
    
        # Find polygons in every color plane of the image
        # Two methods, we use both:
        # 1. ImageUtilities to catch squares with gradient shading. Use upper threshold
        # from slider, set the lower to 0 (which forces edges merging). Then
        # dilate canny output to remove potential holes between edge segments.
        # 2. Binary thresholding at multiple levels
        N = 11
        for c in [0, 1, 2]: #foreach channel (r, g, and b)
            #extract the c-th color plane
            cv.SetImageCOI( timg, c+1 ); #channel of interest (r, g, b)
            cv.Copy( timg, tgray, None );
            cv.Canny( tgray, gray, 0, 50, 5 )
            
            '''if logger.is_debug:
                cv.SaveImage('%sbefore_dialation_%s.png' % \
                             (logger.tmp_directory, binary_threshold), gray)
            '''
            #play with kernel size too
            kernel = cv.CreateStructuringElementEx(
                            kernel_size, kernel_size, 0, 0, cv.CV_SHAPE_RECT) 
            cv.Dilate( gray, gray, kernel, 2)
            
            '''if logger.is_debug:
                cv.SaveImage('%safter_dialation_%s.png' % \
                             (logger.tmp_directory, binary_threshold), gray)
            '''
            polygons.extend(
                ImageUtilities.find_polygons_from_binary(gray, is_quadrilateral=is_quadrilateral,
                                                is_rectangle=is_rectangle)
            )

        #sort polygons by area:
        polygons.sort(ImageUtilities.area_comparison)
        return polygons
    
    @staticmethod
    def find_polygons_from_binary(gray, is_quadrilateral=False, is_rectangle=False):
        polygons = []
        storage = cv.CreateMemStorage(0)
        contours = cv.FindContours(gray, storage, cv.CV_RETR_TREE, cv.CV_CHAIN_APPROX_SIMPLE, (0,0))  
        storage = cv.CreateMemStorage(0)
        while contours:
            #approximate contour with accuracy proportional to the contour perimeter
            arclength = cv.ArcLength(contours)
            polygon = cv.ApproxPoly( contours, storage, cv.CV_POLY_APPROX_DP, arclength * 0.02, 0)

            if is_quadrilateral or is_rectangle:
                p = polygon[0:4]
                if is_rectangle:
                    if ImageUtilities.is_rectangle(p):
                        polygons.append(p)
                else:
                    polygons.append(p)
            else:
                polygons.append(polygon)
            contours = contours.h_next()
        return polygons

    @staticmethod
    def area_comparison(a, b):
        area_a = math.fabs( cv.ContourArea(a) )
        area_b = math.fabs( cv.ContourArea(b) )
        return cmp(area_b, area_a) # compare as integers
        
    @staticmethod
    def make_unique(polygons):
        unique_polygons = []
        for p in polygons:
            if not ImageUtilities.already_exists(p, unique_polygons):
                unique_polygons.append(p)
        return unique_polygons

    @staticmethod
    def already_exists(polygon, polygons):
        for p in polygons:
            for i in range(0, len(p)):
                for j in range (0, len(polygon)):
                    if p[i][0] == polygon[j][0] and p[i][1] == polygon[j][1]:
                        if i == len(polygon)-1:
                            return True
                    #else: break
        return False
    
    @staticmethod
    def is_more_rectangular(q1, q2, buffer=2):
        """
        A quadrilateral is "more rectangular" if it more closely approximates
        having 4 90 degree angles than does the alternate quadrilateral to which
        it is being compared
        """
        if q2 is None:
            return False
        elif q1 is None:
            return True
        
        q1_score = ImageUtilities.get_right_angle_score(q1)
        q2_score = ImageUtilities.get_right_angle_score(q2)
        #if the second quadrilateral (q2) is more rectangular than the first
        #quadrilateral (q1) return True, otherwise, return False
        return q2_score > q1_score
        
    
    @staticmethod   
    def is_rectangle(polygon):
        #return True;
        """
        Rectangle checker
    
        Rectangle polygon should:
            -have 4 vertices after approximation, 
            -have relatively large area (to filter out noisy polygon)
            -be convex.
            -have angles between sides close to 90deg (cos(ang) ~0 )
            -have side ratios roughly square (perimeter-to-area ratio should be
             roughly that of a square).
        Note: absolute value of an area is used because area may be
        positive or negative - in accordance with the polygon orientation
        """
    
        area = math.fabs( cv.ContourArea(polygon) )
        isconvex = cv.CheckContourConvexity(polygon)
        #if len(polygon) == 4 and area > 1000 and isconvex:
        if area > 1000 and isconvex and len(polygon) == 4:
            angles = ImageUtilities.get_angles(polygon)
            if sum(angles) > 20 or max(angles) > 15:
                #return True
                return False
            #print 'POLYGON:', polygon
            #print 'ANGLES:', angles, 'SUM:', sum(angles)
            #get rectang
            #right_angle_score = ImageUtilities.get_right_angle_score(polygon)
            #if right_angle_score >= 220: #todo:  determine good threshold
            #    return False

            
            area = math.fabs( cv.ContourArea(polygon))
            perimeter = cv.ArcLength(polygon, isClosed=True)
            normalized_ratio = area/(perimeter/4)**2

            # ensure square-ish shape and not long rectangle of nonsense:
            if normalized_ratio >= .70: return True
            #if perimeter < 4.6*math.sqrt(area):
            #    return True
    
        return False
    
        
    @staticmethod
    def get_angles(polygon):
        #http://stackoverflow.com/questions/1211212/how-to-calculate-an-angle-from-three-points
        if polygon is None:
            return None
        points = ImageUtilities.sort_points(polygon)
        line_groups = []
        for i in range(0, 4):
            ranges = [[i%4, i%4-1], [(i + 1)%4, i%4], [(i + 1)%4, i%4-1] ]
            lines = []
            for r in ranges:
                start, end = r[0], r[1]
                lines.append(math.sqrt(math.pow(points[start][0]-points[end][0],2) + math.pow(points[start][1]-points[end][1],2)))
            line_groups.append(lines)
        
        angles = []
        for lines in line_groups:
            num = math.pow(lines[0],2)+math.pow(lines[1],2)-math.pow(lines[2],2)
            denom = 2*lines[0]*lines[1]
            theta = math.acos(num/denom)*180/math.pi   
            angles.append(abs(90-theta))
        #print 'ANGLES:', angles, 'SCORE:', sum(angles)
        return angles
        
    
    @staticmethod
    def get_right_angle_score(polygon): 
        angles = ImageUtilities.get_angles(polygon)
        return sum(angles)

    @staticmethod
    def sort_points(points):
        if points is None:
            return points
        # 1) sort by y-values, descending:
        points = sorted(points, key=lambda p: p[1])
        # 2) ensure that second to last x-coord is bigger than last x-coord:
        if points[0][0] > points[1][0]:
            point = points[0]
            points[0] = points[1]
            points[1] = point
        
        if points[2][0] < points[3][0]:
            point = points[2]
            points[2] = points[3]
            points[3] = point
        return points


class RectangleFinder(General):
    def __init__(self, pil_image, logger):
        General.__init__(self)    #has some generic functions (lik a logger)
        self.rectangles = []
        self.logger = logger
        self.pil_image = pil_image
        self.map_rect = None
        self.qr_rect = None
        
    def get_rectangles(self, min_threshold=5, max_threshold=250, increment=5,
                       kernel_size=1):
        self.rectangles = []
        threshold, increment = min_threshold, 5
        past_peak = 0
        while threshold < max_threshold and len(self.rectangles) < 50:
            new_rectangles = ImageUtilities.find_rectangles_by_channel(
                                self.pil2cv(self.pil_image), threshold,
                                kernel_size, logger=self.logger)
            new_rectangles = ImageUtilities.make_unique(new_rectangles)
            
            self.logger.log('%s rectangles found for threshold: %s, past_peak: %s, num_rectangles: %s' % \
                (len(new_rectangles), threshold, past_peak, len(self.rectangles)))
            
            # if we've already found the rectangles, don't continue past a few more
            # iterations, to speed things up.
            if len(self.rectangles) >= 12 and len(new_rectangles) <= len(self.rectangles):
                past_peak = past_peak + 1
                
            if past_peak >= 2:
                self.logger.log('Past peak')
                break
            
            #ensure rectangle list is unique:
            for r in new_rectangles:
                if not ImageUtilities.already_exists(r, self.rectangles):
                    self.rectangles.append(r)
            
            threshold = threshold+increment
        
    def get_qr_rectangle(self):
        self.qr_rect = None
        # checks 2 things:
        # - that the QR code is the "squarest" square in the rectangle array
        # - that the ratio of the area QR code relative to the image size is ~1%
        self.logger.log('getting the QR rectangle...') 
        ratio_best = 0 #initialize to 0 (an impossible ratio)
        cv_image = self.pil2cv(self.pil_image)
        size = cv.GetSize(cv_image);
        total_area = size[0]*size[1]
        self.logger.log('total area: %s' % (total_area))
        for rect in self.rectangles:
            area = math.fabs( cv.ContourArea(rect) )
            perimeter = cv.ArcLength(rect, isClosed=True)
            ratio_this = area/(perimeter/4)**2
            #print rect, area, perimeter, ratio_this
            print 'perimeter_area_ratio_this:', ratio_this
            #print 'snippet_to_total_area_ratio:', area/total_area
            if ratio_this > ratio_best and .01 <= area/total_area <= .05:
                self.logger.log('best area ratio: %s' % ratio_this)
                self.qr_rect = rect
                ratio_best = ratio_this
        return self.qr_rect
    
    def get_map_rectangle(self, source_print):
        self.logger.log('Getting map rectangle...')
        self.map_rect = self.select_rectangle(source_print, .2, .7, in_first_third=True)
        return self.map_rect
    
    def select_rectangle(self, source_print, min_area, max_area, in_first_third=True):
        """
        Finds the rectangle that corresponds to the map_rect; assumes that the
        image has already been rotated.
        """
        if source_print is None:
            self.logger.log('No print defined')
            return

        selected_rect = None
        total_area = self.pil_image.size[0]*self.pil_image.size[1]
        ratio_best = 0 #dummy value for impossibly low ratio
        for rect in self.rectangles:
            area = math.fabs( cv.ContourArea(rect) )
            perimeter = cv.ArcLength(rect, isClosed=True)
            ratio_this = area/(perimeter/4)**2
            #check to see if the rectangle exists in the first third of the
            #image:
            min_y = min([p[1] for p in rect])
            position_match = (min_y < self.pil_image.size[1]/3) == in_first_third or \
                            not in_first_third == (min_y >= self.pil_image.size[1]/3) or \
                            in_first_third is None
            
            # if (1) the total area of the rectangle is within the area range and
            # (2) the rectangle is the most rectangular choice (to exclude trapezoid looking shapes) *and*
            # (3) rectangle starts on second half of the page.
            print ratio_best, ':', ratio_this, area/total_area, position_match
            if min_area < area/total_area < max_area and \
                    ratio_this > ratio_best and \
                    position_match:
                    #ImageUtilities.is_more_rectangular(self.map_rect, rect) and \
                ratio_best = ratio_this
                selected_rect = rect
        
        self.logger.log('selected rectangle: %s' % (selected_rect))
        return selected_rect
    
    def scale_rectangles(self):
        sf = self.pil_image.size[0]/(self.pil_thumb.size[0]*1.0)
        for i in range(0, len(self.rectangles)):
            self.rectangles[i] = [(int(p[0]*sf), int(p[1]*sf)) for p in self.rectangles[i]]
    
    def draw_rectangles(self):
        color = (0,255,0)
        im = self.pil_image.copy()
        cv_image = self.pil2cv(im)
        #output all rectangles:
        for rectangle in self.rectangles:
            cv.PolyLine(cv_image, [rectangle], True, color, 1, cv.CV_AA, 0)
        
        #output qr-code rectangle (if exists):
        if self.qr_rect is not None:
            r = Quadrilateral(self.qr_rect)
            cv.PolyLine(cv_image, [r.to_cv_poly()], True, (0, 0, 255), 1, cv.CV_AA, 0)
            
        #output map rectangle (if exists):
        if self.map_rect is not None:
            r = Quadrilateral(self.map_rect, contract_by=12)
            cv.PolyLine(cv_image, [r.to_cv_poly()], True, (255, 0, 0), 1, cv.CV_AA, 0)  
        
        if self.logger.is_debug:
            cv.SaveImage(self.logger.tmp_directory + 'rectangles.png', cv_image)

        

class QrCodeUtils(General):
    
    def __init__(self, mapimage, pil_image, logger):
        General.__init__(self)      #has some generic functions (lik a logger)
        self.mapimage = mapimage            #mapimage is being passed in by reference
        self.pil_image = pil_image
        self.logger = logger

    def execute_reader(self, img_path):
        def parse_point(val):
            if val.find('Point') == -1:
                return None
            p_txt = (val.split(':')[1]).strip()
            p_txt = p_txt.replace('(', '')
            p_txt = p_txt.replace(')', '')
            points = p_txt.split(',')
            self.logger.log(points)
            return [float(points[0]), float(points[1])]
            
        import subprocess
        cmd = ['java',
            '-cp',
            '%(path)s/javase.jar:%(path)s/core.jar' % \
                dict(path=settings.QR_READER_PATH),
            'com.google.zxing.client.j2se.CommandLineRunner',
            img_path
        ]
        
        cmd = [
            'java', '-version'
        ]
        #cmd = ['ldd' '/usr/lib/jvm/java-6-openjdk/jre/bin/java']
        process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, env=os.environ)
        output, error = process.communicate()
        #self.logger.log(output)
        #self.logger.log(error)
        #process.wait()
        #self.logger.log(process.stdout.read())
        #r = subprocess.Popen('echo "Hello world!"', shell=True)
        
        #self.logger.log(subprocess.check_output(["echo", "Hello World!"]))
        #subprocess.Popen(['echo','1']).wait()
       
        self.logger.log('About to read the QR code from the image...')
        decoded, points = None, []
        cmd = 'java -cp %s/javase.jar:%s/core.jar \
              com.google.zxing.client.j2se.CommandLineRunner %s' % \
              (settings.QR_READER_PATH, settings.QR_READER_PATH, img_path)
        
        self.logger.log(cmd)
        r  = os.popen(cmd)

        #result points:  2 on the top, one on the left:
        for line in r.readlines():
            val = line.strip()
            self.logger.log(val)
            if len(val.split('_')[0]) == 8:
                decoded = val
                continue
            p = parse_point(val)
            if p is not None:
                points.append(p)
        
        self.logger.log(points)
        
        #save rotated image:
        theta = self.get_rotation_angle(points)
    
        return decoded, theta
    
    def get_rotation_angle(self, points):
        if points is None or len(points) == 0: return None
        x, y = 0, 1
        a = points[1]
        b = points[2]
        c = points[0]
        distance = math.fabs(a[x]-b[x])
        
        #Find the degree of the rotation that is needed
        
        #b = [b[x]-0.1, b[y]]
        p = math.fabs(a[x]-b[x])
        q = math.fabs(a[y]-b[y])
        if p != 0:
            theta = math.degrees(math.atan(1.0*q/p))
            if theta == 0:
                if a[x]-b[x] > 0: theta = 180
                return theta
        else:
            theta = 90
            if a[y]-b[y] > 0: theta = -90
            return theta     
        
        #if rotated slightly, figure out angle:
        if b[x] < a[x] and a[y] < b[y]:
            theta = 180-theta
            self.logger.log('condition 1: %s' % (theta))
        elif b[x] < a[x] and b[y] < a[y]:
            theta = 180+theta
            self.logger.log('condition 2: %s' % (theta))
        elif a[x] < b[x] and b[y] < a[y]:
            theta = 360-theta
            self.logger.log('condition 3: %s' % (theta))
        
        return theta

    
    def read_qr(self, qr_rect):
        #this function tries to read the qr code and returns:
        # 1) the qr code
        # 2) the rotation angle of the qr code relative to the orientation
        #       on the original print
        # 3) whether it's page 1 or page 2 of a printed map
        self.logger.log('finding QR code from snippet...')

        if qr_rect is None:
            self.logger.log('No QR Rectangle could be found')
            return None, None
        
        #crop to QR Code image:
        self.logger.log("Cropping the QR Code....")
        qr_image = self.pil_image.copy()
        quad = Quadrilateral(qr_rect)
        #bbox = ImageUtilities.rect_to_pil_bbox(qr_rect)
        qr_image = qr_image.crop(quad.to_pil_bbox())
        
        #save the qr-code to disk, and read it:
        path = '%sqr_%s.png' % (self.mapimage.get_abs_directory_path(), 1)
        self.logger.log(path)
        qr_image.save(path)
        print_id, theta = self.execute_reader(path)
            
        #try again:
        if print_id is None:
            # sometimes, the qr-image needs to be resized to something smaller
            # (which is counter-intuitive to me) in order for it to be read:
            q = qr_image.copy()
            q.thumbnail([100, 100], Image.ANTIALIAS)
            path = '%sqr_%s.png' % (self.mapimage.get_abs_directory_path(), 2)
            self.logger.log(path)
            q.save(path)
            print_id, theta = self.execute_reader(path)
            
        #try reading the entire image:
        if print_id is None:
            # sometimes, the qr-image needs to be resized to something smaller
            # (which is counter-intuitive to me) in order for it to be read:
            q = self.pil_image.copy()
            path = '%sqr_whole_image_%s.png' % (self.mapimage.get_abs_directory_path(), 3)
            self.logger.log(path)
            q.save(path)
            print_id, theta = self.execute_reader(path)
            
        page_num = 1
        if print_id is not None and len(print_id.split('_')) == 2:
            page_num = int(print_id.split('_')[1])
            print_id = print_id.split('_')[0]
        
        #print print_id, theta, page_num
        return print_id, theta, page_num
    
        
class ImageUtils(General):
    @staticmethod
    def subtract_grayscale(img, threshold=20):        
        ## Threshold ~= max( max(R,G,B) - min(R,G,B) ) of grays.
        ## For a mapimage (high quality image), a threshold of 14 seems to work well.
        ## A value of 17 seems good and conservative for an indoor iPhoto.
        ## While 20, or 22, should be the max threshold even for poor quality photos
        
        ## split the image into individual bands
        source = img.split()
        R, G, B, A = 0, 1, 2, 3
        
        ## Create gray subtraction mask using the "difference" and "point" operations.
        ## The function given in the point operation sets all pixel values satisfying
        ## the expression (i <= threshold) to 255, else 0.    
        maskRG = ImageChops.difference(source[R],source[G]).point(lambda i: i <= threshold and 255)
        maskGB = ImageChops.difference(source[G],source[B]).point(lambda i: i <= threshold and 255)
        maskBR = ImageChops.difference(source[B],source[R]).point(lambda i: i <= threshold and 255)
        maskRGB = ImageChops.multiply(maskRG, maskGB)
        maskRGBR = ImageChops.multiply(maskRGB, maskBR)     
        
        ## Paste transparent white into gray areas of original image, as represented by mask
        img.paste((255,255,255,0),None,maskRGBR)
        return img
    
    @staticmethod
    def color_to_alpha(img, color):
        img = img.convert('RGBA')
        def difference1(source, color):
            """When source is bigger than color"""
            return (source - color) / (255.0 - color)
        
        def difference2(source, color):
            """When color is bigger than source"""
            return (color - source) / color
            
        width, height = img.size
    
        color = map(float, color)
        img_bands = [band.convert("F") for band in img.split()]
    
        # Find the maximum difference rate between source and color. I had to use two
        # difference functions because ImageMath.eval only evaluates the expression
        # once.
        alpha = ImageMath.eval(
            """float(
                max(
                    max(
                        max(
                            difference1(red_band, cred_band),
                            difference1(green_band, cgreen_band)
                        ),
                        difference1(blue_band, cblue_band)
                    ),
                    max(
                        max(
                            difference2(red_band, cred_band),
                            difference2(green_band, cgreen_band)
                        ),
                        difference2(blue_band, cblue_band)
                    )
                )
            )""",
            difference1=difference1,
            difference2=difference2,
            red_band = img_bands[0],
            green_band = img_bands[1],
            blue_band = img_bands[2],
            cred_band = color[0],
            cgreen_band = color[1],
            cblue_band = color[2]
        )
    
        # Calculate the new image colors after the removal of the selected color
        new_bands = [
            ImageMath.eval(
                "convert((img - color) / alpha + color, 'L')",
                img = img_bands[i],
                color = color[i],
                alpha = alpha
            )
            for i in xrange(3)
        ]
    
        # Add the new alpha band
        new_bands.append(ImageMath.eval(
            "convert(alpha_band * alpha, 'L')",
            alpha = alpha,
            alpha_band = img_bands[3]
        ))
    
        img = Image.merge('RGBA', new_bands)
        return img
    
class MapUtils(General):
    
    #Map types (be sure to sync w/overlays_wmsoverlay table):
    
    def __init__(self, mapimage, pil_image, logger):
        General.__init__(self)
        self.mapimage = mapimage
        self.pil_image = pil_image
        self.logger = logger
        self.image_quality_statistics = None
        self.map_rect = None
        self.color_threshold = 20
        
        #to be set:
        self.pil_image_color_to_alpha = None
        self.pil_image_grayscale_subtracted = None
        self.pil_image_hollowed_with_margins = None
        
        self.image_records = {}
        
        
    def process_map_image(self, map_rect):
        self.map_rect = Quadrilateral(map_rect, contract_by=12)
        
        #IMPORTANT: set processed_image to None or else "cascade delete" will
        #           delete the mapimage itself (cascade delete not customizable
        #           'til Django 1.3)
        #clear out all old map images:
        self.mapimage.processed_image = None
        self.mapimage.save()
        models.ImageOpts.objects.filter(source_mapimage=self.mapimage).delete()
        
        #get image statistics, to assist with color processing:
        self.stats = ImageQuality(self.pil_image, logger=self.logger)
        
        #perform color-to-alpha calc:
        self.pil_image_color_to_alpha = ImageUtils.color_to_alpha(
                                            self.pil_image.copy(),
                                            self.stats.brightest_cluster)
        
        #perform subtract grayscale calc:
        if self.stats.image_quality == ImageQuality.BAD_PHOTO:
            self.color_threshold = 30
        self.pil_image_grayscale_subtracted = ImageUtils.subtract_grayscale(
                                                self.pil_image.copy(),
                                                threshold=self.color_threshold)
        
        northeast, southwest, extents, img = self.generate_image_with_map_margins()
        self.pil_image_hollowed_with_margins = img
        
        ###########################
        #save images to database: # 
        ###########################
        types = ImageProcessingTypes
        
        #cropped original map
        img = self.map_rect.crop_to_shape(self.pil_image.copy(), rotate=True)
        self.image_records.update({
            types.ORIG: self.save_processed_image(img, types.ORIG)    
        })
        
        #original map with margins:
        img = self.pil_image
        self.image_records.update({
            types.WITH_MARGINS: self.save_processed_image(img, types.WITH_MARGINS,
                                    northeast=northeast, southwest=southwest,
                                    extents=extents)    
        })
        
        #color_to_alpha cropped:
        img = self.map_rect.crop_to_shape(self.pil_image_color_to_alpha.copy(), rotate=True)
        self.image_records.update({
            types.COLOR_TO_ALPHA: self.save_processed_image(img, types.COLOR_TO_ALPHA)    
        })
        
        #color_to_alpha full extent:
        img = self.pil_image_color_to_alpha
        self.image_records.update({
            types.COLOR_TO_ALPHA_WITH_MARGINS:
                self.save_processed_image(
                    img, types.COLOR_TO_ALPHA_WITH_MARGINS,
                    northeast=northeast, southwest=southwest, extents=extents)    
        })
        
        #color_to_alpha with solid margins:
        img = self.pil_image_color_to_alpha.copy()
        img.paste(self.pil_image_hollowed_with_margins, img.getbbox(),
                    mask=self.pil_image_hollowed_with_margins)
        self.image_records.update({
            types.COLOR_TO_ALPHA_WITH_SOLID_MARGINS:
                self.save_processed_image(
                    img, types.COLOR_TO_ALPHA_WITH_SOLID_MARGINS,
                    northeast=northeast, southwest=southwest, extents=extents)    
        })
        
        
        #grayscale_subtracted cropped:
        img = self.map_rect.crop_to_shape(self.pil_image_grayscale_subtracted.copy(),
                                          rotate=True)
        self.image_records.update({
            types.GRAYSCALE_SUBTRACTED: self.save_processed_image(
                                            img, types.GRAYSCALE_SUBTRACTED)    
        })
        
        #grayscale_subtracted full extent:
        img = self.pil_image_grayscale_subtracted
        self.image_records.update({
            types.GRAYSCALE_SUBTRACTED_WITH_MARGINS:
                self.save_processed_image(
                    img, types.GRAYSCALE_SUBTRACTED_WITH_MARGINS,
                    northeast=northeast, southwest=southwest, extents=extents)    
        })
        
        #grayscale_subtracted with solid margins:
        img = self.pil_image_grayscale_subtracted.copy()
        img.paste(self.pil_image_hollowed_with_margins, img.getbbox(),
                    mask=self.pil_image_hollowed_with_margins)
        self.image_records.update({
            types.GRAYSCALE_SUBTRACTED_WITH_SOLID_MARGINS:
                self.save_processed_image(
                    img, types.GRAYSCALE_SUBTRACTED_WITH_SOLID_MARGINS,
                    northeast=northeast, southwest=southwest, extents=extents)    
        })
        
        '''
        if self.stats.image_quality == ImageQuality.BAD_PHOTO:
            self.mapimage.processed_image = self.image_records.get(
                                        types.COLOR_TO_ALPHA_WITH_SOLID_MARGINS)
        else:
            self.mapimage.processed_image = self.image_records.get(
                                        types.GRAYSCALE_SUBTRACTED_WITH_SOLID_MARGINS)
        '''
        if self.stats.image_quality == ImageQuality.BAD_PHOTO:
            self.mapimage.processed_image = self.image_records.get(
                                        types.COLOR_TO_ALPHA)
        else:
            self.mapimage.processed_image = self.image_records.get(
                                        types.GRAYSCALE_SUBTRACTED)
    
    def generate_image_with_map_margins(self):
        from localground.apps.lib.helpers.units import Units
        from django.contrib.gis.geos import Polygon
        
        #determine the width of the map margins (given the current scaling):
        top, left, bottom, right = self.map_rect.get_margins(self.pil_image)
        
        #scale image to its original print size:
        zoom = self.mapimage.source_print.zoom
        old_width = self.mapimage.source_print.map_width
        old_height = self.mapimage.source_print.map_height
        
        self.logger.log('old width: %s, old height: %s, zoom: %s' \
                        % (old_width, old_height, zoom))

        #determine scale factor based on current cropped map:  how much should
        #current image size be increased / decreased?
        w, h = self.map_rect.get_width(), self.map_rect.get_height()
        sf_w = (1.0*old_width)/w
        sf_h = (1.0*old_height)/h
        self.logger.log('scale factor width: %s, scale factor height: %s' % (sf_w, sf_h))
        
        #scale margins:
        top, left, bottom, right = top*sf_h, left*sf_w, bottom*sf_h, right*sf_w

        
        center = self.mapimage.source_print.center
        northeast = Units.add_pixels_to_latlng(
                        center.clone(), zoom, int(1.0*old_width/2 + left),
                        int(-1.0*old_height/2 - top))
        southwest = Units.add_pixels_to_latlng(
                        center.clone(), zoom, int(-1.0*old_width/2 - right),
                        int(1.0*old_height/2 + bottom))
        bbox = (northeast.coords, southwest.coords)
        bbox = [element for tupl in bbox for element in tupl]
        extents = Polygon.from_bbox(bbox)
        
        #punch holes in image:
        hollowed_image = self.pil_image.copy()
        mask=Image.new('L', hollowed_image.size, color=255)
        draw=ImageDraw.Draw(mask) 
        draw.polygon(self.map_rect.to_cv_poly(), fill=0)
        hollowed_image.putalpha(mask)
        return northeast, southwest, extents, hollowed_image
    
            
    
    def save_processed_image(self, img, file_name, northeast=None, southwest=None,
                                extents=None):
        path = self.mapimage.get_abs_directory_path() + file_name
        self.logger.log('Saving map image and inserting to database: ' + path)
        img.save(path)
        
        p = self.mapimage.source_print
        map_image = models.ImageOpts(
            source_mapimage=self.mapimage,
            file_name_orig=file_name,
            zoom=p.zoom,
            host=self.mapimage.host,
            virtual_path=self.mapimage.virtual_path
        )
        
        if extents is not None: map_image.extents = extents
        else: map_image.extents = p.extents
        
        if northeast is not None: map_image.northeast = northeast
        else: map_image.northeast = p.northeast
        
        if southwest is not None: map_image.southwest = southwest
        else: map_image.southwest = p.southwest
        
        map_image.center = p.center
        
        map_image.save(user=self.mapimage.owner)
        return map_image
    
class ImageQuality():
    HIGH_QUALITY_SCAN =  4
    MEDIUM_QUALITY_SCAN = 3
    GOOD_PHOTO = 2
    BAD_PHOTO = 1
    
    def __init__(self, pil_image, logger=None, **kwargs):
        self.pil_image = pil_image
        self.logger = logger
        self.brightest_pixel = kwargs.get('brightest_pixel', None)
        self.brightest_cluster = kwargs.get('brightest_cluster', None)
        self.dif_brightest_pixel_brightest_cluster = kwargs.get(
            'dif_brightest_pixel_brightest_cluster', None)
        self.brightest_cluster_range = kwargs.get('brightest_cluster_range', None)
        self.image_quality = kwargs.get('image_quality', None)
        self.brightest_cluster_average = kwargs.get('brightest_cluster_average', None)
        
        self.init_image_statistics()
        
    def init_image_statistics(self):       
        import scipy          
        import scipy.misc      
        import scipy.cluster
        import struct
        import ImageStat
        
        self.logger.log('Getting image statistics...')
        
        #reduce image size to shorten processing time
        im = self.pil_image.copy()
        im.thumbnail([200, 200])

        stat = ImageStat.Stat(im)
        self.brightest_pixel = (stat.extrema[0][1], stat.extrema[1][1],
                            stat.extrema[2][1])

        
        ar = scipy.misc.fromimage(im)
        shape = ar.shape
        ar = ar.reshape(scipy.product(shape[:2]), shape[2])
        
        # Find clusters
        NUM_CLUSTERS = 5
        codes, dist = scipy.cluster.vq.kmeans(ar, NUM_CLUSTERS)
        
        # Identify brightest cluster
        clr_max = scipy.argmax(scipy.sum(codes,axis=1))
        self.brightest_cluster = codes[clr_max]
        self.brightest_cluster_average = int(scipy.mean(self.brightest_cluster))
        
        self.brightest_cluster_range = max(self.brightest_cluster)-min(self.brightest_cluster)             
        self.dif_brightest_pixel_brightest_cluster = (abs(scipy.sum(self.brightest_pixel) - scipy.sum(self.brightest_cluster)))/3
        
        if sum(self.brightest_cluster)/3 >= 250:
            self.image_quality =  ImageQuality.HIGH_QUALITY_SCAN
        elif sum(self.brightest_cluster)/3 >= 225 and diff_brpixel_brcluster <=10 and self.brightest_cluster_range <=10:
            self.image_quality =  ImageQuality.MEDIUM_QUALITY_SCAN
        elif diff_brpixel_brcluster <= 20 and self.brightest_cluster_range <=10:
            self.image_quality =  ImageQuality.GOOD_PHOTO
        else:
            self.image_quality =  ImageQuality.BAD_PHOTO
  