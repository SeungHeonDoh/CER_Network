import React, { useState, useEffect } from 'react';
import useNetwork from '../../hook';
import D3Graph from '../../D3Graph/D3Graph';
import dummy from '../../utils/data';
import { createConfig } from '../../D3Graph/D3Graph.config';


export default function Main() {
    var { nodes } = useNetwork();
    const [ loading, setLoading ] = useState(true);
    const graphConfig = createConfig();
    const [ data, setData ] = useState(null);
    useEffect(() => {
        console.log(data);
        setData(dummy)
        setLoading(false);
    })
    
    return (
        <div>
            <D3Graph 
                data={data}
                config={graphConfig}
                loading={loading}
            />
        </div>
    )

}