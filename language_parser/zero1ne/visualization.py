# prepare visualization
import pickle
import numpy as np
import pandas as pd
from bokeh.plotting import figure, show, ColumnDataSource
from bokeh.plotting import output_file
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE


def artist_vec(artist, df, dv, wv, idx_to_doc, idx_to_vocab):
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


def embedding(x, method='tsne', perplexity=10):
    if method == 'pca':
        trainer = PCA(n_components=2)
    else:
        trainer = TSNE(n_components=2, perplexity=perplexity)
    return trainer.fit_transform(x)


def initialize_figure(title):
    if title is None:
        title = 'Untitled'

    TOOLTIPS = [
        ("(x,y)", "($x, $y)"),
        ("entity", "@desc"),
    ]

    p = figure(title=title, tooltips=TOOLTIPS)
    p.grid.grid_line_color = None
    p.background_fill_color = "black"
    p.width = 600
    p.height = 600
    return p

def mtext(p, x, y, text, text_color, text_font_size, text_alpha):
    p.text(x, y, text=[text], text_color=text_color, text_align="center",
           text_font_size=text_font_size, text_alpha=text_alpha)

def annotation(p, coordinates, idx_to_text, text_shift=0.05,
    text_font_size='15pt', text_color="firebrick", text_alpha=1.0):

    for idx, text in enumerate(idx_to_text):
        if not text:
            continue
        x_ = coordinates[idx,0] + text_shift
        y_ = coordinates[idx,1] + text_shift
        text = idx_to_text[idx]
        mtext(p, x_, y_, text, text_color, text_font_size, text_alpha)

def draw(coordinates, idx_to_text, p=None, title=None, marker="circle",
         marker_color='gray', marker_size=5, marker_alpha=0.5):
    # prepare figure
    if p is None:
        p = initialize_figure(title)

    # prepare data source
    source = ColumnDataSource(data=dict(
        x = coordinates[:,0].tolist(),
        y = coordinates[:,1].tolist(),
        desc = idx_to_text
    ))

    # scatter plot
    p.scatter('x', 'y', marker=marker, size=marker_size, line_color= 'white',
              fill_color= marker_color, alpha=marker_alpha, source=source)
    return p


def main(model_path, dataset_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    df = pd.read_csv(dataset_path)

    wv = model.wv.vectors
    dv = model.docvecs.vectors_docs
    idx_to_doc = model.docvecs.index2entity
    idx_to_vocab = model.wv.index2word

    artist = list(df['작가명'].unique())

    z_merge = embedding(np.vstack([wv, dv]), 'tsne')
    z_wv = z_merge[:wv.shape[0]]
    z_dv = z_merge[wv.shape[0]:]
    z_av = []
    for i in artist:
        z_av.append(artist_vec(i, df, z_dv, z_wv, idx_to_doc, idx_to_vocab))
    z_av = np.array(z_av)

    p = draw(z_wv, idx_to_vocab, marker_size=6, marker_alpha=0.3, marker_color='gray',
            title='Joint visualization of words and docs and artist')
    p = draw(z_dv, idx_to_doc, p=p, marker_size=6, marker_alpha=0.8, marker_color='blue')
    p = draw(z_av, artist, p=p, marker_size=7, marker_alpha=1, marker_color='red')
    p.height = 1000
    p.width = 1500
    show(p)
    output_file('./dataset/joint_visualization_window=10_tsne.html')