import React, { createContext, useState } from 'react';


const NetworkContext = createContext([{}, () => {}]);

const NetworkProvider = (props) => {
    const [ state, setState ] = useState({
        nodes: [1, 2, 3, 4],
    });
    return (
        <NetworkContext.Provider value={[state, setState]}>
            {props.children}
        </NetworkContext.Provider>
    );
}

export { NetworkContext, NetworkProvider };