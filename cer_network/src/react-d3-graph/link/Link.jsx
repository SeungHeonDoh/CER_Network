import React from 'react';

export default class Link extends React.Component {
    // 링크 클릭
    handleOnClickLink = () => this.props.onClickLink
                            && this.props.onClickLink(this.props.source, this.props.target);

    // 마우스 올리기
    handleOnMouseOverLink = () => this.props.onMouseOverLink
                            && this.props.onMouseOverLink(this.props.source, this.props.target);
    // 마우스 아웃 시키기
    handleOnMouseOutLink = () => this.props.onMouseOutLink
                            && this.props.onMouseOutLink(this.props.source, this.props.target);

    render() {
        const lineStyle = {
            strokeWidth: this.props.strokeWidth,
            stroke: this.props.stroke,
            strokeOpacity: this.props.opacity,
        };

        const lineProps = {
            className: this.props.className,
            onClick: this.handleOnClickLink,
            onMouseOut: this.handleOnMouseOutLink,
            onMouseOver: this.handleOnMouseOverLink,
            style: lineStyle,
            x1: this.props.x1,
            x2: this.props.x2,
            y1: this.props.y1,
            y2: this.props.y2
        };

        return (
            <line {...lineProps} />
        );
    }
}

