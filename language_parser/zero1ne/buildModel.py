import pickle

import gensim
import sklearn
import numpy as np
import pandas as pd
from gensim.models import Doc2Vec
from gensim.models.doc2vec import TaggedDocument
from random import shuffle
import pandas as pd
from konlpy.tag import Okt
print('gensim  version = {}'.format(gensim.__version__))
print('sklearn version = {}'.format(sklearn.__version__))

dataset_path = 'kor_data.csv'
remove_item = ('','Conjunction','Verb','Determiner', 'Exclamation','Josa','Punctuation','Suffix', 'Foreign', 'Number','Adverb')
pos_tagger = Okt()

def tokenize(doc):
    return ['/'.join(t) for t in pos_tagger.pos(doc, norm=True, stem=True)]

def main(dataset_path, remove_item, vector_size=100, window=10, min_count=1, epochs=500):
    df = pd.read_csv(dataset_path)
    docs = list(df['디스크립션'])
    train_docs = [tokenize(row) for row in docs]
    trained_docs_list = []
    for item in train_docs:
        dummy = []
        for indi in item:
            if (indi.split('/')[1] not in remove_item):
                dummy.append(indi.split('/')[0])
        trained_docs_list.append(dummy)
    
    df['text'] = trained_docs_list
    zipdata = zip(df['프로젝트명'],df['text'])
    tagged_data = [TaggedDocument(words=_d, tags=[str(i)]) for i, _d in zipdata]
    model = gensim.models.Doc2Vec(vector_size=100, window=10, min_count=1, workers=8, alpha=0.025, min_alpha=0.015, 
                                epochs=500)
    #sample=1e-4, negative=5
    #shuffling is better (ot needed at each trianing epoch
    shuffle(tagged_data)
    #Build vocabulary from a sequence of sentences 
    model.build_vocab(tagged_data)
    #Update the model’s neural weights from a sequence of sentences
    model.train(tagged_data, epochs=model.epochs, total_examples=model.corpus_count)

    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)

main(dataset_path, remove_item)