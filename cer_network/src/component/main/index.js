import React, { useState, useEffect } from 'react';
import useNetwork from '../../hook';
import D3Graph from '../../D3Graph/D3Graph';
import Search from '../search';
import { createConfig } from '../../D3Graph/D3Graph.config';
import { RenderArea } from '../../styles';


export default function Main() {
    const { setActivateNode, setActivateFunction, loadGraphData, data } = useNetwork();
    const [ loading, setLoading ] = useState(true);
    const [ config, setConfig ] = useState({
    });
    const graphConfig = createConfig({
        isDarkTheme: false,
        node: {
            symbolType: 'diamond'
        },
        link: {
            opacityKey: 'strength',
            highlightColor: 'lightgreen'
        },
        graph: {
            symbolKey: 'Group',
            colorKey: 'Group',
            sizeKey: 'Group',
            symbolMapper: {
                'word': 'circle',
                'project': 'circle',
                'artist': 'circle',
            },
            colorMapper: {
                'artist': '#ff00de',
                'project': '#9A86FA',
                'word': 'gray'
            },
            sizeMapper: {
                'artist': 100,
                'project': 80,
                'word': 20
            }
        }
    });

    useEffect(() => {
        handleLoadData();
    }, [])

    async function handleLoadData(){
        setConfig(graphConfig);
        await loadGraphData();
        setLoading(false);
    }
    
    return (
        <RenderArea>
            <Search />
            <D3Graph 
                data={data}
                config={config}
                loading={loading}
                setActivateNode={setActivateNode}
                setActivateFunction={setActivateFunction}
            />
        </RenderArea>
    )

}