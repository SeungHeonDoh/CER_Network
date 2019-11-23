import React, { useState, useEffect } from 'react';
import useNetwork from '../../hook';
import D3Graph from '../../D3Graph/D3Graph';
import dummy from '../../utils/data';
import { createConfig } from '../../D3Graph/D3Graph.config';


export default function Main() {
    var { nodes } = useNetwork();
    const [ loading, setLoading ] = useState(true);
    const [ config, setConfig ] = useState({
    });
    const graphConfig = createConfig({
        node: {
            symbolType: 'diamond'
        },
        graph: {
            symbolKey: 'level',
            symbolMapper: {
                1: 'cross',
                2: 'circle',
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
        <div>
            <D3Graph 
                data={data}
                config={config}
                loading={loading}
            />
        </div>
    )

}