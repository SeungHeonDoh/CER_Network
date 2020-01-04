import pickle
import gensim
import numpy as np
import pandas as pd
from gensim.models import Doc2Vec
from gensim.models.doc2vec import TaggedDocument
from konlpy.tag import Okt

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

import json
import collections


dataset_path = './dataset/kor_data.csv'
model_path = './dataset/model.pkl'
remove_item = ('','Conjunction','Verb','Determiner', 'Exclamation','Josa','Punctuation','Suffix', 'Foreign', 'Number','Adverb')
pos_tagger = Okt()

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

def embedding(x, method='tsne', perplexity=10):
    if method == 'pca':
        trainer = PCA(n_components=2)
    else:
        trainer = TSNE(n_components=2, perplexity=perplexity)
    return trainer.fit_transform(x)


def get_similarity(df_similarity, query, new_art, new_doc, idx_to_vocab, top_n = 5):
    artist_index = len(new_art)
    doc_index = len(new_doc)
    word_index = len(idx_to_vocab)

    artist_top5 = df_similarity[query].iloc[:artist_index].sort_values(ascending=False)[1:top_n+1]
    artist_result = []
    for idx,sim in zip(artist_top5.index,artist_top5.values):
        documents = {}
        documents['key'] = new_art[idx]
        documents['similarity'] = sim
        artist_result.append(documents)
        
    doc_top5 = df_similarity[query].iloc[artist_index:artist_index+doc_index].sort_values(ascending=False)[1:top_n+1]
    doc_result = []
    for idx,sim in zip(doc_top5.index, doc_top5.values):
        documents = {}
        documents['key'] = new_doc[idx-artist_index]
        documents['similarity'] = sim
        doc_result.append(documents)
        
    word_top5 = df_similarity[query].iloc[artist_index+doc_index:].sort_values(ascending=False)[1:top_n+1]
    word_result = []
    for idx,sim in zip(word_top5.index, word_top5.values):
        documents = {}
        documents['key'] = idx_to_vocab[idx-artist_index-doc_index]
        documents['similarity'] = sim
        word_result.append(documents)
    
    return artist_result, doc_result, word_result


def get_artist_db(df, query):
    query = query.split('_')[1]
    project = list(df[df['작가명']== query]['프로젝트명'])
    inside = list(df[df['작가명']==query]['내부파트너'].dropna().unique())
    outside = list(df[df['작가명']==query]['외부파트너'].dropna().unique())
    media = list(df[df['작가명']==query]['매체'].dropna().unique())
    
    key_list = []
    keyword = ""
    for i in list(df[df['작가명']==query]['키워드'])[0]:
        if i != '#':
            keyword = keyword + i
        elif len(keyword) > 1:
            key_list.append(keyword.strip())
            keyword = ""
    
    documents = {}
    documents['id'] = query
    documents['project'] = project
    documents['key_list'] = key_list
    documents['media'] = media
    documents['inside'] = inside
    documents['outside'] = outside
    return documents

def get_project_db(df, query, df_similarity, new_art, new_doc, idx_to_vocab):
    sim_query = query
    query = query.split('_')[1]
    artist = df[df['프로젝트명']== query]['작가명'].values[0]
    descrtibe = list(df[df['프로젝트명']== query]['디스크립션'])[0]
    inside = list(df[df['프로젝트명']== query]['내부파트너'].dropna().unique())
    outside = list(df[df['프로젝트명']== query]['외부파트너'].dropna().unique())
    keyword_list = df[df['프로젝트명']== query]['text'].values[0]
    keyword = collections.Counter(keyword_list).most_common(5)
    year = df[df['프로젝트명']== query]['년도'].values[0]
    sim_art,sim_doc,sim_word = get_similarity(df_similarity, sim_query , new_art, new_doc, idx_to_vocab)
    
    documents = {}
    documents['id'] = query
    documents['artist'] = artist
    documents['descrtibe'] = descrtibe
    documents['inside'] = inside
    documents['outside'] = outside
    documents['keyword'] = keyword
    documents['year'] = year
    documents['sim_doc'] = sim_doc
    documents['sim_word'] = sim_word
    
    return documents

def get_keyword_db(df, query, df_similarity, new_art, new_doc, idx_to_vocab):
    use_artist = []
    use_project = []

    for idx,i in enumerate(df['text']):
        if query in i:
            use_artist.append(df.iloc[idx]['작가명'])
            use_project.append(df.iloc[idx]['프로젝트명'])
    
    sim_art,sim_doc,sim_word = get_similarity(df_similarity, query , new_art, new_doc, idx_to_vocab)
    
    documents = {}
    documents['id'] = query
    documents['use_artist'] = list(set(use_artist))
    documents['use_project'] = list(set(use_project))
    documents['sim_art'] = sim_art
    documents['sim_doc'] = sim_doc
    documents['sim_word'] = sim_word
    
    return documents


def artist_vec(artist, df, dv, wv, idx_to_doc, idx_to_vocab, tagged_data):
    project = pd.DataFrame(dv, index=idx_to_doc)
    word = pd.DataFrame(wv, index=idx_to_vocab)
    allvector = []
    for i in list(df[df['작가명'] == artist]['프로젝트명']):
        allvector.append(project.loc[str(i)])
#         for word_vec, name in tagged_data:
#             if i == name[0]:
#                 for j in word_vec:
#                     allvector.append(word.loc[str(j)])
    np_all = np.array(allvector)
    artist_vec = np.mean(np_all, axis=0)
    return artist_vec

def makeUniqe(doc,docType='Project'):
    new_doc = []
    for i in doc:
        new_name =docType + '_' + i
        new_doc.append(new_name)
    return new_doc

def tokenize(doc):
    return ['/'.join(t) for t in pos_tagger.pos(doc, norm=True, stem=True)]

def changeTokenize(dataset_path, remove_item):
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
    return df

def main(model_path, dataset_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    df = pd.read_csv(dataset_path)
    df = changeTokenize(dataset_path, remove_item)

    zipdata = zip(df['프로젝트명'],df['text'])
    tagged_data = [TaggedDocument(words=_d, tags=[str(i)]) for i, _d in zipdata]

    wv = model.wv.vectors
    dv = model.docvecs.vectors_docs
    idx_to_doc = model.docvecs.index2entity
    idx_to_vocab = model.wv.index2word

    artist = list(df['작가명'].unique())
    artist_100 = []
    for i in artist:
        artist_100.append(artist_vec(i, df, dv, wv, idx_to_doc, idx_to_vocab, tagged_data))
    av = np.array(artist_100)

    new_doc = makeUniqe(idx_to_doc,'Project')
    new_art = makeUniqe(artist,'Artist')

    artist_index = len(new_art)
    doc_index = len(idx_to_doc)
    word_index = len(idx_to_vocab)
    entity_list = new_art + new_doc + idx_to_vocab
    vec100 = np.vstack([av, dv, wv])

    df_total = pd.DataFrame(vec100, index=entity_list)
    temp = cosine_similarity(df_total)
    df_similarity = pd.DataFrame(temp, columns=entity_list)

    z_merge = embedding(np.vstack([wv, dv]), 'tsne')
    z_wv = z_merge[:wv.shape[0]]
    z_dv = z_merge[wv.shape[0]:]
    z_av = []
    for i in artist:
        z_av.append(artist_vec(i, df, z_dv, z_wv, idx_to_doc, idx_to_vocab, tagged_data))
    z_av = np.array(z_av)


    group_a = []
    for i in range(len(artist)):
        group_a.append('artist')
    group_w = []
    for i in range(len(idx_to_vocab)):
        group_w.append('word')
    group_p = []
    for i in range(len(new_doc)):
        group_p.append('project')

    col = ['key','id','x','y','Group']
    artist_data = {'key':new_art,'id':artist, 'x':z_av.T[0],'y':z_av.T[1],'Group': group_a}
    doc_data = {'key':new_doc,'id':idx_to_doc,'x':z_dv.T[0],'y':z_dv.T[1],'Group': group_p}
    word_data = {'key':idx_to_vocab,'id':idx_to_vocab,'x':z_wv.T[0],'y':z_wv.T[1],'Group': group_w}

    a = pd.DataFrame(artist_data, columns=col)
    b = pd.DataFrame(doc_data, columns=col)
    c = pd.DataFrame(word_data, columns=col)
    total = pd.concat([a,b,c])

    attribute_a = []
    for i in new_art:
        attribute_a.append(get_artist_db(df, i))
        
    attribute_d = []
    for i in new_doc:
        attribute_d.append(get_project_db(df, i, df_similarity, new_art, new_doc, idx_to_vocab))
        
    attribute_w = []
    for i in idx_to_vocab:
        attribute_w.append(get_keyword_db(df, i, df_similarity, new_art, new_doc, idx_to_vocab))

    attribute = attribute_a + attribute_d + attribute_w
    total['attritube'] = attribute
    total_dic = total.to_dict('record')

    # Your codes .... 
    with open('./nodeLink/node.json', 'w', encoding='UTF-8') as outfile:
        outfile.write(json.dumps(total_dic, cls=NpEncoder, ensure_ascii=False, indent=4))

    main_link = []
    sub_link = []
    for i in range(len(total)):
        key = total.iloc[i]['key']
        attribute = total.iloc[i]['attritube']
        if key in new_art:
            for j in attribute['project']:
                documents = {}
                documents['source'] = key
                documents['target'] = 'Project_'+j
                documents['strength'] = 1
                documents['Type'] = 'main'
                main_link.append(documents)
            if type(attribute['inside']) is list:
                try:
                    inlist = attribute['inside'][0].split(', ')
                    for k in inlist:
                        documents = {}
                        documents['source'] = key
                        documents['target'] = 'Artist_'+k
                        documents['strength'] = 0.5
                        documents['Type'] = 'main'
                        main_link.append(documents)
                except:
                    continue
        elif key in new_doc:
            documents = {}
            documents['source'] = key
            documents['target'] = 'Artist_'+ attribute['artist']
            documents['strength'] = 1
            documents['Type'] = 'main'
            main_link.append(documents)
            
        elif key in idx_to_vocab:
            for a in attribute['use_artist']:
                documents = {}
                documents['source'] = key
                documents['target'] = 'Artist_'+ a
                documents['strength'] = 0.3
                documents['Type'] = 'sub'
                main_link.append(documents)
            for b in attribute['use_project']:
                documents = {}
                documents['source'] = key
                documents['target'] = 'Project_'+ b
                documents['Type'] = 'sub'
                documents['strength'] = 0.3
                main_link.append(documents)

    # Your codes .... 
    with open('./nodeLink/link.json', 'w', encoding='UTF-8') as outfile:
        outfile.write(json.dumps(main_link, cls=NpEncoder, ensure_ascii=False, indent=4))

main(model_path, dataset_path)
print("Finish Make Json")