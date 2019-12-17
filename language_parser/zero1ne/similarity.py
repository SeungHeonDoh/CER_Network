import pickle
import gensim
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

dataset_path = 'kor_data.csv'
model_path = 'model.pkl'

def make_unique(doc_list, type = 'project'):
    new_doc = []
    for i in doc_list:
        if type == 'project':
            projectName = 'P_'+i
            new_doc.append(projectName)
        elif type == 'artist':
            projectName = 'A_'+i
            new_doc.append(projectName)
    return new_doc

def make_SimilarMatrix(wv, dv, entity_list, word_index):
    vec100 = np.vstack([wv, dv])
    df_total = pd.DataFrame(vec100, index=entity_list)

    cosine_sim = cosine_similarity(df_total)
    df_similarity = pd.DataFrame(cosine_sim, columns=entity_list)

    for idx, i in enumerate(df_similarity.columns):
        if idx == word_index-1:
            word2word = df_similarity.loc[:,:i].iloc[:word_index]
            word2project = df_similarity.loc[:,:i].iloc[word_index:]
        elif idx == word_index:
            project2project = df_similarity.loc[:,i:].iloc[word_index:]
            project2word = df_similarity.loc[:,i:].iloc[:word_index]

    return word2word, word2project, project2project, project2word

def embedding(x, method='tsne', perplexity=30):
    if method == 'pca':
        trainer = PCA(n_components=2)
    else:
        trainer = TSNE(n_components=2, perplexity=perplexity)
    return trainer.fit_transform(x)

def main(model_path, dataset_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    df = pd.read_csv(dataset_path)
    
    wv = model.wv.vectors
    dv = model.docvecs.vectors_docs
    idx_to_doc = model.docvecs.index2entity
    idx_to_vocab = model.wv.index2word

    new_doc = make_unique(idx_to_doc, type='project')

    doc_index = len(new_doc)
    word_index = len(idx_to_vocab)
    entity_list = idx_to_vocab + new_doc

    word2word, word2project, project2project, project2word = make_SimilarMatrix(wv, dv, entity_list, word_index)
    z_merge = embedding(np.vstack([wv, dv]), 'tsne')
    z_wv = z_merge[:wv.shape[0]]
    z_dv = z_merge[wv.shape[0]:]

