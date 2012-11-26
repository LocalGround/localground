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
    
    
def threshold_image(pil_image, file_name):
    cv_i = pil2cv(pil_image)
    #split channels:
    r = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    g = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    b = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.Split(cv_i, r, g, b, None)
    
    #calculate image brightness:
    cv_brightness = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    cv.AddWeighted(r, 1./3., g, 1./3., 0.0, cv_brightness)
    cv.AddWeighted(cv_brightness, 2./3., b, 1./3., 0.0, cv_brightness)
    
    cv_union = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
    band_names = ['r','g','b']
    idx = 0
    cutoff = 15
    for band in [r, g, b]:
        for threshold in range(0, 21, 1):
            dst = cv.CreateImage(cv.GetSize(cv_i), cv_i.depth, 1)
            cv.Threshold(band, dst, threshold, 255, cv.CV_THRESH_BINARY )
            if threshold == cutoff:
                cv.Or(cv_union, dst, cv_union)
            #cv.SaveImage("/usr/local/django/localground/jobs/stats/canny/thresh_%s_%s.png" % \
            #            (band_names[idx], threshold), dst)
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
    '''
    file_name = 'DSCN0267.JPG'
    
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

    
    

