#!/usr/bin/env python
import os, sys
from PIL import Image, ImageDraw, ImageChops, ImageMath, ImageOps
import cv, cv2, numpy, csv


path = '/usr/local/django/localground/jobs/stats/'
destination_path = '/media/psf/Berkeley/Fall 2012/PublicHealth245/FinalProject/'
R = None            #red band      
G = None            #green band      
B = None            #blue band      
BRIGHTNESS = None   #brightness   
MSR = None          #mean shift red
MSG = None          #mean shift green
MSB = None          #mean shift blue
MSBRIGHTNESS = None #mean shift brightness
RAT = None          #adaptive thresholding, red band   
GAT = None          #adaptive thresholding, green band   
BAT = None          #adaptive thresholding, blue band 
BRAT = None         #adaptive thresholding, brightness 
RSUB = None         #red minus brightness
GSUB = None         #green minus brightness
BSUB = None         #blue minus brightness
ACTUAL = None


def setup_environment():
   from django.core.management import setup_environ
   dirs = os.getcwd().split('/')
   settings_path = '/'.join(dirs[:len(dirs)-2])
   sys.path.append(settings_path)
   import settings
   setup_environ(settings)
   
def piltocv(pil_image):
    im = pil_image.convert('RGB')
    cv_image = cv.CreateImageHeader(im .size, cv.IPL_DEPTH_8U, 3)  # RGB image
    cv.SetData(cv_image, im .tostring(), im .size[0]*3)
    cv.CvtColor(cv_image, cv_image, cv.CV_RGB2BGR)
    return cv_image

def cvtopil(cv_image, mode="L"):
    #mode options: '1', 'CMYK', 'F', 'I', 'L', 'P', 'RGB', 'RGBA', 'RGBX', 'YCbCr'
    return Image.fromstring(mode, cv.GetSize(cv_image), cv_image.tostring())
    
def cv2tocv(cv2_image):
    source = cv2_image # source is numpy array 
    bitmap = cv.CreateImageHeader((source.shape[1], source.shape[0]), cv.IPL_DEPTH_8U, 3)
    cv.SetData(bitmap, source.tostring(), source.dtype.itemsize * 3 * source.shape[1])
    return bitmap
    
def cvtocv2(cv_image):
    return numpy.asarray(cv_image[:,:])
    
def write_to_file(file_path=path, file_name='output_sm.csv'):
    h, w = cv.GetSize(R) #returns # of rows (height), # of columns (width)
    actual_3band = Image.open(path + 'true.png')
    #resize image:
    #actual_3band = cvtopil(actual_3band)
    actual_3band.thumbnail([size,size], Image.NEAREST)
    actual_3band.save(path + 'true_scaled.png')
    actual_3band = piltocv(actual_3band)
    
    ACTUAL = cv.CreateImage(cv.GetSize(BRIGHTNESS), BRIGHTNESS.depth, 1)
    cv.CvtColor(actual_3band, ACTUAL, cv.CV_RGB2GRAY)
    header = [
        'ROW_NUM', 'COL_NUM', 'R', 'G', 'B', 'BRIGHTNESS', 'RSUB', 'GSUB', 'BSUB',
        'RAT', 'GAT', 'BAT', 'BRAT', 'MSR', 'MSG', 'MSB',
        'MSBRIGHTNESS', 'RSUBMS', 'GSUBMS', 'BSUBMS', 'PIXEL_DIFF',
        'PIXEL_MS_DIFF', 'ACTUAL'
    ]
    header_smaller = ['BRIGHTNESS', 'MSBRIGHTNESS', 'PIXEL_DIFF',
        'PIXEL_MS_DIFF', 'ACTUAL']
    data = []
    data_smaller = []
    print w, h, w*h
    #h, w = 10, 10
    #print w, h, w*h
    for y in range (0, h):
        for x in range (0, w):
            r, g, b = int(R[x, y]), int(G[x, y]), int(B[x, y])
            brightness = int(BRIGHTNESS[x, y])
            rsub, gsub, bsub = abs(r-brightness), abs(g-brightness), abs(b-brightness)
            msr, msg, msb = int(MSR[x, y]), int(MSG[x, y]), int(MSB[x, y])
            brightness_diff = rsub + gsub + bsub
            msbrightness = int(MSBRIGHTNESS[x, y])
            msrsub, msgsub, msbsub = abs(msr-msbrightness), abs(msg-msbrightness), abs(msb-msbrightness)
            msbrightness_diff = msrsub + msgsub + msbsub
            rat = int(1 if RAT[x, y] == 255 else 0)
            gat = int(1 if GAT[x, y] == 255 else 0)
            bat = int(1 if BAT[x, y] == 255 else 0)
            brat = int(1 if BRAT[x, y] == 255 else 0)
            actual = int(0 if ACTUAL[x, y] == 255 else 1)
            
            data.append([
                y, x, r, g, b, brightness, rsub, gsub, bsub,
                rat, gat, bat, brat, msr, msg, msb, msbrightness,
                msrsub, msgsub, msbsub, brightness_diff, msbrightness_diff, actual
            ])
            data_smaller.append([brightness, msbrightness, brightness_diff, msbrightness_diff, actual])
     
    with open('%s%s' % (destination_path, file_name), 'wb') as csvfile:
        csvwriter = csv.writer(csvfile, delimiter=',')
        csvwriter.writerow(header)
        for row in data:
            csvwriter.writerow(row)
            
    with open('%s%s' % (destination_path, 'output_rf.csv'), 'wb') as csvfile:
        csvwriter = csv.writer(csvfile, delimiter=',')
        csvwriter.writerow(header_smaller)
        for row in data_smaller:
            csvwriter.writerow(row)
    csvfile.close()
    


def threshold_image(pil_image, file_name):
    cv_i = piltocv(pil_image)
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
        cv.SaveImage("%sthresh_%s_%s.png" % \
                        (path, 'adaptive', band_names[idx]), dst)
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


#AT = adaptive thresholding
#SUB = band - grayscaled version of the band




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
    file_name = 'IMG_20110527_123020.jpg'
    size = 500
    pil_i = Image.open('%s%s' % (path, file_name))
    
    #img = cv2.imread('%s%s' % (path, file_name))
    #dst = cv.CreateImage(cv.GetSize(img), img.depth, 3)
    #img = cv2.reduce(img, 64, cv2.cv.CV_REDUCE_SUM, dst)
    #cv2.imwrite('%s%s' % (path, '__testing.png'))

    dir = file_name.split('.')[0]
    path = '%scanny/%s/' % (path, dir)
    try: os.mkdir(path)
    except: print '%s directory already exists' % path
    
    pil_i = pil_i.convert('RGBA')
    pil_i.thumbnail([size,size], Image.ANTIALIAS)
    
    #split channels:
    cv_i = piltocv(pil_i)
    R = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    G = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    B = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.Split(cv_i, R, G, B, None)
    
    #smooth the image with a Gaussian:
    cv_smoothed = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 3)
    cv.Smooth(cv_i, cv_smoothed, smoothtype=cv.CV_GAUSSIAN, param1=5, param2=3, param3=1, param4=0)
    pil_smoothed = cvtopil(cv_smoothed, mode='RGB')
    pil_smoothed.save('%sthumbnail_smoothed.png' % path)
    cv_i = piltocv(pil_smoothed)

    #convert to grayscale and subtract
    pil_grayscale =  ImageOps.grayscale(pil_smoothed)
    BRIGHTNESS = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.CvtColor(cv_i, BRIGHTNESS, cv.CV_RGB2GRAY)
    
    #perform mean shift filtering
    src = cvtocv2(cv_i)
    MSF = cvtocv2(cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 3))
    cv2.pyrMeanShiftFiltering(src, 30.0, 30.0, MSF) #source, spatial radius, color radius, destination
    cv.SaveImage('%sthresh_%s_%s.png' % (path, 'meanshift', 'r'), MSF)
    
    #split MSF to individual bands
    MSF = cv2tocv(MSF)
    MSR = cv.CreateImage(cv.GetSize(MSF), cv_i.depth, 1)
    MSG = cv.CreateImage(cv.GetSize(MSF), cv_i.depth, 1)
    MSB = cv.CreateImage(cv.GetSize(MSF), cv_i.depth, 1)
    MSBRIGHTNESS = cv.CreateImage(cv.GetSize(MSF), cv_i.depth, 1)
    cv.CvtColor(MSF, MSBRIGHTNESS, cv.CV_RGB2GRAY)
    cv.Split(MSF, MSR, MSG, MSB, None)
    
    #perform adaptive thresholding:
    window_size, adaptive_threshold = 51, 20
    d = {'r': R, 'g': G, 'b': B, 'br': BRIGHTNESS}
    for key, val in d.items():
        src = val
        dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
        cv.Set(dst, cv.CV_RGB(255, 255, 255))
        cv.AdaptiveThreshold(src, dst, 255, cv.CV_ADAPTIVE_THRESH_MEAN_C,
                            cv.CV_THRESH_BINARY_INV, window_size, adaptive_threshold)
        cv.SaveImage('%sthresh_%s_%s.png' % (path, 'adaptive', key), dst)
        if key == 'r':
            RAT = dst
        elif key == 'g':
            GAT = dst
        elif key == 'b':
            BAT = dst
        else:
            BRAT = dst
    
    write_to_file(file_path=path)
    
    