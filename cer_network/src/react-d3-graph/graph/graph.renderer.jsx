
import React from 'react';

import CONST from './graph.const';

import Link from '../link/Link';
import Node from '../node/node';
import {
    buildLinkProps,
    buildNodeProps
} from './graph.helper';

function _buildNodeLinks(nodeId, nodes, links, config, linkCallbacks, highlightedNode, highlightedLink, transform) {
    let linksComponents = [];

    if (links[nodeId]) {
        const adjacents = Object.keys(links[nodeId]);
        const n = adjacents.length;

        for (let j=0; j < n; j++) {
            const source = nodeId;
            const target = adjacents[j];

            if (nodes[target]) {
                const key = `${nodeId}${CONST.COORDS_SEPARATOR}${target}`;
                const props = buildLinkProps(
                    source,
                    target,
                    nodes,
                    links,
                    config,
                    linkCallbacks,
                    highlightedNode,
                    highlightedLink,
                    transform
                );

                linksComponents.push(<Link key={key} {...props} />);
            }
        }
    }

    return linksComponents;
}

function buildGraph(nodes, nodeCallbacks, links, linkCallbacks, config, highlightedNode, highlightedLink, transform) {
    let linksComponents = [];
    let nodesComponents = [];

    for (let i = 0, keys = Object.keys(nodes), n = keys.length; i < n; i++) {
        const nodeId = keys[i];

        const props = buildNodeProps(nodes[nodeId], config, nodeCallbacks,
                                        highlightedNode, highlightedLink, transform);

        nodesComponents.push(<Node key={nodeId} {...props} />);

        linksComponents = linksComponents.concat(
            _buildNodeLinks(nodeId, nodes, links, config, linkCallbacks, highlightedNode, highlightedLink, transform)
        );
    }

    return {
        nodes: nodesComponents,
        links: linksComponents
    };
}

export {
    buildGraph
};
