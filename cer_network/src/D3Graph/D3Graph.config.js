//theme of the graph
const theme = {
    dark: {
        node: {
            color: '#999',
            highlightColor: 'lightgreen',
            fontColor: '#f2f2f2',
        },
        link: {
            highlightColor: '#eee',
        },
    },
    light: {
        node: {
            color: '#d3d3d3',
            highlightColor: 'lightgreen',
            fontColor: '#484848',
        },
        link: {
            highlightColor: '#484848',
        },
    },
}

const getDefaultConfig = (themeType) => {
    return {
        graph: {
            nodeHighlightBehavior: true,
            automaticRearrangeAfterDropNode: true,
            highlightOpacity: 0.2,
            height: window.innerHeight,
            width: window.innerWidth,
        },
        node: {
            color: theme[themeType].node.color,
            highlightColor: theme[themeType].node.highlightColor,
            fontColor: theme[themeType].node.fontColor,
            labelProperty: 'name',
            size: 200,
        },
        link: {
            highlightColor: theme[themeType].link.highlightColor,
        },
    };
};

function createConfig(newConfig = {}, darkTheme = false) {
    const themeType = darkTheme ? 'dark' : 'light';
    const defaultConfig = getDefaultConfig(themeType);
    const mergedConfig = {
        ...defaultConfig.graph,
        ...newConfig.graph,
        node: {
            ...defaultConfig.node,
            ...newConfig.node,
        },
        link: {
            ...defaultConfig.link,
            ...newConfig.link,
        },
    };
    return mergedConfig;
}

export { createConfig }