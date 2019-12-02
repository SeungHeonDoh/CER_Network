import React, { useState, useEffect } from 'react';
import useNetwork from '../../hook';
import D3Graph from '../../D3Graph/D3Graph';
import dummy from '../../utils/data';
import { createConfig } from '../../D3Graph/D3Graph.config';
import { RenderArea } from '../../styles';


export default function Main() {
    var { nodes } = useNetwork();
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
        },
        graph: {
            symbolKey: 'level',
            colorKey: 'level',
            symbolMapper: {
                1: 'cross',
                2: 'circle',
            },
            colorMapper: {
                1: '#d3d3d3',
                2: 'white',
            }
        }
    });

    const [ data, setData ] = useState(null);
    useEffect(() => {
        setData(dummy);
        setConfig(graphConfig);
        setLoading(false);
    }, [])
    
    return (
        <RenderArea>
            <D3Graph 
                data={data}
                config={config}
                loading={loading}
            />
        </RenderArea>
    )

}