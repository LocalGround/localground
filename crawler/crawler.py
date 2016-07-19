#!/usr/bin/env python3
import urllib.request
import requests, json, time
from requests.auth import HTTPBasicAuth
from bs4 import BeautifulSoup
import datetime

def get_detail_links(url):
    response = urllib.request.urlopen(url)
    if not response: return
    soup = BeautifulSoup(response.readall())
    article_tags = soup.find_all('article')  #<a href="/courses">inner_text</a>
    links = article_tags[0].findAll('a')
    urls = []
    for link in links:
        try:
            url = link.attrs['href']
            if 'scholarships/detail/' in url:
                urls.append(url)
        except:
            pass
    return urls  

class Scholarship:
    source_url = None
    project_id = None
    title = 'Untitled'
    description = ''
    website = None
    year_of_need = None
    deadline = None
    max_award = None
    min_award = None
    num_awards = None
    eligibility = None
    
    def __init__(self, url, project_id):
        response = urllib.request.urlopen(url)
        if not response: return
        self.source_url = url
        self.project_id = project_id
        self.soup = BeautifulSoup(response.readall())
        self.parse_title()
        self.parse_description()
        self.parse_scholarship_url()
        self.parse_details()
    #parses for each div
    #look at page for reference
    #gets title

    #uses class to find the div
    def parse_title(self):
        try:
            self.title = self.soup.findAll("div", { "class" : "detailbox1" })[0].contents[0]
        except: pass

    def parse_description(self):
        try:
            import unicodedata
            d = self.soup.findAll("div", { "class" : "detailbox2" })[0]
            d = d.get_text()
            d = unicodedata.normalize('NFKD', d).encode('ascii', 'ignore')
            self.description = d[:999] #only get the first 1,000 characters
        except: pass
        
     #look at this because this does something different
    def parse_scholarship_url(self):
        try:
            d = self.soup.findAll("div", { "class" : "detailbox3" })[0]
            node = d.find_all("p")[6]
            self.website = node.find_all("a")[0].attrs['href']
        except: pass
    
    def parse_details(self):
        d = self.soup.findAll("div", { "class" : "detailbox3" })[0]
        self.deadline = self._get_val(d, 5)
        self.max_award = self._get_val(d, 4)
        self.min_award = self._get_val(d, 3)
        self.num_awards = self._get_val(d, 2)
        self.eligibility = self._get_val(d, 1)
        self.year_of_need = self._get_val(d, 0)
        node = d.find_all("p")[6]
        self.website = node.find_all("a")[0].attrs['href']
        
    def _get_val(self, div, index):
        try:
            node = div.find_all("p")[index]
            val = node.b.nextSibling
            val = val.replace('\n', '').strip()
            return val
        except:
            return None
        
    def save_to_database(self):
        lg_url = 'http://localhost:7777/api/0/forms/5/data/?accept=application/json'
        r = requests.post(
            lg_url,
            data=scholarship.to_dictionary(),
            auth=HTTPBasicAuth('lucio', 'blanco10')
        )
        if r.status_code == 201:
            message = 'SUCCESSFULLY INSERTED TO DATABASE'
            print('-'*len(message))
            print(message)
            print('-'*len(message))
        else:
            message = 'THERE WAS AN INSERT ERROR'
            print('-'*len(message))
            print(message)
            print('-'*len(message))
            print(r.text)
        
    def to_dictionary(self):
        return {
            'source_url': self.source_url,
            'title': self.title,
            'description': self.description,
            'website': self.website,
            'year_of_need': self.year_of_need,
            'deadline': self.deadline,
            'num_awards': self.num_awards,
            'eligibility': self.eligibility,
            'min_award': self.min_award,
            'max_award': self.max_award,
            'project_id': self.project_id,
            'min_award_num': self.convert_string_to_int(self.min_award),
            'max_award_num': self.convert_string_to_int(self.max_award),
            'deadline_date': self.convert_string_to_date(self.deadline)
        }
    
    def output(self):
        print('{0: >12}: {1}'.format('source_url', self.source_url))
        print('{0: >12}: {1}'.format('title', self.title))
        print('{0: >12}: {1}'.format('website', self.website))
        print('{0: >12}: {1}'.format('year_of_need', self.year_of_need))
        print('{0: >12}: {1}'.format('deadline', self.deadline))
        print('{0: >12}: {1}'.format('num_awards', self.num_awards))
        print('{0: >12}: {1}'.format('eligibility', self.eligibility))
        print('{0: >12}: {1}'.format('min_award', self.min_award))
        print('{0: >12}: {1}'.format('max_award', self.max_award))
        #print('{0: >12}: {1}'.format('description', self.description))

    def convert_string_to_int(self, stringInt):
        try:
            withoutCommas = stringInt.replace(",", "")
            return int(float(withoutCommas))
        except ValueError:
            return None

    def convert_string_to_date(self, stringDate):
        fmt = '%Y-%m-%d'
        try:
            date = datetime.datetime.strptime(stringDate, fmt)
            return date
        except ValueError:
            try:
                newString = stringDate.replace('0000','2015')
                date = datetime.datetime.strptime(newString, fmt)
                return date
            except:
                return None
        
    

links_to_crawl = [
    'http://www.collegescholarships.com/types/corporate-scholarships',
    #'http://www.collegescholarships.com/major-degree/accounting-scholarships',
    #'http://www.collegescholarships.com/major-degree/advertising-scholarships',
    #'http://www.collegescholarships.com/major-degree/computer-science-scholarships'
]

if __name__ == '__main__':
    f = open('linksCrawled.txt', 'w')
    detail_links = set()
    project_id = 5
    
    #STEP 1: Find all of the scholarship detail links:
    for link in links_to_crawl[:1]:
        print('getting detail links from {}...'.format(link))
        urls = get_detail_links(link)
        if urls is not None:
            detail_links.update(urls)
        
        #so you don't get blocked
        time.sleep(2)
    
    #STEP 2: Loop through each scholarship detail, extract important
    #        information, and save it to the database:


    #load into dictionary, if dict dont do, if it isnt add to dict

    
    i = 1
    for link in detail_links:
        scholarship = Scholarship(link, project_id)
        print('-'*100)
        scholarship.output()
        scholarship.save_to_database()
        time.sleep(2)
        f.write(link + '\n')
        i += 1
    f.close()

            

