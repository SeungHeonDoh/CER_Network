import datetime
import json
import re
import sys
import time
from bs4 import BeautifulSoup
import requests
from time import sleep

def ISEAurls(url = "http://www.isea-archives.org/isea2019-presentations/"):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    names = []
    urls = []
    link = []
    for i in soup.findAll('a'):
        link.append(i)
        
    for i in link:
        name = i.getText()
        url = i.attrs['href']
        names.append(name)
        urls.append(url)

    names = names[39:160]
    urls = urls[39:160]

    return names, urls


def get_list(url):    
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    keyword = []
    abstract = []
    author = soup.find('h1',{"entry-title"}).getText().split('Paper: ')[1].split(' — ')[0]
    papername = soup.find('h1',{"entry-title"}).getText().split('Paper: ')[1].split(' — ')[1]
    for idx, i in enumerate(soup.find('div',{"entry-content"}).findAll('p')):
        if idx == 1:
            keyword.append(i.getText().replace('Keywords: ','').replace('\xa0',' ').split(', '))
        elif idx == 2:
            abstract.append(i.getText().replace('\xa0',' '))
    for a,b in zip(keyword, abstract):
        document ={}
        document['keyword']=a
        document['abstract']=b
    document['author'] = author
    document['papername'] = papername
    
    return document

def main():
    names, urls =  ISEAurls()
    final_db = {}
    for idx, i in enumerate(urls):
        try:
            doc = get_list(i)
            final_db[str(idx)] = doc
            sleep(0.5)
        except:
            continue
    
    with open('result.json', 'w') as fp:
        json.dump(final_db, fp)

main()