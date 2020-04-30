import React from 'react';

import { drag as d3Drag } from 'd3-drag';
import { forceLink as d3ForceLink } from 'd3-force';
import { select as d3Select, selectAll as d3SelectAll, event as d3Event } from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';

import CONST from './graph.const';
import DEFAULT_CONFIG from './graph.config';
import ERRORS from '../err';

import * as graphRenderer from './graph.renderer';
import * as graphHelper from './graph.helper';
import utils from '../utils';
import { GraphArea } from '../../styles/graph';


// Some d3 constant values
const D3_CONST = {
    FORCE_LINK_STRENGTH: 1,
    LINK_IDEAL_DISTANCE: 100,
    SIMULATION_ALPHA_TARGET: 0.05
};

export default class Graph extends React.Component {
    _graphForcesConfig() {
        this.state.simulation.nodes(this.state.d3Nodes).on('tick', this._tick);

        const forceLink = d3ForceLink(this.state.d3Links)
            .id(l => l.id)
            .distance(D3_CONST.LINK_IDEAL_DISTANCE)
            .strength(D3_CONST.FORCE_LINK_STRENGTH);

        this.state.simulation.force(CONST.LINK_CLASS_NAME, forceLink);

        const customNodeDrag = d3Drag()
            .on('start', this._onDragStart)
            .on('drag', this._onDragMove)
            .on('end', this._onDragEnd);

        d3Select(`#${this.state.id}-${CONST.GRAPH_WRAPPER_ID}`)
            .selectAll('.node')
            .call(customNodeDrag);
    }

    _onDragEnd = () =>
        !this.state.config.staticGraph &&
        this.state.config.automaticRearrangeAfterDropNode &&
        this.state.simulation.alphaTarget(D3_CONST.SIMULATION_ALPHA_TARGET).restart();

    _onDragMove = (ev, index, nodeList) => {
        const id = nodeList[index].id;

        if (!this.state.config.staticGraph) {
            // this is where d3 and react bind
            let draggedNode = this.state.nodes[id];

            draggedNode.x += d3Event.dx;
            draggedNode.y += d3Event.dy;

            // set nodes fixing coords fx and fy
            draggedNode['fx'] = draggedNode.x;
            draggedNode['fy'] = draggedNode.y;

            this._tick();
        }
    };

 
    _onDragStart = () => this.pauseSimulation();

 
    _setNodeHighlightedValue = (id, value = false) =>
        this._tick(
            graphHelper.updateNodeHighlightedValue(this.state.nodes, this.state.links, this.state.config, id, value)
        );

    _tick = (state = {}) => this.setState(state);

    _zoomConfig = () =>
        d3Select(`#${this.state.id}-${CONST.GRAPH_WRAPPER_ID}`).call(
            d3Zoom()
                .scaleExtent([this.state.config.minZoom, this.state.config.maxZoom])
                .on('zoom', this._zoomed)
        ).on("dblclick.zoom", null);

    _zoomed = () => {
        const transform = d3Event.transform;

        d3SelectAll(`#${this.state.id}-${CONST.GRAPH_CONTAINER_ID}`).attr('transform', transform);

        this.state.config.panAndZoom && this.setState({ transform: transform.k });
    };

    _highlightOn = (node) => {
        const doHighlight = !this.state.isFocused;
        const highlightedNode = this.state.highlightedNode;
        if (highlightedNode == '') {
            this.state.config.nodeHighlightBehavior && this._setNodeHighlightedValue(node.id, doHighlight);
        }
        this.setState({ isFocused: doHighlight }, () => {
            this.props.onDoubleClickNode && this.props.onDoubleClickNode(node);
            this.props.setActivateNode(node);
        });
    }

    _highlightOff = (node) => {
        const doHighlight = !this.state.isFocused;
        const highlightedNode = this.state.highlightedNode;
        if (highlightedNode !== '') {
            this.state.config.nodeHighlightBehavior && this._setNodeHighlightedValue(highlightedNode, doHighlight);
            this.setState({ highlightedNode: '' });
        }
        this.setState({ isFocused: doHighlight }, () => {
            this.props.onDoubleClickNode && this.props.onDoubleClickNode(node);
        });
    }

    onClickNode = node => {
        this.props.onClickNode && this.props.onClickNode(node);
        if(this.state.highlightedNode===''){
            this._highlightOn(node);
        }else{
            this._highlightOff(node);
            this.restartSimulation();
        }
    };

    onDoubleClickNode = node => {
        //
    };

    onMouseOverNode = node => {
        // this.props.onMouseOverNode && this.props.onMouseOverNode(node);
        // this.state.config.nodeHighlightBehavior && this._setNodeHighlightedValue(id, true);
        // this._highlightOn(node);
    };

    onMouseOutNode = node => {
        // this.props.onMouseOutNode && this.props.onMouseOutNode(node);
        // this.state.config.nodeHighlightBehavior && this._setNodeHighlightedValue(id, false);
        // this._highlightOff(node);
        // this.restartSimulation();
    };

    onMouseOverLink = (source, target) => {
        this.props.onMouseOverLink && this.props.onMouseOverLink(source, target)
        // if (this.state.config.linkHighlightBehavior) {
        //     this.state.highlightedLink = { source, target };
        //     this._tick();
        // }
    };

    onMouseOutLink = (source, target) => {
        this.props.onMouseOutLink && this.props.onMouseOutLink(source, target);
        // if (this.state.config.linkHighlightBehavior) {
        //     this.state.highlightedLink = undefined;
        //     this._tick();
        // }
    };

    pauseSimulation = () => this.state.simulation.stop();

    resetNodesPositions = () => {
        if (!this.state.config.staticGraph) {
            for (let nodeId in this.state.nodes) {
                let node = this.state.nodes[nodeId];

                if (node.fx && node.fy) {
                    Reflect.deleteProperty(node, 'fx');
                    Reflect.deleteProperty(node, 'fy');
                }
            }

            this.state.simulation.alphaTarget(D3_CONST.SIMULATION_ALPHA_TARGET).restart();

            this._tick();
        }
    };

    activateNodeMethod = async (node) => {
        if(this.state.highlightedNode!==''){
            await this._highlightOff(node);
            await this.restartSimulation();
        
        }
        this._highlightOn(node);
    }

    restartSimulation = () => !this.state.config.staticGraph && this.state.simulation.restart();

    constructor(props) {
        super(props);

        if (!this.props.id) {
            utils.throwErr(this.constructor.name, ERRORS.GRAPH_NO_ID_PROP);
        }

        this.state = graphHelper.initializeGraphState(this.props, this.state);
        this.state.isFocused = false;
 
        this.props.setActivateFunction(this.activateNodeMethod);
    }

    componentWillReceiveProps(nextProps) {
        const newGraphElements =
            nextProps.data.nodes.length !== this.state.nodesInputSnapshot.length ||
            nextProps.data.links.length !== this.state.linksInputSnapshot.length ||
            !utils.isDeepEqual(nextProps.data, {
                nodes: this.state.nodesInputSnapshot,
                links: this.state.linksInputSnapshot
            });
        const configUpdated =
            !utils.isObjectEmpty(nextProps.config) && !utils.isDeepEqual(nextProps.config, this.state.config);
        const state = newGraphElements ? graphHelper.initializeGraphState(nextProps, this.state) : this.state;
        const config = configUpdated ? utils.merge(DEFAULT_CONFIG, nextProps.config || {}) : this.state.config;
        // in order to properly update graph data we need to pause eventual d3 ongoing animations
        newGraphElements && this.pauseSimulation();
        const transform = nextProps.config.panAndZoom !== this.state.config.panAndZoom ? 1 : this.state.transform;
        this.setState({
            ...state,
            config,
            newGraphElements,
            configUpdated,
            transform
        });
    }

    componentDidUpdate() {
        // if the property staticGraph was activated we want to stop possible ongoing simulation
        this.state.config.staticGraph && this.pauseSimulation();

        if (!this.state.config.staticGraph && this.state.newGraphElements) {
            this._graphForcesConfig();
            this.restartSimulation();
            this.setState({ newGraphElements: false });
        }

        if (this.state.configUpdated) {
            this._zoomConfig();
            this.setState({ configUpdated: false });
        }
    }

    componentDidMount() {
        if (!this.state.config.staticGraph) {
            this._graphForcesConfig();
        }

        // graph zoom and drag&drop all network
        this._zoomConfig();
    }

    componentWillUnmount() {
        this.pauseSimulation();
    }

    render() {
        const { nodes, links } = graphRenderer.buildGraph(
            this.state.nodes,
            {
                onClickNode: this.onClickNode,
                onDoubleClickNode: this.onDoubleClickNode,
                onMouseOverNode: this.onMouseOverNode,
                onMouseOut: this.onMouseOutNode
            },
            this.state.links,
            {
                onClickLink: this.props.onClickLink,
                onMouseOverLink: this.onMouseOverLink,
                onMouseOutLink: this.onMouseOutLink
            },
            this.state.config,
            this.state.highlightedNode,
            this.state.highlightedLink,
            this.state.transform
        );

        const svgStyle = {
            height: this.state.config.height,
            width: this.state.config.width
        };

        return (
            <GraphArea id={`${this.state.id}-${CONST.GRAPH_WRAPPER_ID}`}>
                <svg 
                    style={svgStyle}
                >
                    <rect 
                        width="100%" 
                        height="100%"
                        onClick={()=>{
                            this._highlightOff(this.state.highlightedNode);
                            this.restartSimulation();
                        }}
                    />
                    <g id={`${this.state.id}-${CONST.GRAPH_CONTAINER_ID}`}>
                        {links}
                        {nodes}
                    </g>
                </svg>
            </GraphArea>
        );
    }
}
