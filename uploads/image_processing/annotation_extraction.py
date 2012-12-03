#!/usr/bin/env python
import os, sys
import Image, ImageDraw, ImageChops, ImageMath, ImageOps
import cv

def setup_environment():
   from django.core.management import setup_environ
   dirs = os.getcwd().split('/')
   settings_path = '/'.join(dirs[:len(dirs)-2])
   sys.path.append(settings_path)
   import settings
   setup_environ(settings)
   
def pil2cv(pil_image):
    im = pil_image.convert('RGB')
    cv_image = cv.CreateImageHeader(im .size, cv.IPL_DEPTH_8U, 3)  # RGB image
    cv.SetData(cv_image, im .tostring(), im .size[0]*3)
    cv.CvtColor(cv_image, cv_image, cv.CV_RGB2BGR)
    return cv_image

def cv2pil(cv_image, mode="L"):
    #mode options: '1', 'CMYK', 'F', 'I', 'L', 'P', 'RGB', 'RGBA', 'RGBX', 'YCbCr'
    return Image.fromstring(mode, cv.GetSize(cv_image), cv_image.tostring())
   
def calculate_histogram(img):
    histHeight = 500            # Height of the histogram
    histWidth = 1000             # Width of the histogram
    multiplerValue = 1.5        # The multiplier value basically increases
                                # the histogram height so that love values
                                # are easier to see, this in effect chops off
                                # the top of the histogram.
    showFstopLines = True       # True/False to hide outline
    fStopLines = 5
    
    
    # Colours to be used
    backgroundColor = (51,51,51)    # Background color
    lineColor = (102,102,102)       # Line color of fStop Markers 
    red = (255,60,60)               # Color for the red lines
    green = (51,204,51)             # Color for the green lines
    blue = (0,102,255)              # Color for the blue lines

    hist = img.histogram()
    histMax = max(hist)
    xScale = float(histWidth)/len(hist)                     # xScaling
    yScale = float((histHeight)*multiplerValue)/histMax     # yScaling 
    
    
    im = Image.new("RGBA", (histWidth, histHeight), backgroundColor)   
    draw = ImageDraw.Draw(im)
    
    
    # Draw Outline is required
    if showFstopLines:    
        xmarker = histWidth/fStopLines
        x =0
        for i in range(1,fStopLines+1):
            draw.line((x, 0, x, histHeight), fill=lineColor)
            x+=xmarker
        draw.line((histWidth-1, 0, histWidth-1, 200), fill=lineColor)
        draw.line((0, 0, 0, histHeight), fill=lineColor)
    
    
    # Draw the RGB histogram lines
    x=0; c=0;
    for i in hist:
        if int(i)==0: pass
        else:
            color = red
            if c>255: color = green
            if c>511: color = blue
            draw.line((x, histHeight, x, histHeight-(i*yScale)), fill=color)        
        if x>255: x=0
        else: x+=1
        c+=1
    
    # Now save and show the histogram    
    im.save('histogram.png', 'PNG')
    im.show()
    
def threshold_image(pil_image, file_name):
    cv_i = pil2cv(pil_image)
    #calculate_histogram(pil_image)
    #split channels:
    r = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    g = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    b = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    #cv.Histogram(r)
    #cv.Split(cv_i, r, g, b, None)
    #return
    #calculate image brightness:
    cv_brightness = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.AddWeighted(r, 1./3., g, 1./3., 0.0, cv_brightness)
    cv.AddWeighted(cv_brightness, 2./3., b, 1./3., 0.0, cv_brightness)
    
    cv_union = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.Set(cv_union, cv.CV_RGB(0, 0, 0));
    band_names = ['r','g','b']
    idx = 0
    cutoff = 15
    print cv.GetSize(cv_i), cv_i.depth
    for band in [r, g, b]:
        dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
        cv.AdaptiveThreshold(band, dst, 255, cv.CV_ADAPTIVE_THRESH_MEAN_C,
                                cv.CV_THRESH_BINARY, 75, 10)
        cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
                        ('adaptive', band_names[idx]), dst)
        '''for threshold in range(0, 21, 1):
            dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
            #cv.Threshold(band, dst, threshold, 255, cv.CV_THRESH_BINARY )
            cv.AdaptiveThreshold(band, dst, 255, cv.CV_ADAPTIVE_THRESH_MEAN_C,
                                cv.CV_THRESH_BINARY, 25, 1)
            if threshold == cutoff:
                cv.Or(cv_union, dst, cv_union)
            cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
                        (band_names[idx], threshold), dst)'''
        idx += 1
    cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/%s_mask.png" % file_name, cv_union)

if __name__ == '__main__':
    setup_environment()
    '''
    file_name = 'pdf019.png'
    file_name = 'may.jpg'
    file_name = 'photo.jpg'
    file_name = 'castleimaginepage1.jpg'
    file_name = 'alejandro.jpg'
    file_name = 'bobbiecehimap.png'
    file_name = 'EPSON016.JPG'
    file_name = 'downtownnevadacitypage1.jpg'
    file_name = 'DSCN0267.JPG'
    file_name = 'photo.JPG'
    file_name = 'IMG_20110427_132643.jpg' #cal sailing club (boats)
    file_name = 'IMG_20110527_123020.jpg' #Tibet - sunshine
    file_name = '3cj8q5np_photo.jpg' #bad photo
    '''
    file_name = 'pdf019.png'
    
    pil_i = Image.open('/usr/local/django/localground/jobs/stats/%s' % file_name)
    pil_i = pil_i.convert('RGBA')
    pil_i.thumbnail([1000,1000], Image.ANTIALIAS)
    cv_i = pil2cv(pil_i)
    
    #smooth the image with a Gaussian:
    cv_smoothed = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 3)
    cv.Smooth(cv_i, cv_smoothed, smoothtype=cv.CV_GAUSSIAN, param1=5, param2=3, param3=1, param4=0)
    pil_smoothed = cv2pil(cv_smoothed, mode='RGB')

    #convert to grayscale and subtract
    pil_grayscale =  ImageOps.grayscale(pil_smoothed)
    pil_grayscale = pil_grayscale.convert('RGB')
    pil_subtracted = ImageChops.subtract(pil_smoothed, pil_grayscale)
    
    #brightness mask:
    cv_i = pil2cv(pil_smoothed)
    #split channels:
    r = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    g = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    b = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.Split(cv_i, r, g, b, None)
    
    window_size, adaptive_threshold = 51, 20
    dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.AdaptiveThreshold(r, dst, 255, cv.CV_ADAPTIVE_THRESH_MEAN_C,
                            cv.CV_THRESH_BINARY_INV, window_size, adaptive_threshold)
    cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
                        ('adaptive', 'r'), dst)
    mask = dst
    dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 3)
    cv.Set(dst, cv.CV_RGB(255, 255, 255))
    orig = pil2cv(pil_i)
    cv.Copy(orig, dst, mask)
    cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
                        ('a_mask', 'r'), dst)
    
    dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.AdaptiveThreshold(g, dst, 255, cv.CV_ADAPTIVE_THRESH_MEAN_C,
                            cv.CV_THRESH_BINARY_INV, window_size, adaptive_threshold)
    cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
                        ('adaptive', 'g'), dst)
    
    dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.AdaptiveThreshold(b, dst, 255, cv.CV_ADAPTIVE_THRESH_MEAN_C,
                            cv.CV_THRESH_BINARY_INV, window_size, adaptive_threshold)
    cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
                        ('adaptive', 'b'), dst)
    
    #meanshift filtering:
    #dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 3)
    import cv2,  numpy
    src = cv2.imread('/usr/local/django/localground/jobs/stats/%s' % file_name)
    dst = cv2.imread('/usr/local/django/localground/jobs/stats/%s' % file_name)
    #dst = cv.createImage(cv.etSize(cv_i), cv_i.depth, 1)
    #dst = cv2.pyrMeanShiftFiltering(src, 10.0, 35.0, 3)
    #dst = numpy.empty(cv.GetSize(cv_i))
    #src = cv2.imread('/usr/local/django/localground/jobs/stats/%s' % file_name)
    #dst = cv2.createImage(cv.GetSize(cv_i), cv_i.depth, 1)
   # print cv.PyrMeanShiftFiltering(src, 5.0)
    #print src, dst
    #dst = cv2.createImage(cv.getSize(src), src.depth, 3)
    #print cv2.pyrMeanShiftFiltering(src, 10.0, 35.0, 3)
    cv2.pyrMeanShiftFiltering(src, 20.0, 35.0, dst)
    cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
                        ('meanshift', 'r'), dst)
    #seq = []
    #seq = cv.PyrSegmentation(cv_i, dst, cv.CreateMemStorage(), 1, 1, 1)
    #cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
    #                    ('meanshift', 'r'), dst)
    '''
    
    #calculate image brightness:
    cv_brightness = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.AddWeighted(r, 1./3., g, 1./3., 0.0, cv_brightness)
    cv.AddWeighted(cv_brightness, 2./3., b, 1./3., 0.0, cv_brightness)
    
   
    threshold_image(pil_subtracted, file_name.split('.')[0])
    
    '''
    dst = cv.CreateImage(cv.GetSize(cv_smoothed), cv.IPL_DEPTH_16S, 3)
    laplace = cv.Laplace(cv_smoothed, dst)
    cv.SaveImage("/usr/local/django/localground/jobs/stats/__laplace.png", dst)
    '''
    
    #can't figure out how to convert the laplacian back to PIL
    #pil_laplace = cv2pil(dst, mode='RGB')
    #pil_laplace.show()

    
    '''
    
    
    '''
    X-Variables:
    *AT = adaptive thresholding
    *SUB = band - grayscaled version of the band
    R, G, B, Brightness, RAT, GAT, BAT, RSUB, GSUB, BSUB, Y
    
    h, w = cv.GetSize(r) #returns # of rows (height), # of columns (width)
    header = ['ROW_NUM', 'COL_NUM', 'R', 'G', 'B']
    data = []
    print w, h, w*h
    for y in range (0, h):
        for x in range (0, w):
            data.append([y, x, int(r[x, y]), int(g[x, y]), int(b[x, y])])
     
    import csv
    with open('/usr/local/django/localground/jobs/stats/canny/aaadata.csv', 'wb') as csvfile:
        csvwriter = csv.writer(csvfile, delimiter=',')
        csvwriter.writerow(header)
        for row in data:
            csvwriter.writerow(row)
    csvfile.close()
    '''

