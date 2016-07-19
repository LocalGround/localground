#!/usr/bin/env python3

# use urllib to get the header information for a web page at location url
import urllib.request
import urllib.parse
import urllib.robotparser
from bs4 import BeautifulSoup
import time

def get_links(id, url):
    response = urllib.request.urlopen(url)
    if not response: return
    soup = BeautifulSoup(response.readall())
    
    article_tags = soup.find_all('article')  #<a href="/courses">inner_text</a>
    links = article_tags[0].findAll('a')
    urls = []
    for link in links:
        try:
            url = link.attrs['href']
            if url[0] == '/':
                url = 'http://www.collegescholarships.com' + url
            urls.append(url)
        except:
            pass
        print(url)
    return urls
        
def convert_string_to_list_of_words(string_of_words):
    import string
    for p in string.punctuation:
        string_of_words = string_of_words.replace(p, '')
    string_of_words = string_of_words.replace('\n', ' ')
    return list(set(string_of_words.split(' ')))

def SetRobotsChecker(robot_url):
    '''
    This function uses the "RobotFileParser," which is just a helper object that
    provides you with some methods for reading and checking whether a webpage
    can be crawled.
    '''
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(robot_url)
    rp.read()
    return rp

def OkToCrawl(rp, url):
    '''
    Returns True if the crawler is not prohibited from crawling the webpage,
    False otherwise.  Please open up the robots.txt file to understand how
    the file indicates whether or not various pages should be crawled.
    '''
    return rp.can_fetch("*", url)

if __name__ == '__main__':
    # 1) Examining the robots.txt file on the iSchool website:
    robots_url = 'http://ischool.berkeley.edu/robots.txt'
    rp = SetRobotsChecker(robots_url)
    
    # 2) Crawl the ischool webpage, and print some links:
    # Check if it's OK to crawl:
    counter = 0
    #https://colleges.niche.com/scholarships/career/advertising-and-pr/
    links_to_crawl = ['http://www.collegescholarships.com/types/corporate-scholarships']
    links_already_crawled = []
    while len(links_to_crawl) > 0 and counter < 5:
        current_link = links_to_crawl[0]
        links_already_crawled.append(current_link)
        del links_to_crawl[0]
        
        if OkToCrawl(rp, current_link):
            #first, go out to current_link and get relevant information.
            print('getting {}...'.format(current_link))
            urls = get_links(counter, current_link)
            
            #add any links on the current_link page to out master links to crawl
            for url in urls:
                if url not in links_already_crawled:
                    links_to_crawl.append(url)
            counter += 1
            time.sleep(2)

            

