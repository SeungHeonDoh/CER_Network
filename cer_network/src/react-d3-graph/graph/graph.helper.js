import {
    forceX as d3ForceX,
    forceY as d3ForceY,
    forceSimulation as d3ForceSimulation,
    forceManyBody as d3ForceManyBody
} from 'd3-force';

import CONST from './graph.const';
import DEFAULT_CONFIG from './graph.config';
import ERRORS from '../err';

import utils from '../utils';

const NODE_PROPS_WHITELIST = ['id', 'highlighted', 'x', 'y', 'index', 'vy', 'vx'];

// D3 graph 생성
function _createForceSimulation(width, height) {
    const frx = d3ForceX(width / 2).strength(CONST.FORCE_X);
    const fry = d3ForceY(height / 2).strength(CONST.FORCE_Y);

    return d3ForceSimulation()
        .force('charge', d3ForceManyBody().strength(CONST.FORCE_IDEAL_STRENGTH))
        .force('x', frx)
        .force('y', fry);
}

// node Opacity 조절
function _getNodeOpacity(node, highlightedNode, highlightedLink, config) {
    const highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);
    const someNodeHighlighted = !!(
        highlightedNode ||
        (highlightedLink && highlightedLink.source && highlightedLink.target)
    );
    let opacity;
    
    if (someNodeHighlighted && config.highlightDegree === 0) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else if (someNodeHighlighted) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else {
        opacity = config.node.opacity;
    }

    return opacity;
}
// link matrix 생성
function _initializeLinks(graphLinks) {
    return graphLinks.reduce((links, l) => {
        const source = l.source.id || l.source;
        const target = l.target.id || l.target;

        if (!links[source]) {
            links[source] = {};
        }

        if (!links[target]) {
            links[target] = {};
        }
        const keys = Object.keys(l);
        
        var linkProperty = {}
        for(var i=0; i < keys.length; i++){
            if(!['source', 'target'].includes(keys[i])){
                linkProperty[keys[i]] = l[keys[i]];
            }
        }

        // @TODO: If the graph is directed this should be adapted
        links[source][target] = links[target][source] = linkProperty;

        return links;
    }, {});
}
// Node array로 부터 init 코드
function _initializeNodes(graphNodes) {
    let nodes = {};
    const n = graphNodes.length;

    for (let i = 0; i < n; i++) {
        const node = graphNodes[i];

        node.highlighted = false;

        if (!node.hasOwnProperty('x')) {
            node.x = 0;
        }
        if (!node.hasOwnProperty('y')) {
            node.y = 0;
        }

        nodes[node.id.toString()] = node;
    }

    return nodes;
}


 // Error 코드
function _validateGraphData(data) {
    if (!data.nodes || !data.nodes.length) {
        utils.throwErr('Graph', ERRORS.INSUFFICIENT_DATA);
    }

    const n = data.links.length;

    for (let i = 0; i < n; i++) {
        const l = data.links[i];

        if (!data.nodes.find(n => n.id === l.source)) {
            utils.throwErr('Graph', `${ERRORS.INVALID_LINKS} - "${l.source}" is not a valid source node id`);
        }
        if (!data.nodes.find(n => n.id === l.target)) {
            utils.throwErr('Graph', `${ERRORS.INVALID_LINKS} - "${l.target}" is not a valid target node id`);
        }
    }
}
//link props
function buildLinkProps(
    source,
    target,
    nodes,
    links,
    config,
    linkCallbacks,
    highlightedNode,
    highlightedLink,
    transform
) {

    const x1 = (nodes[source] && nodes[source].x) || 0;
    const y1 = (nodes[source] && nodes[source].y) || 0;
    const x2 = (nodes[target] && nodes[target].x) || 0;
    const y2 = (nodes[target] && nodes[target].y) || 0;

    let mainNodeParticipates = false;

    switch (config.highlightDegree) {
        case 0:
            break;
        case 2:
            mainNodeParticipates = true;
            break;
        default:
            // 1st degree is the fallback behavior
            mainNodeParticipates = source === String(highlightedNode) || target === String(highlightedNode);
            break;
    }

    const reasonNode = mainNodeParticipates && nodes[source].highlighted && nodes[target].highlighted;
    const reasonLink =
        source === (highlightedLink && highlightedLink.source) &&
        target === (highlightedLink && highlightedLink.target);
    const highlight = reasonNode || reasonLink;

    var opacity = config.link.opacity;
    if(config.link.opacityKey !== undefined){
        opacity = links[source][target][config.link.opacityKey]
    }
    
    if (highlightedNode || (highlightedLink && highlightedLink.source)) {
        opacity = highlight?opacity:config.highlightOpacity;
    }

    let stroke = config.link.color;

    if (highlight) {
        stroke = config.colorMapper[nodes[target][config.colorKey]];
    }

    let strokeWidth = config.link.strokeWidth * (1 / transform);

    if (config.link.semanticStrokeWidth) {
        const linkValue = links[source][target] || links[target][source] || 1;
        strokeWidth += linkValue * strokeWidth / 10;
    }

    return {
        source,
        target,
        x1: x1*config.width/3 + config.width/2 - 200,
        y1: y1*config.height/3 + config.height/2,
        x2: x2*config.width/3 + config.width/2 - 200,
        y2: y2*config.height/3 + config.height/2,
        strokeWidth,
        stroke,
        className: CONST.LINK_CLASS_NAME,
        opacity,
        onClickLink: linkCallbacks.onClickLink,
        onMouseOverLink: linkCallbacks.onMouseOverLink,
        onMouseOutLink: linkCallbacks.onMouseOutLink
    };
}
// None props
function buildNodeProps(node, config, nodeCallbacks = {}, highlightedNode, highlightedLink, transform) {
    const highlight =
        node.highlighted ||
        (node.id === (highlightedLink && highlightedLink.source) ||
            node.id === (highlightedLink && highlightedLink.target));
    const opacity = _getNodeOpacity(node, highlightedNode, highlightedLink, config);
    
    var fill;
    
    if(config.colorKey == undefined){
        fill = node.color || config.node.color;
    } else {
        fill = node.color || config.colorMapper[node[config.colorKey]];
    }

    if (highlight && config.node.highlightColor !== CONST.KEYWORDS.SAME) {
        fill = config.colorMapper[node[config.colorKey]];
    }

    let stroke = config.node.strokeColor;

    if (highlight && config.node.highlightStrokeColor !== CONST.KEYWORDS.SAME) {
        stroke = config.node.highlightStrokeColor;
    }

    var nodeSize;
    if(config.colorKey == undefined){
        nodeSize = node.size || config.node.size;
    }  else {
        nodeSize = node.size || config.sizeMapper[node[config.sizeKey]];
    }

    const t = 1 / transform;
    var fontSize = highlight ? config.node.highlightFontSize : config.node.fontSize;
    var dx = fontSize * t + nodeSize / 100 + 1.5;
    const strokeWidth = highlight ? config.node.highlightStrokeWidth : config.node.strokeWidth;
    const svg = node.svg || config.node.svg;
    var fontColor = node.fontColor || config.node.fontColor;
    
    if (highlight) {
        nodeSize *= 2;
        fontColor = config.colorMapper[node[config.colorKey]];
    } else{
        fontSize = 0;
    }

    let type;
    if(config.symbolKey == undefined){
        type = node.symbolType || config.node.symbolType;
    }else{
        type = node.symbolType || config.symbolMapper[node[config.symbolKey]];
    }
    
    return {
        className: CONST.NODE_CLASS_NAME,
        cursor: config.node.mouseCursor,
        cx: (node && node.x*config.width/3 + config.width/2 - 200) || '0',
        cy: (node && node.y*config.height/3 + config.height/2) || '0',
        fill,
        fontColor,
        fontSize: fontSize * t,
        dx,
        fontWeight: highlight ? config.node.highlightFontWeight : config.node.fontWeight,
        id: node.id,
        metadata: node,
        label: node[config.node.labelProperty] || node.id,
        onClickNode: nodeCallbacks.onClickNode,
        onDoubleClickNode: nodeCallbacks.onDoubleClickNode,
        onMouseOverNode: nodeCallbacks.onMouseOverNode,
        onMouseOut: nodeCallbacks.onMouseOut,
        opacity,
        renderLabel: config.node.renderLabel,
        size: nodeSize * t,
        stroke,
        strokeWidth: strokeWidth * t,
        svg,
        type,
    };
}
// Graph init
function initializeGraphState({ data, id, config }, state) {
    let graph;

    _validateGraphData(data);

    const nodesInputSnapshot = data.nodes.map(n => Object.assign({}, n));
    const linksInputSnapshot = data.links.map(l => Object.assign({}, l));

    if (state && state.nodes && state.links) {
        // absorb existent positioning
        graph = {
            nodes: data.nodes.map(
                n =>
                    state.nodes[n.id]
                        ? Object.assign({}, n, utils.pick(state.nodes[n.id], NODE_PROPS_WHITELIST))
                        : Object.assign({}, n)
            ),
            links: {}
        };
    } else {
        graph = {
            nodes: data.nodes.map(n => Object.assign({}, n)),
            links: {}
        };
    }

    graph.links = data.links.map(l => Object.assign({}, l));
    let newConfig = Object.assign({}, utils.merge(DEFAULT_CONFIG, config || {}));
    let nodes = _initializeNodes(graph.nodes);
    let links = _initializeLinks(graph.links); // matrix of graph connections
    const { nodes: d3Nodes, links: d3Links } = graph;
    const formatedId = id.replace(/ /g, '_');
    const simulation = _createForceSimulation(newConfig.width, newConfig.height);

    return {
        id: formatedId,
        config: newConfig,
        links,
        d3Links,
        linksInputSnapshot,
        nodes,
        d3Nodes,
        nodesInputSnapshot,
        highlightedNode: '',
        simulation,
        newGraphElements: false,
        configUpdated: false,
        transform: 1
    };
}
// value mapping
function updateNodeHighlightedValue(nodes, links, config, id, value = false) {
    const highlightedNode = value ? id : '';
    const node = Object.assign({}, nodes[id], { highlighted: value });
    let updatedNodes = Object.assign({}, nodes, { [id]: node });

    // when highlightDegree is 0 we want only to highlight selected node
    if (links[id] && config.highlightDegree !== 0) {
        updatedNodes = Object.keys(links[id]).reduce((acc, linkId) => {
            const updatedNode = Object.assign({}, updatedNodes[linkId], { highlighted: value });

            return Object.assign(acc, { [linkId]: updatedNode });
        }, updatedNodes);
    }

    return {
        nodes: updatedNodes,
        highlightedNode
    };
}

export { buildLinkProps, buildNodeProps, initializeGraphState, updateNodeHighlightedValue };
