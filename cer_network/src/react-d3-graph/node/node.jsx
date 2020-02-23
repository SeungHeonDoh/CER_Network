import React from 'react';
import CONST from './node.const';
import nodeHelper from './node.helper';

export default class Node extends React.Component {
    // node 클릭
    handleOnClickNode = () => this.props.onClickNode && this.props.onClickNode(this.props.metadata);
    // node 더블 클릭
    handleOnDoubleClickNode = () => this.props.onDoubleClickNode && this.props.onDoubleClickNode(this.props.metadata);
    // 마우스 올리기
    handleOnMouseOverNode = () => this.props.onMouseOverNode && this.props.onMouseOverNode(this.props.metadata);
    // 마우스 out
    handleOnMouseOutNode = () => this.props.onMouseOut && this.props.onMouseOut(this.props.metadata);

    render() {
        const nodeProps = {
            cursor: this.props.cursor,
            onClick: this.handleOnClickNode,
            onDoubleClick: this.handleOnDoubleClickNode,
            onMouseOut: this.handleOnMouseOutNode,
            onMouseOver: this.handleOnMouseOverNode,
            opacity: this.props.opacity
        };

        const circleProps = {
            cursor: this.props.cursor,
            onClick: this.handleOnClickNode,
            onDoubleClick: this.handleOnDoubleClickNode,
            onMouseOut: this.handleOnMouseOutNode,
            onMouseOver: this.handleOnMouseOverNode,
            opacity: this.props.opacity
        }

        const textProps = {
            dx: this.props.dx || CONST.NODE_LABEL_DX,
            dy: CONST.NODE_LABEL_DY,
            fill: this.props.fontColor,
            fontSize: this.props.fontSize,
            fontWeight: this.props.fontWeight,
            opacity: this.props.opacity
        };

        const size = this.props.size;
        let gtx = this.props.cx;
        let gty = this.props.cy;
        let label;
        let node;
        let circle;

        if (this.props.svg) {
            const height = size / 10;
            const width = size / 10;
            const tx = width / 2;
            const ty = height / 2;
            const transform = `translate(${tx},${ty})`;

            label = (
                <text {...textProps} transform={transform}>
                    {this.props.label}
                </text>
            );
            node = <image {...nodeProps} href={this.props.svg} width={width} height={height} />;

            // svg offset transform regarding svg width/height
            gtx -= tx;
            gty -= ty;
        } else {
            nodeProps.d = nodeHelper.buildSvgSymbol(size, this.props.type);
            nodeProps.fill = this.props.fill;
            nodeProps.stroke = this.props.stroke;
            nodeProps.strokeWidth = this.props.strokeWidth;
            label = <text {...textProps}>{this.props.label}</text>;
            node = <path {...nodeProps} />;
            circle = <circle r={size/9.5} fill="none" stroke={this.props.fill} opacity={this.props.opacity}/>;
        }

        const gProps = {
            className: this.props.className,
            cx: this.props.cx,
            cy: this.props.cy,
            id: this.props.id,
            transform: `translate(${gtx},${gty})`
        };

        return (
            <g {...gProps}>
                {node}
                {circle}
                {this.props.renderLabel && label}
            </g>
        );
    }
}
