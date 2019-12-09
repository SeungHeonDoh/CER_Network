import json
import pandas as pd
import nltk
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

import re 
import gensim
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from collections import namedtuple
from random import shuffle

nltk.download('stopwords')
nltk.download('wordnet')

def docs_preprocessor(docs):
    tokenizer = RegexpTokenizer(r'\w+')
    docs = docs.lower()  # Convert to lowercase.
    docs = tokenizer.tokenize(docs)  # Split into words.
    docs = [w for w in docs if not w in stopwords.words('english')]
    # Remove numbers, but not words that contain numbers.
    docs = [token for token in docs if not token.isdigit()]
    # Remove words that are only one character.
    docs = [token for token in docs if len(token) > 1]
    # Lemmatize all words in documents.
    lemmatizer = WordNetLemmatizer()
    docs = [lemmatizer.lemmatize(token) for token in docs]

    return docs


def make_model(df):
    zipdata = zip(df['author'],df['abstract'])
    tagged_data = [TaggedDocument(words=_d, tags=[str(i)]) for i, _d in zipdata]

    model = gensim.models.Doc2Vec(vector_size=50, window=10, min_count=1, workers=8, alpha=0.025, min_alpha=0.015, 
                                epochs=500)
    #shuffling is better (ot needed at each trianing epoch
    shuffle(tagged_data)
    #Build vocabulary from a sequence of sentences 
    model.build_vocab(tagged_data)
    #Update the model’s neural weights from a sequence of sentences
    model.train(tagged_data, epochs=model.epochs, total_examples=model.corpus_count)
    col = model.docvecs.index2entity
    return model, col


def author2author(model,col,theshold = 0.6):
    author2author =[]
    for i in col:
        for n,v in model.docvecs.most_similar(i, topn=101):
            if v > theshold:
                documents = {}
                documents['source'] = i
                documents['target'] = n
                author2author.append(documents)

    return author2author

def author2keyword(df,model,col):
    author2keyword = []
    for i in range(len(df)):
        for j in df.iloc[i]['keyword']:
            documents = {}
            documents['source'] = df.iloc[i]['author']
            documents['target'] = j.replace('keywords: ','')
            author2keyword.append(documents)
    return author2keyword

def node(df, add_keyword=False):
    node = []
    for i in range(len(df)):
        documents = {}
        documents['id'] = df.iloc[i]['author']
        documents['label'] = 'author'
        node.append(documents)

        if add_keyword:
            for j in df.iloc[i]['keyword']:
                keydoc = {}
                keydoc['id'] = j
                keydoc['label'] = 'keyword'
                node.append(keydoc)

    return node


    

def main(json = 'result.json'):
    df = pd.read_json(json)
    df = df.T

    for idx, i in enumerate(df['keyword']):
        temp =[]
        for j in i:
            j = j.lower()
            j.replace("keywords: ","")
            temp.append(j)
        df.iloc[idx]['keyword'] = temp

    for idx, i in enumerate(df['abstract']):
        abstract = docs_preprocessor(i)
        df.iloc[idx]['abstract'] = abstract

    model, col= make_model(df)
    authorlink = author2author(model, col)
    # author2keyword = author2keyword(df,model,col)
    authornode = node(df, add_keyword=False)

    print("Number of Author2Author Links: ",len(authorlink))
    print("Number of Author Node: ",len(authornode))

    with open('node.json', 'w') as f:
        json.dump(authornode , f, indent='\t')
        
    with open('author2author.json', 'w') as f:
        json.dump(authorlink , f, indent='\t')
    
    # with open('author2keyword.json', 'w') as f:
    #     json.dump(author2keyword , f, indent='\t')

main()
print("finsh")




