import pickle
import gensim
import numpy as np
import pandas as pd
from gensim.models import Doc2Vec
from gensim.models.doc2vec import TaggedDocument
from konlpy.tag import Komoran

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.preprocessing import MinMaxScaler


import json
import collections


dataset_path = './dataset/kor_data.csv'
model_path = './dataset/model.pkl'
save_item = ('NNG','NNP','VV','VA')
pos_tagger = Komoran(userdic='./user_dic.txt')

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


def embedding(x, method='tsne', perplexity=20):
    if method == 'pca':
        trainer = PCA(n_components=2)
    else:
        trainer = TSNE(n_components=2, perplexity=perplexity)
    result = trainer.fit_transform(x)
    scaler = MinMaxScaler(feature_range=(-1, 1), copy=True)
    return scaler.fit_transform(result)

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
    documents['작가명'] = query
    documents['키워드'] = key_list
    documents['참여 프로젝트'] = project
    documents['매체'] = media
    documents['내부 파트너'] = inside
    documents['외부 파트너'] = outside
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
    documents['프로젝트명'] = query
    documents['Creator'] = artist
    documents['keyword'] = keyword
    documents['디스크립션'] = descrtibe
    documents['내부 참여자'] = inside
    documents['외부 참여자'] = outside
    documents['년도'] = year
    documents['유사 프로젝트'] = sim_doc
    documents['유사 키워드'] = sim_word
    
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
    documents['키워드명'] = query
    documents['사용 크리에이터'] = list(set(use_artist))
    documents['사용 프로젝트'] = list(set(use_project))
    documents['유사 아티스트'] = sim_art
    documents['유사 프로젝트'] = sim_doc
    documents['유사 키워드'] = sim_word
    
    return documents


def artist_vec(artist, df, dv, wv, idx_to_doc, idx_to_vocab, tagged_data):
    project = pd.DataFrame(dv, index=idx_to_doc)
    word = pd.DataFrame(wv, index=idx_to_vocab)
    allvector = []
    for i in list(df[df['작가명'] == artist]['프로젝트명']):
        allvector.append(0.05 * project.loc[str(i)])        
    allvector.append(project.loc[str(artist)])
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
    return ['/'.join(t) for t in pos_tagger.pos(doc)]

def changeTokenize(df, docs, save_item):
    train_docs = [tokenize(row) for row in docs]
    trained_docs_list = []
    for item in train_docs:
        dummy = []
        for indi in item:
            if (indi.split('/')[1] in save_item):
                dummy.append(indi.split('/')[0])
        trained_docs_list.append(dummy)
    return trained_docs_list

def main(model_path, dataset_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    df = pd.read_csv(dataset_path)
    docs = list(df['디스크립션'])
    pro_token = changeTokenize(df, docs, save_item)
    df['text'] = pro_token

    art_dec = []
    for i in df['작가명'].unique():
        art_dec.append(df[df['작가명'] == i].iloc[0]['작가소개'])
    
    art_token = changeTokenize(df, art_dec, save_item)
    zipdata = zip(df['프로젝트명'],df['text'])
    art_zipdata = zip(df['작가명'].unique(), art_token)

    tagged_data = [TaggedDocument(words=_d, tags=[str(i)]) for i, _d in zipdata]
    a_tagged_data = [TaggedDocument(words=_d, tags=[str(i)]) for i, _d in art_zipdata]
    tagged_data = tagged_data + a_tagged_data

    wv = model.wv.vectors
    dv = model.docvecs.vectors_docs
    idx_to_doc = model.docvecs.index2entity
    idx_to_vocab = model.wv.index2word

    artist = list(df['작가명'].unique())
    av = []
    for i in artist:
        av.append(artist_vec(i, df, dv, wv, idx_to_doc, idx_to_vocab, tagged_data))

    only_doc = pd.DataFrame([idx_to_doc,dv])
    only_doc= only_doc.T
    only_doc.columns=['name','vector']
    dv = []
    idx_to_doc = []
    for idx in range(len(only_doc)):
        instance = only_doc.iloc[idx]
        if instance['name'] in artist:
            pass
        else:
            idx_to_doc.append(instance['name'])
            dv.append(instance['vector'])

    av = np.array(av)
    dv = np.array(dv)



    new_doc = makeUniqe(idx_to_doc,'Project')
    new_art = makeUniqe(artist,'Artist')

    artist_index = len(new_art)
    doc_index = len(idx_to_doc)
    word_index = len(idx_to_vocab)
    entity_list = new_art + new_doc + idx_to_vocab
    vec100 = np.vstack([av, dv, wv])

    df_total = pd.DataFrame(vec100, index=entity_list)
    sim_vec = cosine_similarity(df_total)
    df_similarity = pd.DataFrame(sim_vec, columns=entity_list)

    z_merge = embedding(np.vstack([av,dv,wv]), 'tsne')
    z_av = z_merge[:av.shape[0]]
    z_dv = z_merge[av.shape[0]:av.shape[0]+dv.shape[0]]
    z_wv = z_merge[av.shape[0]+dv.shape[0]:]


    group_a = []
    for i in range(len(artist)):
        group_a.append('artist')
    group_w = []
    for i in range(len(idx_to_vocab)):
        group_w.append('word')
    group_p = []
    for i in range(len(new_doc)):
        group_p.append('project')

    col = ['id','text','x','y','group']
    artist_data = {'id':new_art,'text':artist, 'x':z_av.T[0],'y':z_av.T[1],'group': group_a}
    doc_data = {'id':new_doc,'text':idx_to_doc,'x':z_dv.T[0],'y':z_dv.T[1],'group': group_p}
    word_data = {'id':idx_to_vocab,'text':idx_to_vocab,'x':z_wv.T[0],'y':z_wv.T[1],'group': group_w}
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
    with open('../../cer_network/src/data/node.json', 'w', encoding='UTF-8') as outfile:
        outfile.write(json.dumps(total_dic, cls=NpEncoder, ensure_ascii=False, indent=4))

    main_link = []
    for i in range(len(total)):
        key = total.iloc[i]['id']
        attribute = total.iloc[i]['attritube']

        if key in new_art:
            for j in attribute['참여 프로젝트']:
                documents = {}
                documents['source'] = key
                documents['target'] = 'Project_'+j
                documents['strength'] = 1
                documents['Type'] = 'main'
                main_link.append(documents)
                
        elif key in new_doc:
            documents = {}
            documents['source'] = key
            documents['target'] = 'Artist_'+ attribute['Creator']
            documents['strength'] = 1
            documents['Type'] = 'main'
            main_link.append(documents)
            
        elif key in idx_to_vocab:
            for a in attribute['사용 크리에이터']:
                documents = {}
                documents['source'] = key
                documents['target'] = 'Artist_'+ a
                documents['strength'] = 0.3
                documents['Type'] = 'sub'
                main_link.append(documents)
            for b in attribute['사용 프로젝트']:
                documents = {}
                documents['source'] = key
                documents['target'] = 'Project_'+ b
                documents['Type'] = 'sub'
                documents['strength'] = 0.3
                main_link.append(documents)

    with open('../../cer_network/src/data/link.json', 'w', encoding='UTF-8') as outfile:
        outfile.write(json.dumps(main_link, cls=NpEncoder, ensure_ascii=False, indent=4))

main(model_path, dataset_path)
print("Finish Make Json")